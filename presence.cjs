const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}!`);

  // ステータス候補
  const statuses = ['online', 'idle', 'dnd'];

  // 常に表示するアクティビティ
  const activities = [
    { name: '指名手配を登録中', type: ActivityType.Watching }, // Watching
    { name: 'Plot city', type: ActivityType.Playing }           // Playing
  ];

  // プレゼンス更新関数
  const updatePresence = () => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    client.user.setPresence({
      activities: activities,
      status: randomStatus,
    });

    console.log(`🟢 ステータス変更: status='${randomStatus}', activities=[${activities.map(a => a.name).join(', ')}]`);
  };

  // 起動時に即実行
  updatePresence();

  // 8時間ごとに変更（28800000ms）
  setInterval(updatePresence, 8 * 60 * 60 * 1000);
});

client.login('YOUR_BOT_TOKEN');