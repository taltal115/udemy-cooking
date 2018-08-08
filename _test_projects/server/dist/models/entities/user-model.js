"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const config = require('../../utils/config');
function default_1(sequelize, dataTypes) {
    const User = sequelize.define("User", {
        id: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                isUUID: 4
            }
        },
        firstName: {
            allowNull: false,
            type: dataTypes.STRING(64),
            field: 'first_name'
        },
        lastName: {
            allowNull: false,
            type: dataTypes.STRING(64),
            field: 'last_name'
        },
        picture: {
            allowNull: true,
            type: dataTypes.STRING(128),
            field: 'picture'
        },
        password: {
            allowNull: true,
            type: dataTypes.STRING(60),
            defaultValue: '',
        },
        email: {
            allowNull: false,
            type: dataTypes.STRING(128),
            unique: true,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        emailConfirmed: {
            type: dataTypes.BOOLEAN,
            defaultValue: false,
            field: 'email_confirmed'
        },
        phone: {
            allowNull: true,
            type: dataTypes.STRING(32)
        },
        phoneConfirmed: {
            type: dataTypes.BOOLEAN,
            defaultValue: false,
            field: 'phone_confirmed'
        },
        securityStamp: {
            allowNull: true,
            type: dataTypes.STRING(4000),
            field: 'security_stamp'
        },
        loginFailedCount: {
            type: dataTypes.INTEGER,
            defaultValue: 0,
            field: 'login_failed_count'
        },
        isLocked: {
            type: dataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_locked'
        },
        lockExpire: {
            allowNull: true,
            type: dataTypes.DATE,
            field: 'lock_expire'
        }
        // ,
        // orgID: {
        //     allowNull: false,
        //     type: dataTypes.STRING(64),
        //     field: 'org_id'
        // }
    }, {
        tableName: 'users',
        timestamps: false,
        freezeTableName: true,
        indexes: [{ unique: true, fields: ['email'] }],
        // classMethods: {
        //     generateHash: function (password, next) {
        //         return bcrypt.hashSync(password, 12);
        //     }
        // },
        classMethods: {
            lookup: function (identifier) {
                return this.findOne({
                    where: {
                        $or: [
                            { id: identifier },
                            { email: identifier }
                        ]
                    }
                }).then(function (row) {
                    if (!row) {
                        throw 'Unknown person with id/username/email: ' + identifier;
                    }
                    return row;
                });
            }
        },
        instanceMethods: {
            comparePassword: function (password) {
                console.log('bcrypt.comparebcrypt.comparebcrypt.comparebcrypt.comparebcrypt.comparebcrypt.compare');
                return bcrypt.compareSync(password, this.password);
            }
        },
        hooks: {
            beforeUpdate: function (user, next) {
                var BCRYPT_REGEX = /^\$2[aby]\$[0-9]{2}\$.{53}$/;
                if (!BCRYPT_REGEX.test(user.password)) {
                    user.password = bcrypt.hashSync(user.password, config.saltRounds);
                }
                return user;
            }
        }
    });
    User.associate = function (models) {
        User.belongsToMany(models.Organization, {
            as: 'organizations',
            through: 'user_organizations',
            foreignKey: 'user_id',
            otherKey: "org_id"
        });
    };
    return User;
}
exports.default = default_1;
