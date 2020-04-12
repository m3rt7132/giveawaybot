const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
const db = require("quick.db");
exports.run = async (client, message, args) => {
  // SABİT
  var prefix = await db.fetch("prefix_"+ message.guild.id);
  if(prefix == null) prefix = ayarlar.prefix;
  var tr = [
    emo("hata") + "**Bu komut adminlere özeldir**", //0
    "Silme işlemi yapmak için önce çekiliş oluşturmalısınız", //1
    "KULLANIM:", //2
    "ID öğrenmek için", //3
    "cekilis-bitir", //4
    "cekilisler", //5
    "Belirlenen aralıkların dışında rakam girdiniz", //6
    "**{cekilisadi}** isimli çekilişi bitirmek üzeresiniz. Onaylıyor musunuz? ``onay``", // 7
    "Çekiliş sonuçları birazdan yayınlanacak", // 8
    "Verilen süre içerisinde cevap yazmadığınız için işleminiz iptal edilmiştir"
  ];
  var en = [
    emo("hata") + "**Only admins can use this command!**",
    "There are no giveaways in progress so you can't delete it!",
    "USAGE:",
    "To learn ID",
    "giveaway-finish",
    "giveaways",
    "You must type the correct number(giveaway ID) of giveaways in the progress.",
    "Are you really want to finish the giveaway called with **{cekilisadi}**? If yes, type `confirm`",
    "Giveaway results will be published soon",
    "Your transaction has been canceled because you did not reply within the given time."
    
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
  var cekilisler = db.get("cekilisler_" + message.guild.id);
  if(cekilisler == null) return message.channel.send(emo("hata") + "**" + mesaj[1] + "**");
  if(cekilisler.length <= 0) return message.channel.send(emo("hata") + "**" + mesaj[1] + "**");
  let id = args[0];
  if(id == null) return message.channel.send("**" + mesaj[2] + "** " + prefix + mesaj[4] + " (ID)\n" + mesaj[3] + " ``" + prefix +mesaj[5] + "``" );
  if(id <= 0 || id > cekilisler.length) return message.channel.send(emo("hata") + "**" +mesaj[6] + "**")
  var secilen = cekilisler[id-1];
  mesaj[7] = mesaj[7].replace("{cekilisadi}", secilen.split('-')[0]);
  message.channel.send(mesaj[7]);
  var onay;
    try {
    await message.channel
      .awaitMessages(m => m.author.id == message.author.id && (m.content.toLowerCase() == "onay" || m.content.toLowerCase() == "confirm"), {
        max: 1,
        time: 10000,
        errors: ["time"]
      })
      .then(msg => {
        onay = msg.first().content;
      });
      var secilenx = secilen.split("-");
      secilenx[2] = "1s";
      var secilenyaz = secilenx.join("-");
      cekilisler[id-1] = secilenyaz;
      db.set("cekilisler_" + message.guild.id, cekilisler);
      message.channel.send(emo("onay") + "**" + mesaj[8] + "**");     
    }
  catch (err) { message.channel.send(emo("hata") + "**" + mesaj[9] + "**"); }
  
  function emo(yazi) {
  let emoji = client.emojis.find(j => j.name === yazi)
  return "<a:" + emoji.name + ":" + emoji.id + "> │";
}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["cekilis-bitir", "giveaway-finish", "finish-giveaway", "çekilişbitir", "çekilisbitir", "çekiliş-bitir", "cekilisbitir"],
  permLevel: 0
};

exports.help = {
  name: "cekilis-bitir",
  description: "cekilis-bitir",
  usage: "cekilis-bitir"
};
