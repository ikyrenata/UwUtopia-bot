const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const DEFAULT_PREFIX = '!';
const userData = {};
const userWeapons = {};
const userAnimals = {};
const cooldowns = {};
const userSlotStats = {};
const userCooldowns = {};
const auctions = {};
const userLumina = {};
const userBuffs = {};
const userCrates = {};
const userLootboxes = {};
const activeCurses = {};
const lootEvents = {};
const luminaLeaderboard = {};
const userSocials = {};
const prefixData = {};

function getUser(message) {
  if (!userData[message.author.id]) {
    userData[message.author.id] = { xp: 0, currency: 0, level: 1, health: 100, losses: 0, luminaSent: 0 };
  }
  return userData[message.author.id];
}

function getPrefix(guildId) {
  return prefixData[guildId] || DEFAULT_PREFIX;
}

function randomChance(percent) {
  return Math.random() < percent / 100;
}

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function hasCooldown(userId, command) {
  const now = Date.now();
  const cooldown = userCooldowns[userId]?.[command];
  return cooldown && now < cooldown;
}

function setCooldown(userId, command, duration) {
  if (!userCooldowns[userId]) userCooldowns[userId] = {};
  userCooldowns[userId][command] = Date.now() + duration;
}

function formatCurrency(value) {
  return ${value.toLocaleString()} coins;
}

