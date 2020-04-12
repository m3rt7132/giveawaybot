const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const db = require("quick.db");
const ms = require("ms");
var momentDuration = require("moment-duration-format");
const moment = require("moment");

exports.run = async (client, message, args) => {

  if(message.author.id !== ayarlar.sahip && message.author.id !== "343496705196556288") return;
   if (!args[0] || args[0].includes('token')) return message.channel.send(`**You must type a code!**`)
  
    const code = args.join(' ');
    function clean(text) {
        if (typeof text !== 'string')
            text = require('util').inspect(text, { depth: 0 })
        text = text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203))
        return text;
    };
    async function send(embed) {
        message.channel.send(embed);
    }
    try {
          var evaled = clean(await eval(code));
      if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace("token", "Verdim tokeni hissettin mi kardeşim").replace(client.token, "Verdim tokeni hissettin mi kardeşim").replace(process.env.PROJECT_INVITE_TOKEN, "Verdim tokeni hissettin mi kardeşim");
          message.channel.send(`${evaled.replace(client.token, "Verdim tokeni hissettin mi kardeşim").replace(process.env.PROJECT_INVITE_TOKEN, "Verdim tokeni hissettin mi kardeşim")}`, {code: "js", split: true});
    } catch(err) { message.channel.send(err, {code: "js", split: true}) }
  
    function emo(yazi) {
  let emoji = client.emojis.find(j => j.name === yazi)
  return "<a:" + emoji.name + ":" + emoji.id + "> │";
}
  async function sunucuGir(id) {
    let sunucu = client.guilds.get(id) || message.guild
    if (!sunucu) return;
    return client.emit("guildCreate", sunucu)
  } 
  async function sunucuAyril(id) {
    let sunucu = client.guilds.get(id) || message.guild
    if (!sunucu) return;
    return client.emit("guildDelete", sunucu)
  } 
  async function fakeGir(id) {
    let uye = client.users.get(id) || message.author
    if (!uye) return;
    return client.emit("guildMemberAdd", uye)
  } 
  async function fakeCik(id) {
    let uye = client.users.get(id) || message.author
    if (!uye) return;
    return client.emit("guildMemberRemove", uye)
  } 
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['eval'],
  permLevel: 0
};

exports.help = {
  name: 'eval',
  description: 'eval',
  usage: 'eval'
};
