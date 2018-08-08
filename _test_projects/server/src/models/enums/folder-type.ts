declare enum FileAccess {
    // constant members
    None,
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write
}



declare enum TreeItemAccess {
    None,
    Create    = 1 << 1,
    Rename   = 1 << 2,
    Delete   = 1 << 3,
    All  = Create | Rename | Delete
}

