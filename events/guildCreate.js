/**
 * 
 * @param {import('../Ene')} client 
 */
 module.exports = async (client, guild) => {
    if (!client.guilds_info[v.id]) {
        console.log(`Adding server to guilds information ${v.name}`);
        client.guilds_info[v.id] = {}
    }
}