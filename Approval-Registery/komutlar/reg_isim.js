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
	  //.setFooter(app.embed.footer, kullanıcı.user.displayAvatarURL({dynamic: true}))
	  .setTimestamp()              
    moment.locale('tr');    
    if (!message.member.roles.cache.has(app.Kayıt_Roller.Reg_rol) && !message.member.hasPermission("ADMINISTRATOR"))  return message.react(app.emoji.red)          
    const appr = message.mentions.users.first() ||  message.guild.members.cache.get(args[0])
    var yeniad;
    let name =  args[1];
    let age = Number (args[2]);
    // 
    if (!appr || !name || !age) return  message.channel.send(approvemb.setTitle('Bi yerde yanlış yaptın. ').setDescription('Gerekli bilgileri düzgün şekilde girdiğine dikkat et. \n\n** Doğru Kulanımı** \`'+ayarlar.prefix+'isim @Approval/İD Memo 18 \`')).then(x => x.delete({timeout: 10000}));

                const Approval = message.guild.member(appr);
              if (Approval.roles.cache.has(app.Kayıt_Roller.karantina[0])) return   message.channel.send(approvemb.setTitle('Dur Orda !').setDescription(`**${client.guilds.cache.get(ayarlar.server_id).roles.cache.get(app.Kayıt_Roller.karantina[0]).name}** Adlı role sahip olduğu için bu işlemi gerçekleştiremem.`))
                       if (Approval.user.username.includes(app.sunucu.tag)) yeniad = `${app.sunucu.tag} ${name} | ${age}`;
                       if (!Approval.user.username.includes(app.sunucu.tag)) yeniad = `${app.sunucu.tagsız} ${name} | ${age}`;
            
                       Approval.setNickname(yeniad).catch(err => { return; });

                  message.channel.send(approvemb.setDescription(`${Approval}, adını [\`${yeniad}\`] olarak değiştirdim. \n İyi Eğlenceler Dilerim ^^`))
                  
      rdb.add(`reg.${message.author.id}.isim`, +1);
      kdb.push(`isimler.${appr.id}`, {
        yetkili : message.author.id,
        kayıt_olan : Approval.id,
        isim_yas : yeniad,
        komut : '[İsim Değiştirme]',
        Zaman: Date.now()
      });
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["i"],
  kategori: "Yetkili Komutları",
  permLevel: 0
};
exports.help = {
  approval_komut: "isim",
  description: "Sunucuda Erkek kaydı",
  usage: "kayıt isim yaş"
};
