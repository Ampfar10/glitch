module.exports = {
    name: 'kick',
    category: 'Group',
    description: 'Kicks a user from the group (admin only)',
    async execute(conn, chatId, msg) {
        const { remoteJid } = msg.key;
        if (!await isAdmin(conn, chatId, msg)) return conn.sendMessage(chatId, { text: 'Only admins can use this command.' });

        const userToKick = msg.message.extendedTextMessage?.contextInfo?.participant;
        if (!userToKick) return conn.sendMessage(chatId, { text: 'Please tag a user to kick.' });

        await conn.groupParticipantsUpdate(remoteJid, [userToKick], 'remove');
        conn.sendMessage(chatId, { text: `User kicked: ${userToKick}` });
    }
};
