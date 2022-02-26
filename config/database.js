module.exports = {
    development: {
        username: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_DATABASE,
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        dialect: process.env.DEV_DB_CONNECTION,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    },
    test: {
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASSWORD,
        database: process.env.TEST_DB_DATABASE,
        host: process.env.TEST_DB_HOST,
        port: process.env.TEST_DB_PORT,
        dialect: process.env.TEST_DB_CONNECTION,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_CONNECTION,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    },
}
