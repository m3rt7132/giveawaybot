const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
const db = require("quick.db");
exports.run = async (client, message, args) => {
  // SABİT
  var prefix = await db.fetch("prefix_"+ message.guild.id);
  if(prefix == null) prefix = ayarlar.prefix;
  var tr = [
    "Dil tercihi:", // 0
    "Dilinizi değiştirmek için: **" + prefix + "dil (en, tr)**", // 1
    "Hatalı dil seçimi", // 2
    "Dil tercihiniz başarıyla değiştirildi", // 3
    "Bu komut adminlere özeldir" // 4
  ];
  var en = [
    "Language preference:",
    "To change your language: **" + prefix + "lang (en, tr)**",
    "Incorrect language selection",
    "Your language preference has been changed successfully",
    "Only admins can use that command"
  ];
  let dil;
  var mesaj;
  await dilkontrol();
  // SABİT
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(emo("hata") + "**" + mesaj[4] + "**");

  let tercih = args[0];
  if (tercih == null) {
    return message.channel.send(mesaj[0] + " ``" + dil.toUpperCase() + "``\n" + mesaj[1]);
  }
  if (tercih != "tr" && tercih != "en") return message.channel.send(emo("hata") + "**" + mesaj[2] + "**");
  db.set("dil_" + message.guild.id, tercih);
  await dilkontrol();
  return message.channel.send(emo("onay") + "**" + mesaj[3] + "**");

  async function dilkontrol() {
    dil = await db.fetch("dil_" + message.guild.id);
    mesaj = [];
    if (dil == "tr") mesaj = tr;
    else if (dil == "en") mesaj = en;
  }
  function emo(yazi) {
  let emoji = client.emojis.find(j => j.name === yazi)
  return "<a:" + emoji.name + ":" + emoji.id + "> │";
}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["dil", "language", "lang"],
  permLevel: 0
};

exports.help = {
  name: "dil",
  description: "dil",
  usage: "dil"
};
