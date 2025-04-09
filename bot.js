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
<<<<<<< HEAD
const flipCooldown = new Set();
=======
>>>>>>> 92154144b1fcb6f92ff0899a84ce6e32317687a9
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
  return `${value.toLocaleString()} coins`;
}

client.on("ready", () => {
  console.log(`UwUtopia is live as ${client.user.tag}`);
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

  if (command === 'work') {
    const now = Date.now();
    const cooldownTime = 1000 * 60 * 5;
    if (cooldowns[`${userId}_work`] > now) {
      const remaining = Math.ceil((cooldowns[`${userId}_work`] - now) / 1000);
      return message.reply(`You're tired! Wait ${remaining} seconds before working again.`);
    }
    const earnings = Math.floor(Math.random() * 50) + 50;
    user.currency += earnings;
    user.xp += 15;
    cooldowns[`${userId}_work`] = now + cooldownTime;

    const embed = new EmbedBuilder()
      .setTitle(`You worked hard!`)
      .setDescription(`You earned **${earnings}** coins and gained **15 XP**.`)
      .setColor('#00ff99');

    return message.reply({ embeds: [embed] });
  }

  if (command === 'balance') {
    const embed = new EmbedBuilder()
      .setColor('#FFC0CB')
      .setAuthor({ name: `${message.author.username}'s Wallet`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setDescription(`You have **${user.currency.toLocaleString()}** coins.`)
      .setFooter({ text: 'Keep grinding!' });
    return message.channel.send({ embeds: [embed] });
  }

  if (command === 'profile') {
    return message.reply(`XP: ${user.xp}, Level: ${user.level}, Currency: ${user.currency}, Health: ${user.health}`);
  }

  if (command === 'hunt') return handleHunt(message, userId);
  if (command === 'battle') return handleBattle(message, userId);
  if (command === 'flip') return handleFlip(message, userId, args);
  if (command === 'slot') return startSlotMachine(message, args);
  if (command === 'inventory') return showInventory(message);
  if (command === 'zoo') return showZoo(message);
  if (command === 'help') return showHelp(message);

  if (command === 'admin') {
    if (message.author.id !== '328983842570371074') return message.reply("You're not allowed.");
    const sub = args[0];
    const target = message.mentions.users.first();
    if (!target) return message.reply('Mention someone.');
    const targetData = getUser({ author: target });

    if (sub === 'setxp') {
      const amount = parseInt(args[2]);
      targetData.xp = amount;
      return message.reply(`Set ${target.username}'s XP to ${amount}.`);
    }

    if (sub === 'setcurrency') {
      const amount = parseInt(args[2]);
      targetData.currency = amount;
      return message.reply(`Set ${target.username}'s currency to ${amount}.`);
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
  message.reply(`You found a **${found}** and gained **${xpGain} XP**!`);
}

function handleBattle(message, userId) {
  if (hasCooldown(userId, "battle")) return message.reply("You're still recovering from battle!");
  setCooldown(userId, "battle", 10000);
  const xp = Math.floor(Math.random() * 25 + 15);
  userData[userId].xp += xp;
  message.reply(`You battled and gained **${xp} XP**!`);
}

async function handleFlip(message, userId, args) {
  const choice = args[0]?.toLowerCase();
  const betInput = args[1];
  if (!['heads', 'tails'].includes(choice)) {
    return message.reply("Usage: `!flip heads 100` or `!flip tails all`");
  }

<<<<<<< HEAD
  if (flipCooldown.has(userId)) {
    return message.reply("You're flipping too fast! Please wait 5 seconds.");
  }
  flipCooldown.add(userId);
  setTimeout(() => flipCooldown.delete(userId), 5000);

=======
>>>>>>> 92154144b1fcb6f92ff0899a84ce6e32317687a9
  const user = getUser(message);
  let betAmount = parseInt(betInput);
  if (betInput === 'all') betAmount = Math.min(user.currency, 250000);
  if (isNaN(betAmount) || betAmount <= 0) return message.reply("Invalid bet amount.");
  if (betAmount > 250000) return message.reply("Max bet is 250,000 coins.");
  if (user.currency < betAmount) return message.reply("Not enough coins.");

  user.currency -= betAmount;
<<<<<<< HEAD

  // Use visual fantasy-themed emojis (custom ones can be added later)
  const flipAnimation = ['<a:coinflip1:123456789012345678>', '<a:coinflip2:123456789012345679>', '<a:coinflip3:123456789012345680>'];
  const embed = new EmbedBuilder()
    .setTitle(`✨ Flipping the Magic Coin...`)
    .setDescription(`${flipAnimation.join(" ")}`)
    .setColor(0xFFD700)
    .setImage('https://media1.tenor.com/m/wKNqmz5FgUIAAAAC/coin-money.gif') // fantasy coin
    .setFooter({ text: `${message.author.username}'s Coin Flip`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

  const sent = await message.channel.send({ embeds: [embed] });

  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(2500);
=======
  const embed = new EmbedBuilder()
    .setTitle(`🪙 Flipping the Coin...`)
    .setDescription("Flipping...")
    .setColor(0xFFD700)
    .setFooter({ text: `${message.author.username}'s Coin Flip`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

  const sent = await message.channel.send({ embeds: [embed] });
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(2000);
>>>>>>> 92154144b1fcb6f92ff0899a84ce6e32317687a9

  const result = Math.random() < 0.5 ? 'heads' : 'tails';
  const win = result === choice;

<<<<<<< HEAD
  if (win) user.currency += betAmount * 2;

  embed
    .setTitle(`✨ The coin landed on: **${result.toUpperCase()}**!`)
    .setColor(win ? 0x00FF99 : 0xFF5555)
    .setThumbnail(result === 'heads'
      ? 'https://cdn-icons-png.flaticon.com/512/3793/3793025.png'  // example head
      : 'https://cdn-icons-png.flaticon.com/512/3793/3793029.png') // example tail
    .setDescription(
      win
        ? `You chose **${choice}** and won **${(betAmount * 2).toLocaleString()}** coins!`
        : `Bad luck! You lost **${betAmount.toLocaleString()}** coins.`
    );

=======
  embed
    .setTitle(`🪙 It landed on: **${result.toUpperCase()}**`)
    .setColor(win ? 0x00FF99 : 0xFF5555)
    .setDescription(
      win
        ? `You guessed **${choice}** and won **${(betAmount * 2).toLocaleString()}** coins!`
        : `Oops! You lost **${betAmount.toLocaleString()}** coins.`
    );
  if (win) user.currency += betAmount * 2;
>>>>>>> 92154144b1fcb6f92ff0899a84ce6e32317687a9
  await sent.edit({ embeds: [embed] });
}

async function startSlotMachine(message, args) {
  const user = getUser(message);
  const userId = message.author.id;
  if (!userSlotStats[userId]) userSlotStats[userId] = { losses: 0 };

  const items = ['🍒', '🍋', '🍊', '🍇', '💎'];
  const payoutMultipliers = { '🍒': 1, '🍋': 2, '🍊': 3, '🍇': 5, '💎': 10 };

  function spin(pity = false) {
    if (!pity) return items[Math.floor(Math.random() * items.length)];
    const weighted = [
      { item: '🍒', weight: 40 },
      { item: '🍋', weight: 30 },
      { item: '🍊', weight: 20 },
      { item: '🍇', weight: 9 },
      { item: '💎', weight: 1 },
    ];
    const total = weighted.reduce((sum, i) => sum + i.weight, 0);
    const rand = Math.random() * total;
    let acc = 0;
    for (const i of weighted) {
      acc += i.weight;
      if (rand <= acc) return i.item;
    }
    return '🍒';
  }

  let betAmount = args[0] === 'all' ? Math.min(user.currency, 250000) : parseInt(args[0]);
  if (isNaN(betAmount) || betAmount <= 0) return message.reply("Enter a valid bet.");
  if (betAmount > 250000) return message.reply("Max bet is 250,000.");
  if (user.currency < betAmount) return message.reply("Not enough coins.");

  user.currency -= betAmount;
  const losses = userSlotStats[userId].losses;
  const pity = [3, 6, 9].includes(losses) || losses > 9;
  const final = pity ? spin(true) : spin();
  const finalReel = pity ? [final, final, final] : [spin(), spin(), spin()];

  const embed = new EmbedBuilder()
    .setTitle('🎰 Slot Machine 🎰')
    .setDescription('Spinning...')
    .setColor('#FFC0CB')
    .setFooter({ text: `Bet: ${betAmount.toLocaleString()} coins` });

  const msg = await message.channel.send({ embeds: [embed] });
  const delay = ms => new Promise(res => setTimeout(res, ms));
  for (let i = 0; i < 3; i++) {
    const reels = [spin(), spin(), spin()].join(' | ');
    embed.setDescription(`Spinning...\n| ${reels} |`);
    await msg.edit({ embeds: [embed] });
    await delay(500);
  }

  const resultLine = finalReel.join(' | ');
  embed.setDescription(`Result:\n| ${resultLine} |`);

  if (finalReel.every(i => i === finalReel[0])) {
    const icon = finalReel[0];
    const winnings = betAmount * payoutMultipliers[icon];
    user.currency += winnings;
    userSlotStats[userId].losses = 0;
    embed.addFields({ name: 'You Won!', value: `You won **${winnings.toLocaleString()} coins**!` });
  } else {
    userSlotStats[userId].losses++;
    embed.addFields({ name: 'You Lost!', value: `You lost **${betAmount.toLocaleString()} coins**.` });
  }

  await msg.edit({ embeds: [embed] });
}

function showInventory(message) {
  const weapons = userWeapons[message.author.id] || {};
  const weaponList = Object.entries(weapons).map(([name, count]) => `${name}: ${count}`).join('\n') || 'No weapons yet!';
  const embed = new EmbedBuilder()
    .setTitle(`${message.author.username}'s Inventory`)
    .setDescription(weaponList)
    .setColor('#6699ff');
  return message.reply({ embeds: [embed] });
}

function showZoo(message) {
  const animals = userAnimals[message.author.id] || {};
  const zooList = Object.entries(animals).map(([name, count]) => `${name}: ${count}`).join('\n') || 'No animals yet!';
  const embed = new EmbedBuilder()
    .setTitle(`${message.author.username}'s Zoo`)
    .setDescription(zooList)
    .setColor('#ffcc66');
  return message.reply({ embeds: [embed] });
}

function showHelp(message) {
  const embed = new EmbedBuilder()
    .setTitle('UwUtopia Commands')
    .setDescription(`
\`!work\` - Earn coins and XP  
\`!flip heads 100\` - Flip a coin  
\`!slot\` - Play slot machine  
\`!balance\` - Show your wallet  
\`!profile\` - Your stats  
\`!zoo\` - See your animals  
\`!inventory\` - Your items  
\`!admin\` - Admin-only`)
    .setColor('#aaaaee');
  return message.reply({ embeds: [embed] });
}

client.login('MTM1ODIwNjM1Mzg3Mjc4MTQ0NA.G5BaXm.UAtlG2_jyC1Dz6aHhpCaAGckFO3e3MxT5zDm0w');
<<<<<<< HEAD
=======
      
>>>>>>> 92154144b1fcb6f92ff0899a84ce6e32317687a9
