/**
 *
 * @param {import('../Ene')} client
 */
module.exports = async (client) => {
  console.log('Bot operational sir.');

  client.guilds.cache.forEach(v => {
    if (!client.guilds_info[v.id]) {
      console.log(`Adding server to guilds information ${v.name}`);
      client.guilds_info[v.id] = {}
    }
  });
}