const Discord = require('discord.js');
const ayarlar = require("../ayarlar.json")
exports.run = async(client, message, args) => {
  if(message.author.id != ayarlar.sahip || message.author.id != "343496705196556288") return;
  process.exit(0)
};

exports.conf = {
  enabled: true, 
  guildOnly: true,
  aliases: ['reboot', 'restart']
};

exports.help = {
  name: 'reboot', 
  description: 'This command restarts bot.', 
  usage: 'reboot',
};