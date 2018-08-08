import { NextFunction, Request, Response, Router } from "express";
// import { Authorized } from "../utils/auth";

class TicketsRoute {
    public static init(router: Router) {

        router.post("/tickets", async (req: Request, res: Response, next: NextFunction) => {
            console.log("tal" ,req.body);
            res.json({
                name: 'tal',
                ...req.body
            });
        });

    }
}
export = TicketsRoute;