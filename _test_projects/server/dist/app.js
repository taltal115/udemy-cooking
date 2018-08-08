"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
// import * as passport from "passport";
const errorHandler = require("errorhandler");
const mongoose = require("mongoose");
// import * as session from 'express-session';
const index_1 = require("./routes/index");
// import { sequelize } from "./models/entities/index";
// import passport from "passport";
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./utils/config');
/**
 * The server.
 *
 * @class Server
 */
class Server {
    //private router: express.Router = express.Router();
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        this.app = express();
        //configure application
        this.config();
        //add api
        this.db();
        //add api
        this.api();
        //add routes
        this.routes();
    }
    db() {
        return __awaiter(this, void 0, void 0, function* () {
            let conf = config.db;
            mongoose.connect(conf.mongo.uri);
            // await sequelize.sync().then(() => {
            //   console.log('sequelize success');
            // }).catch((error: Error) => {
            //   console.log('sequelize failed');
            // });
            //mongoose.Promise = global.Promise;
            mongoose.connection
                .on('error', console.error.bind(console, 'connection error:'));
            //.once('open', () => console.log('mongoose Connection Succeeded.'));
        });
    }
    api() {
        //empty for now
        //console.log('MONGODB_URI', process.env.MONGODB_URI);
        //console.log('SESSION_SECRET', process.env.SESSION_SECRET);
        //console.log('MONGOLAB_URI', process.env.MONGOLAB_URI);
    }
    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        let client = path.resolve(__dirname, config.client);
        //client = client + '/build/production/MAM';
        this.app.use(express.static(client));
        if (config.cors && config.cors.enabled) {
            console.log("config.cors: ", config.cors);
            this.app.use(cors(config.cors));
        }
        // catch 404 and forward to error handler
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        //error handling
        this.app.use(errorHandler());
    }
    /**
     * initiate application routes.
     *
     * @class Server
     * @method routes
     * @return void
     */
    routes() {
        let router = express.Router();
        index_1.Routes.init(router);
        this.app.use(router);
    }
}
module.exports = new Server();
