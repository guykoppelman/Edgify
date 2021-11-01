const utils = require('../utils');

/**
 *  The use of MVC kind of Architcture allow the flxibility
 *  in the code. this is why we use this Model layer (to  implement the business logic)
 */
const step12 = async function(csvData){
    data = await utils.executeTrads(csvData);
    return data;
}

module.exports.step12 = step12;