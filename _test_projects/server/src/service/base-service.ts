import { IAuthAttributes } from "../models";

export class BaseService {
    public static parseAuth(session: any): IAuthAttributes {
        return {
            user_id: session.u_id,
            org_id: session.o_id,
            role: session.role
        }
    }
}