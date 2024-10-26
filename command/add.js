module.exports = {
    name: 'add',
    category: 'Group',
    description: 'Adds a user to the group (admin only)',
    async execute(conn, chatId, msg, args) {
        const { remoteJid } = msg.key;
        if (!await isAdmin(conn, msg)) return conn.sendMessage(chatId, { text: 'Only admins can use this command.' });

        const numberToAdd = args[0];
        if (!numberToAdd) return conn.sendMessage(chatId, { text: 'Please provide a number to add.' });
        
        await conn.groupParticipantsUpdate(remoteJid, [`${numberToAdd}@s.whatsapp.net`], 'add');
        conn.sendMessage(chatId, { text: `User added: ${numberToAdd}` });
    }
};
