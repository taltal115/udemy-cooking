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
class HomeRoute {
    static init(router) {
        const service = new service_1.HomeService();
        router.get("/file-tree", auth_1.Authorized, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const data = yield service.tree();
            res.json(data);
        }));
        router.post("/user-init", auth_1.Authorized, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var model = req.body;
            let result = yield service.userInit(model);
            res.json(result);
        }));
    }
}
module.exports = HomeRoute;
