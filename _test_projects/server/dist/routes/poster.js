"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const service_1 = require("../service");
const auth_1 = require("../utils/auth");
class PosteRoute {
    static init(router) {
        const service = new service_1.PostersService();
        router.get("/posters", auth_1.Authorized, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let query = {
                page: parseInt(req.query.page),
                start: parseInt(req.query.start),
                limit: parseInt(req.query.limit),
                id: parseInt(req.params.id)
            };
            service.session = req.session;
            const data = yield service.get(query);
            res.json(data);
        }));
        router.post("/posters/:action", auth_1.Authorized, (req, res, next) => {
            let action = req.params && req.params.action;
            switch (action) {
                case "create":
                case "update":
                case "delete":
                    res.send(`${action} posters`);
            }
        });
        router.get("/posters/:id", auth_1.Authorized, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let query = {
                page: parseInt(req.query.page),
                start: parseInt(req.query.start),
                limit: parseInt(req.query.limit),
                id: parseInt(req.params.id)
            };
            service.session = req.session;
            const data = yield service.get(query);
            res.json(data);
        }));
    }
}
module.exports = PosteRoute;
