

export interface ITreeItem {
    id: Number,
    parentId: Number,
    text: String,
    href: String | null
}

export interface ITreeItemViewModel {
    id?: Number | null,
    parentId?: Number | null,
    text: String
    leaf?: Boolean | null,
    type?: any | null,
    iconCls?: any | null,
    href?: any | null,
    visible?:any | null,
}
