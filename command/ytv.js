const axios = require('axios');

module.exports = {
    name: 'ytv',
    description: 'Download video from YouTube in 720p',
    category: 'Media',
    async execute(conn, chatId, args, senderId) {
        const url = args[0];

        if (!url) {
            return conn.sendMessage(chatId, { text: 'Please provide a YouTube video URL!' });
        }

        try {
            // Send request to download video and get title
            const response = await axios.post('https://ampfar12.pythonanywhere.com/downloadv', { url });
            const { title } = response.data;

            // Notify the user about the download with the video title
            const notifyMessage = await conn.sendMessage(chatId, { text: `Downloading ${title}...`, mentions: [senderId] });

            // Send the video as a document
            const filepath = response.data.filepath;
            await conn.sendMessage(chatId, {
                video: { url: filepath },
                caption: `Here is your video: ${title}`,
                mentions: [senderId]
            });
        } catch (error) {
            console.error('Error downloading video:', error.message);
            await conn.sendMessage(chatId, { text: 'Failed to download video. Please try again later.', mentions: [senderId] });
        }
    }
};
