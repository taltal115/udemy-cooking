declare namespace SP.Permissions.Enums {
    
    enum SystemObject {
        None,
        Organization,
        OrganizationType,
        User,
        UserGroup,
        Asset,
        Error,
        Logger,
        Folder,
        Role,
        Keyword,
        Table,
        View,
        Tag,
        Attachment,
        Flag,
        DBConnection,
        DBConnectionType
    }

    enum AdministrativeActions
    {
        NotSet = 0,
        Edit = 1,
        Delete = 2,
        DeepDelete = 3,
        ChangeOwner = 4,
        ChangePermissions = 5,
        ChangeContent = 6,
        View = 7
    }

    enum AdvancedAdministrativeActions
    {
        NotSet = 0,
        Import = 1,
        Export = 2,
        Undelete = 3,
        Shredder = 4
    }
}