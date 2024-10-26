
// Utility to check if a user is an admin
async function isAdmin(conn, msg) {
    const groupMetadata = await conn.groupMetadata(msg.key.remoteJid);
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
    return admins.includes(msg.key.participant);
}

module.exports = { isAdmin };
