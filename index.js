const Discord = require('discord.js');
const client = new Discord.Client();
const Distube = require('distube');
const distube = new Distube(client, { searchSongs: false, emitNewSongOnly: true });
const { token } = require('./info.json');
const prefix = '.'

client.on('ready', () => {
    client.user.setActivity('.help', { type: 'PLAYING' });
    console.clear();
});


client.on("ready", () => {
    console.log(`${client.user.tag} has logged is`);
});

'use strict';
const { Client, MessageEmbed } = require('discord.js');
client.on('ready', () => {
    console.log('Mira webon estoy listo pero... soy un mensaje embed a si que... soy una ladilla ._.!');
});

client.on('message', message => {
    if (message.content === '.help') {
        const embed = new MessageEmbed()
            //Justin Cracked at Fortnite
            .setTitle('Korom Music Bot commands list')
            .addField('.play', 'Pon la cancion o video de youtube que quieras.')
            .addField('.stop', 'Deten la cancion que se esta reproduciendo.')
            .addField('.skip','Saltate la cancion que esta sonando.')
            .addField('.loop/repeat','Repite la misma cancion que acaba de sonar.')
            .addField('.queue','Mira la cola de canciones que pusiste.')
            .setColor(2895667)
            .setFooter('Made by クロム  אㄥ')
        //Si este es otro mensaje que no sirve para una mierda
        message.channel.send(embed);
    }
});



client.on("message", async (message) => {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift();

    // Queue status template
    const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

    // DisTube event listeners, more in the documentation page
    distube
        .on("playSong", (message, queue, song) => message.channel.send(
            `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user.tag}\n${status(queue)}`
        ))
        .on("addSong", (message, queue, song) => message.channel.send(
            `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user.tag}`
        ))
        .on("playList", (message, queue, playlist, song) => message.channel.send(
            `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user.tag}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
        ))
        .on("addList", (message, queue, playlist) => message.channel.send(
            `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
        ))
        // DisTubeOptions.searchSongs = true
        .on("searchResult", (message, result) => {
            let i = 0;
            message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
        })
        // DisTubeOptions.searchSongs = true
        .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
        .on("error", (message, e) => {
            console.error(e)
            message.channel.send("An error encountered: " + e);
        });

    if (command == "play") {
        if (!message.member.voice.channel) return message.channel.send('No estas en ningun canal de voz');
        if (!args[0]) return message.channel.send('Debes indicar algo para poner');
        distube.play(message, args.join(" "));
    }

    if (command == "stop") {
        distube.stop(message);
        message.channel.send('Has parado la musica.');
    }

    if (command == "skip") {
        distube.skip(message);
        message.channel.send('skipped');
    }

    if (["loop", "repeat"].includes(command)) {
        distube.setRepeatMode(message, paseInt(args[0]))
        let mode = distube.setRepeatMode(message, parseInt(args[0]));
        mode = mode ? mode == 2 ? "Repeat queue" : "Repeat song" : "Off";
        message.channel.send("Set repeat mode to `" + mode + "`");
    }

    if (command == "queue") {
        let queue = distube.getQueue(message);
        message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
        ).join("\n"));
    }
    
    if (command == "autoplay") {
        let mode = distube.toggleAutoplay(message);
        message.channel.send("Set autoplay mode to `" + (mode ? "On" : "Off") + "`");``
    }
});

client.login(token);