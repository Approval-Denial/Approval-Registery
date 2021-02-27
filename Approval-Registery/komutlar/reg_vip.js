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
	//  .setAuthor(server.name, server.iconURL({dynamic: true}))
	//  .setFooter(app.embed.footer, kullanıcı.user.displayAvatarURL({dynamic: true}))
	  .setTimestamp()              
    moment.locale('tr');    
    if (!message.member.roles.cache.has(app.Kayıt_Roller.Reg_rol) && !message.member.hasPermission("ADMINISTRATOR"))  return message.react(app.emoji.red)          
    const üye = message.mentions.users.first() ||  message.guild.members.cache.get(args[0])
if (!üye) return message.channel.send(approvemb.setDescription('Bi yerde yanlış yaptın. \n Komutu doğru şekilde kullandığına emin ol. \n \`'+ayarlar.prefix+'vip @Approval/İD\`')).then(x => x.delete({timeout: 10000}));
  const member = message.guild.member(üye);
     if (member.roles.cache.has(app.Kayıt_Roller.Vip)) {
         member.roles.remove(app.Kayıt_Roller.Vip)
         message.react(app.emoji.onay)
     } else{
       member.roles.add(app.Kayıt_Roller.Vip)
       message.react(app.emoji.onay)
     }
        
      
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['special'],
    kategori: "Yetkili Komutları",
    permLevel: 0
};
exports.help = {
  approval_komut: "vip",
    description: "Sunucuda Erkek kaydı",
    usage: "kayıt isim yaş"
};
