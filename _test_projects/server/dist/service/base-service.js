"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseService {
    static parseAuth(session) {
        return {
            user_id: session.u_id,
            org_id: session.o_id,
            role: session.role
        };
    }
}
exports.BaseService = BaseService;
