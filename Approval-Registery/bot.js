
const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const fs = require("fs");
const moment = require("moment");
moment.locale("tr")
const chalk = require("chalk");
require("./util/eventLoader")(client);
var prefix = ayarlar.prefix;
const app = require("./approval.json")
const qdb = require("quick.db");
const db = require("quick.db");
const cdb = new qdb.table("cezalar");
const pdb = new qdb.table("puanlar");
const limit = new qdb.table("limitler");
const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};
 /*
  idle = BOŞTA
  online = ÇEVRİMİÇİ
  dnd = RAHATSIZ ETMEYİN
invisible = GÖRÜNMEZ/ÇEVRİMDIŞI
*/

client.on("ready", async () => {
  client.user.setPresence({ activity: { name: app.bot.activity }, status: app.bot.durum });
    let botses = client.channels.cache.get(app.sunucu.bot_voice);
  if (botses) botses.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
  setInterval(() => {
    botses.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
    client.user.setPresence({ activity: { name: app.bot.activity },status: app.bot.durum });

    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Ses Kanalına Bağlantı Güncellendi. ve Durum Güncellendi`);
}, 600000)
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`${props.help.approval_komut} Adlı Komut Yüklendi ! `);   
    client.commands.set(props.help.approval_komut, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.approval_komut);
    });
  });
});

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
        client.aliases.set(alias, cmd.help.approval_komut);
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
        client.aliases.set(alias, cmd.help.approval_komut);
        
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

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.bot_owner) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
/*
client.on('debug', e => {
  console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
 });*/

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

Date.prototype.toTurkishFormatDate = function (format) {
  let date = this,
    day = date.getDate(),
    weekDay = date.getDay(),
    month = date.getMonth(),
    year = date.getFullYear(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds();

  let monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
  let dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");

  if (!format) {
    format = "dd MM yyyy | hh:ii:ss";
  };
  format = format.replace("mm", month.toString().padStart(2, "0"));
  format = format.replace("MM", monthNames[month]);
  
  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2));
  };
  
  format = format.replace("dd", day.toString().padStart(2, "0"));
  format = format.replace("DD", dayNames[weekDay]);

  if (format.indexOf("HH") > -1) format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("hh") > -1) {
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
  };
  if (format.indexOf("ii") > -1) format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("ss") > -1) format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
  return format;
};


client.login(ayarlar.token);



client.on("guildMemberAdd", member => {
 if ( app.sunucu_ayarlar.welcome === true) {
   // const attachment = new Discord.MessageAttachment(); Foto veya Gif koymak için HG mesajının son satırını  '   Kaydın Yapıldıktan Sonra Tüm Kuralları Kabul Etmiş Sayılırsın. **`,attachment);  ' olarak değişin
  
if (member.user.bot) return member.roles.add(app.Kayıt_Roller.bot);
  var appgün = moment(member.user.createdAt)
    .add(app.sunucu.fakegün, "days")
    .fromNow();
    appgün = appgün.replace("birkaç saniye önce", " ");

  if (!appgün.includes("önce") || appgün.includes("sonra") || appgün == " ") {
  
       member.roles.set(app.Kayıt_Roller.karantina);
       const server = member.guild
       const kullanıcı = member
       const approvemb = new Discord.MessageEmbed()
       /* .setAuthor(server.name, server.iconURL({dynamic: true}))
       .setFooter(app.embed.footer, kullanıcı.user.displayAvatarURL({dynamic: true}))*/
         .setTimestamp()              
         moment.locale('tr'); 
     member.guild.channels.cache.get(app.kayıt.Fake_log).send(`${member} Adlı Kullanıcı Hesabı 5 gün içinde kurulu Olduğu İçin Karantınaya Atıldı.`);
   
  } else {

      if (!member.roles.cache.has(app.Kayıt_Roller.Kayıtsız)) {
          member.roles.set(app.Kayıt_Roller.Kayıtsız);

      }
    
        const emojisayi = {
          "9":"<a:Emoji_9:794264989216538635>",
          "8":"<a:Emoji_8:794264989610410045>",
          "7":"<a:Emoji_7:794264989426647060>",
          "6":"<a:Emoji_6:794264989559947294>",
          "5":"<a:Emoji_5:794264989502013450>",
          "4":"<a:Emoji_4:794264989459939338>",
          "3":"<a:Emoji_3:794264989514334228>",
          "2":"<a:Emoji_2:794264989544349719>",
          "1":"<a:Emoji_1:794264989095165962>",
          "0":"<a:Emoji_0:794264989628104745>",
        };
        "abcdefghijklmnopqrstuvwxyz".split("").forEach(c => {
          emojisayi[c] = emojisayi[c.toUpperCase()] = `:regional_indicator_${c}:`;
        });
        const emojisayi1 = {
          "9":"<a:sayi_9:814574158473068664>",
          "8":"<a:sayi_8:814573980404285460>",
          "7":"<a:sayi_7:814573979289387019>",
          "6":"<a:sayi_6:814573979724414986>",
          "5":"<a:sayi_5:814573979250458666>",
          "4":"<a:sayi_4:814573979675000832>",
          "3":"<a:sayi_3:814573979570012220>",
          "2":"<a:sayi_2:814573979615887360>",
          "1":"<a:sayi_1:814573973290614824>",
          "0":"<a:sayi_0:814574354658361414>"
        }
        "abcdefghijklmnopqrstuvwxyz".split("").forEach(c => {
          emojisayi1[c] = emojisayi1[c.toUpperCase()] = `:regional_indicator_${c}:`;
        });
        const emojisayi2 = {
          "0":"<a:approval_0:814608400410345482>",
          "1":"<a:approval_1:814608401572036649>",
          "2":"<a:approval_2:814608402465685504>",
          "3":"<a:approval_3:814608402310627329>",
          "4":"<a:approval_4:814608402584043581>",
          "5":"<a:approval_5:814608402353094682>",
          "6":"<a:approval_6:814608404143538197>",
          "7":"<a:approval_7:814608402432786442>",
          "8":"<a:approval_8:814608403363528764>",
          "9":"<a:approval_9:814608402298568706>"
          }
          "abcdefghijklmnopqrstuvwxyz".split("").forEach(c => {
            emojisayi2[c] = emojisayi2[c.toUpperCase()] = `:regional_indicator_${c}:`;
          });
        const toplam = member.guild.memberCount;
        let sunucu;
      if (app.emoji_sayi.emoji1 == true & app.emoji_sayi.emoji2 == false & app.emoji_sayi.emoji3 == false)  sunucu = `` +`${toplam}`.split("").map(c => emojisayi[c] || c).join("")
      if (app.emoji_sayi.emoji1 == false & app.emoji_sayi.emoji2 == true & app.emoji_sayi.emoji3 == false)  sunucu = `` +`${toplam}`.split("").map(c => emojisayi1[c] || c).join(" ")
      if (app.emoji_sayi.emoji1 == false & app.emoji_sayi.emoji2 == false & app.emoji_sayi.emoji3 == true)  sunucu = `` +`${toplam}`.split("").map(c => emojisayi2[c] || c).join(" ")
      if (app.emoji_sayi.emoji1 == false & app.emoji_sayi.emoji2 == false & app.emoji_sayi.emoji3 == false)  sunucu = '`'+toplam+'`'

    
    member.guild.channels.cache.get(app.kayıt.HG_Kanal).send(`** Aramıza Hoşgeldin ${member} (\`${member.id}\`) 

    Seninle Beraber ${sunucu || member.guild.memberCount} Kişiye Ulaştık
    
    Kaydının Yapılması İçin <@&${app.Kayıt_Roller.Reg_rol}> Görevlisi Seninle İlgilenicektir.

    Hesabını \`${moment(member.createdAt).format("DD | MM | YY・HH:mm:ss")}\` Tarihinde Kurmuşsun
    
    Kaydın Yapıldıktan Sonra Tüm Kuralları Kabul Etmiş Sayılırsın. **`);
  }
}

else {
  return;
}
});
client.on("guildMemberAdd", member => {
  const server = member.guild
	const kullanıcı = member
  const approvemb = new Discord.MessageEmbed()
	/* .setAuthor(server.name, server.iconURL({dynamic: true}))
	.setFooter(app.embed.footer, kullanıcı.user.displayAvatarURL({dynamic: true}))*/
	  .setTimestamp()              
    moment.locale('tr'); 
  if ( app.sunucu_ayarlar.ototag == true) {
    const isim = `${app.sunucu.tag || app.sunucu.tagsız} İsim | Yaş`
    member.setNickname(isim)
    member.guild.channels.cache.get(app.log.ototag_log).send(approvemb.setDescription(`**Sunucuya Giriş Yapan ${member} (\`${member.id}\`) Adlı Kullanıcının Adını \`[${isim}]\` Olarak Değiştirdim. **`))
  }
if(app.sunucu_ayarlar.ototag == false) {
undefined;
}
  
 });

