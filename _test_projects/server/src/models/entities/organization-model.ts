import * as SequelizeStatic from "sequelize";
import { DataTypes, Sequelize } from "sequelize";
import { IOrganizationAttributes, IOrganizationInstance } from "./interfaces/organization-interface";

export default function (sequelize: Sequelize, dataTypes: DataTypes):
    SequelizeStatic.Model<IOrganizationInstance, IOrganizationAttributes> {

    const Organization = sequelize.define<IOrganizationInstance, IOrganizationAttributes>("Organization", {
        id: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },
        name: {
            allowNull: false,
            type: dataTypes.STRING(64),
            field: 'name'
        },
        url: {
            allowNull: true,
            type: dataTypes.STRING(128),
            field: 'url'
        }
    }, {
            tableName: 'organizations',
            timestamps: false,
        });

    Organization.associate = function (models) {
        Organization.belongsToMany(models.User, {
            as: 'users',
            through: 'user_organizations',
            foreignKey: 'org_id',
            otherKey: "user_id"
        });
    }

    return Organization;
}

