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
    if (!appr || !name || !age) return  message.channel.send(approvemb.setTitle('Bi yerde yanlış yaptın. ').setDescription('Gerekli bilgileri düzgün şekilde girdiğine dikkat et. \n\n** Doğru Kulanımı** \`'+ayarlar.prefix+'erkek @Approval/İD Memo 18 \`')).then(x => x.delete({timeout: 10000}));

         if (app.sunucu_ayarlar.taglı_alım == true) {
            const Approval = message.guild.member(appr);
 let Vip = client.guilds.cache.get(ayarlar.server_id).roles.cache.get(app.Kayıt_Roller.Vip)
 let Booster = client.guilds.cache.get(ayarlar.server_id).roles.cache.get(app.Kayıt_Roller.Booster)
                   if (!Approval.user.username.includes(app.sunucu.tag) && !Approval.roles.cache.has(app.Kayıt_Roller.Booster) &&  !Approval.roles.cache.has(app.Kayıt_Roller.Vip)) return  message.channel.send(approvemb.setTitle('Dur Orda !').setDescription(`Kayıt İşlemi tamamlanamadı. \n\n Kayıt için gerekli olanlar \n **1** \`•\` ⇒ \`${app.sunucu.tag}\` olan tagımızı alması lazım.\n**2** \`•\` ⇒  Üst yetkili tarafından \`${Vip.name}\` rolü verilmesi.\n**3** \`•\` ⇒  son olarak \`${Booster.name}\` rolüne sahip olması lazım (Booster rolü) `)).then(x => x.delete({timeout: 10000}));
                   if (Approval.roles.cache.has(app.Kayıt_Roller.karantina[0])) return   message.channel.send(approvemb.setTitle('Dur Orda !').setDescription(`**${client.guilds.cache.get(ayarlar.server_id).roles.cache.get(app.Kayıt_Roller.karantina[0]).name}** Adlı role sahip olduğu için bu işlemi gerçekleştiremem.`)).then(x => x.delete({timeout: 10000}));
                   if (Approval.user.username.includes(app.sunucu.tag)) yeniad = `${app.sunucu.tag} ${name} | ${age}`;
                   if (!Approval.user.username.includes(app.sunucu.tag)) yeniad = `${app.sunucu.tagsız} ${name} | ${age}`;
        
                   Approval.setNickname(yeniad).catch(err => { return; });
              Approval.roles.remove(app.Kayıt_Roller.Kayıtsız);
               Approval.roles.add(app.Kayıt_Roller.Erkek);
              message.channel.send(approvemb.setDescription(`${Approval}, kaydın tamamlandı. adını [\`${yeniad}\`] olarak değiştirdim. \n İyi Eğlenceler Dilerim ^^`)).then(x => x.delete({timeout: 10000}));
              
  rdb.add(`reg.${message.author.id}.erkek`, +1);
  kdb.push(`isimler.${appr.id}`, {
    yetkili : message.author.id,
    kayıt_olan : Approval.id,
    isim_yas : yeniad,
    komut : '[Erkek Kayıt]',
    Zaman: Date.now()
  });
         }
         else {
           
                const Approval = message.guild.member(appr);
              if (Approval.roles.cache.has(app.Kayıt_Roller.karantina[0])) return   message.channel.send(approvemb.setTitle('Dur Orda !').setDescription(`**${client.guilds.cache.get(ayarlar.server_id).roles.cache.get(app.Kayıt_Roller.karantina[0]).name}** Adlı role sahip olduğu için bu işlemi gerçekleştiremem.`)).then(x => x.delete({timeout: 10000}));
                       if (Approval.user.username.includes(app.sunucu.tag)) yeniad = `${app.sunucu.tag} ${name} | ${age}`;
                       if (!Approval.user.username.includes(app.sunucu.tag)) yeniad = `${app.sunucu.tagsız} ${name} | ${age}`;
            
                       Approval.setNickname(yeniad).catch(err => { return; });
                  Approval.roles.remove(app.Kayıt_Roller.Kayıtsız);
                   Approval.roles.add(app.Kayıt_Roller.Erkek);
                  message.channel.send(approvemb.setDescription(`${Approval}, kaydın tamamlandı. adını [\`${yeniad}\`] olarak değiştirdim. \n İyi Eğlenceler Dilerim ^^`)).then(x => x.delete({timeout: 10000}));
                  
      rdb.add(`reg.${message.author.id}.erkek`, +1);
      kdb.push(`isimler.${appr.id}`, {
        yetkili : message.author.id,
        kayıt_olan : Approval.id,
        isim_yas : yeniad,
        komut : '[Erkek Kayıt]',
        Zaman: Date.now()
      });

         }


};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["e"],
  kategori: "Yetkili Komutları",
  permLevel: 0
};
exports.help = {
  approval_komut: "erkek",
  description: " Erkek Kayıt",
  usage: ayarlar.prefix+"erkek @Approval/"+ayarlar.bot_owner[0]+" Memo 18"
};
