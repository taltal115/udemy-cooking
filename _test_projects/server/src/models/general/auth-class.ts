import { Roles } from "../enums";

export interface IAuthAttributes {
	user_id: string,
	org_id?: string,
	role: Roles
}


export class Auth {	
	private _auth: IAuthAttributes;
	get auth(): IAuthAttributes {
		return this._auth;
	}

	set auth(auth: IAuthAttributes) {
		this._auth = auth;
	}

	private _session: any;
	get session(): any {
		return this._session;
	}

	set session(session: any) {
		this._auth = {
			user_id: session.u_id,
			org_id: session.o_id,
			role: session.role
		};
		this._session = session;
	}
	
	public is(role: Roles) {
		switch (role) {
			case Roles.Super:
				return this.auth.role == Roles.Super;
			case Roles.Admin:
				return this.auth.role == Roles.Admin;
		}
	}
}