client.on("message", async message => {
      if(message.author.id !== ayarlar.bot_owner[0])  return;
      if (message.content === "approvalkatıl") {
      message.delete()
    client.emit(
      "guildMemberAdd",
      message.member || (await message.guild.fetchMember(message.author))
    );
  }
});

client.on('message', msg => {

  if (msg.content.toLocaleLowerCase() === 'tag' || msg.content.toLocaleLowerCase() === '.tag' || msg.content.toLocaleLowerCase() === '!tag' || msg.content.toLocaleLowerCase() === '-tag') {
    msg.channel.send(app.sunucu.tag);
  }
});

client.on("message", async (message) => {
    if (!ayarlar.bot_owner[0].includes(message.author.id)) return;

    let args = message.content.split(" ");

    if (args[0] == `.eval` && args.length > 1) {
        if (!message.guild) return;
        let codein = args.slice(1).join(' ')
        if (!codein.toLowerCase().includes('token')) {
            try {
                let code = eval(codein)
                if (codein.length < 1) return message.channel.send(`Kodu yaz`)
                if (typeof code !== 'string')
                    code = require('util').inspect(code, { depth: 0 });

                const embed = new Discord.MessageEmbed()
                    .setColor('#7C00DB')
                    .addField('📥 ', `\`\`\`js\n${codein.length > 1024 ? "1024 karakteri aşıyor." : codein}\`\`\``)
                    .addField('📤 ', `\`\`\`js\n${code.length > 1024 ? "1024 karakteri aşıyor." : code}\n\`\`\``)
                message.channel.send(embed)
            } catch (e) {
                let embed2 = new Discord.MessageEmbed()
                    .setColor('RED')
                    .addField('📥 ', `\`\`\`js\n${codein.length > 1024 ? "1024 karakteri aşıyor." : codein}\`\`\``)
                    .addField('🚫 ', `\`\`\`js\n${e.length > 1024 ? "1024 karakteri aşıyor." : e}\`\`\``)
                message.channel.send(embed2);
            }
        } else {
            message.channel.send(`ne bilm`)
        }
        if (args[0] == `.restart`) {
            await message.channel.send(`⏳ **Bot yeniden başlatılıyor..**`);
          
                if (err) return console.log(err);
                await message.channel.send('Emredersin Oç');
                process.exit();
            
        }
    }
});

