import { Router } from "express";

var fs = require("fs");
var path = require("path");

export class Routes {
    public static init(router: Router) {
        fs.readdirSync(__dirname)
            .map((file: string) => path.join(__dirname, file))
            .filter((file: string) => fs.statSync(file).isFile() && !(file.indexOf("index.js") > 0))
            .forEach(function (file: string) {
                var model = module.require(file);
                if ('init' in model) {
                    model.init(router);
                }
            });
    }
}