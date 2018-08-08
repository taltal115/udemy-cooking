"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../models/entities/index");
class QueryService {
    static query(query) {
        return new Promise((resolve, reject) => {
            // Results will be an empty array and metadata will contain the number of affected rows.
            index_1.sequelize.query(query).spread((results, affected) => {
                return resolve({ results: results, affected: affected });
            }).catch((error) => {
                return reject(error);
            });
        });
    }
}
exports.QueryService = QueryService;
