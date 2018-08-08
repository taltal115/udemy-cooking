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
const util = require('util');
class TreeRoute {
    static init(router) {
        const service = new service_1.TreeService();
        router.get("/tree", auth_1.Authorized, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            service.session = req.session;
            let tree = yield service.getTree();
            res.json(tree);
        }));
        router.post("/tree-item/:action", auth_1.Authorized, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let model = req.body;
            let params = req.params;
            let result = {};
            let auth = service_1.BaseService.parseAuth(req.session);
            if (params && params.action) {
                switch (params.action) {
                    case "add":
                        result = yield service.addItem(model, auth);
                        break;
                    case "rename":
                        result = yield service.renameItem(model, auth);
                        break;
                    case "delete":
                        result = yield service.deleteItem(model, auth);
                        break;
                    case "attach-asset":
                        result = yield service.attachAsset(model, auth);
                        break;
                    default:
                        console.log(util.format('unrecvognize action: %s', params.action));
                }
            }
            else {
                console.log("action didn't provided");
            }
            res.json(result);
        }));
    }
}
module.exports = TreeRoute;
