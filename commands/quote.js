const axios = require('axios');

async function getMotivationalQuote() {
    try {
        const response = await axios.get('https://zenquotes.io/api/random');

        if (response.data && Array.isArray(response.data) && response.data.length > 0 && response.data[0].q && response.data[0].a) {
            const quote = response.data[0].q;
            const author = response.data[0].a;
            return { quote, author };
        } else {
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Error fetching motivational quote:', error.message);
        return { quote: 'Tidak dapat mendapatkan kutipan motivasi saat ini.', author: 'Unknown' };
    }
}

module.exports = {
    name: 'quote',
    description: 'motivational quote',
    async execute(interaction) {
        await interaction.deferReply();
        const { quote, author } = await getMotivationalQuote();

        return void interaction.followUp({
            embeds: [
                {
                    title: `Quote by ${author}`,
                    description: `${quote}`,
                }
            ]
        });
    },
};
