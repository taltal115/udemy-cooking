"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const auth_1 = require("../utils/auth");
const service_1 = require("../service");
const deferred = require('deferred');
class LookupRoute {
    static init(router) {
        //const service = new OrganizationService();
        router.get("/lookups", auth_1.Authorized, (req, res, next) => {
            let filter = new Array();
            if (req.query.filter) {
                filter = JSON.parse(req.query.filter);
            }
            let group = filter.find(item => item.property == "group");
            const groups = group.value.split(',');
            var promises = groups.map((group) => __awaiter(this, void 0, void 0, function* () {
                const defer = deferred();
                group = group.trim();
                switch (group) {
                    case "organizations":
                    case "roles":
                        let user = filter.find(item => item.property == "user_id");
                        if (group === "organizations") {
                            defer.resolve(service_1.OrganizationService.lookup(user.value));
                        }
                        else if (group === "roles") {
                            defer.resolve(service_1.RoleService.lookup(user.value));
                        }
                    case "category":
                        defer.resolve([
                            { group: "category", value: "Commercial" },
                            { group: "category", value: "Movie" },
                            { group: "category", value: "News" },
                            { group: "category", value: "Series" },
                            { group: "category", value: "Show" },
                            { group: "category", value: "Sports" }
                        ]);
                    case "genre":
                        defer.resolve([
                            { group: "genre", value: "Action" },
                            { group: "genre", value: "Animation" },
                            { group: "genre", value: "Comedy" },
                            { group: "genre", value: "Drama" },
                            { group: "genre", value: "Fantasy" },
                            { group: "genre", value: "Historical" },
                            { group: "genre", value: "Horror" },
                            { group: "genre", value: "Music" },
                            { group: "genre", value: "Romance" },
                            { group: "genre", value: "Science Fiction" }
                        ]);
                    default:
                        defer.resolve([]);
                }
                return defer.promise;
            }));
            Promise.all(promises).then(function (data) {
                return res.status(200).json(data.reduce((a, b) => a.concat(b), []));
            });
        });
        router.get("/lookups/:group", auth_1.Authorized, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let group = req.params && req.params.group;
            switch (group) {
                case "organizations":
                    break;
                case "roles":
                    break;
                case "system-settings":
                    break;
                default:
                    res.status(500).redirect('/#unknown');
                    break;
            }
        }));
    }
}
module.exports = LookupRoute;
