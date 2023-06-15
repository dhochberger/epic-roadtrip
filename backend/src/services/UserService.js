const User = require('../models/user');
const RefreshToken = require('../models/refresh-token');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const keys = require('../auth/passport.js');
const crypto = require('crypto');

class UserService {
    static async getAllUsers() {
        try {
            return await User.find();
        } catch (error) {
            throw error;
        }
    }

    static async getUser(id) {
        try {
            const user = await User.findOne({ _id: id }, { password: 0 });
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async addUser(newUser) {
        try {
            const userToRegister = await User.findOne({
                where: { username: String(newUser.username) },
            });

            if (userToRegister) {
                return null;
            } else return await User.create(newUser);
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(id, updateUser) {
        try {
            const existUser = await User.findOne({
                $or: [{ email: updateUser.email }, { username: updateUser.username }],
            });

            if (existUser) {
                return false;
            }

            let updatedUser = await User.findOneAndUpdate({ _id: id }, updateUser, {
                new: true,
                useFindAndModify: false,
            });

            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            const userToDelete = await User.findOneAndDelete({ _id: id });
            return userToDelete;
        } catch (error) {
            throw error;
        }
    }

    static async register(newUser) {
        try {
            const emailExist = await User.findOne({ email: newUser.email });
            const usernameExist = await User.findOne({ username: newUser.username });

            if (emailExist) {
                return 'email';
            } else if (usernameExist) {
                return 'username';
            } else return await User.create(newUser);
        } catch (error) {
            throw error;
        }
    }

    static async login(userLogin, ipAdress) {
        try {
            let userToLogin = await User.findOne({
                email: userLogin.login,
            });

            if (!userToLogin) {
                userToLogin = await User.findOne({
                    username: userLogin.login,
                });
            }

            if (!userToLogin || !bcrypt.compareSync(userLogin.password, userToLogin.password)) {
                return null;
            }

            const userToken = await RefreshToken.findOne({
                user: userToLogin._id,
            });

            let refreshToken = await createOrUpdateRefreshToken(userToLogin, ipAdress);

            const jwtToken = generateJwtToken(userToLogin);

            userToLogin.password = undefined;
            return { user: userToLogin, jwtToken, refreshToken: refreshToken.token };
        } catch (error) {
            throw error;
        }
    }

    static async refreshToken({ token, ipAddress }) {
        const refreshToken = await RefreshToken.findOne({ token }).populate('user');

        if (!refreshToken || !refreshToken.isActive) return null;

        const { user } = refreshToken;
        user.password = undefined;

        const newRefreshToken = await createOrUpdateRefreshToken(user, ipAddress);

        const jwtToken = generateJwtToken(user);
        return { jwtToken, refreshToken: newRefreshToken.token };
    }

    static async disconnect(id) {
        try {
            let disconnected = await RefreshToken.findOneAndDelete({ _id: id });

            return disconnected;
        } catch (error) {
            throw error;
        }
    }
}

function generateJwtToken(user) {
    return jwt.sign({ sub: user.id, id: user.id }, keys.secretOrKey, {
        expiresIn: '1w',
    });
}

async function createOrUpdateRefreshToken(user, ipAddress) {
    return await RefreshToken.findOneAndUpdate(
        {
            _id: user._id,
        },
        {
            user: user._id,
            token: crypto.randomBytes(40).toString('hex'),
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdByIp: ipAddress,
        },
        { upsert: true, new: true }
    );
}

module.exports = UserService;
