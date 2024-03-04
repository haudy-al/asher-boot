const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");

module.exports = {
    name: 'resume',
    description: 'Resume current song!',
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
        const success = queue.node.resume()
        return void interaction.followUp({
            content: success ? '▶ | Resumed!' : '❌ | Something went wrong!',
        });
    },
};
