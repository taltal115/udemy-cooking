
import { sequelize } from "../models/entities/index";

export class QueryService {

    public static query(query: any): Promise<any> {
        return new Promise((resolve: Function, reject: Function) => {
            // Results will be an empty array and metadata will contain the number of affected rows.
             sequelize.query(query).spread((results, affected) => {
                return resolve({ results: results, affected: affected });
            }).catch((error: Error) => {
                return reject(error);
            });
        });
    }
}