module.exports = {
    name: 'link',
    category: 'Group',
    description: 'Gets the group link',
    async execute(conn, chatId) {
        const { remoteJid } = msg.key;
        try {
            const linkCode = await conn.groupInviteCode(remoteJid);
            const groupLink = `https://chat.whatsapp.com/${linkCode}`;
            conn.sendMessage(remoteJid, { text: `Group Link: ${groupLink}` });
        } catch (error) {
            conn.sendMessage(remoteJid, { text: 'Failed to retrieve group link.' });
        }
    }
};
