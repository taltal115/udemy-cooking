import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
// import * as passport from "passport";
import * as errorHandler from "errorhandler";
import * as mongoose from 'mongoose';
// import * as session from 'express-session';
import { Routes } from './routes/index';
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

  private app: express.Application = express();
  //private router: express.Router = express.Router();
  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //configure application
    this.config();

    //add api
    this.db();

    //add api
    this.api();

    //add routes
    this.routes();
  }

  private async db() {
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
  }

  private api() {
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
  private config() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    let client = path.resolve(__dirname, config.client);
    //client = client + '/build/production/MAM';
    this.app.use(express.static(client));

    if (config.cors && config.cors.enabled) {
        console.log("config.cors: ",config.cors);
      this.app.use(cors(config.cors));
    }


    // catch 404 and forward to error handler
    this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
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
  private routes() {
    let router: express.Router = express.Router();
    Routes.init(router);
    this.app.use(router);
  }
}

export = new Server();