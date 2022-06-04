const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const salts = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salts);
};

const verifyPassword = async (password, hash) => {
    const v = await bcrypt.compare(password, hash);
    return !!v;
};

module.exports = { hashPassword, verifyPassword };
