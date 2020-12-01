const { RichEmbed, Client, Collection } = require('discord.js');
const { config } = require("dotenv");
const fs = require("fs");

const client = new Client({
    disableEveryone: true
})

client.commands = new Collection();
client.aliases = new Collection();

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Hello, ${client.user.username} is now online and ready to be used in ${client.guilds.size} servers. No errors or dumps were reported in the process.`);

    client.user.setPresence({
        status: "online",
        game: {
            name: `BOT STATUS HERE`, //Put whatever you want the bot status to be in between the ''. If you want to show how many servers the bot is in, watch the video!
            type: "PLAYING" //Can be PLAYING, WATCHING or LISTENING
        }
    });
})


client.on("message", async message => {
    const prefix = "e-"; //You can change the prefix of your bot to whatever you want here. Just replace e- with your prefix

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length == 0) return;

    let command = client.commands.get(cmd);

    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
    command.run(client, message, args);
});

client.login(process.env.TOKEN);
