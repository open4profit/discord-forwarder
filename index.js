const config = require('./config');
const Discord = require('discord.js');
const request = require('request');

const client = new Discord.Client();

client.on('ready', () => {
  console.info('logged in as ' + client.user.tag);
});

client.on('error', err => {
  console.error(err);
  process.exit(1);
});

client.on('warn', message => {
  console.warn(message);
});

client.on('reconnecting', message => {
  console.info('reconnecting...');
});

client.on('resume', message => {
  console.info('connected');
});

client.on('disconnect', message => {
  console.info('disconnected');
  process.exit(1);
});

client.on('message', message => {
  if (config.READING_CHANNELS.includes(message.channel.id)) {
    
    const channel = client.channels.get(message.channel.id)
    let content = `**${message.channel.parent.name}**\n${channel.name}\n${message.content}\n`   
    message.attachments.forEach(attachment => {      
    content += ` ${attachment.ProxyUrl} \n`    
  })
    content = content.replace(/\[1\]/g, '');
    content = content.replace('<@&577534787502211073>', '');
    config.WRITING_CHANNELS.forEach(channel => {
      client.channels.get(channel).send(content, {embed: message.embeds[0]}).catch(err => {
        console.error(err);
      });
    });

    config.WEBHOOKS.forEach(webhook => {
      request({
        url: webhook,
        method: 'POST',
        json: {
          content: content,
          embeds: message.embeds,
        },
      }, err => {
        if (err) {
          console.error(err);
        }
      });
    });
  }
});

client.login(config.TOKEN);
