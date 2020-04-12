const Discord = require('discord.js');
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");
var momentDuration = require("moment-duration-format");
const moment = require("moment");
exports.run = (client, message, args) => {
// SABİT
  var tr = [
    "gün", //0
    "saat", //1
    "dakika", //2
    "saniye", //3
    "Çekilişin adı", //4
    "Süresi", //5
    "Oluşturulma tarihi", //6
    "önce", //7
    "Detaylar", //8
    "Tıkla", //9
    "Katılımcı sayısı", // 10
    "Aktif bir çekiliş bulunmamakta" // 11
  ];
  var en = [
    "days",
    "hours",
    "minutes",
    "seconds",
    "Name of the giveaway",
    "Duration",
    "Created on",
    "ago",
    "Details",
    "Click",
    "The number of participants",
    "There are no giveaways in progress"
    
  ];
  let dil = db.get("dil_" + message.guild.id);
  var mesaj = [];
  if(dil == "tr") mesaj = tr;
  else if(dil == "en") mesaj = en;
// SABİT
  var cekilisler = db.get("cekilisler_" + message.guild.id);
  if(cekilisler != null) {
    var kanal = db.get("cekiliskanal_" + message.guild.id);
    if(cekilisler.length > 0) {
      var avatar = (message.author.avatarURL) ? message.author.avatarURL: "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png"
      var desc = "";
      var index = 1;
      cekilisler.map(cek => {
        var ayir = cek.split("-");             
        var simdi = new Date().getTime();
        var cekilis = ayir[6];
        if(dil == "tr") var kalan = moment.duration(simdi - cekilis).format("D [gün] H [saat] m [dakika] s [saniye]"); 
        else var kalan = moment.duration(simdi - cekilis).format("D [days] H [hours] m [minutes] s [seconds]"); 
            var devam = true;
            var embedsure = "";
            var dk = "", sat = "", san = "", gn = "";
            ayir[2].split(" ").map(j => {
              var dvm = true;
              if(j.replace("s"), " " + mesaj[3]) {
                san = j.replace("s", " " + mesaj[3]);
                if(san.includes(mesaj[3])) dvm = false;
                else san = "";
              }
              if(devam) {
                if(j.replace("m"), " " + mesaj[2]) {
                  dk = j.replace("m", " " + mesaj[2]);
                  if(dk.includes(mesaj[2])) dvm = false;
                  else dk = "";
                }
                if(devam) {
                  if(j.replace("h"), " " + mesaj[1]) {
                    sat = j.replace("h", " " + mesaj[1]);
                    if(sat.includes(mesaj[1])) dvm = false;
                    else sat = "";
                  }
                  if(devam) {
                    if(j.replace("d"), " " + mesaj[0]) {
                      gn = j.replace("d", " " + mesaj[0]);
                      if(gn.includes(mesaj[0])) dvm = false;
                      else gn = "";
                    }                       
                  }
                }
              }
               embedsure += gn + sat + dk + san + " ";
            });
        var katilimcilar = db.get("katilimcilar_" + message.guild.id + "_" + ayir[7]);
        var katilimcisayi = (katilimcilar == null) ? 0 : katilimcilar.length;
        var giveawaylink;
        giveawaylink = "https://discordapp.com/channels/" + message.guild.id + "/" + kanal + "/" + ayir[7];
        let giveawayduzen = "[" + mesaj[9] + "](" + giveawaylink + ")";
        desc += index + "- **"+mesaj[4]+": **" + ayir[0] + "\n│ **"+mesaj[5]+":** " + embedsure + "\n│ **"+mesaj[6]+":** " + kalan + " "+mesaj[7]+"\n│ **" + mesaj[10] + ":** " + katilimcisayi +"\n│ **" + mesaj[8] + "**: "  +giveawayduzen +"\n\n";  
        index++;
      }
      );
      var embed = new Discord.RichEmbed()
      .setDescription(desc)
      .setTitle("Discord Giveaway")
      .setFooter(message.member.displayName, avatar)
      .setThumbnail(client.user.avatarURL)
      .setColor("#36393f")
      message.channel.send(embed);
    }
    else message.channel.send(emo("hata") + "** " + mesaj[11] +"**");
  }
  else message.channel.send(emo("hata") + "** " + mesaj[11] +"**");
  
  
 function emo(yazi) {
  let emoji = client.emojis.find(j => j.name === yazi)
  return "<a:" + emoji.name + ":" + emoji.id + "> │";
}
  
  

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['cekilisler', 'giveaways', "çekilişler", "çekilisler"],
  permLevel: 0
};

exports.help = {
  name: 'cekilisler',
  description: 'cekilisler',
  usage: 'cekilisler'
};
