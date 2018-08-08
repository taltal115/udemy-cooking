import * as SequelizeStatic from "sequelize";
import { DataTypes, Sequelize } from "sequelize";
import { IRoleInstance, IRoleAttributes } from "./interfaces/role-interface";

export default function (sequelize: Sequelize, dataTypes: DataTypes):
    SequelizeStatic.Model<IRoleInstance, IRoleAttributes> {

    const Role = sequelize.define<IRoleInstance, IRoleAttributes>("Role", {
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

