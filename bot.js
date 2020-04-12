const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
var colors = require("colors");
const db = require("quick.db");
require("./util/eventLoader")(client);
const http = require("http");
const express = require("express");
const app = new express();
var prefix;
const Hapi = require("hapi");
const path = require("path");
const DBL = require("dblapi.js");
app.get("/", (request, response) => {
  response.sendStatus(200);
  //response.sendFile(path.join(__dirname+'/index.html'))
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`https://30814giveaway.glitch.me`);
}, 43200000);

app.get("/foo", (req, res, next) => {
  const foo = JSON.parse(req.body.jsonString);
  // ...
});


const server = http.createServer(app);
const dbl = new DBL("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDE5MDA0Njc3Mjk4NTg2NiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTc5NDQ3OTQ3fQ.DAqmfVReg1hqF32BryhukiZ9xHzWXVELdVGBgOe8Tn8", client);
dbl.on("posted", () => {
  console.log("Server count posted!");
});

dbl.on("error", e => {
  console.log(`Oops! ${e}`);
});
const log = message => {
  console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${message}`.gray);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.backup = {
  roles: new Discord.Collection(),
  channels: new Discord.Collection(),
  emojis: new Discord.Collection(),
  presences: new Discord.Collection()
}
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  prefix = await db.fetch("prefix_" + message.guild.id);
  if (prefix == null) prefix = ayarlar.prefix;
  // SABİT
  var tr = [
    "Mevcut prefix: ", // 0
    "Değiştirmek için: ``" + prefix + "prefix`` veya ``giveaway.prefix``", //1
    "Prefix başarıyla değiştirildi ", // 2
    "Bu komut sadece adminlere özeldir" // 3
  ];
  var en = [
    "Available prefix: ", //0
    "To change: ``" + prefix + "prefix`` or ``giveaway.prefix``", // 1
    "Prefix succesfully changed ", // 2
    "This command is specific to admins" // 3
  ];
  let dil = await db.fetch("dil_" + message.guild.id);
  var mesaj = [];
  if (dil == "tr") mesaj = tr;
  else mesaj = en;
  // SABİT
  let komut = message.content.toLowerCase().split(" ")[0];
  komut = komut.slice(prefix.length);
  let args = message.content.split(" ");
  args.splice(0, 1);
  if (
    message.content.toLowerCase().split(" ")[0] == prefix + "prefix" ||
    message.content.toLowerCase().split(" ")[0] == "giveaway.prefix"
  ) {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return mesajgonder(emo("hata") + "**" + mesaj[3] + "**");
    let pref = message.content.toLowerCase().split(" ")[1];
    if (pref == undefined)
      return mesajgonder(mesaj[0] + "``" + prefix + "``\n" + mesaj[1]);
    db.set("prefix_" + message.guild.id, pref);
    mesajgonder(emo("onay") + "**" + mesaj[2] + "**``" + pref + "``");
  }
  if (message.mentions.members.first() != null) {
    if (message.mentions.members.first().id == "654190046772985866") {
      mesajgonder(emo("donendc") + "**My prefix is here:** ``" + prefix + "``");
    }
  }
  if (!message.content.startsWith(prefix)) return;
  function mesajgonder(yazi) {
    message.channel.send(yazi);
  }
  function emo(yazi) {
    let emoji = client.emojis.find(j => j.name === yazi);
    return "<a:" + emoji.name + ":" + emoji.id + "> │";
  }
});
client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

/*client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});*/

client.login(ayarlar.token);
/*
// SABİT
  var tr = [
    "Açıklama girmediniz"
  ];
  var en = [
    "No description"
  ];
  let dil = "en";
  var mesaj = [];
  if(dil == "tr") mesaj = tr;
  else if(dil == "en") mesaj = en;
// SABİT
*/
