"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TreeItem {
    constructor(model) {
        this.id = model.id || null;
        this.text = model.text;
        this.parentId = model.parentId;
        if (model.href) {
            this.href = model.href;
        }
    }
}
exports.TreeItem = TreeItem;
;
class TreeItemViewModel {
    static generate(model) {
        var vm = {};
        vm.leaf = model.leaf || true;
        vm.iconCls = model.iconCls || null;
        vm.text = model.text;
        if (model.visible != undefined) {
            vm.visible = model.visible;
        }
        if (model.id != undefined) {
            vm.id = model.id;
        }
        if (model.parentId != undefined) {
            vm.parentId = model.parentId;
        }
        if (model.type != undefined) {
            vm.type = model.type;
        }
        if (model.href != undefined) {
            vm.href = model.href;
        }
        return vm;
    }
}
exports.TreeItemViewModel = TreeItemViewModel;
;
/*


import { ITreeItem, ITreeItemViewModel } from "./interfaces";

export class TreeItem implements ITreeItem {
    public id: Number;
    public text: String;
    public parentId: Number;
    //public href: String;
    public query: String;

    constructor(model: ITreeItem) {
        this.id = model.id || null;
        this.text = model.text;
        this.parentId = model.parentId;

        // if (model.href) {
        //     this.href = model.href;
        // }

        if (model.query) {
            this.query = model.query;
        }
    }
};


export class TreeItemViewModel implements ITreeItemViewModel {
    public id?: Number;
    public text: String;
    public parentId?: Number;
    public leaf?: Boolean;
    public type: String;
    public iconCls: String;
    public href: String;
    public visible?: Boolean;
    public q?: String;

    static generate(model: ITreeItemViewModel): ITreeItemViewModel {
        var vm: any = {};

        vm.text = model.text;
        vm.iconCls = 'iconCls' in model ? model.iconCls : null;
        vm.id = 'id' in model ? model.id : null;
        vm.parentId = 'parentId' in model ? model.parentId : null;
        vm.type = 'type' in model ? model.type : null;
        vm.href = 'href' in model ? model.href : null;
        vm.leaf = 'leaf' in model ? model.leaf : true;
        vm.query = 'query' in model ? model.query : null;
        vm.visible = 'visible' in model ? model.visible : null;

        return vm;
    }
};



*/
