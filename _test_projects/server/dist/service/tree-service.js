"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const documents_1 = require("../models/documents");
const _1 = require("../models/");
const enums_1 = require("../models/enums");
const deferred = require('deferred');
class TreeService extends _1.Auth {
    _genItem(model) {
        const item = new documents_1.TreeItem(model);
        return item;
    }
    getTree() {
        const defer = deferred();
        documents_1.UserPreference.findOne({ userId: this.auth.user_id }).select({
            favorites: 1,
            privates: 1,
            searches: 1
        }).exec((err, data) => {
            let tree = new Array();
            // if (err) {
            //     defer.resolve(tree);
            // };
            tree.push({ parentId: null, id: 1, text: 'Assets', type: 'favorite', iconCls: 'x-fa fa-film', href: '#assets', leaf: true });
            if (data) {
                var arr = [];
                var favorites = data.getValue('favorites');
                if (favorites && favorites.length > 0) {
                    arr = arr.concat(favorites.map((item) => {
                        item.href = '#assets/' + item.id;
                        item.iconCls = 'x-fa fa-file-video-o';
                        return item;
                    }));
                }
                var privates = data.getValue('privates');
                if (privates && privates.length > 0) {
                    tree.push({ parentId: null, id: 2, text: 'Work Items', type: 'private', visible: false, iconCls: 'x-fa fa-gears', href: '#privates', leaf: true });
                    // var _private = tree.find(item => item.type == 'private');
                    // if (_private) {
                    //     _private.visible = true;
                    // }
                }
                var searches = data.getValue('searches');
                if (searches && searches.length > 0) {
                    // var _search = tree.find(item => item.type == 'search');
                    // if (_search) {
                    //     _search.visible = true;
                    tree.push({ parentId: null, id: 3, text: 'Saved Searches', type: 'search', visible: false, iconCls: 'x-fa fa-search', leaf: true });
                    arr = arr.concat(searches.map((item) => {
                        item.iconCls = 'x-fa fa-file-text-o';
                        return item;
                    }));
                    // }
                }
                if (arr.length > 0) {
                    tree = tree.concat(arr.map((item) => {
                        return documents_1.TreeItemViewModel.generate(item);
                    }));
                }
            }
            if (this.is(enums_1.Roles.Super) || this.is(enums_1.Roles.Admin)) {
                tree = tree.concat([
                    //{ parentId: null, text: 'Recent Activities', iconCls: 'x-fa fa-clock-o', href: '#recent', leaf: true },
                    //{ parentId: null, text: 'Support Request', iconCls: 'x-fa fa-ticket', href: '#support', leaf: true },
                    //{ parentId: null, text: 'Running Jobs', iconCls: 'x-fa fa-tasks', href: '#running-jobs', leaf: true },
                    { parentId: null, id: 4, text: 'Settings', iconCls: 'x-fa fa-wrench' },
                    //{ parentId: 4, text: 'Sharing', iconCls: 'x-fa fa-share-alt', href: '#sharing', leaf: true },
                    //{ parentId: 4, text: 'Notifications', href: '#notifications', iconCls: 'x-fa fa-flag', leaf: true },
                    //{ parentId: 4, text: 'Network', href: '#network', iconCls: 'x-fa fa-signal', leaf: true },
                    //{ parentId: 4, text: 'System Settings', href: '#system-settings', iconCls: 'x-fa fa-gear', leaf: true },
                    { parentId: 4, text: 'Organizations', iconCls: 'x-fa fa-users', href: '#organizations', leaf: true },
                    { parentId: 4, text: 'Users', iconCls: 'x-fa fa-user', href: '#users', leaf: true },
                ]);
            }
            tree = tree.concat([
                { parentId: null, text: 'Trash', iconCls: 'x-fa fa-trash-o', href: '#trash', leaf: true }
            ]);
            defer.resolve(tree);
        });
        return defer.promise;
    }
    addItem(model) {
        var push = {};
        var type = model.type;
        var item = this._genItem(model);
        switch (type) {
            case "favorite":
                push = { favorites: item };
                break;
            case "private":
                push = { privates: item };
                break;
            case "search":
                push = { searches: item };
                break;
        }
        // let parent = this.tree.find(x => x.id == item.parentId);
        // if (parent != null) {
        //     item.href = parent.href + '/' + item.id;
        // }
        const defer = deferred();
        documents_1.UserPreference.findOneAndUpdate({ userId: this.auth.user_id }, { $push: push }, { upsert: true }, function (err, doc) {
            if (err) {
                defer.reject(err);
            }
            // TODO: update parent to be leaf = false
            var result = item;
            result.iconCls = 'x-fa fa-file-video-o';
            result.leaf = true;
            defer.resolve({
                action: 'add',
                success: true,
                data: result
            });
        });
        return defer.promise;
    }
    renameItem(model) {
        let field = {};
        let query = { userId: this.auth.user_id };
        switch (model.type) {
            case "favorite":
                field = { $set: { "favorites.$.text": model.text } };
                query["favorites.id"] = model.id;
                break;
            case "private":
                //field = { $set: { "privates.$.text": model.text } };
                return;
            case "search":
                field = { $set: { "searches.$.text": model.text } };
                query["searches.id"] = model.id;
                break;
        }
        const defer = deferred();
        documents_1.UserPreference.findOneAndUpdate(query, field, { upsert: true }, function (err, doc) {
            if (err) {
                defer.reject(err);
            }
            defer.resolve({
                action: 'update',
                success: true,
                data: model
            });
        });
        return defer.promise;
    }
    deleteItem(model) {
        let action = {};
        switch (model.type) {
            case "favorite":
                let items = (model.items instanceof Array) ? model.items : [model.items];
                action = { $pull: { "favorites": { id: { $in: items } } } };
                break;
            case "private":
                return;
            case "search":
                action = { $pull: { "searches": { id: { $eq: model.items } } } };
                break;
        }
        const defer = deferred();
        documents_1.UserPreference.findOneAndUpdate({ userId: this.auth.user_id }, action, function (err, doc) {
            if (err) {
                defer.reject(err);
            }
            defer.resolve({
                action: 'delete',
                success: true,
                data: model.items
            });
        });
        return defer.promise;
    }
    attachAsset(model) {
        const defer = deferred();
        documents_1.UserPreference.findOneAndUpdate({ userId: this.auth.user_id, "favorites.id": model.id }, { $addToSet: { "favorites.$.assets": model.assetId } }, { upsert: true }, function (err, doc) {
            if (err) {
                defer.reject(err);
            }
            defer.resolve({
                action: 'update',
                success: true,
                data: model
            });
        });
        return defer.promise;
    }
}
exports.TreeService = TreeService;
