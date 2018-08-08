import { Request, Response, Router } from "express";
import { OrganizationService } from "../service";
import { IOrganizationInstance } from "../models";
import { Authorized } from "../utils/auth";

class OrganiztionRoute {
    public static init(router: Router) {
        const service = new OrganizationService();

        router.get("/organizations", Authorized, (req: Request, res: Response) => {
            service.session = req.session;
            service.retrieve().then((orgs: Array<IOrganizationInstance>) => {
                return res.send(orgs);
            }).catch((error: Error) => {
                return res.status(500).send(error);
            });
        });

        router.get("/organization/:id", Authorized, (req: Request, res: Response) => {
            service.session = req.session;
            service.get(req.params.id).then((org: IOrganizationInstance) => {
                if (org) {
                    return res.send(org);
                } else {
                    return res.sendStatus(404);
                }
            }).catch((error: Error) => {
                return res.status(500).send(error);
            });
        });

        router.put("/organization", Authorized, async (req: Request, res: Response) => {
            service.session = req.session;
            var body = req.body;
            await service.add(body).then((organization: IOrganizationInstance) => {
                res.status(200).send({ success: true, item: organization });
            }).catch((error: Error) => {
                return res.status(409).send({ success: false, error: error });
            });

        });

        router.post("/organization/:id", Authorized, (req: Request, res: Response) => {
            service.session = req.session;
            service.update(req.params.id, req.body).then((data: any) => {
                return res.status(200).send({ success: true });
            }).catch((error: Error) => {
                return res.status(409).send(error);
            });
        });

        router.delete("/organization/:id", Authorized, async (req: Request, res: Response) => {
            service.session = req.session;
            const id = req.params.id;
            service.delete(id).then(() => {
                return res.status(200).send({ success: true });
            }).catch((error: Error) => {
                return res.status(500).send(error);
            });
        });
    }
}
export = OrganiztionRoute;