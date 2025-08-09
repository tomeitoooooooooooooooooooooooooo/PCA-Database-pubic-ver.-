client.once('ready', () => {
  client.user.setPresence({
    activities: [{ name: '指名手配', type: 0 }], 
    status: 'online',
  });
  console.log(`Logged in as ${client.user.tag}!`);
});
