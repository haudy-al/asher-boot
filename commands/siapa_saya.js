const fs = require('fs');

module.exports = {
    name: 'siapa_saya',
    description: 'siapa saya',
    async execute(interaction) {
        const kataKataAcak = ['Bocah Bau Tai', 'Anjing', 'Bocah Belum Mandi', 'siluman bebek', 'peju buangan', 'sampah masyaraat', 'orang gila'];
    
        const kataAcak = kataKataAcak[Math.floor(Math.random() * kataKataAcak.length)];
    
        const hasilAkhir = `Anda Adalah ${kataAcak}`;
    
        await interaction.deferReply();
    
        return void interaction.followUp({ content: hasilAkhir });
    },
    
};
