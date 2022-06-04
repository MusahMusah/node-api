const generateReference = async (length = 18) => {
    let result = '';
    const characters = '0123456789abcdefghij';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

module.exports = {
    generateReference
};
