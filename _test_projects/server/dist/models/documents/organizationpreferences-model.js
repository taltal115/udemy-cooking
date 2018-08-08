"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.OrganizationPreferenceSchema = new mongoose_1.Schema({
    organizationId: {
        type: String, unique: true, required: true, index: true
    }
}, {
    //_id: false,
    strict: false,
    collection: 'organization-preferences'
});
exports.OrganizationPreference = mongoose_1.model("OrganizationPreference", exports.OrganizationPreferenceSchema);
