"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const mainPath = path.resolve(__dirname + '../../../../../');
module.exports = {
    name: process.env.APP_NAME || "School Server",
    mainPath: mainPath,
    path: path.resolve(__dirname + '../../../../'),
    host: process.env.SERVER_HOST || 'localhost',
    schema: process.env.SERVER_URLSCHEMA || 'http://',
    port: process.env.SERVER_PORT || 3000,
    adminMail: 'School Desk <admin@school-desk.com>',
    // With "salt round" they actually mean the cost factor. The cost factor controls how much time is needed to calculate a single BCrypt hash. The higher the cost factor, the more hashing rounds are done. Increasing te cost factor by 1 doubles the necessary time. The more time is necessary, the more difficult is brute-forcing.
    // The salt is a random value, and should differ for each calculation, so the result should hardly ever be the same, even for equal passwords.
    // The salt is usually included in the resulting hash-string in readable form. So with storing the hash-string you also store the salt. Have a look at this answer for more details.
    saltRounds: 8,
    jwtSecret: process.env.JWT_SECRET || '27ABA98CBB33E',
    db: {
        mongo: {
            uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/school-desk',
        },
        mysql: {
            username: process.env.SQL_USERNAME || 'root',
            password: process.env.SQL_PASSWORD || 'root',
            database: process.env.SQL_DATABASE || 'school-desk',
            host: process.env.SQL_HOST || 'localhost',
            port: process.env.SQL_PORT || 3306,
            dialect: process.env.SQL_DIALECT || 'mysql',
            logging: false,
            force: true,
            timezone: process.env.SQL_TIMEZONE || '+00:00',
        }
    },
    session: {
        // 256-bit WEP Keys (https://randomkeygen.com/)
        secret: process.env.SESSION_SECRET || 'F2fsUR7bMtToYpGTGStSx5SkFXjlKSu5',
        duration: 5400,
        readonly: false,
        name: 'school-desk-system',
        resave: false,
        saveUninitialized: false,
        proxy: false //?
    },
    cors: {
        enabled: true,
        origin: process.env.CORS_ORIGIN || "*",
    },
    client: process.env.CLIENT_PATH || '../../client',
};
