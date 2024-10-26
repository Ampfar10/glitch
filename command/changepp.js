module.exports = {
    name: 'changepp',
    category: 'Group',
    description: 'Changes the group profile picture (admin only)',
    async execute(conn, chatId, msg) {
        const { remoteJid } = msg.key;
        if (!await isAdmin(conn, msg)) return conn.sendMessage(remoteJid, { text: 'Only admins can use this command.' });

        const media = await downloadMediaMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo?.quotedMessage);
        if (media) {
            await conn.updateProfilePicture(remoteJid, { url: media });
            conn.sendMessage(chatId, { text: 'Group profile picture updated.' });
        } else {
            conn.sendMessage(chatId, { text: 'Please quote or send an image to use as the new profile picture.' });
        }
    }
};
