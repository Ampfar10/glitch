const axios = require('axios');
const fs = require('fs');

// Define the command structure
module.exports = {
    name: 'yta',
    description: 'Download audio from a YouTube video based on the given URL',
    category: 'Media',
    async execute(conn, chatId, args, senderId) {
        const url = args[0];

        if (!url) {
            return conn.sendMessage(chatId, { text: 'Please provide a valid YouTube video URL.' });
        }

        try {
            // Make a request to your yt-dlp API
            const response = await axios.post('http://127.0.0.1:5000/download', {
                url: url,
            });

            if (response.data.filepath) {
                const filepath = response.data.filepath;

                // Send the audio file to the user with a hidden mention
                await conn.sendMessage(chatId, {
                    audio: fs.createReadStream(filepath), // Stream the audio file
                    caption: `Here's your audio, @${senderId.split('@')[0]}!`,
                    mentions: [senderId], // Mention the user
                });

                // Optionally, you can delete the file after sending
                fs.unlinkSync(filepath); // Remove the file after sending
            } else {
                await conn.sendMessage(chatId, { text: 'Download error: Sorry, can\'t find that.' });
            }
        } catch (error) {
            console.error('Error downloading audio:', error);
            await conn.sendMessage(chatId, { text: `Error: ${error.response ? error.response.data.error : error.message}` });
        }
    }
};
