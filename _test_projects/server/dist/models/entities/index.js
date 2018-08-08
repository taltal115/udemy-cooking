"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cls = require("continuation-local-storage");
const fs = require("fs");
const path = require("path");
const SequelizeStatic = require("sequelize");
const config = require('../../utils/config');
class Database {
    constructor() {
        this._basename = path.basename(module.filename);
        let dbConfig = config.db.mysql;
        if (dbConfig.logging) {
            dbConfig.logging = console.info;
        }
        this._namespace = cls.createNamespace('ditve-transaction');
        //(SequelizeStatic as any).cls = cls.createNamespace("ditve-transaction");
        SequelizeStatic.useCLS(this._namespace);
        this._sequelize = new SequelizeStatic(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
        this._models = {};
        fs.readdirSync(__dirname).filter((file) => {
            return (file !== this._basename) && (file !== "interfaces");
        }).forEach((file) => {
            let model = this._sequelize.import(path.join(__dirname, file));
            this._models[model.name] = model;
        });
        Object.keys(this._models).forEach((modelName) => {
            if (typeof this._models[modelName].associate === "function") {
                this._models[modelName].associate(this._models);
            }
        });
    }
    getModels() {
        return this._models;
    }
    getSequelize() {
        return this._sequelize;
    }
}
const database = new Database();
exports.models = database.getModels();
exports.sequelize = database.getSequelize();
