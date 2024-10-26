module.exports = {
    name: 'add',
    category: 'Group',
    description: 'Adds a user to the group (admin only)',
    async execute(conn, msg, args) {
        const { remoteJid } = msg.key;
        if (!await isAdmin(conn, msg)) return conn.sendMessage(remoteJid, { text: 'Only admins can use this command.' });

        const numberToAdd = args[0];
        if (!numberToAdd) return conn.sendMessage(remoteJid, { text: 'Please provide a number to add.' });
        
        await conn.groupParticipantsUpdate(remoteJid, [`${numberToAdd}@s.whatsapp.net`], 'add');
        conn.sendMessage(remoteJid, { text: `User added: ${numberToAdd}` });
    }
};
