(async () => {
    const Discord = require("discord.js");
    const Database = require("easy-json-database");
    const devMode = typeof __E_IS_DEV !== "undefined" && __E_IS_DEV;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const s4d = {
        Discord,
        database: new Database(`${devMode ? S4D_NATIVE_GET_PATH : "."}/db.json`),
        joiningMember: null,
        reply: null,
        tokenInvalid: false,
        tokenError: null,
        checkMessageExists() {
            if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
            if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
        }
    };
    s4d.client = new s4d.Discord.Client({
        intents: [Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)],
        partials: ["REACTION"]
    });

    var arguments2, command, member_xp, member_level;


    await s4d.client.login('token').catch((e) => {
        s4d.tokenInvalid = true;
        s4d.tokenError = e;
    });

    s4d.client.on('ready', async () => {

        while (s4d.client && s4d.client.token) {
            await delay(50);
            s4d.client.user.setActivity(String(('Helping snaX_RuSh auf' + String(s4d.client.guilds.cache.size))));
            await delay(Number(1800) * 1000);

            console.log('ran')
        }

    });

    s4d.client.on('guildMemberAdd', async (param1) => {
        s4d.joiningMember = param1;
        s4d.client.channels.cache.get('709784256875986965').send(String((['Wie geht\'s dir', s4d.joiningMember, '?'].join(''))));
        (s4d.joiningMember).roles.add((Array.prototype.concat.apply([], s4d.client.guilds.cache.array().map((g) => g.roles.cache.array())).get('705430114799845376')));
        s4d.joiningMember = null
    });

    s4d.client.on('guildMemberRemove', async (param1) => {
        s4d.leavingMember = param1;
        s4d.client.channels.cache.get('709784256875986965').send(String((['Warum warst du nur so kurz hier', s4d.joiningMember, '?'].join(''))));
        s4d.leavingMember = null
    });

    s4d.client.on('messageCreate', async (s4dmessage) => {
        arguments2 = (s4dmessage.content).split(' ');
        command = arguments2.splice(0, 1)[0];
        if (command == '!say') {
            s4dmessage.channel.send(String('You have written the following content after !say:'));
            s4dmessage.channel.send(String((arguments2.join(' '))));
        }

    });

    s4d.client.on('messageCreate', async (s4dmessage) => {
        if (!((s4dmessage.member).user.bot)) {
            member_xp = s4d.database.get(String(('xp-' + String(s4dmessage.author.id))));
            member_level = s4d.database.get(String(('level-' + String(s4dmessage.author.id))));
            if (!member_xp) {
                member_xp = 0;
            } else if (!member_level) {
                member_level = 0;
            }
            s4d.database.set(String(('xp-' + String(s4dmessage.author.id))), (member_xp + 1));
            member_xp = member_xp + 1;
            if (member_xp > 100) {
                s4d.database.set(String(('level-' + String(s4dmessage.author.id))), (member_level + 1));
                member_level = member_level + 1;
                s4dmessage.channel.send(String((['Congratulations, ', s4dmessage.member, 'you jumped to level ', member_level, '!!'].join(''))));
            }
            if ((s4dmessage.content) == '!level') {
                s4dmessage.channel.send(String(([s4dmessage.member, ', you are currently level: ', member_level].join(''))));
            } else if ((s4dmessage.content) == '!xp') {
                s4dmessage.channel.send(String(([s4dmessage.member, ', you need ', 100 - member_xp, ' to jump to level ', member_level + 1].join(''))));
            }
        }

    });


    return s4d;
})();
