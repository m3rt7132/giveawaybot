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
    "Bulunmuyor", //1
    "Yetkililer", //2
    "Yetkili olarak atadığınız kişiler çekiliş komutlarını kullanabilecektir\nYetkiliyi kaldırmak için aynı komutu kullanabilirsiniz",//3
    "cekilis-yetkili (kullanıcı etiketi)", //4
    "Çekiliş yetkilileri", //5
    "Yetkiler başarıyla düzenlendi" //6
  ];
  var en = [
    emo("hata") + "**Only admins can use this command!**",
    "There are no any giveaway admins!",
    "Admins",
    "Only giveaway admins or who has **Administrator** permission may start the giveaway.\nYou can use the same command to remove the admin",
    "giveaway-admins (mention a user)",
    "Giveaway admins",
    "Successfully added a giveaway admin!"
  ];
  let dil;
  var mesaj;
  dil = await db.fetch("dil_" + message.guild.id);
  mesaj = [];
  if (dil == "tr") mesaj = tr;
  else if (dil == "en") mesaj = en;
  // SABİT
  var engellikanal = [];
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(mesaj[0]);
     engellikanal = await db.fetch("admin_"+message.guild.id);
    if(engellikanal != null) {
      if(engellikanal.length == 0) engellikanal == null;
    }
    var engellikanalx = [];
    let kanal = message.mentions.members.first();
    console.log(engellikanal);
    if(kanal == null) {
      var mesajx;
      if(engellikanal != null) {
        mesajx = engellikanal.map(e => client.users.get(e));
        if(engellikanal.length == 0) mesajx = mesaj[1];
      }
      else mesajx = mesaj[1];
      var engelleBilgi = new Discord.RichEmbed()
      .setTitle("Discord Giveaway - " + mesaj[2])
      .setColor("#36393f")
      .setDescription(mesaj[3] + "\n📝 ``"+prefix+ mesaj[4] +"``")
      .addField(mesaj[5], mesajx)
      .setThumbnail(client.user.avatarURL)
      message.channel.send(engelleBilgi);
    }
    else
    {
    let i = 0;
    let yaz = true;
    let ii;
    if(engellikanal == null) { yaz = true; }
    else {
      engellikanalx = engellikanal;
      engellikanalx.map(engel => {
        if(kanal.id == engel) { yaz = false; ii = i; }
        i++;
      });
     }
    if(yaz) {
        engellikanalx[engellikanalx.length] = kanal.id;
        db.set("admin_"+message.guild.id, engellikanalx);
        return message.channel.send(emo("evet") + " **"+mesaj[6]+"** " + kanal);
      }
      else {
        engellikanalx.splice(ii,1);
        db.set("admin_"+message.guild.id, engellikanalx);
        return message.channel.send(emo("hayir") + " **"+mesaj[6]+"** " + kanal);
      }
    }
  function emo(yazi) {
  let emoji = client.emojis.find(j => j.name === yazi)
  return "<a:" + emoji.name + ":" + emoji.id + "> │";
}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["cekilis-yetkili", "giveaway-admin", "giveaway-admins", "cekilis-yetkililer", "giveawayadmins", "çekilişyetkilileri", "çekilişyetkililer", "çekiliş-yetkilileri", "giveawayers"],
  permLevel: 0
};

exports.help = {
  name: "cekilis-yetkilileri",
  description: "cekilis-yetkili",
  usage: "cekilis-yetkili"
};
