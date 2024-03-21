const axios = require('axios');
const {GuildMember, ApplicationCommandOptionType} = require('discord.js');

async function getRandomKanjiAndReading(mode) {
    try {
        let modeKanji = '';

        if (mode == 'on_readings') {
            modeKanji = 'onyomi';
        } else if (mode == 'kun_readings') {
            modeKanji = 'kunyomi';
        } else {
            modeKanji = 'tidak diketahui';
        }

        const kanjiList = [
            '一',
            '七',
            '三',
            '上',
            '下',
            '中',
            '九',
            '二',
            '五',
            '人',
            '休',
            '先',
            '入',
            '八',
            '六',
            '円',
            '出',
            '力',
            '十',
            '千',
            '口',
            '右',
            '名',
            '四',
            '土',
            '夕',
            '大',
            '天',
            '女',
            '子',
            '字',
            '学',
            '小',
            '山',
            '川',
            '左',
            '年',
            '手',
            '文',
            '日',
            '早',
            '月',
            '木',
            '本',
            '村',
            '林',
            '校',
            '森',
            '正',
            '気',
            '水',
            '火',
            '犬',
            '玉',
            '王',
            '生',
            '田',
            '男',
            '町',
            '白',
            '百',
            '目',
            '石',
            '空',
            '立',
            '竹',
            '糸',
            '耳',
            '花',
            '草',
            '虫',
            '見',
            '貝',
            '赤',
            '足',
            '車',
            '金',
            '雨',
            '青',
            '音',
        ];
        // Pilih kanji secara acak dari daftar kanji
        const randomIndex = Math.floor(Math.random() * kanjiList.length);
        const randomKanji = kanjiList[randomIndex];

        console.log(randomKanji);

        // Panggil API untuk mendapatkan cara membaca Kanji
        const kanjiReadingResponse = await axios.get(`https://kanjiapi.dev/v1/kanji/${randomKanji}`);

        if (kanjiReadingResponse) {
            // console.log(kanjiReadingResponse);
            let jawaban = [];
            if (mode == 'kun_readings') {
                jawaban = kanjiReadingResponse.data.kun_readings;
            } else if (mode == 'on_readings') {
                jawaban = kanjiReadingResponse.data.on_readings;
            }
            return {kanji: randomKanji, jawaban, modeKanji};
        } else {
            throw new Error('Invalid API response structure for Kanji reading');
        }
    } catch (error) {
        console.error('Error fetching random Kanji and reading:', error.message);
        return {kanji: '無', kunyomi: 'Unknown'};
    }
}

module.exports = {
    name: 'play_kanji',
    description: 'Start a Kanji guessing game',
    options: [
        {
            name: 'mode',
            type: ApplicationCommandOptionType.String,
            description: 'cara baca',
            required: true,
            choices: [
                {
                    name: 'kunyomi',
                    value: 'kun_readings',
                },
                {
                    name: 'onyomi',
                    value: 'on_readings',
                },
            ],
        },
    ],
    async execute(interaction) {
        if (!interaction) return;

        await interaction.deferReply();

        try {
            const mode = interaction.options.getString('mode');

            console.log(mode);

            const {kanji, jawaban, modeKanji} = await getRandomKanjiAndReading(mode);

            console.log(jawaban);

            // Send the Kanji to the user
            await interaction.followUp(`Kanji: ${kanji}`);

            // Ask all users to guess the reading
            await interaction.followUp(`apa ${modeKanji} dari kanji tersebut ?`);

            // Await all users' responses
            const collector = interaction.channel.createMessageCollector({time: 30000});

            let answered = false;

            collector.on('collect', async message => {
                if (!answered) {
                    const userAnswer = message.content.trim();
                    let responseMessage = '';

                    switch (true) {
                        case jawaban.includes(userAnswer):
                            responseMessage = `✅ | Benar  ${modeKanji} ${kanji} adalah ${jawaban}.`;
                            answered = true; // Set variabel answered menjadi true hanya jika jawaban benar
                            break;
                        default:
                            responseMessage = `❌ | Salah. ${modeKanji} Yang Benar ${kanji} adalah ${jawaban}.`;
                            break;
                    }

                    await interaction.followUp(responseMessage);
                    collector.stop();
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0 && !answered) {
                    interaction.followUp('⏱ | Waktu Habis');
                }
            });
        } catch (error) {
            console.error('Error during Kanji game:', error.message);
            await interaction.followUp(`Error during Kanji game: ${error.message}`);
        }
    },
};
