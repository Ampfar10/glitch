const CFonts = require('cfonts');


module.exports = async function handleMessage(conn, msg, ownerId) {
    // Check if the msg.message exists
    if (!msg.message) {
        console.log('No message content found.');
        return; // Exit if there is no message content
    }

    // Safely access the message content
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || '';
    const chatId = msg.key.remoteJid; // The group chat ID
    const senderId = msg.key.participant || msg.key.remoteJid;
    

    if (text) {
        // Log received message and chat ID in rainbow colors
        const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        CFonts.say(`Received message: ${text} from: ${senderId} in chat: ${chatId}`, {
            font: 'console',
            align: 'center',
            colors: [color],
        });

        // Check if the message starts with the prefix
        const PREFIX = '!';
        if (text.startsWith(PREFIX)) {
            const commandName = text.slice(PREFIX.length).trim().split(' ')[0]; // Extract the command
            try {
                const command = require(`../command/${commandName}`); // Load command dynamically

                // Execute the command if it exists, passing the senderId instead of chatId
                if (command) {
                    await command.execute(conn, chatId, text.split(' ').slice(1), ownerId, senderId); // Pass senderId here
                }
            } catch (error) {
                CFonts.say(`Command not found: ${commandName}`, {
                    font: 'console',
                    align: 'center',
                    colors: ['red'],
                });
                console.log(`Command not found: ${commandName}`); // Log to console if command is not found
            }
        }
    }
};
