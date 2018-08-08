import { DataTypes, Sequelize } from "sequelize";

export default function (sequelize: Sequelize, dataTypes: DataTypes) {

    const UserOrganization = sequelize.define("UserOrganization", {
        role: dataTypes.INTEGER,
        createdAt: dataTypes.DATE,
        updatedAt: dataTypes.DATE
    }, {
            tableName: 'user_organizations',
            timestamps: true,
        });

    UserOrganization.associate = function (models) {
        UserOrganization.belongsTo(models.User, {
            foreignKey: "user_id",
            as: 'users'
        });
        
        UserOrganization.belongsTo(models.Organization, {
            foreignKey: "org_id",
            as: 'organizations'
        });
    };

    return UserOrganization;
};