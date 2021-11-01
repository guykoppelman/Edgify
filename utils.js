    /**
     * Module dependencies.
     */
    const csv = require('csvtojson');
    const {fetch}  = require('cross-fetch');
    const jwt = require('jsonwebtoken');
    const fs = require('fs');
    const tokenSecret = 'a3f9e45c-8ced';

    //------------------ parse the the input csv stream and convert to array ----------
    const parseCsv = async function (csvBuff){
        var csvstr = csvBuff.toString(); 
        var data = await csv().fromString(csvstr);
        return data;
    };
    module.exports.parseCsv  = parseCsv;
    //---------------------------------------------------------------------------------

    //------------------ get the exchange rate from a 3pr Service ---------------------
    const  getEURforUSD = async function (url,apiKye){
        const response = await fetch(url + apiKye);
        if(!response) return null;
        const rates = await response.json();
        if(!rates) return null;
        if(!rates.data.EUR) return null
        return rates.data.EUR.toFixed(2);
    };
    module.exports.getEURforUSD = getEURforUSD;
    //---------------------------------------------------------------------------------

    //----------------------------- deside if the order is aceptble -------------------
     const isTradeExecute = function(id, price, rate, tradeType, amount){
        if(((rate < price)  && tradeType === "buy" ) || ((rate > price)  && tradeType === "sell" )){
            return {id:id, price: price, rate: rate, type: tradeType, status: "Executed", total: amount * rate};
        }
        else {
            return {id:id, price: price, rate: rate, type: tradeType, status: "Denied", total: amount * rate};
        }
    };
    module.exports.isTradeExecute = isTradeExecute;
    //---------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------
    function createSellTradeSummory(sellMarketPriceAprr){
        let avgPrice = sellMarketPriceAprr.reduce((c,p) => (Number(c.price) + Number(p.price)))/sellMarketPriceAprr.length;
        let ammount = sellMarketPriceAprr.reduce((c,p) => Number(c.amount) + Number(p.amount));
        let res = {price: avgPrice, trade_type: "Sell, Market Price", count:sellMarketPriceAprr.length, amount:ammount}; 
        return res;
    };
    
    //---------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------
    function createBuyTradeSummory(buyMarketPriceAprr){
        let avgPrice = buyMarketPriceAprr.reduce((c,p) => (Number(c.price) + Number(p.price)))/buyMarketPriceAprr.length;
        let ammount = buyMarketPriceAprr.reduce((c,p) => Number(c.amount) + Number(p.amount));
        let res = {price: avgPrice, trade_type: "Buy, Market Price", count:buyMarketPriceAprr.length, amount:ammount}; 
        return res;
    } 
    //---------------------------------------------------------------------------------

    //--------------The entryopint for executing the list of orders -------------------
    const executeTrads = async function(csvData){
        let results = [];
        let marketSellPrice = [];
        let marketBuyPrice = [];
        let len = csvData.length
        let sellMarketSummory = null;
        let buyMarketSummory = null;
        for(i=0;i<len;i++){
        let trade = csvData[i];
    
            try{
                // url: https://freecurrencyapi.net/api/v2/latest?apikey=
                // key:  8baa76d0-394c-11ec-8600-01437ec9fbd4
                 let rate = await getEURforUSD('https://freecurrencyapi.net/api/v2/latest?apikey=','8baa76d0-394c-11ec-8600-01437ec9fbd4');
                 if(trade.price.toLowerCase() !== 'market'){
                 let tradeRes = isTradeExecute(trade.id, trade.price, rate, trade.type, trade.amount);
                 results.push({...tradeRes ,err: null});
                 }
                 else {
                    if(trade.price.toLowerCase() === 'market' ){
                    if(trade.type === 'sell')
                        marketSellPrice.push({id:trade.id, price:rate, type:trade.type, amount:trade.amount}) 
                    if(trade.type === 'buy')
                        marketBuyPrice.push({id:trade.id, price:rate, type:trade.type, amount:trade.amount}) 
                    }
                    else{
                        results.push({...tradeRes ,err: 'undefined price'});
                    }
                 }

            }
            catch(err){
                results.push({...tradeRes, err:"failed to fetch rate"});
            }       
        };

        if(marketSellPrice.length != 0){
            sellMarketSummory = createSellTradeSummory(marketSellPrice)
        }
        if(marketBuyPrice.length != 0){
            buyMarketSummory = createBuyTradeSummory(marketBuyPrice)
        }
        
        return {...results,sellMarketSum: sellMarketSummory,buyMarketSum: buyMarketSummory};
    };
    module.exports.executeTrads = executeTrads; 
    //---------------------------------------------------------------------------------

    //------------------------------- request auth verify -----------------------------
    const authVerify = function (req, res, next) {
        const token = req.headers.authorization
        if (!token) res.status(403).json({error: "please provide a token"})
        else {
            jwt.verify(token.split(" ")[1], tokenSecret, (err, value) => {
                if (err) res.status(500).json({error: 'failed to authenticate token'})
                next()
            })
        }
    }
    //---------------------------------------------------------------------------------
    module.exports.authVerify = authVerify;
    //---------------------------------------------------------------------------------