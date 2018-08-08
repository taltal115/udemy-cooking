import { Request, Response, Router, NextFunction } from "express";
import { Authorized } from "../utils/auth";
import { OrganizationService, RoleService } from "../service";

const deferred = require('deferred');

class LookupRoute {
    public static init(router: Router) {
        //const service = new OrganizationService();

        router.get("/lookups", Authorized, (req: Request, res: Response, next: NextFunction) => {
            let filter: Array<any> = new Array();

            if (req.query.filter) {
                filter = JSON.parse(req.query.filter)
            }

            let group: any = filter.find(item => item.property == "group");
            const groups = group.value.split(',');

            var promises = groups.map(async (group) => {
                const defer = deferred();
                group = group.trim();

                switch (group) {
                    case "organizations":
                    case "roles":
                        let user: any = filter.find(item => item.property == "user_id");

                        if (group === "organizations") {
                            defer.resolve(OrganizationService.lookup(user.value));
                        }
                        else if (group === "roles") {
                            defer.resolve(RoleService.lookup(user.value));
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
            });


            Promise.all(promises).then(function (data: Array<any>) {
                return res.status(200).json(
                    data.reduce((a, b) => a.concat(b), [])
                );
            });
        });

        router.get("/lookups/:group", Authorized, async (req: Request, res: Response, next: NextFunction) => {
            let group: string = req.params && req.params.group;

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
        });
    }
}
export = LookupRoute;