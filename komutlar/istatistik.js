const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
const db = require("quick.db");
const ms = require("ms");
let moment = require("moment")
exports.run = async (client, message, args) => {
  let dil = await db.fetch(`dil_${message.guild.id}`)
  if (dil == "tr") {
    let full = 512;
let memory = (process.memoryUsage().heapUsed + process.memoryUsage().external + process.memoryUsage().rss);
let ram = ((memory / 1024 / 1024).toFixed(0) + "**/**512 MB")
let yuzderam = ((memory / (full * 1024 * 1024)) * 100).toFixed(2)
let acilmatarih;
var biten = db.get("bitencekilis");
    var aktif = 0;
    client.guilds.map(a=> {
      var sayi = db.get("cekilisler_" + a.id);
      if(sayi != null) aktif += sayi.length;
    });
acilmatarih = moment
    .utc(client.user.createdAt)
    .format("DD MMMM dddd YYYY [(**]HH:mm:ss[**)]")
    .replace("Monday", `Pazartesi`)
    .replace("Tuesday", `Salı`)
    .replace("Wednesday", `Çarşamba`)
    .replace("Thursday", `Perşembe`)
    .replace("Friday", `Cuma`)
    .replace("Saturday", `Cumartesi`)
    .replace("Sunday", `Pazar`)
    .replace("January", `Ocak`)
    .replace("February", `Şubat`)
    .replace("March", `Mart`)
    .replace("April", `Nisan`)
    .replace("May", `Mayıs`)
    .replace("June", `Haziran`)
    .replace("July", `Temmuz`)
    .replace("August", `Ağustos`)
    .replace("September", `Eylül`)
    .replace("October", `Ekim`)
    .replace("November", `Kasım`)
    .replace("December", `Aralık`);
  message.channel.send("**GIVEAWAY DISCORD!**").then(async(msg) => msg.edit(
    new Discord.RichEmbed()
.setColor("#36393f")
.setTitle("Bot İstatistikleri!")
.setThumbnail(client.user.avatarURL)
//.setImage("https://media.giphy.com/media/yDm4Ry6XU77Py/giphy.gif")
.setDescription(`__**YAPIMCILAR**__\n${client.users.get("254950632757133312")}, ${client.users.get("343496705196556288")}\n\n__**KÜTÜPHANE**__\ndiscord.js\n\n__**AÇIK KALMA SÜRESİ**__\n${require("moment").duration(client.uptime).format("M [ay,] D [gün,] H [saat,] m [dakika,] s [saniye]")}\n\n__**BOT**__\n**${client.guilds.size}** sunucu, **${client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString().split(",")[0]} bin** kullanıcı, **${client.channels.size}** kanal!\n\n__**RAM KULLANIMI**__\n${ram} \`|\` **%${yuzderam}** oranında kullanılıyor!\n\n__**GECİKME SÜRELERİ**__\nDiscord API **${client.ping.toFixed(0)}**ms \`|\` Mesaj Tepkime **${(msg.createdTimestamp - message.createdTimestamp).toFixed(0)}**ms\n\n__**AÇILIŞ TARİHİ**__\n${acilmatarih} \`|\` ${(await tarihHesapla(client.user.createdAt))}\n\n__**BOTUN KATILDIĞI SON SUNUCU**__\n${(await db.fetch(`soneklenilen`))}\n\n__**ÇEKİLİŞ İSTATİSTİKLERİ**__\n**${aktif}** adet devam eden \`|\` **${biten}** adet biten çekiliş bulunmakta!`)
))
  } else {
        let full = 512;
let memory = (process.memoryUsage().heapUsed + process.memoryUsage().external + process.memoryUsage().rss);
let ram = ((memory / 1024 / 1024).toFixed(0) + "**/**512 MB")
let yuzderam = ((memory / (full * 1024 * 1024)) * 100).toFixed(2)
let acilmatarih;    
acilmatarih = moment
    .utc(client.user.createdAt)
    .format("DD MMMM dddd YYYY [(**]HH:mm:ss[**)]")
  message.channel.send("**GIVEAWAY DISCORD!**").then(async(msg) => msg.edit(
    new Discord.RichEmbed()
.setColor("#36393f")
.setTitle("Bot Statistics!")
.setThumbnail(client.user.avatarURL)
//.setImage("https://media.giphy.com/media/yDm4Ry6XU77Py/giphy.gif")
.setDescription(`__**DEVELOPERS**__\n${client.users.get("254950632757133312")}, ${client.users.get("343496705196556288")}\n\n__**LIBRARY**__\ndiscord.js\n\n__**UPTIME**__\n${require("moment").duration(client.uptime).format("M [months,] D [days,] H [hours,] m [minutes,] s [seconds]")}\n\n__**BOT**__\n**${client.guilds.size}** server, **${client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString().split(",")[0]}k** user, **${client.channels.size}** channel!\n\n__**RAM USAGE**__\n${ram} \`|\` Using **%${yuzderam}** of the RAM!\n\n__**LATENCY**__\nDiscord API **${client.ping.toFixed(0)}**ms \`|\` Message Response **${(msg.createdTimestamp - message.createdTimestamp).toFixed(0)}**ms\n\n__**CREATED AT**__\n${acilmatarih} \`|\` ${(await tarihHesapla(client.user.createdAt))}\n\n__**LAST SERVER OF BOT JOINED**__\n${(await db.fetch(`soneklenilen`))}\n\n__**GİVEAWAY STATISTICS**__\nThere are **${aktif}** of active, **${biten}** of finished giveaways!`)
))
  }
  async function tarihHesapla(tarih) {
  if (dil == "tr") {
  let süre = Date.now() - tarih;
  let saniye = süre / 1000;
  let gün = parseInt(saniye / 86400);
  saniye = saniye % 86400;
  let saat = parseInt(saniye / 3600);
  saniye = saniye % 3600;
  let dakika = parseInt(saniye / 60);
  saniye = parseInt(saniye % 60);

  süre = `${saniye} saniye`;
  if (gün) süre = `${gün} gün`;
  else if (saat) saat = `${saat} saat`;
  else if (dakika) dakika = `${dakika} dakika`;
  return süre + " önce"
  } else if (dil == "en") {
    let süre = Date.now() - tarih;
  let saniye = süre / 1000;
  let gün = parseInt(saniye / 86400);
  saniye = saniye % 86400;
  let saat = parseInt(saniye / 3600);
  saniye = saniye % 3600;
  let dakika = parseInt(saniye / 60);
  saniye = parseInt(saniye % 60);

  süre = `${saniye} seconds`;
  if (gün) süre = `${gün} days`;
  else if (saat) saat = `${saat} hours`;
  else if (dakika) dakika = `${dakika} minutes`;
  return süre + " ago"
  }
};
  };

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["istatistikler", "botbilgi", "bot-bilgi", "i", "bot-info", "botinfo", "stats", "statistics", "stat", "statistic", "info"],
  permLevel: 0
};

exports.help = {
  name: "istatistik",
  description: "istatistik",
  usage: "istatistik"
};
