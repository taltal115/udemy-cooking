import { NextFunction, Request, Response, Router } from "express";
import { PostersService } from "../service";
import { Authorized } from "../utils/auth";

class PosteRoute {
    public static init(router: Router) {
        const service = new PostersService();

        router.get("/posters", Authorized, async (req: Request, res: Response, next: NextFunction) => {
            let query: any = {
                page: parseInt(req.query.page),
                start: parseInt(req.query.start),
                limit: parseInt(req.query.limit),
                id: parseInt(req.params.id)
            }
            
            service.session = req.session;
            const data = await service.get(query);
            res.json(data);
        });

        router.post("/posters/:action", Authorized, (req: Request, res: Response, next: NextFunction) => {
            let action: string = req.params && req.params.action;
            switch (action) {
                case "create":
                case "update":
                case "delete":
                    res.send(`${action} posters`);
            }
        });

        router.get("/posters/:id", Authorized, async (req: Request, res: Response, next: NextFunction) => {
            let query: any = {
                page: parseInt(req.query.page),
                start: parseInt(req.query.start),
                limit: parseInt(req.query.limit),
                id: parseInt(req.params.id)
            }

            service.session = req.session;
            const data = await service.get(query);
            res.json(data);
        });
    }
}
export = PosteRoute;