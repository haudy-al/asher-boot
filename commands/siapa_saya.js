const fs = require('fs');

module.exports = {
    name: 'siapa_saya',
    description: 'siapa saya',
    execute(interaction) {
        let str = 'Anda Adalah Bocah Bau Tai';
        

        return void interaction.reply({
            content: str,
            ephemeral: true,
        });
    },
};
