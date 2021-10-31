const utils = require('../utils');

const step1 = async function(csvData){
    data = await utils.executeTrads(csvData);
    return data;
}

module.exports.step1 = step1;