const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");
const ms = require("ms");
exports.run = async (client, message, args) => {
  // SABİT
  var prefix = await db.fetch("prefix_"+ message.guild.id);
  if(prefix == null) prefix = ayarlar.prefix;
  var tr = [
    "Çekiliş için herhangi bir kanal belirlenmemiş. ``" + prefix +
      "cekilis-kanal``",
    "Çekilişte verilecek ödülü girin",
    "Çekiliş açıklamasını girin",
    "Çekilişin süresini girin (örn: 1d, 1h, 1m, 1s)",
    "Çekilişin talihli sayısını girin",
    "Çekilişe sponsor olan kişi ismi veya etiketi (sponsor yoksa: ``0``)",
    "En az katılımcı sayısı (limit yoksa: ``0``)",
    "Bu komut adminlere özeldir",
    "Süre",
    "Talihli sayısı",
    "En az katılımcı",
    "En fazla katılımcı",
    "Verilen süre içerisinde cevap yazmadığınız için işleminiz iptal edilmiştir",
    "Hatalı bir veri girdiniz",
    "saniye",
    "dakika",
    "saat",
    "gün",
    "Yok",
    "Limit yok",
    "Çekiliş başarıyla oluşturuldu.",
    "ÇEKİLİŞ BAŞLADI!",
    "Çekiliş oluşturma sihirbazı başladı. İptal etmek için herhangi bir yerde ``iptal`` yazabilirsiniz.",
    "**DİKKAT:** Soruların hiçbirisinde '-' karakterini kullanmanıza izin verilmemektedir.",
    "İşleminiz iptal edildi",
    "Çekilişe katılmak için sahip olunması gereken rol tagı/tagları (Şart yoksa ``0``)",
    "Kimler katılabilir?",
    "Herkes",
    "Çekiliş süresi en fazla 15 gün olabilir"
    
  ];
  var en = [
    "No channels have been set for the draw. ``" + // 0
      prefix +
      "giveaway-channel``",
    "Type the prize giveaway", // 1
    "Type the description", // 2
    "Type the duration (ex: 1d, 1h, 1m, 1s)", // 3
    "Type the how many members will win", // 4
    "Type the sponsor's name or tag (If nobody; type ``0``)", // 5
    "Type the minimum number of participant (Type ``0`` if you don't want)", // 6
    "This command only for admins", // 7
    "Duration", // 8
    "Winners Size", // 9
    "Minimum participations", // 10
    "Maximum participations", // 11
    "Timeout!", // 12 
    "You didn't type a correct information!", // 13
    "seconds", // 14
    "minutes", // 15
    "hours", // 16
    "days", // 17
    "No", // 18
    "No limit", // 19
    "Giveaway has been created successfully to according to your choices.", // 20
    "GIVEAWAY STARTED!", // 21
    "Giveaway creation wizard started. To cancel, you can type ``cancel`` anywhere.", //22
    "**ATTENTION:** You are not allowed to use the '-' character in any of the questions.", //23
    "Your transaction has been canceled", //24
    "Role tag(s) that must be owned to participate in the giveaway (if there is no condition ``0``)", //25
    "Who can participate?", //26
    "Everyone", //27
    "Giveaway can be up to 15 days" //28
  ];
  let dil = await db.fetch("dil_" + message.guild.id);
  var mesaj = [];
  const sure = 20000;
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
  if (!yetki) return message.channel.send(emo("hata") + "**" + mesaj[7] + "**");
  // YETKİ KONTROL
  let kanal = await db.fetch("cekiliskanal_" + message.guild.id);
  kanal = client.channels.get(kanal);
  if (kanal == null || kanal == undefined) return message.channel.send(emo("hata") + "**" + mesaj[0] + "**");
  let topla = "";
  var devam = true;
  var embedsure;
  var katilimcisayi, baslik, aciklama, surex, sponsor, enazkatilimci, rolkisitlama, embedrol = "";
  message.channel.send(mesaj[22] + "\n" + mesaj[23]);
  message.channel.send(mesaj[1]);
  try {
    var cevapOdul = await message.channel
      .awaitMessages(m => m.author.id == message.author.id, {
        max: 1,
        time: sure,
        errors: ["time"]
      })
      .then(msg => {
        console.log(msg);
        baslik = msg.first().content;
        if(baslik.includes('-') || baslik == "iptal" || baslik == "cancel") { message.channel.send(emo("hata") + "**" + mesaj[24] + "**"); devam = false;}
      });
    if(!devam) return;
    message.channel.send(mesaj[2]);
    try {
      var cevapBaslik = await message.channel
        .awaitMessages(m => m.author.id == message.author.id, {
          max: 1,
          time: sure,
          errors: ["time"]
        })
        .then(msg => {
          aciklama = msg.first().content;
          if(aciklama.includes('-') || aciklama == "iptal" || aciklama == "cancel") { message.channel.send(emo("hata") + "**" + mesaj[24] + "**"); devam = false;}
        });
      if(!devam) return;
      message.channel.send(mesaj[3]);
      try {
        var cevapSure = await message.channel
          .awaitMessages(m => m.author.id == message.author.id, {
            max: 1,
            time: sure,
            errors: ["time"]
          })
          .then(msg => {
            let s = msg.first().content;
            if(s.includes('-') || s == "iptal" || s == "cancel") { message.channel.send(emo("hata") + "**" + mesaj[24] + "**"); devam = false; return;}
            let sonuc = 0;
            let zaman = s;
            zaman = zaman.split(' ');
            zaman.map(x => {
               let hesap = ms(x);
               sonuc += hesap
            })       
            if (!sonuc > 0) { 
              message.channel.send(emo("hata") + "**" + mesaj[13] + "**");
              devam = false;
            }
            else if(sonuc > 1296000000) {
              message.channel.send(emo("hata") + "**" + mesaj[28] + "**");
              devam = false;
            }
            embedsure = "";
            var dk = "", sat = "", san = "", gn = "";
            s.split(" ").map(j => {
              var dvm = true;
              if(j.replace("s"), " " + mesaj[14]) {
                san = j.replace("s", " " + mesaj[14]);
                if(san.includes(mesaj[14])) dvm = false;
                else san = "";
              }
              if(devam) {
                if(j.replace("m"), " " + mesaj[15]) {
                  dk = j.replace("m", " " + mesaj[15]);
                  if(dk.includes(mesaj[15])) dvm = false;
                  else dk = "";
                }
                if(devam) {
                  if(j.replace("h"), " " + mesaj[16]) {
                    sat = j.replace("h", " " + mesaj[16]);
                    if(sat.includes(mesaj[16])) dvm = false;
                    else sat = "";
                  }
                  if(devam) {
                    if(j.replace("d"), " " + mesaj[17]) {
                      gn = j.replace("d", " " + mesaj[17]);
                      if(gn.includes(mesaj[17])) dvm = false;
                      else gn = "";
                    }                       
                  }
                }
              }
               embedsure += gn + sat + dk + san + " ";
            });
            
            surex = msg.first().content;
          });
        if (devam) {
          message.channel.send(mesaj[4]);
          try {
            var cevapTalihli = await message.channel
              .awaitMessages(m => m.author.id == message.author.id, {
                max: 1,
                time: sure,
                errors: ["time"]
              })
              .then(msg => {
                let s = msg.first().content;
                if(s.includes('-') || s == "iptal" || s == "cancel") { message.channel.send(emo("hata") + "**" + mesaj[24] + "**"); devam = false; return;}
                katilimcisayi = s;
                if (!(s > 0)) { 
                  message.channel.send(emo("hata") + "**" + mesaj[13] + "**");
                  devam = false;
                }                
              });
            if (devam) {
              message.channel.send(mesaj[5]);
              try {
                var cevapSponsor = await message.channel
                  .awaitMessages(m => m.author.id == message.author.id, {
                    max: 1,
                    time: sure,
                    errors: ["time"]
                  })
                  .then(msg => {
                    var spn = msg.first().mentions.members.first();
                    if(spn != null) {
                      sponsor = spn.user.tag;
                      if(sponsor.includes('-')) { message.channel.send(emo("hata") + "**" + mesaj[24] + "**"); devam = false; return;}
                    }
                    else {
                      let s = msg.first().content;
                      if(s.includes('-') || s == "iptal" || s == "cancel") { message.channel.send(emo("hata") + "**" + mesaj[24] + "**"); devam = false; return;}
                      if (s == 0) { 
                        sponsor = mesaj[18];
                      }
                      else { sponsor = s }
                    }
                  });
                if (devam) {
                  message.channel.send(mesaj[6]);
                  try {
                    var cevapEnAz = await message.channel
                      .awaitMessages(m => m.author.id == message.author.id, {
                        max: 1,
                        time: sure,
                        errors: ["time"]
                      })
                      .then(msg => {
                        let s = msg.first().content;
                        if(s.includes('-') || s == "iptal" || s == "cancel") { message.channel.send(emo("hata") + "**" + mesaj[24] + "**"); devam = false; return;}
                        if (!(s >= 0)) { 
                          message.channel.send(emo("hata") + "**" + mesaj[13] + "**");
                          devam = false;
                        }
                        if(s == "0") enazkatilimci = katilimcisayi;
                        else enazkatilimci = s;
                      });
                  }
                
                  catch(err) { message.channel.send(emo("hata") + "**" + mesaj[12] + "**"); }
                  if(!devam) return;
                  message.channel.send(mesaj[25]);
                  try {
                    var roller = await message.channel
                      .awaitMessages(m => m.author.id == message.author.id, {
                        max: 1,
                        time: sure,
                        errors: ["time"]
                      })
                      .then(msg => {
                        if(msg.first().content.includes('-') || msg.first().content == "iptal" || msg.first().content == "cancel") { message.channel.send(emo("hata") + "**" + mesaj[24] + "**"); devam = false; return;}
                        let s = msg.first().mentions.roles;
                          var rolindex = 0;
                          var index = 0;
                          var mesajrol = "";
                          s.map(a => {
                            rolindex++;
                          })
                          if(rolindex <= 0) {
                            rolkisitlama = "0";
                            embedrol = mesaj[27];
                          }
                          else {
                            s.map(a => {
                              mesajrol += "<@&"+ a.id + ">";
                              embedrol += "<@&" + a.id + ">";
                              if(index+1 < rolindex) { mesajrol+= "/"; embedrol += " | "}
                              index++;
                            })
                            rolkisitlama = mesajrol;
                          }
                        
                      });                    
                    if (devam) {
                        topla += baslik + "-" + aciklama + "-" + surex + "-" + katilimcisayi + "-" + sponsor + "-" + enazkatilimci;      
                        topla += "-" + new Date().getTime();
                        var toplaveri = topla;
                        topla = topla.split("-");
                        var avatar = (message.author.avatarURL) ? message.author.avatarURL: "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png"
                        var yarismaBilgi = new Discord.RichEmbed()
                          .setTitle(topla[0])
                          .setDescription(topla[1])
                          .setColor("#36393f")
                          .addField(mesaj[8], embedsure, false)
                          .addField(mesaj[9], topla[3], true)
                          .addField(mesaj[10], (enazkatilimci > katilimcisayi) ? topla[5] : mesaj[19], true)
                          .addField("Sponsor",  topla[4], true)
                          .addField(mesaj[26], embedrol, false)
                          .setThumbnail(client.user.avatarURL)
                          .setFooter(message.member.displayName, avatar)
                          client.channels.get(kanal.id).send(":tada: **" + mesaj[21] + "** :tada:", { embed: yarismaBilgi }).then(async msg => {
                          msg.react("🎉");
                          toplaveri += "-" + msg.id;
                          toplaveri += "-" + rolkisitlama;
                          let cekilisler = await db.fetch("cekilisler_" + message.guild.id);
                          var cekilis = [];
                          if(cekilisler != null) {
                            if(cekilisler.length > 0) { cekilis = cekilisler; cekilis.push(toplaveri); }
                            else cekilis[0] = toplaveri;
                          }
                          else cekilis[0] = toplaveri;
                          db.set("cekilisler_" + message.guild.id, cekilis);
                          message.channel.send(emo("onay") + "**" + mesaj[20] + "**");  
                        })
                    }
                  } catch (err) {
                    message.channel.send(emo("hata") + "**" + mesaj[12] + "**" + err);
                  }
                }
              } catch (err) {
                message.channel.send(emo("hata") + "**" + mesaj[12] + "**"+ err);
              }
            }
          } catch (err) {
            message.channel.send(emo("hata") + "**" + mesaj[12] + "**" + err);
          }
        }
      } catch (err) {
        message.channel.send(emo("hata") + "**" + mesaj[12] + "**" + err);
      }
    } catch (err) {
      message.channel.send(emo("hata") + "**" + mesaj[12] + "**" + err);
    }
  } catch (err) {
    message.channel.send(emo("hata") + "**" + mesaj[12] + "**" + err);
  }
    function emo(yazi) {
    let emoji = client.emojis.find(j => j.name === yazi)
    return "<a:" + emoji.name + ":" + emoji.id + "> │";
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["cekilis-baslat", "giveaway-start", "start-giveaway","çekiliş-başlat", "çekilis-baslat", "çekilişbaşlat", "çekilisbaslat", "cekilisbaslat"],
  permLevel: 0
};

exports.help = {
  name: "cekilis-baslat",
  description: "cekilis-baslat",
  usage: "cekilis-baslat"
};
