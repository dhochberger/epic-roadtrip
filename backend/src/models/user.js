const mongoose = require('../database');

const UserSchema = mongoose.Schema(
    {
        firstname: { type: String, require: false },
        lastname: { type: String, require: false },
        username: { type: String, require: true, unique: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
    },
    { timestamps: true }
);

UserSchema.pre('save', (next) => {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
