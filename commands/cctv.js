const { ApplicationCommandOptionType } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'cctv',
    description: 'Get CCTV IPs for a country',
    options: [
        {
            name: 'country',
            type: ApplicationCommandOptionType.String,
            description: 'The country code for CCTV IPs',
            required: true,
        },
        {
            name: 'limit',
            type: ApplicationCommandOptionType.Integer,
            description: 'The number of IP addresses to fetch (default: 20)',
            required: false,
        },
    ],
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const country = interaction.options.getString('country').toUpperCase();
            const limit = interaction.options.getInteger('limit') || 20; // Default limit is 20
            const ipAddresses = await getCCTVIps(country, limit);

            const formattedIpAddresses = ipAddresses.map((ip, index) => `${index + 1}. ${ip}`).join('\n');

            await interaction.followUp({
                content: `IP Addresses for ${country}:\n${formattedIpAddresses}`,
            });
        } catch (error) {
            console.error(error);
            await interaction.followUp({
                content: 'Failed to fetch IP addresses.',
            });
        }
    },
};

async function getCCTVIps(country, limit = 20) {
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:68.0) Gecko/20100101 Firefox/68.0',
        };

        const response = await axios.get(`http://www.insecam.org/en/bycountry/${country}`, {headers});
        const lastPage = parseInt(response.data.match(/pagenavigator\("\?page=", (\d+)/)[1]);

        const ipList = [];
        for (let page = 0; page < lastPage; page++) {
            const pageResponse = await axios.get(`http://www.insecam.org/en/bycountry/${country}/?page=${page}`, {
                headers,
            });
            const findIP = pageResponse.data.match(/http:\/\/\d+\.\d+\.\d+\.\d+(?::\d+)?/g);

            // Adding only up to the specified limit

            if (ipList.length + findIP.length <= limit) {
                ipList.push(...findIP);
            } else {
                ipList.push(...findIP.slice(0, limit - ipList.length));
                break;
            }
        }

        return ipList;
        
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch IP addresses.');
    }
}
