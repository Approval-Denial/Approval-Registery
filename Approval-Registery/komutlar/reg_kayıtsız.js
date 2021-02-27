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
    const appr = message.mentions.users.first() ||  message.guild.members.cache.get(args[0])
    var yeniad;
if (!appr) return message.channel.send(approvemb.setDescription('Bi yerde yanlış yaptın. \n Komutu doğru şekilde kullandığına emin ol. \n \`'+ayarlar.prefix+'kayıtsız @Approval/İD\`')).then(x => x.delete({timeout: 10000}));
const appcik = message.guild.member(appr);
if (appcik.user.username.includes(app.sunucu.tag)) yeniad = `${app.sunucu.tag} İsim | Yaş`;
if (!appcik.user.username.includes(app.sunucu.tag)) yeniad = `${app.sunucu.tagsız} İsim | Yaş`;
  
  if (message.member.roles.highest.position <= appcik.roles.highest.position) return message.react(app.emoji.red);

  //appr.roles.remove(app.kayıt.kayıtsız[0]);
  appcik.roles.set(app.Kayıt_Roller.Kayıtsız);
  appcik.setNickname(yeniad).catch(err => { return undefined; });
  
  message.react(app.emoji.onay)
  rdb.add(`reg.${message.author.id}.kayıtsız`, +1);
  kdb.push(`isimler.${appr.id}`, {
    yetkili : message.author.id,
    kayıt_olan : appcik.id,
    isim_yas : yeniad,
    komut : '[Kayıtsıza Atıldı]',
    Zaman: Date.now()
  });

};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["kayıtsız"],
  kategori: "Yetkili Komutları",
  permLevel: 0
};
exports.help = {
  approval_komut: "unreg",
  description: "Sunucuda Erkek kaydı",
  usage: "kayıt isim yaş"
};
