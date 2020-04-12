const ayarlar = require('../ayarlar.json');
const Discord = require('discord.js');
const db = require('quick.db');
module.exports = guild => {
  var botsahip = guild.client.users.get("254950632757133312");
  var m3rt = guild.client.users.get("343496705196556288")
  db.delete("dil_" + guild.id);
  db.delete("cekiliskanal_" + guild.id);
  db.delete("cekilisler_" + guild.id);
  var leaves = db.get("leaveclear_" + guild.id);
  if(leaves != null) {
    if(leaves.length > 0) {
      leaves.map(le => {
        db.delete(le);
      });
    }
  }
  db.delete("leaveclear_" + guild.id);
  db.delete("prefix_" + guild.id);
  db.delete("admin_" + guild.id);
  const atilmaBilgi = new Discord.RichEmbed()
  .setThumbnail(guild.iconURL || ayarlar.default_avatar)
  .setDescription("🔴 Botunuz bir sunucudan atıldı")
  .addField("Sunucu İsmi", "**"+guild.name+"**")
  .addField("Sunucu ID", "`"+guild.id+"`")
//  .addField("Sunucu Sahibi", guild.owner + " (**" + guild.owner.tag + "**)")
  .addField("Kullanıcı Sayısı", "**"+guild.memberCount+"**")
  guild.client.channels.get("667696996127342592").send("**Aga be** <@343496705196556288>", {embed: atilmaBilgi})
   guild.client.user.setActivity(`${guild.client.guilds.size} servers and ` + guild.client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + ` users! (.help)`);

}