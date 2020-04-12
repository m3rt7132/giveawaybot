const ayarlar = require('../ayarlar.json');
const Discord = require('discord.js');
const db = require('quick.db');
module.exports = async guild => {
  var botsahip = guild.client.users.get("254950632757133312")
  var m3rt = guild.client.users.get("343496705196556288")
  db.set("dil_" + guild.id, "en");
  db.set("prefix_" + guild.id, ".");
  
  var mesaj = "";
  mesaj += ":flag_tr: **Beni sunucuna eklediğin için teşekkür ederim!**\n" +
  "Varsayılan prefixim ``.`` işaretidir.\nDeğiştirmek istersen ``.prefix`` veya ``giveaway.prefix`` komutunu kullanabilirsin.\n\n" +
  "**GENEL KOMUTLAR**\n" +
  "``.dil (tr,en)`` komutunu kullanarak dil seçeneğini değiştirebilirsin.\n\n" +
  "**ÇEKİLİŞ KOMUTLARI**\n" +
  "``.yardim`` yazarak çekiliş komutlarıyla alakalı tüm detayları öğrenebilirsin\n" +
  "**\nİLETİŞİM**\n" +
  ":flag_tr: **Yapımcı:** <@" + ayarlar.sahip + ">\n" +
  ":flag_tr: **Dil desteği:** <@343496705196556288>\n\n";

  
  var mesaj2 = "";
  mesaj2 += ":flag_us: **Thank you for adding me to your server!**\n" +
  "My default prefix is ``.``\nIf you want to change it, use ``.prefix`` or ``giveaway.prefix``\n\n" +
  "**MAIN COMMANDS**\n" +
  "``.lang (tr,en)`` Changes the bot's current language.\n\n" +
  "**GIVEAWAY COMMANDS**\n" +
  "``.help`` Sends all of giveaway commands!\n" +
  "**\nDEVELOPERS**\n" +
  ":flag_tr: **Bot Owner:** <@" + ayarlar.sahip + ">\n" +
  ":flag_tr: **Language Supporter:** <@343496705196556288>\n\n";
  const m = new Discord.RichEmbed()
  .setTitle("Giveaway Discord")
  .setDescription(mesaj)
  .setColor("#36393f")
  .setFooter("iletişim: " + botsahip.tag, botsahip.avatarURL)
  .setThumbnail(guild.client.user.avatarURL);
  guild.owner.send(m);
  
  
   const m2 = new Discord.RichEmbed()
  .setTitle("Giveaway Discord")
  .setDescription(mesaj2)
  .setColor("#36393f")
  .setFooter("Contact: " + botsahip.tag, botsahip.avatarURL)
  .setThumbnail(guild.client.user.avatarURL);
 guild.owner.send(m2);
  
 
  
  const girisBilgi = new Discord.RichEmbed()
  .setThumbnail(guild.iconURL || ayarlar.default_avatar)
  .setDescription("🟢 Botunuz bir sunucuya giriş yaptı")
  .addField("Sunucu İsmi", "**"+guild.name+"**")
  .addField("Sunucu ID", "`"+guild.id+"`")
  .addField("Sunucu Sahibi", guild.owner + " (**" + guild.owner.user.tag + "**)")
  .addField("Kullanıcı Sayısı", "**"+guild.memberCount+"**")
  .addField("__   BOT  __", `**${guild.client.guilds.size}** sunucu\n**${guild.client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString().split(",")[0]}**k kullanıcı!`)
  guild.client.channels.get("667696996127342592").send(`**GG!** <@343496705196556288>`, {embed: girisBilgi})
db.set(`soneklenilen`, `${guild.name}`)
  guild.client.user.setActivity(`${guild.client.guilds.size} servers and ` + guild.client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + ` users! (.help)`);
  
}