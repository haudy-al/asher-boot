const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'sapa',
    description: 'sapa orang',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user you want to get info about',
            required: true,
        },
    ],

    async execute(interaction, client) {
        const imagePath = './assets/images/hallo1.gif';

        const user = interaction.options.getUser('user');
        
        await interaction.deferReply();
        
        return void interaction.followUp({ content: `hallo ${user}`, files: [imagePath] });
    },
};
