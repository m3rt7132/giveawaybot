const chalk = require('chalk');
const moment = require('moment');
const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
var colors = require('colors');
const ms = require("ms");
const db = require("quick.db");
var prefix = ayarlar.prefix;

module.exports = async client => {
  client.user.setStatus("idle");
  client.user.setActivity(`${client.guilds.size} servers and ` + client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + ` users! (.help)`);
  console.log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] BOT: Şu an `.gray + client.channels.size + ` adet kanala, `.gray + client.guilds.size + ` adet sunucuya ve `.gray + 
              client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() 
              + ` kullanıcıya hizmet veriliyor!`.gray)
  // SABİT
  var tr = [
    "Çekiliş iptal edildi: ", // 0
    "Yeterli katılım olmadığı için çekiliş iptal edildi", //1
    "``Katılımcıların sayısı az olduğu için çekiliş iptal edildi.``\nKatılan kişi sayısı: ", //2
    "\nEn az katılması gereken kişi sayısı: ", // 3
    "Çekiliş sonuçlandı: ", // 4
    "Kazanan(lar)", //5
    "Çekiliş detayları", //6
    "Sonuçlar"
  ];
  var en = [
    "Giveaway canceled: ", // 0
    "Giveaway was canceled because there are no participations", //1
    "``The giveaway was canceled because the number of participants was small.``\nNumber of participants: ", //2
    "\nMinimum number of participations: ", // 3
    "Giveaway finished!: ", //4
    "Winner(s)", // 5
    "Giveaway details", // 6
    "Results" // 7
  ];
// SABİT
  
  setInterval(() => {
    client.guilds.map(x => {
      let index = 0;
      var guild = x;
      let dil = db.get("dil_" + guild.id);
      var mesaj = [];
      if(dil == "tr") mesaj = tr;
      else mesaj = en;
      var cekilisler = db.get("cekilisler_" + guild.id);
      var kanal = db.get("cekiliskanal_" + guild.id);
      if(cekilisler != null) {
        if(cekilisler.length > 0) {
          cekilisler.map(cekilis => {
            var c = cekilisler[index].split('-');
            let sonuc = 0;
            let zaman = c[2];
            zaman = zaman.split(' ');
            zaman.map(x => {
               let hesap = ms(x);
               sonuc += hesap
            })
            var ekle = parseInt(c[6]);
            sonuc = sonuc + ekle;
            if(new Date().getTime() >= sonuc) {
              var biten = db.get("bitencekilis");
              var bitendb = (biten > 0) ? biten + 1: 1;
              db.set("bitencekilis", bitendb);
              
              var katilimcilar = db.get("katilimcilar_" + guild.id + "_" + c[7]);
              var leaves = db.get("leaveclear_" + guild.id);
              if(leaves != null) {
                if(leaves.length > 0) {
                  leaves.map(le => {
                    if(le == "katilimcilar_" + guild.id + "_" + c[7]) {
                      db.delete(le);
                    }
                  });
                }
              }    
              let giveawaylink = "https://discordapp.com/channels/" + guild.id + "/" + kanal + "/" + c[7];
              if(katilimcilar == null) {
                var bilgi = new Discord.RichEmbed()
                .setTitle(mesaj[0] + c[0])
                .setColor("#36393f")
                .setDescription(mesaj[1] + "\n:calling: [" + mesaj[6] + "](" + giveawaylink + ")")
                //client.guilds.get(guild.id).channels.get(kanal).send("test");
                //guild.channels.get(kanal).send("test"); 
                cekilisler.splice(index, 1);
                db.set("cekilisler_" + guild.id, cekilisler);
                db.delete("katilimcilar_" + guild.id + "_" + c[7]);
                guild.channels.get(kanal).fetchMessage(c[7]).then(m => { 
                  m.edit(":tada: ** " + mesaj[0].substr(0, mesaj[0].length-2).toUpperCase() + "** :tada:")
                })
                return;
              }
              else if(katilimcilar.length == 0) {
                var bilgi = new Discord.RichEmbed()
                .setTitle(mesaj[0] + c[0])
                .setColor("#36393f")
                .setDescription(mesaj[1] + "\n:calling: [" + mesaj[6] + "](" + giveawaylink + ")");
                guild.channels.get(kanal).send(bilgi); 
                cekilisler.splice(index, 1);
                db.set("cekilisler_" + guild.id, cekilisler);
                db.delete("katilimcilar_" + guild.id + "_" + c[7]);
                guild.channels.get(kanal).fetchMessage(c[7]).then(m => { 
                  m.edit(":tada: ** " + mesaj[0].substr(0, mesaj[0].length-2).toUpperCase() + "** :tada:")
                })
                return;
              } 
              else if(katilimcilar.length < c[5] || katilimcilar.length < c[3]) {
                var encok = (c[5] > c[3]) ? c[5] : c[3];
                var bilgi = new Discord.RichEmbed()
                .setTitle(mesaj[0] + c[0])
                .setColor("#36393f")
                .setDescription(mesaj[2] + "**" + katilimcilar.length + "**" + mesaj[3] + "**" + encok+ "**\n\n:calling: [" + mesaj[6] + "](" + giveawaylink + ")");
                guild.channels.get(kanal).send(bilgi);  
                cekilisler.splice(index, 1);
                db.set("cekilisler_" + guild.id, cekilisler);
                db.delete("katilimcilar_" + guild.id + "_" + c[7]);
                guild.channels.get(kanal).fetchMessage(c[7]).then(m => m.edit(":tada: ** " + mesaj[0].substr(0, mesaj[0].length-2).toUpperCase() + "** :tada:"))
                return;
              }          
              
              var kisi = [];
              for(let ind = 0; ind < c[3]; ind++)
              {
                var kazanan = Math.floor(Math.random() * Math.floor(katilimcilar.length));
                kisi.push(katilimcilar[kazanan]);
                katilimcilar.splice(kazanan, 1);
              }
              var kazanan = "", kazananavatar;
              kazananavatar = client.users.get(kisi[0]).avatarURL;
              kazananavatar = (kazananavatar != null) ? kazananavatar : "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
              kisi.map(a => {
                kazanan += "<@"+ a + "> ``=>`` " + client.users.get(a).username + "#" + client.users.get(a).discriminator + " | ``" + a +"``\n";

              });
              var bilgi = new Discord.RichEmbed()
              .setTitle(mesaj[4] + c[0])
              .setThumbnail(kazananavatar)
              .setColor("#36393f")
              .setDescription(mesaj[5] + "\n " + kazanan + "\n\n:calling: [" + mesaj[6] + "](" + giveawaylink + ")");
              
              
              guild.channels.get(kanal).send(bilgi);
              guild.channels.get(kanal).fetchMessage(c[7]).then(m => m.edit(":tada: ** " + mesaj[4].substr(0, mesaj[4].length-2).toUpperCase() + "** :tada:"))
              cekilisler.splice(index, 1);
              db.set("cekilisler_" + guild.id, cekilisler);
              db.delete("katilimcilar_" + guild.id + "_" + c[7]);
            }
            index++;
          })
        }
      }
    })
  }, 8000)

};
