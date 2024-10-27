const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const axios = require('axios');

ffmpeg.setFfmpegPath(ffmpegPath);

// Replace with your YouTube Data API key
const YOUTUBE_API_KEY = 'AIzaSyBQSOlFefCVJjVctHDs2VPwkUAJvJRuKH4';

module.exports = {
    name: 'ytv',
    description: 'Download video from YouTube',
    category: 'Media',
    async execute(conn, chatId, args) {
        console.log("Executing !ytv command with args:", args);
        
        const youtubeUrl = args[0];
        if (!youtubeUrl) {
            console.error("No YouTube link provided.");
            return conn.sendMessage(chatId, { text: "Please provide a YouTube link! Usage: !ytv <YouTube_URL>" });
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
                console.error("Video not found or is restricted.");
                return conn.sendMessage(chatId, { text: "Video not found or is restricted." });
            }

            const title = videoInfo.data.items[0].snippet.title.replace(/[\/\\:*?"<>|]/g, "");
            console.log("Video title:", title);
            const outputPath = path.resolve(__dirname, `${title}.mp4`);

            await conn.sendMessage(chatId, { text: `Downloading "${title}"...` });

            const downloadVideo = () => {
                return new Promise((resolve, reject) => {
                    const videoStream = ytdl(youtubeUrl, {
                        filter: 'audioandvideo',
                        quality: 'highest',
                        requestOptions: {
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
                                "Accept-Language": "en-US,en;q=0.9",
                            }
                        }
                    });

                    ffmpeg(videoStream)
                        .output(outputPath)
                        .on('end', () => {
                            console.log("Video download completed:", title);
                            resolve();
                        })
                        .on('error', (error) => {
                            console.error("Error during video conversion:", error);
                            reject(error);
                        })
                        .run();
                });
            };

            await downloadVideo();

            await conn.sendMessage(chatId, {
                video: fs.readFileSync(outputPath),
                mimetype: 'video/mp4',
                caption: `Here is your video: ${title}`,
            });

            fs.unlinkSync(outputPath);
            console.log("Temporary video file deleted:", outputPath);
        } catch (error) {
            console.error("Error in !ytv command:", error);
            conn.sendMessage(chatId, { text: "There was an error processing your request. Please try again later." });
        }
    }
};
