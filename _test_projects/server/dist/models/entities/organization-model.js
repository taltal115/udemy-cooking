"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, dataTypes) {
    const Organization = sequelize.define("Organization", {
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
    };
    return Organization;
}
exports.default = default_1;
