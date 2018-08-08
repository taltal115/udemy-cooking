"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, dataTypes) {
    const Role = sequelize.define("Role", {
        value: {
            type: dataTypes.DECIMAL,
            allowNull: false,
            validate: {
                isDecimal: true
            }
        },
        name: {
            allowNull: false,
            type: dataTypes.STRING(32),
            field: 'name'
        }
    }, {
        tableName: 'roles',
        timestamps: false,
        freezeTableName: true,
        indexes: [{ unique: true, fields: ['value', 'name'] }],
        classMethods: {
            associate: function (models) {
                Role.belongsToMany(models.User, { through: 'user_roles', as: 'users' });
            }
        }
    });
    return Role;
}
exports.default = default_1;