client.on("ready", () => {
  console.log(UwUtopia is live as ${client.user.tag});
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  const prefix = getPrefix(message.guild.id);
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();
  const userId = message.author.id;
  const user = getUser(message);

  if (!userWeapons[userId]) userWeapons[userId] = [];
  if (!userAnimals[userId]) userAnimals[userId] = [];

  if (command === 'work'|| sub === 'w') {
    const now = Date.now();
    const cooldownTime = 1000 * 60 * 5;
    if (cooldowns[${userId}_work] > now) {
      const remaining = Math.ceil((cooldowns[${userId}_work] - now) / 1000);
      return message.reply(You're tired! Wait ${remaining} seconds before working again.);
    }
    const earnings = Math.floor(Math.random() * 50) + 50;
    user.currency += earnings;
    user.xp += 15;
    cooldowns[${userId}_work] = now + cooldownTime;

    const embed = new EmbedBuilder()
      .setTitle(You worked hard!)
      .setDescription(You earned **${earnings}** coins and gained **15 XP**.)
      .setColor('#00ff99');

    return message.reply({ embeds: [embed] });
  }

  if (command === 'balance'|| sub === 'b') {
    const embed = new EmbedBuilder()
      .setColor('#FFC0CB')
      .setAuthor({ name: ${message.author.username}'s Wallet, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setDescription(You have **${user.currency.toLocaleString()}** coins.)
      .setFooter({ text: 'Keep grinding!' });
    return message.channel.send({ embeds: [embed] });
  }

  if (command === 'profile'|| sub === 'p') {
    return message.reply(XP: ${user.xp}, Level: ${user.level}, Currency: ${user.currency}, Health: ${user.health});
  }

  if (command === 'hunt' || command === 'h') return handleHunt(message, userId);
  if (command === 'battle' || command === 'b') return handleBattle(message, userId);
  if (command === 'coinflip' || command === 'cf') return handleFlip(message, userId, args);
  if (command === 'slot' || command === 's') return startSlotMachine(message, args);
  if (command === 'inventory' || command === 'inv') return showInventory(message);
  if (command === 'zoo' || command === 'z') return showZoo(message);
  if (command === 'help') return showHelp(message);

  if (command === 'admin' || command === 'a') {
    if (message.author.id !== '328983842570371074') return message.reply("You're not allowed.");
    const sub = args[0];
    const target = message.mentions.users.first();
    if (!target) return message.reply('Mention someone.');
    const targetData = getUser({ author: target });

    if (sub === 'setxp' || sub === 'xp') {
      const amount = parseInt(args[2]);
      targetData.xp = amount;
      return message.reply(Set ${target.username}'s XP to ${amount}.);
    }

    if (sub === 'setcurrency' || sub === 'money') {
      const amount = parseInt(args[2]);
      targetData.currency = amount;
      return message.reply(Set ${target.username}'s currency to ${amount}.);
    }

    return message.reply('Invalid admin command.');
  }
});

function handleHunt(message, userId) {
  if (hasCooldown(userId, "hunt")) return message.reply("You're too tired to hunt again just yet!");
  setCooldown(userId, "hunt", 10000);
  const animals = ["Wolf", "Fox", "Deer", "Dragon"];
  const found = getRandom(animals);
  const xpGain = Math.floor(Math.random() * 20 + 10);
  userAnimals[userId].push(found);
  userData[userId].xp += xpGain;
  message.reply(You found a **${found}** and gained **${xpGain} XP**!);
}

function handleBattle(message, userId) {
  if (hasCooldown(userId, "battle")) return message.reply("You're still recovering from battle!");
  setCooldown(userId, "battle", 10000);
  const xp = Math.floor(Math.random() * 25 + 15);
  userData[userId].xp += xp;
  message.reply(You battled and gained **${xp} XP**!);
}

async function handleFlip(message, userId, args) {
  const choice = args[0]?.toLowerCase();
  const betInput = args[1];
  if (!['heads', 'tails'].includes(choice)) {
    return message.reply("Usage: !flip heads 100 or !flip tails all");
  }

  const user = getUser(message);
  let betAmount = parseInt(betInput);
  if (betInput === 'all') betAmount = Math.min(user.currency, 250000);
  if (isNaN(betAmount) || betAmount <= 0) return message.reply("Invalid bet amount.");
  if (betAmount > 250000) return message.reply("Max bet is 250,000 coins.");
  if (user.currency < betAmount) return message.reply("Not enough coins.");

  user.currency -= betAmount;
  const embed = new EmbedBuilder()
    .setTitle(🪙 ping the Coin...)
    .setDescription("ping...")
    .setColor(0xFFD700)
    .setFooter({ text: ${message.author.username}'s Coin Flip, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

  const sent = await message.channel.send({ embeds: [embed] });
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(2000);

  const result = Math.random() < 0.5 ? 'heads' : 'tails';
  const win = result === choice;

  embed
    .setTitle(🪙 It landed on: **${result.toUpperCase()}**)
    .setColor(win ? 0x00FF99 : 0xFF5555)
    .setDescription(
      win
        ? You guessed **${choice}** and won **${(betAmount * 2).toLocaleString()}** coins!
        : Oops! You lost **${betAmount.toLocaleString()}** coins.
    );
  if (win) user.currency += betAmount * 2;
  await sent.edit({ embeds: [embed] });
}

async function startSlotMachine(message, args) {
    const user = getUser(message);
    const userId = message.author.id;
    if (!userSlotStats[userId]) userSlotStats[userId] = { losses: 0 };

    const items = ['🍒', '🍋', '🍊', '🍇', '💎'];
    const payoutMultipliers = {
        '🍒': 1,
        '🍋': 2,
        '🍊': 3,
        '🍇': 5,
        '💎': 10,
    };

    function spin(pity = false) {
        if (!pity) return items[Math.floor(Math.random() * items.length)];

        const weighted = [
            { item: '🍒', weight: 40 },
            { item: '🍋', weight: 30 },
            { item: '🍊', weight: 20 },
            { item: '🍇', weight: 9 },
            { item: '💎', weight: 1 },
        ];
        const totalWeight = weighted.reduce((sum, i) => sum + i.weight, 0);
        const rand = Math.random() * totalWeight;
        let acc = 0;
        for (const i of weighted) {
            acc += i.weight;
            if (rand <= acc) return i.item;
        }
        return '🍒'; // fallback
    }

    let betAmount;
    if (args[0] === 'all') {
        if (user.currency <= 0) {
            return message.channel.send("You don’t have any Shinnies✨ to bet.");
        }
        betAmount = Math.min(user.currency, 250000);
    } else {
        betAmount = parseInt(args[0]);
        if (isNaN(betAmount) || betAmount <= 0) {
            return message.channel.send("Enter a valid bet amount.");
        }
    }

    if (betAmount > 250000) {
        return message.channel.send("Max bet is 250,000 Shinnies✨.");
    }
    if (user.currency < betAmount) {
        return message.channel.send("You don’t have enough Shinnies✨.");
    }

    user.currency -= betAmount;

    const losses = userSlotStats[userId].losses;
    const pityTriggered = [3, 6, 9].includes(losses) || losses > 9;
    const finalIcon = pityTriggered ? spin(true) : spin();
    const finalReel = pityTriggered ? [finalIcon, finalIcon, finalIcon] : [spin(), spin(), spin()];

    const username = message.author.username;
    const embed = new EmbedBuilder()
        .setColor('#FFC0CB')
        .setTitle('🎰 Slot Machine 🎰')
        .setDescription('Spinning...')
        .setFooter({ text: Bet Amount: ${betAmount.toLocaleString()} Shinnies✨ });

    const msg = await message.channel.send({ embeds: [embed] });
    const delay = ms => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < 3; i++) {
        const spinningReel = [spin(), spin(), spin()].join(' | ');
        embed.setDescription(Spinning...\n| ${spinningReel} |);
        await msg.edit({ embeds: [embed] });
        await delay(500);
    }

    const finalLine = finalReel.join(' | ');
    embed.setDescription(Result:\n| ${finalLine} |);

    if (finalReel.every(i => i === finalReel[0])) {
        const icon = finalReel[0];
        const win = betAmount * payoutMultipliers[icon];
        user.currency += win;
        userSlotStats[userId].losses = 0;
        embed.addFields({ name: ${username} won!, value: **${username}** won **${win.toLocaleString()} Shinnies✨**!! });
    } else {
        userSlotStats[userId].losses++;
        embed.addFields({ name: ${username} lost!, value: **${username}** lost **${betAmount.toLocaleString()} Shinnies✨**... });
    }

    await msg.edit({ embeds: [embed] });
}

function showZoo(message) {
  const animals = userAnimals[message.author.id] || [];
  const zooList = animals.length ? animals.join('\n') : 'No animals yet!';
  const embed = new EmbedBuilder()
    .setTitle(${message.author.username}'s Zoo)
    .setDescription(zooList)
    .setColor('#ffcc00')
    .setFooter({ text: 'Collect more animals to expand your zoo!' });
  message.reply({ embeds: [embed] });
}

function showHelp(message) {
  const embed = new EmbedBuilder()
    .setTitle('UwUtopia Help')
    .setDescription('Here are the commands you can use:')
    .addFields(
      { name: '!work', value: 'Work to earn coins and XP.' },
      { name: '!balance', value: 'Check your coin balance.' },
      { name: '!hunt', value: 'Go hunting for animals and XP.' },
      { name: '!battle', value: 'Fight and gain XP.' },
      { name: '!slot', value: 'Play the slot machine for a chance to win big!' },
      { name: '!inventory', value: 'Check your inventory for weapons.' },
      { name: '!zoo', value: 'See your collection of animals.' },
      { name: '!admin', value: 'Admin commands to modify user data (restricted to authorized users).' }
    )
    .setColor('#00ff99');
  message.channel.send({ embeds: [embed] });
}

client.login('MTM1ODIwNjM1Mzg3Mjc4MTQ0NA.GlP_Wi.uo3dbjydgFIB9jbwueOHN0TLJ9GIHKQCNqP57c');
