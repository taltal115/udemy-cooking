"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
class Auth {
    get auth() {
        return this._auth;
    }
    set auth(auth) {
        this._auth = auth;
    }
    get session() {
        return this._session;
    }
    set session(session) {
        this._auth = {
            user_id: session.u_id,
            org_id: session.o_id,
            role: session.role
        };
        this._session = session;
    }
    is(role) {
        switch (role) {
            case enums_1.Roles.Super:
                return this.auth.role == enums_1.Roles.Super;
            case enums_1.Roles.Admin:
                return this.auth.role == enums_1.Roles.Admin;
        }
    }
}
exports.Auth = Auth;
