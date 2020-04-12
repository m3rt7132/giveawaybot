const Discord = require('discord.js');
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");
exports.run = async (client, message, args) => {
// SABİT
  var tr = [
    ""
  ];
  var en = [
    ""
  ];
  let dil = await db.fetch("dil_" + message.guild.id);
  var mesaj = [];
  if(dil == "tr") mesaj = tr;
  else if(dil == "en") mesaj = en;
// SABİT
  let komut = args[0];
  if(komut == null) {
    
    var biten = db.get("bitencekilis");
    var aktif = 0;
    client.guilds.map(a=> {
      var sayi = db.get("cekilisler_" + a.id);
      if(sayi != null) aktif += sayi.length;
    });
    var bayrak = (dil.toUpperCase() == "TR") ? ":flag_tr:" : ":flag_us:";
    if(dil == "tr") {
      var bilgi = new Discord.RichEmbed()
      .setTitle("Çekiliş botu komutları!")
      .setDescription(
                     "**Bot** ile ilgili sorun/öneri/görüş için aşağıdaki kişilerle iletişime geçebilirsiniz\n\n" +
                     emo("bayrak") + " **Yapımcı:** <@" + ayarlar.sahip + ">, <@343496705196556288>\n\n" +
                     "**KULLANICI KOMUTLARI**\n" +
                     "``cekilis`` Tüm çekiliş komutlarını gösterir\n" +
                     "``cekilisler`` Aktif durumdaki çekiliş listesini gösterir\n" +
                     "\n**YETKİLİ KOMUTLARI**\n" +
                     "``prefix veya giveaway.prefix`` Sunucudaki prefixi değiştirir\n" +
                     "``cekilis-baslat`` Çekiliş başlatır\n" +
                     "``cekilis-sil`` Aktif çekilişi iptal eder\n" +
                     "``cekilis-kopyala`` Aktif veya biten bir çekilişi sadece ID ile tekrar başlatabilirsiniz\n" +
                     "``cekilis-bitir`` Aktif çekilişi manuel olarak bitirip sonuçları yayınlar\n" +
                     "``cekilis-yetkili`` Sadece etiketlediğiniz kullanıcıların çekiliş başlatabilmesini sağlar\n" + 
                     "``cekilis-kanal`` Çekilişlerin loglanacağı kanalı ayarlar\n" +
                     "``dil`` Botun dilini değiştirir(tr,eng)\n" +
                     "\n:bar_chart: **BOT İSTATİSTİKLERİ**\n" +
                     "Dil: " + bayrak + "\n" +
                     "(Tüm sunucular) Aktif çekiliş: ``" + aktif + "``\n"+
                     "(Tüm sunucular) Oluşturulan çekiliş: ``" + biten + "``\n"+
                     "Ping: ``" + Math.round(client.ping) + "``\n" +
                     "**" + client.guilds.size + "** sunucu ** " + client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + "** kullanıcı\n\n"+
                     ":globe_with_meridians: [Davet]("+ayarlar.botdavet+") │ 📲 [Destek Sunucusu]("+ayarlar.destek+") | 👍 [DBL](https://top.gg/bot/654190046772985866)" +
                     "")
      .setThumbnail(client.user.avatarURL)
      .setColor("#36393f")
      message.channel.send(bilgi);
    }
    else {
      var bilgi = new Discord.RichEmbed()
      .setTitle("Giveaway bot commands!")
      .setDescription(
                     "If you have any questions or suggestions about the **bot**, you can contact to persons who pinged on below\n\n" +
                     emo("bayrak") + " **Creator:** <@" + ayarlar.sahip + ">\n\n" +
                     "**USER COMMANDS**\n" +
                     "``giveaway`` Shows the all commands about giveaways\n" +
                     "``giveaways`` Shows the all giveaways in the progress\n" +
                     "\n**ADMIN COMMANDS**\n" +
                     "``prefix or giveaway.prefix`` To change prefix in this server\n" +
                     "``giveaway-start`` Starts a giveaway\n" +
                     "``giveaway-delete`` Cancels an active giveaway in that server\n" +
                     "``giveaway-copy`` You can re-create a giveaway it is active or finished giveaways\n" +
                     "``giveaway-finish`` Stops an active giveaway and shows results manually\n" +
                     "``giveaway-admins`` Only specified giveaway admins may start a giveaway\n" + 
                     "``giveaway-channel`` Sets the giveaway log channel\n" +
                     "``lang`` Changes bot's language(tr, en)\n" +
                     "\n:bar_chart: **BOT STATISTICS**\n" +
                     "Language: " + bayrak + "\n" +
                     "(All servers) Number of giveaways it's in the progress: ``" + aktif + "``\n"+
                     "(All servers) Number of total giveaways: ``" + biten + "``\n"+
                     "Latency: ``" + Math.round(client.ping) + "``\n" +
                     "**" + client.guilds.size + "** servers ** " + client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + "** users\n\n"+
                     ":globe_with_meridians: [Invite]("+ayarlar.botdavet+") │ 📲 [Support Server]("+ayarlar.destek+") | 👍 [DBL](https://top.gg/bot/654190046772985866)" +
                     "")
      .setThumbnail(client.user.avatarURL)
      .setColor("#36393f")
      message.channel.send(bilgi);
    }
  }
    function emo(yazi) {
    //let emoji = client.emojis.find(j => j.name === yazi)
    //return "<a:" + emoji.name + ":" + emoji.id + "> │";
      return yazi;
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['cekilis', 'giveaway', 'çekiliş', 'help', 'yardım', 'yardim', "komutlar", "komuts", "commands"],
  permLevel: 0
};

exports.help = {
  name: 'yardım',
  description: 'yardım',
  usage: 'yardım'
};
