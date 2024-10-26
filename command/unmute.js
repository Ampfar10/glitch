const CFonts = require('cfonts');
const { unmuteBot, isMuted } = require('../stateManager'); 

module.exports = {
    name: 'unmute',
    description: 'Mute the bot (owner only)',
    category: 'Owner',
    execute(conn, chatId, args, ownerId, senderId) {
        if (senderId !== ownerId) {
            return conn.sendMessage(chatId, { text: 'This command can only be used by the owner.', mentions: [senderId] });
        }

        if (isMuted()) {
            return conn.sendMessage(chatId, { text: 'The bot is already unmuted.', mentions: [senderId] });
        }

        // Mute the bot
        unmuteBot();
        CFonts.say('Bot unmuted', { font: 'console', align: 'center', colors: ['yellow'] });
        conn.sendMessage(chatId, { text: 'The bot has been unmuted.', mentions: [senderId] });
    },
};
