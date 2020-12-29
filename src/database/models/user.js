'use strict';
import { emailSubject, passwordResetSubject, userType } from '../../api/utils/constant';
import sendEmail from '../../email/email';
import { emailVerificationTemplate, passwordResetTemplate } from '../../email/template';
import { encryptToken } from '../../api/utils/crypto';

module.exports = (sequelize, DataTypes) => {
    const userSchema = {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
         email: {
             type: DataTypes.STRING,
             unique: true,
             allowNull: false
        },
        address: {
             type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
        },
        account_type: {
             type: DataTypes.STRING,
             defaultValue: 'member'
        },
        created_at: {
            type: DataTypes.DATE
        },
        unit: {
            type: DataTypes.INTEGER,
            unique:true,
            allowNull: true
        },
        worker: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        first_timer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        bio: {
            type: DataTypes.STRING
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        resetToken: {
            type: DataTypes.STRING,
        }
    }
    
    const user = sequelize.define('User', userSchema, {timestamps: false})

    user.associate = db => {
        user.hasOne(db.Auth, {
            foreignKey: 'user_id',
        });
        user.belongsTo(db.Unit, {
            foreignKey: 'unit',
            sourceKey:'unit_id'
        })
        user.hasMany(db.Post, {
            foreignKey: 'author_id',
        })
        user.hasMany(db.Comment, {
            foreignKey: 'reviewer_id',
            sourceKey:'user_id'
        })
    }

    user.prototype.mutateFirstTimer = async function (bool) {
        this.first_timer = bool;
        await this.save();
        return this
    }

    user.prototype.mutateWorker = async function (bool) {
        this.worker = bool;
        await this.save();
        return this
    }

    user.prototype.assignUnit = async function (unit) {
        this.unit = unit;
        await this.save();
        return this;
    }

    user.prototype.assignHOD = async function (unit_id) {
        this.account_type = userType.HOD.toString();
        this.unit = unit_id;
        await this.save();
        return this;
    }

    user.prototype.updateUser = async function (user) {
        const { address, bio, name, image } = user;
        this.address = address;
        this.bio = bio;
        this.name = name;
        this.image = image;
        await this.save();
        return this
    }

    user.prototype.activateAccount = async function () {
        this.isVerified = true;
        await this.save();
        return this;
    }

    user.prototype.sendVerificationEmail = async function (url) {
        const { name, email } = this;
        await sendEmail(email,emailSubject, emailVerificationTemplate(name, url))
    }

     user.prototype.generateResetToken = async function () {
        this.resetToken = encryptToken()
        await this.save();
        return this.resetToken;
    }

    user.prototype.sendPasswordResetEmail = async function (url) {
        const { name, email } = this;
        const resetToken = await this.generateResetToken();
        const resetUrl = `${url}/${resetToken}`
        await sendEmail(email, passwordResetSubject, passwordResetTemplate(name, resetUrl))
    }

    user.prototype.setPasswordTokenNull = async function () {
        this.resetToken = '';
        this.save();
        return this ;
    };

  return user;
};