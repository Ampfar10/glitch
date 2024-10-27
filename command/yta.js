const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const axios = require('axios');

ffmpeg.setFfmpegPath(ffmpegPath);

// Replace with your YouTube Data API key
const YOUTUBE_API_KEY = 'AIzaSyBQSOlFefCVJjVctHDs2VPwkUAJvJRuKH4';

module.exports = {
    name: 'yta',
    description: 'Download audio from YouTube',
    category: 'Media',
    async execute(conn, chatId, args) {
        console.log("Executing !yta command with args:", args);
        
        const youtubeUrl = args[0];
        if (!youtubeUrl) {
            console.error("No YouTube link provided.");
            return conn.sendMessage(chatId, { text: "Please provide a YouTube link! Usage: !yta <YouTube_URL>" });
        }

        if (!ytdl.validateURL(youtubeUrl)) {
            console.error("Invalid YouTube link provided:", youtubeUrl);
            return conn.sendMessage(chatId, { text: "Invalid YouTube link. Please try again." });
        }

        try {
            const videoId = ytdl.getURLVideoID(youtubeUrl);
            console.log("Extracted video ID:", videoId);

            const videoInfo = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                params: {
                    id: videoId,
                    part: 'snippet',
                    key: YOUTUBE_API_KEY,
                },
            });
            console.log("Video info received:", videoInfo.data);

            if (videoInfo.data.items.length === 0) {
                console.error("Audio not found or is restricted.");
                return conn.sendMessage(chatId, { text: "Audio not found or is restricted." });
            }

            const title = videoInfo.data.items[0].snippet.title.replace(/[\/\\:*?"<>|]/g, "");
            console.log("Audio title:", title);
            const outputPath = path.resolve(__dirname, `${title}.mp3`);

            await conn.sendMessage(chatId, { text: `Downloading audio for "${title}"...` });

            const downloadAudio = () => {
                return new Promise((resolve, reject) => {
                    const audioStream = ytdl(youtubeUrl, {
                        filter: 'audioonly',
                        quality: 'highestaudio',
                        requestOptions: {
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
                                "Accept-Language": "en-US,en;q=0.9",
                            }
                        }
                    });

                    ffmpeg(audioStream)
                        .toFormat('mp3')
                        .output(outputPath)
                        .on('end', () => {
                            console.log("Audio download completed:", title);
                            resolve();
                        })
                        .on('error', (error) => {
                            console.error("Error during audio conversion:", error);
                            reject(error);
                        })
                        .run();
                });
            };

            await downloadAudio();

            await conn.sendMessage(chatId, {
                audio: fs.readFileSync(outputPath),
                mimetype: 'audio/mp3',
                caption: `Here is your audio: ${title}`,
            });

            fs.unlinkSync(outputPath);
            console.log("Temporary audio file deleted:", outputPath);
        } catch (error) {
            console.error("Error in !yta command:", error);
            conn.sendMessage(chatId, { text: "There was an error processing your request. Please try again later." });
        }
    }
};
