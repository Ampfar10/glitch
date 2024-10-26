module.exports = {
    name: 'well',
    category: 'Owner',
    description: 'Adds owner to a group by group ID (owner only)',
    async execute(conn, chatId, args) {
        if (!await isOwner(msg)) return conn.sendMessage(msg.key.remoteJid, { text: 'Only the bot owner can use this command.' });

        const groupId = args[0];
        await conn.groupParticipantsUpdate(groupId, [msg.key.participant], 'add');
        await conn.groupParticipantsUpdate(groupId, [msg.key.participant], 'promote');
        conn.sendMessage(msg.key.remoteJid, { text: `Added owner to group ${groupId} and promoted to admin.` });
    }
};
