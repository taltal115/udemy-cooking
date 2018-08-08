"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const config = require("./config");
class Helper {
    startingPointLog() {
        console.info(chalk.green(`
--------------------------------------------------------------
Name:\t\t\t\t\t ${config.title}
Environment:\t\t\t ${process.env.NODE_ENV}
Port:\t\t\t\t\t ${config.port}
Database:\t\t\t\t ${config.db.mongo.uri}
--------------------------------------------------------------
`));
    }
    static toPager(query) {
        return {
            page: parseInt(query.page),
            start: parseInt(query.start),
            limit: parseInt(query.limit)
        };
    }
    static GUID(type = 'v1') {
        var uuid = require('node-uuid');
        switch (type) {
            case 'v4':
                return uuid.v4();
        }
        return uuid.v1();
    }
}
exports.Helper = Helper;
