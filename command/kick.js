module.exports = {
    name: 'kick',
    category: 'Group',
    description: 'Kicks a user from the group (admin only)',
    async execute(conn, chatId) {
        const { remoteJid } = msg.key;
        if (!await isAdmin(conn, msg)) return conn.sendMessage(remoteJid, { text: 'Only admins can use this command.' });

        const userToKick = msg.message.extendedTextMessage?.contextInfo?.participant;
        if (!userToKick) return conn.sendMessage(remoteJid, { text: 'Please tag a user to kick.' });

        await conn.groupParticipantsUpdate(remoteJid, [userToKick], 'remove');
        conn.sendMessage(remoteJid, { text: `User kicked: ${userToKick}` });
    }
};
