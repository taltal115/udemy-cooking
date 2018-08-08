import * as cls from "continuation-local-storage";
import * as fs from "fs";
import * as path from "path";
import * as SequelizeStatic from "sequelize";
import { Sequelize } from "sequelize";

const config = require('../../utils/config');

import { IUserAttributes, IUserInstance } from "./interfaces/user-interface";
import { IOrganizationAttributes, IOrganizationInstance } from "./interfaces/organization-interface";

export interface SequelizeModels {
  User: SequelizeStatic.Model<IUserAttributes, IUserInstance>;
  Organization: SequelizeStatic.Model<IOrganizationAttributes, IOrganizationInstance>;
  Role;
  UserOrganization;
}

class Database {
  private _basename: string;
  private _models: SequelizeModels;
  private _sequelize: Sequelize;
  private _namespace: cls.Namespace;

  constructor() {
    this._basename = path.basename(module.filename);
    let dbConfig = config.db.mysql;

    if (dbConfig.logging) {
      dbConfig.logging = console.info;
    }

    this._namespace = cls.createNamespace('ditve-transaction')

    //(SequelizeStatic as any).cls = cls.createNamespace("ditve-transaction");
    SequelizeStatic.useCLS(this._namespace);

    this._sequelize = new SequelizeStatic(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
    this._models = ({} as any);

    fs.readdirSync(__dirname).filter((file: string) => {
      return (file !== this._basename) && (file !== "interfaces");
    }).forEach((file: string) => {
      let model = this._sequelize.import(path.join(__dirname, file));
      this._models[(model as any).name] = model;
    });

    Object.keys(this._models).forEach((modelName: string) => {
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
export const models = database.getModels();
export const sequelize = database.getSequelize();
