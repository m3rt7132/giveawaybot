const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
const db = require("quick.db");
const ms = require("ms");
exports.run = async (client, message, args) => {
  // SABİT
  var prefix = await db.fetch("prefix_"+ message.guild.id);
  if(prefix == null) prefix = ayarlar.prefix;
  var tr = [
    emo("hata") + "**Bu komut adminlere özeldir**", //0
    "Kopyalama işlemi yapmak için önce çekiliş oluşturmalısınız", //1
    "KULLANIM:", //2
    "Mesaj ID", //3
    "cekilis-tekrar", //4
    " gün", //5
    " saat", //6
    " dakika", //7
    " saniye", //8
    "Limit yok", //9
    "Süre", //10
    "Talihli sayısı", //11
    "En az katılımcı", //12
    "ÇEKİLİŞ BAŞLADI!", //13
    "Çekilişin kopyası başarıyla oluşturuldu", //14
    "Çekiliş detayları alınamadı.", // 15
    "**{cekilisadi}** isimli çekiliş kopyalanacak, onaylıyor musunuz? ``onay``", //16
    "İşleminiz iptal edildi", //17
    "Kimler katılabilir?", //18
    "Herkes"
  ];
  var en = [
    emo("hata") + "**Only admins can use this command!**",
    "There are no giveaways in progress so you can't copy it!",
    "USAGE:",
    "Message ID",
    "copy-giveaway",
    " days", //5
    " hours", //6
    " minutes", //7
    " seconds", //8
    "No limit",
    "Duration",
    "Winners Size",
    "Minimum participations",
    "GIVEAWAY STARTED!",
    "Copy of giveaway successfully created",
    "There's an error to get giveaway details.",
    "Giveaway **{cekilisadi}** will be copied, If you're ok, type ``confirm``",
    "Your transaction has been canceled",
    "Who can participate?",
    "Everyone"
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
  let id = args[0];
  if(id == null) return message.channel.send("**" + mesaj[2] + "** " + prefix + mesaj[4] + " ("+mesaj[3]+")");
  var cekiliskanal = db.get("cekiliskanal_" + message.guild.id);
  client.channels.get(cekiliskanal).fetchMessage(id).then(async msj => {
    var embed = msj.embeds[0];
    var baslik = embed.title;
    mesaj[16] = mesaj[16].replace("{cekilisadi}", baslik);
    message.channel.send(mesaj[16]);
    try {
        var response = await message.channel.awaitMessages(msg2 => msg2.content.toLowerCase() == "onay" || msg2.content.toLowerCase() == "confirm", {
        maxMatches: 1,
        time: 5000,
        errors: ['time']
       })
      }
    catch(err) { return message.channel.send(emo("hata") + "**" + mesaj[17] + "**");}
    var aciklama = embed.description;
    var sure = embed.fields[0].value;
    var sureembed = sure;
    var talihli = embed.fields[1].value;
    var enaz = embed.fields[2].value;
    var enazembed = enaz;
    var sponsor = embed.fields[3].value;
    var embedkimlerkatilabilir = "";
    sure = sure.replace(mesaj[8], "s");
    sure = sure.replace(mesaj[5], "d");
    sure = sure.replace(mesaj[7], "m");
    sure = sure.replace(mesaj[6], "h")
    
    let sonuc = 0;
    var zaman = sure.split(' ');
    zaman.map(x => {
      let hesap = ms(x);
      sonuc += hesap
    })
    var cekiliszaman =  new Date().getTime();
    if(enaz == mesaj[9]) enaz = talihli;
    
    var kimlerdb = "";
    var kimlerkatilabilir = embed.fields[4].value;
    var cekilisdizi = [];
    if(kimlerkatilabilir == mesaj[19]) {
      embedkimlerkatilabilir = mesaj[19];
      kimlerdb = "0";
    }
    else {
      kimlerkatilabilir = kimlerkatilabilir.split(" ");
      kimlerkatilabilir.map(l => {
        if(l.startsWith("<@&")) { cekilisdizi.push(l); } 
      })
      kimlerdb = cekilisdizi.join("/");
      embedkimlerkatilabilir = cekilisdizi.join(" | ");
    }
    var topla = baslik + "-" + aciklama + "-" + sure + "-" + talihli + "-" + sponsor + "-" + enaz + "-" + cekiliszaman + "-";
    
    var avatar = (message.author.avatarURL) ? message.author.avatarURL: "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png"
    var yarismaBilgi = new Discord.RichEmbed()
    .setTitle(baslik)
    .setDescription(aciklama)
    .setColor("#36393f")
    .addField(mesaj[10], sureembed, false)
    .addField(mesaj[11], talihli, true)
    .addField(mesaj[12], enazembed, true)
    .addField("Sponsor",  sponsor, true)
    .addField(mesaj[18], embedkimlerkatilabilir, false)
    .setThumbnail(client.user.avatarURL)
    .setFooter(message.member.displayName, avatar)
    client.channels.get(cekiliskanal).send(":tada: **" + mesaj[13] + "** :tada:", { embed: yarismaBilgi }).then(async msg => {
    msg.react("🎉");
    topla += msg.id;
    topla += "-" + kimlerdb;
    let cekilisler = db.get("cekilisler_" + message.guild.id);
    var cekilis = [];
    if(cekilisler != null) {
      if(cekilisler.length > 0) { cekilis = cekilisler; cekilis.push(topla); }
      else cekilis[0] = topla;
    }
    else cekilis[0] = topla;
    db.set("cekilisler_" + message.guild.id, cekilis);
    message.channel.send(emo("onay") + "**" + mesaj[14] + "**");  
  })    
  }).catch(err => message.channel.send(emo("hata") + "**" + mesaj[15] + "**")) 
  
  
  
  function emo(yazi) {
  let emoji = client.emojis.find(j => j.name === yazi)
  return "<a:" + emoji.name + ":" + emoji.id + "> │";
}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["cekilis-tekrar", "giveaway-again", "giveaway-refresh", "cekilis-yenile", "giveaway-copy", "copy-giveaway", "cekilis-kopyala", "çekiliştekrarla", "çekiliş-tekrarla", "çekilişkopyala", "çekiliş-kopyala", "copygiveaway", "repeat-giveaway", "repeatgiveaway"],
  permLevel: 0
};

exports.help = {
  name: "cekilis-copy",
  description: "cekilis-copy",
  usage: "cekilis-copy"
};
