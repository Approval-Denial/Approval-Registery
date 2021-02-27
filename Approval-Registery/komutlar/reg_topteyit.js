const Discord = require("discord.js");
const db = require("quick.db");
const rdb = new db.table("teyit");
const kdb = new db.table("kullanici");
const ayarlar = require("../ayarlar.json");
const app = require("../approval.json")
const moment = require("moment");

exports.run = async (client, message, args) => {
	const server = message.member.guild
	const kullanıcı = message.member
  const approvemb = new Discord.MessageEmbed()
//	  .setAuthor(server.name, server.iconURL({dynamic: true}))
//	  .setFooter(app.embed.footer, kullanıcı.user.displayAvatarURL({dynamic: true}))
	  .setTimestamp()              
    moment.locale('tr');    
    if (!message.member.roles.cache.has(app.Kayıt_Roller.Reg_rol) && !message.member.hasPermission("ADMINISTRATOR"))  return message.react(app.emoji.red)          
  
    let teyitData = rdb.get("reg") || {};
    let data = Object.keys(teyitData);
    let dataTop = data.filter(x => message.guild.members.cache.has(x)).sort((a, b) => Number((teyitData[b].erkek || 0) + (teyitData[b].kadin || 0)) - Number((teyitData[a].erkek) + (teyitData[a].kadin))).map((value, index) => `\`${index+1}.\` ${message.guild.members.cache.get(value)} **\`${teyitData[value].erkek || 0}\` erkek, \`${teyitData[value].kadin || 0}\` kadın [${(teyitData[value].erkek || 0) + (teyitData[value].kadin || 0)}]**`).splice(0, 15).join("\n");
    message.channel.send(approvemb.setTitle('Top Teyit').setDescription(`${dataTop || 'Verileri köpeğim yedi...'}`));

 
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["topteyit"],
  kategori: "Yetkili Komutları",
  permLevel: 0
};
exports.help = {
  approval_komut: "topt",
  description: "Sunucuda Erkek kaydı",
  usage: "kayıt isim yaş"
};
