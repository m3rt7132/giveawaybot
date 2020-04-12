const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
const db = require("quick.db");
exports.run = async (client, message, args) => {
  // SABİT
  let cekiliskanal = await db.fetch("cekiliskanal_" + message.guild.id);
  let kanaletiket = message.guild.channels.get(cekiliskanal);
  var prefix = await db.fetch("prefix_"+ message.guild.id);
  if(prefix == null) prefix = ayarlar.prefix;
  var tr = [
    "**Bu komut adminlere özeldir**",
    "Çekiliş duyuruları için ayarlanan kanal: **" + kanaletiket + "**\nDeğiştirmek için: ``" + prefix + "cekilis-kanal (kanal etiketi)``", 
    "**Çekiliş kanalı başarıyla ayarlandı**"
  ];
  var en = [
    "**This command is specific to admins**",
    "Setted up channel for giveaway logs: **" + kanaletiket + "**\nIf you want to change: ``" + prefix + "giveaway-channel (channel tag)``",
    "**Channel successfully set**"
  ];
  let dil;
  var mesaj;
  dil = await db.fetch("dil_" + message.guild.id);
  mesaj = [];
  if (dil == "tr") mesaj = tr;
  else if (dil == "en") mesaj = en;
  // SABİT
  // YETKİ KONTROL
  var yetki = false;
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    var yetkililer = db.get("admin_" + message.guild.id);
    if(yetkililer != null) {
      if(yetkililer.length > 0) {
        yetkililer.map(id => {
          if(id == message.author.id) yetki = true;
        })
      }
    }
  }
  else yetki = true;
  if (!yetki) return message.channel.send(emo("hata") + "**" + mesaj[0] + "**");
  // YETKİ KONTROL
  let kanal = message.mentions.channels.first();
  if(kanal == null) return message.channel.send(mesaj[1]);
  db.set("cekiliskanal_" + message.guild.id, kanal.id);
  message.channel.send(emo("onay") + mesaj[2]);
  
  function emo(yazi) {
  let emoji = client.emojis.find(j => j.name === yazi)
  return "<a:" + emoji.name + ":" + emoji.id + "> │";
}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["cekilis-kanal", "giveaway-channel", "çekilişkanal", "çekilişlog", "çekiliş-kanal", "log-channel", "logchannel", "cekiliskanal", "cekilislog"],
  permLevel: 0
};

exports.help = {
  name: "cekilis-kanal",
  description: "cekilis-kanal",
  usage: "cekilis-kanal"
};
