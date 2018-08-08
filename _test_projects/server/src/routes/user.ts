import { Request, Response, Router } from "express";
//import { validationResult } from 'express-validator/check';
import { UserService } from "../service";
import { IUserInstance } from "../models";
//import { userRules } from './rules/user.rules';
import { Authorized } from "../utils/auth";

class UserRoute {
    public static init(router: Router) {
        const service = new UserService();

        router.get("/users", Authorized, (req: Request, res: Response) => {
            service.session = req.session;
            service.retrieve().then((users: Array<IUserInstance>) => {
                return res.status(200).json(users);
            }).catch((error: Error) => {
                return res.status(500).send(error);
            });
        });

        router.get("/users/:id", Authorized, (req: Request, res: Response) => {
            service.session = req.session;
            service.get(req.params.id).then((user: IUserInstance) => {
                if (user) {
                    return res.status(200).json(user);
                } else {
                    return res.sendStatus(404);
                }
            }).catch((error: Error) => {
                return res.status(500).json(error);
            });
        });

        router.put("/user", Authorized, (req: Request, res: Response) => {
            service.session = req.session;
            service.add(req.body).then((user: IUserInstance) => {
                var data = { "success": true, "user": user };
                res.status(200).json(data);
            }).catch((error: Error) => {
                res.status(409).json(error);
            });
        });

        router.post("/user/:id", Authorized, (req: Request, res: Response) => {
            service.session = req.session;
            service.update(req.params.id, req.body).then((user: any) => {
                var data = { "success": true, "user": user };
                res.status(200).json(data);
            }).catch((error: Error) => {
                res.status(409).json(error);
            });
        });

        router.delete("/user/:id", Authorized, (req: Request, res: Response) => {
            service.session = req.session;
            service.delete(req.params.id).then(() => {
                return res.status(200).json({ success: true });
            }).catch((error: Error) => {
                return res.status(500).json(error);
            });
        });
    }
}
export = UserRoute;