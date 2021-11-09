let dbOption
// local db
// dbOption = {
//     connectionsLimit: 10,
//     host: 'localhost',
//     user: 'root',
//     password: 'Qq120128',
//     port: '3306',
//     database: 'xd_blog'
// }

// db on server: xd_blog
dbOption = {
    connectionsLimit: 10,
    host: '172.16.133.129',
    user: 'root',
    password: 'Qq120128',
    port: '3306',
    database: 'xd_blog'
}

module.exports = dbOption