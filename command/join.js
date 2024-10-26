module.exports = {
    name: 'join',
    category: 'Owner',
    description: 'Joins a group using an invite link (owner only)',
    async execute(conn, msg, args) {
        if (!await isOwner(msg)) return conn.sendMessage(msg.key.remoteJid, { text: 'Only the bot owner can use this command.' });

        const inviteLink = args[0];
        try {
            await conn.groupAcceptInvite(inviteLink.split('/').pop());
            conn.sendMessage(msg.key.remoteJid, { text: 'Joined group successfully.' });
        } catch {
            conn.sendMessage(msg.key.remoteJid, { text: 'Failed to join group.' });
        }
    }
};
