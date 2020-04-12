const ayarlar = require('../ayarlar.json');
const fs = require("fs");
const Discord = require('discord.js');
const db = require("quick.db");
module.exports = async packet => {
  // neyim ben mark zuckerberg falan mı
  
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
  if (['MESSAGE_REACTION_ADD'].includes(packet.t)) {
    if(packet.d.member.user.bot == true) return;   
  }
  var kullanici = packet.d.user_id;
  var mesaj = packet.d.message_id;
  var guild = packet.d.guild_id;
  var kanal = packet.d.channel_id;
  var cekilisler = await db.fetch("cekilisler_" + guild);
  if(cekilisler == null) return;
  if(!cekilisler.length > 0) return;
  var devam = true;
  cekilisler.map(async cekilis => {
    cekilis = cekilis.split('-');
    if(mesaj == cekilis[7]) {
      var katilimcilar = [];
      var katilimcidb = await db.fetch("katilimcilar_" + guild + "_" + mesaj);
      if(['MESSAGE_REACTION_ADD'].includes(packet.t)) {
            // ROL KONTROL
            var roldevam = false;
            if(cekilis[8] == "0") roldevam = true;
            else {
              var roller = [];
              if(cekilis[8].includes("/")) roller = cekilis[8].split('/');
              else roller[0] = cekilis[8];
              roller.map(rollerx => { 
                packet.d.member.roles.map(memberrol => {
                  if(memberrol == rollerx.substr(3, rollerx.length - 4)) {
                    roldevam = true;
                  }
                })

              })
            }

            if(!roldevam) return;
            // ROL KONTROL
        if(katilimcidb != null) {
          if(katilimcidb.length > 0)
          {
            katilimcidb.map(p => {
              if(p == kullanici) devam = false;
            })
            if(!devam) return;
            katilimcilar = katilimcidb;
            katilimcilar.push(kullanici);
          }
          else katilimcilar[0] = kullanici;
        }
        else katilimcilar[0] = kullanici;
        if(devam) {
          db.set("katilimcilar_" + guild + "_" + mesaj, katilimcilar);
          var getir = await db.fetch("leaveclear_" + guild);
          var getiryeni = [];
          var getiryaz = true;
          if(getir != null) { 
            if(getir.length > 0) {
              getir.map(h => {
                if(h == "katilimcilar_" + guild + "_" + mesaj) {
                  getiryaz = false;
                } 
              })
             if(getiryaz) getiryeni.push("katilimcilar_" + guild + "_" + mesaj);
            }
            else getiryeni[0] = "katilimcilar_" + guild + "_" + mesaj;
          }
          else getiryeni[0] = "katilimcilar_" + guild + "_" + mesaj;
          if(getiryaz) {
            db.set("leaveclear_" + guild, getiryeni);  
          }       
        }
      }
      else if(['MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
        
        if(katilimcidb == null) return;
        if(!katilimcidb.length > 0) return;
        if(katilimcidb.length - 1 <= 0) katilimcidb = null;
        else {
          var index = 0;
          katilimcidb.map(u => {
            if(kullanici == u) katilimcidb.splice(katilimcidb[index], 1);
            index++;
          })
        }
        if(katilimcidb == null) db.set("katilimcilar_" + guild + "_" + mesaj, []);
        else db.set("katilimcilar_" + guild + "_" + mesaj, katilimcidb);
      }
    }
  })
};