client.on("guildMemberAdd", async member => {
  const server = member.guild
	const kullanıcı = member
  const approvemb = new Discord.MessageEmbed()
	/* .setAuthor(server.name, server.iconURL({dynamic: true}))*/
	.setFooter(app.embed.footer, kullanıcı.user.displayAvatarURL({dynamic: true}))
	  .setTimestamp()              
    moment.locale('tr'); 
  let girciksaksogibi = member.guild.channels.cache.get(app.kayıt.Join_Left)
  if (!girciksaksogibi) return;
  girciksaksogibi.send(approvemb.setAuthor(member.user.tag,server.iconURL({dynamic: true})).setDescription(`**${member.user} (\`${member.user.id}\`) \n Sunucuya Katıldı **`))
});

client.on("guildMemberRemove", async member => {
  const server = member.guild
	const kullanıcı = member
  const approvemb = new Discord.MessageEmbed()
	/* .setAuthor(server.name, server.iconURL({dynamic: true}))*/
	.setFooter(app.embed.footer, kullanıcı.user.displayAvatarURL({dynamic: true}))
	  .setTimestamp()      
  let girciksaksogibi = member.guild.channels.cache.get(app.kayıt.Join_Left)
  if (!girciksaksogibi) return;

  //girciksaksogibi.send(`** \`${member.user.tag} | ${member.user.id} \` \n Sunucudan Ayrıldı ** `)
  girciksaksogibi.send(approvemb.setAuthor(member.user.tag,server.iconURL({dynamic: true})).setDescription(`**${member.user} (\`${member.user.id}\`) \n Sunucudan Ayrıldı **`))
});