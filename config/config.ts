import dotenv from 'dotenv';

dotenv.config();

export default {
    db_config: {
        host: '127.0.0.1',
        user: 'son-bot',
        port: 3306,
        password: process.env.MYSQL_PASSWORD,
        database: 'SonBot'
    }
};