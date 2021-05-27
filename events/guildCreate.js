/**
 *
 * @param {import('../Ene')} client
 */
module.exports = async (client, guild) => {
  if (!client.guilds_info[guild.id]) {
    console.log(`Adding server to guilds information ${guild.name}`);
    client.guilds_info[guild.id] = {}
  }
}