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
class OrganiztionRoute {
    static init(router) {
        const service = new service_1.OrganizationService();
        router.get("/organizations", auth_1.Authorized, (req, res) => {
            service.session = req.session;
            service.retrieve().then((orgs) => {
                return res.send(orgs);
            }).catch((error) => {
                return res.status(500).send(error);
            });
        });
        router.get("/organization/:id", auth_1.Authorized, (req, res) => {
            service.session = req.session;
            service.get(req.params.id).then((org) => {
                if (org) {
                    return res.send(org);
                }
                else {
                    return res.sendStatus(404);
                }
            }).catch((error) => {
                return res.status(500).send(error);
            });
        });
        router.put("/organization", auth_1.Authorized, (req, res) => __awaiter(this, void 0, void 0, function* () {
            service.session = req.session;
            var body = req.body;
            yield service.add(body).then((organization) => {
                res.status(200).send({ success: true, item: organization });
            }).catch((error) => {
                return res.status(409).send({ success: false, error: error });
            });
        }));
        router.post("/organization/:id", auth_1.Authorized, (req, res) => {
            service.session = req.session;
            service.update(req.params.id, req.body).then((data) => {
                return res.status(200).send({ success: true });
            }).catch((error) => {
                return res.status(409).send(error);
            });
        });
        router.delete("/organization/:id", auth_1.Authorized, (req, res) => __awaiter(this, void 0, void 0, function* () {
            service.session = req.session;
            const id = req.params.id;
            service.delete(id).then(() => {
                return res.status(200).send({ success: true });
            }).catch((error) => {
                return res.status(500).send(error);
            });
        }));
    }
}
module.exports = OrganiztionRoute;
