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
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let data = kdb.get(`isimler.${member.id}`);
    if (!data) return message.channel.send(approvemb('Kayıt Geçmişi Bulunamadı.')).then(x => x.delete({timeout: 10000}));
    let listedData = data.length > 0 ? data.map((value, index) => `\`${new Date(value.Zaman).toTurkishFormatDate()}\` tarihinde \`${index + 1}.\` İşlemi yapılmıştır. \n\n • İsmi [\`${value.isim_yas}\`] \n • Kaydı Yapan ${message.guild.members.cache.has(value.yetkili) ? message.guild.members.cache.get(value.yetkili) : "Bulunamadı."}\n • İşlem **${value.komut}** \n`) : "Bu Üyenin İsim Geçmişi Bulunamadı.";  
      message.channel.send(approvemb.setDescription(`${listedData.join("\n")}`)).then(x => x.delete({timeout: 20000}));

};
exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: ["geçmiş"],
  kategori: "Yetkili Komutları",
  permLevel: 0
};
exports.help = {
  approval_komut: "isimler",
  description: "Sunucuda Erkek kaydı",
  usage: "kayıt isim yaş"
};
