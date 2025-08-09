require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('discord.js');

const { DISCORD_TOKEN, CLIENT_ID } = process.env;

const crimeChoices = [
  { name: "道路交通法違反", value: "道路交通法違反" },
  { name: "銃刀法違反", value: "銃刀法違反" },
  { name: "窃盗罪（お金、車両、盗品）", value: "窃盗罪（お金、車両、盗品）" },
  { name: "殺人罪", value: "殺人罪" },
  { name: "ATM強盗", value: "ATM強盗" },
  { name: "店舗強盗", value: "店舗強盗" },
  { name: "フリーサ強盗", value: "フリーサ強盗" },
  { name: "ブースティング（S・Aクラス）", value: "ブースティング（S・Aクラス）" },
  { name: "ボブキャット強盗", value: "ボブキャット強盗" },
  { name: "客船強盗", value: "客船強盗" },
  { name: "飛行場襲撃", value: "飛行場襲撃" },
  { name: "ユニオン強盗", value: "ユニオン強盗" },
  { name: "アーティファクト強盗", value: "アーティファクト強盗" },
  { name: "パシフィック強盗", value: "パシフィック強盗" }
];

const wantedCommand = new SlashCommandBuilder()
  .setName('wanted')
  .setDescription('指名手配情報を登録します。')
  .addStringOption(option =>
    option.setName('名前').setDescription('指名手配者の名前').setRequired(true))
  .addStringOption(option =>
    option.setName('市民id').setDescription('市民ID').setRequired(true))
  .addStringOption(option =>
    option.setName('車両ナンバー').setDescription('車両ナンバープレート').setRequired(false));

for (let i = 1; i <= 14; i++) {
  wantedCommand.addStringOption(option =>
    option.setName(`罪状${i}`)
      .setDescription(`罪状を選択（${i}個目）`)
      .addChoices(...crimeChoices)
      .setRequired(false));
}

const setSpreadsheetCommand = new SlashCommandBuilder()
  .setName('set_spreadsheet')
  .setDescription('スプレッドシートIDとシート名を設定します（サーバーごと）')
  .addStringOption(option =>
    option.setName('spreadsheet_id').setDescription('GoogleスプレッドシートID').setRequired(true))
  .addStringOption(option =>
    option.setName('sheet_name').setDescription('スプレッドシートのシート名').setRequired(true));

const setupHelpCommand = new SlashCommandBuilder()
  .setName('setup_help')
  .setDescription('セットアップ方法を表示します');

const helpCommand = new SlashCommandBuilder()
  .setName('help_pd')
  .setDescription('警察向けコマンド一覧を表示');

const readReadmeCommand = new SlashCommandBuilder()
  .setName('read_readmefile')
  .setDescription('READMEファイルのリンクを表示します。');

const commands = [
  wantedCommand,
  setSpreadsheetCommand,
  setupHelpCommand,
  helpCommand,
  readReadmeCommand
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('スラッシュコマンド登録中...');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('✅ 登録完了！');
  } catch (error) {
    console.error('❌ 登録エラー:', error);
  }
})();
