"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
exports.AssetsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        es_indexed: true
    },
    orgId: {
        type: String,
        es_indexed: true
    },
    categories: {
        type: [String],
        es_indexed: true
    },
    genres: {
        type: [String],
        es_indexed: true
    },
    tags: {
        type: [String],
        es_indexed: true
    },
    fileUuid: {
        type: String
    }
}, {
    timestamps: true,
    strict: false
});
exports.AssetsSchema.plugin(mongoosePaginate);
exports.Asset = mongoose_1.model("Asset", exports.AssetsSchema);
