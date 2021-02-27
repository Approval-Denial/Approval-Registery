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
message.channel.send(approvemb.setTitle('Kayıt Komudu Listesi.').setDescription(`<a:Approvalintaci:814672033870512128>** ${message.guild.members.cache.get(ayarlar.bot_owner[0]).user.username} **<a:Approvalintaci:814672033870512128>

**[Kayıt Komutları ve Kullanım]**
**
\`•\` ⇒ ${ayarlar.prefix}erkek/e @Approval/İD Memo 18 \`(Erkek Üyeleri kaydeder ve DataBase'e bilgileri depolar)\`
\`•\` ⇒ ${ayarlar.prefix}kız/k @Approval/İD Batu 17 \`(Kız Üyeleri kaydeder ve DataBase'e bilgileri depolar)\`
\`•\` ⇒ ${ayarlar.prefix}isim/i @Approval/İD Memo 18 \`(Üyenin İsmini Değiştirir ve DataBase'e bilgileri depolar)\`
\`•\` ⇒ ${ayarlar.prefix}unreg/kayıtsız @Approval/İD \`(Üyeyi Kayıtsıza atar ve DataBase'e bilgileri depolar)\`
\`•\` ⇒ ${ayarlar.prefix}geçmiş @Approval/İD \`(Depolanmış Bilgileri Size İletir)\`
\`•\` ⇒ ${ayarlar.prefix}topt \`(Kayıt sıralamasını gösterir)\`**

`))
message.react('814672032742375495')
};
exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: ["help"],
  kategori: "Yetkili Komutları",
  permLevel: 0
};
exports.help = {
  approval_komut: "yardım",
  description: "Sunucuda Erkek kaydı",
  usage: "kayıt isim yaş"
};
