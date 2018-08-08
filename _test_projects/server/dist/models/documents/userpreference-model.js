"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.UserPreferenceSchema = new mongoose_1.Schema({
    userId: {
        type: String, unique: true, required: true, index: true
    }
}, {
    //_id: false,
    strict: false,
    collection: 'user-preferences'
});
exports.UserPreference = mongoose_1.model("UserPreference", exports.UserPreferenceSchema);
