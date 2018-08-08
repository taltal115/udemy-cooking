import { NextFunction, Request, Response, Router } from "express";
import { HomeService } from "../service";
import { Authorized } from "../utils/auth";

class HomeRoute {
    public static init(router: Router) {
        const service: any = new HomeService();

        router.get("/file-tree", Authorized, async (req: Request, res: Response, next: NextFunction) => {
            const data = await service.tree();
            res.json(data);
        });

        router.post("/user-init", Authorized, async (req: Request, res: Response, next: NextFunction) => {
            var model = req.body;
            let result = await service.userInit(model);
            res.json(result);
        });
    }
}
export = HomeRoute;