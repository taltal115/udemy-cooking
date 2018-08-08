"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
class Routes {
    static init(router) {
        fs.readdirSync(__dirname)
            .map((file) => path.join(__dirname, file))
            .filter((file) => fs.statSync(file).isFile() && !(file.indexOf("index.js") > 0))
            .forEach(function (file) {
            var model = module.require(file);
            if ('init' in model) {
                model.init(router);
            }
        });
    }
}
exports.Routes = Routes;
