client.once('ready', () => {
  client.user.setPresence({
    activities: [{ name: '指名手配を登録中', type: 3 }], // Watching 指名手配を登録中
    status: 'online',
  });
  console.log(`Logged in as ${client.user.tag}!`);
});
