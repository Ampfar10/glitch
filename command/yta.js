const axios = require('axios');

module.exports = {
    name: 'yta',
    description: 'Download audio from YouTube',
    category: 'Media',
    async execute(conn, chatId, args, senderId) {
        const url = args[0];

        if (!url) {
            return conn.sendMessage(chatId, { text: 'Please provide a YouTube video URL!' });
        }

        try {
            // Send request to download audio and get title
            const response = await axios.post('https://ampfar12.pythonanywhere.com/download', { url });
            const { title } = response.data;

            // Notify the user about the download with the audio title
            const notifyMessage = await conn.sendMessage(chatId, { text: `Downloading ${title}...`, mentions: [senderId] });

            // Send the audio as a document
            const filepath = response.data.filepath;
            await conn.sendMessage(chatId, {
                audio: { url: filepath },
                caption: `Here is your audio: ${title}`,
                filename: `${title}.mp3`, // Set the filename for the audio file
                mimetype: 'audio/mpeg',
                mentions: [senderId]
            });
        } catch (error) {
            console.error('Error downloading audio:', error.message);
            await conn.sendMessage(chatId, { text: 'Failed to download audio. Please try again later.', mentions: [senderId] });
        }
    }
};
