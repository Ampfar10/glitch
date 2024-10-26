const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Displays all bot commands categorized.',
    category: 'Utility',
    async execute(conn, chatId, args, ownerId, senderId) {
        // Map to store commands by category
        const categorizedCommands = new Map();

        // Scan the commands folder and load commands
        const commandFiles = fs.readdirSync(path.join(__dirname, '../command'));

        commandFiles.forEach(file => {
            const command = require(`../command/${file}`);
            
            // Group commands by category
            if (!categorizedCommands.has(command.category)) {
                categorizedCommands.set(command.category, []);
            }
            categorizedCommands.get(command.category).push(command);
        });

        // Build help message
        let helpMessage = '📋 *Bot Commands* 📋\n\n';

        categorizedCommands.forEach((commands, category) => {
            helpMessage += `*${category}*\n`;
            commands.forEach(command => {
                helpMessage += `${command.name},`;
            });
            helpMessage += '\n\n';
        });

        // Send help message
        await conn.sendMessage(chatId, { 
            text: helpMessage, 
            mentions: [senderId]
        });
    }
};
