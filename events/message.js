const ayarlar = require('../ayarlar.json');
const fs = require("fs");
const Discord = require('discord.js');
const db = require("quick.db");
module.exports = async message => {
  let client = message.client;
  if (message.author.bot) return;
  if(message.channel.type == "dm") return;
  var prefix = await db.fetch("prefix_"+ message.guild.id);
  if(prefix == null) prefix = ayarlar.prefix;
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(' ')[0].slice(prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
 
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
  }
