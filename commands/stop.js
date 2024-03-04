const {GuildMember} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");

module.exports = {
    name: 'stop',
    description: 'Stop all songs in the queue!',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.currentTrack)
            return void interaction.followUp({
                content: '❌ | Lu Ga Muter Music Dek!',
            });
        queue.node.stop()
        return void interaction.followUp({content: '🛑 | Dah Gw Matiin Music Nya!'});
    },
};
