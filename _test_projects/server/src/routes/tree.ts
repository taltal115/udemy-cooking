import { NextFunction, Request, Response, Router } from "express";
import { TreeService, BaseService } from "../service";
import { Authorized } from "../utils/auth";
import { IAuthAttributes } from "../models";

const util = require('util');

class TreeRoute {
    public static init(router: Router) {
        const service: any = new TreeService();

        router.get("/tree", Authorized, async (req: Request, res: Response, next: NextFunction) => {
            service.session = req.session;
            let tree = await service.getTree();
            res.json(tree);
        });

        router.post("/tree-item/:action", Authorized, async (req: Request, res: Response, next: NextFunction) => {
            let model = req.body;
            let params = req.params;
            let result = {};
            let auth: IAuthAttributes = BaseService.parseAuth(req.session);

            if (params && params.action) {
                switch (params.action) {
                    case "add":
                        result = await service.addItem(model, auth);
                        break;
                    case "rename":
                        result = await service.renameItem(model, auth);
                        break;
                    case "delete":
                        result = await service.deleteItem(model, auth);
                        break;
                    case "attach-asset":
                        result = await service.attachAsset(model, auth);
                        break;
                    default:
                        console.log(util.format('unrecvognize action: %s', params.action))
                }
            }
            else {
                console.log("action didn't provided")
            }

            res.json(result);
        });
    }
}
export = TreeRoute;