const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const prefix = "!";  // Default prefix for commands

// Your MongoDB Schema setup
const profileSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    coins: { type: Number, default: 0 },
    level: { type: Number, default: 1 }
});

const Profile = mongoose.model('Profile', profileSchema);

// Discord bot client setup
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Connect to MongoDB (mongodb+srv://ikyrenata:<db_password>@cluster0.hvjvoyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0)
mongoose.connect('your_mongodb_uri_here', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

// Basic command: Check user balance
client.on('messageCreate', async message => {
    if (message.content.startsWith(`${prefix}balance`)) {
        const user = await Profile.findOne({ userID: message.author.id });
        if (user) {
            message.reply(`You have ${user.coins} coins and are at level ${user.level}!`);
        } else {
            message.reply('You don\'t have a profile yet!');
        }
    }
});

// Basic command: Give coins to another user
client.on('messageCreate', async message => {
    if (message.content.startsWith(`${prefix}give`)) {
        const args = message.content.split(' ');
        const targetUser = message.mentions.users.first();
        const amount = parseInt(args[2]);

        if (!targetUser || isNaN(amount) || amount <= 0) {
            return message.reply("Please mention a user and specify a valid amount.");
        }

        const senderProfile = await Profile.findOne({ userID: message.author.id });
        const targetProfile = await Profile.findOne({ userID: targetUser.id });

        if (!senderProfile || senderProfile.coins < amount) {
            return message.reply("You don\'t have enough coins.");
        }

        senderProfile.coins -= amount;
        targetProfile.coins += amount;

        await senderProfile.save();
        await targetProfile.save();

        message.reply(`Successfully gave ${amount} coins to ${targetUser.tag}.`);
    }
});

// Log bot in with your token
client.login('MTM1ODIwNjM1Mzg3Mjc4MTQ0NA.GBictf.ZXcsvTh9SPX-ftiD8X8boVsAkAW5nreFRamhmY');
