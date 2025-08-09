const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const { appendLog } = require('./googleSheets.cjs');
require('dotenv').config();
const fetch = require('node-fetch');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

const TOKEN = process.env.DISCORD_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const fineTable = {
  "道路交通法違反": 100000,
  "銃刀法違反": 250000,
  "窃盗罪（お金、車両、盗品）": 1000000,
  "殺人罪": 1200000,
  "ATM強盗": 1000000,
  "店舗強盗": 2000000,
  "フリーサ強盗": 3000000,
  "ブースティング（S・Aクラス）": 4000000,
  "ボブキャット強盗": 6000000,
  "客船強盗": 6000000,
  "飛行場襲撃": 8000000,
  "ユニオン強盗": 8000000,
  "アーティファクト強盗": 12000000,
  "パシフィック強盗": 20000000
};

async function setSpreadsheetConfig(guildId, spreadsheetId, sheetName) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/configs`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({ guild_id: guildId, spreadsheet_id: spreadsheetId, sheet_name: sheetName })
  });
  if (!res.ok) {
    throw new Error(`Supabase setSpreadsheetConfig error: ${res.statusText}`);
  }
}

async function getSpreadsheetConfig(guildId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/configs?guild_id=eq.${guildId}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error(`Supabase getSpreadsheetConfig error: ${res.statusText}`);
  }
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot起動完了: ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, guildId } = interaction;

  try {
    if (commandName === 'set_spreadsheet') {
      const spreadsheetId = interaction.options.getString('spreadsheet_id');
      const sheetName = interaction.options.getString('sheet_name');
      await setSpreadsheetConfig(guildId, spreadsheetId, sheetName);
      await interaction.reply({ content: `✅ このサーバーのスプレッドシートIDとシート名を設定しました。`, ephemeral: true });

    } else if (commandName === 'wanted') {
      await interaction.deferReply({ ephemeral: false });

      const config = await getSpreadsheetConfig(guildId);
      if (!config || !config.spreadsheet_id || !config.sheet_name) {
        return interaction.editReply({ content: '❌ スプレッドシートIDまたはシート名が設定されていません。まず `/set_spreadsheet` を実行してください。' });
      }

      const spreadsheetId = config.spreadsheet_id;
      const sheetName = config.sheet_name;

      const name = interaction.options.getString('名前');
      const citizenId = interaction.options.getString('市民id');
      const licensePlate = interaction.options.getString('車両ナンバー') || '未指定';

      const crimes = [];
      let totalFine = 0;
      for (let i = 1; i <= 14; i++) {
        const crime = interaction.options.getString(`罪状${i}`);
        if (crime) {
          crimes.push(crime);
          totalFine += fineTable[crime] || 0;
        }
      }

      const crimeDisplay = crimes.length ? crimes.map(c => `• ${c}`).join('\n') : '未指定';
      const fineFormatted = `${totalFine.toLocaleString()} 円`;

      const deadlineDate = new Date(Date.now() + 60 * 60 * 1000);
      const deadline = new Intl.DateTimeFormat('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(deadlineDate);

      const registeredBy = interaction.user.tag;

      const embed = new EmbedBuilder()
        .setTitle('指名手配情報')
        .setColor(0xFF6347)
        .addFields(
          { name: '名前', value: `\`\`\`${name}\`\`\``, inline: true },
          { name: '市民ID', value: `\`\`\`${citizenId}\`\`\``, inline: true },
          { name: '車両ナンバー', value: `\`\`\`${licensePlate}\`\`\``, inline: true },
          { name: '罪状', value: `\`\`\`\n${crimeDisplay}\n\`\`\``, inline: false },
          { name: '指名手配終了期限', value: `\`\`\`${deadline} まで\`\`\``, inline: true },
          { name: '罰金額合計', value: `\`\`\`${fineFormatted}\`\`\``, inline: true }
        );

      await interaction.editReply({ embeds: [embed] });

      await appendLog(spreadsheetId, sheetName, {
        name,
        citizenId,
        crimes: crimeDisplay,
        licensePlate,
        fineAmount: totalFine,
        deadline,
        registeredBy,
      });

    } else if (commandName === 'read_readmefile') {
      await interaction.reply({
        content: '📄 BotのREADMEはこちらです:\nhttps://github.com/tomeitoooooooooooooooooooooooooo/PCA-Database-pubic-ver.-/blob/main/README.md',
        ephemeral: true
      });

    } else if (commandName === 'setup_help') {
      const creds = require(`./${process.env.SPREADSHEET_KEYFILE}`);
      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle('セットアップ方法')
          .setColor(0xFF6347)
          .setDescription(
`1. Googleスプレッドシートを作成してください  
2. 「編集者」として以下のアカウントを追加してください  
\`${creds.client_email}\`  
3. このBotで \`/set_spreadsheet\` コマンドを使い、スプレッドシートIDとシート名を設定してください。`
          )]
      });

    } else if (commandName === 'help_pd') {
      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle('警察ボットヘルプ')
          .setColor(0xFF6347)
          .addFields({
            name: '使用可能コマンド',
            value: '```\n/wanted\n/set_spreadsheet\n/read_readmefile\n/setup_help\n/help_pd\n```'
          })],
        ephemeral: true
      });
    }
  } catch (error) {
    console.error('❌ エラー:', error);
    try {
      if (interaction.deferred) {
        await interaction.editReply({ content: '処理中にエラーが発生しました。' });
      } else if (!interaction.replied) {
        await interaction.reply({ content: '処理中にエラーが発生しました。', ephemeral: true });
      }
    } catch (replyError) {
      console.error('❌ 返信処理中のエラー:', replyError);
    }
  }
});

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`✅ Health check server running on port ${PORT}`));

client.login(TOKEN);
