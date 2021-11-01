const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const rounds = 10;
const tokenSecret = 'a3f9e45c-8ced';

// Authenticaton 
    /*  const user = 'guy';
        const pass = '1234566';
    */
//const hash = '$2b$10$F3Ij5BOc7J8SQ7eqh9WjTuFptlhbyiAvYbuwoGRdMFvkZsfmiclym'

// the login router
//-----------------------------------------------------------------------------------------
router.post('/',(req,res) =>{
    let user = req.body.user;
    let pass = req.body.password;
    let _hash = redPassHash();
    if(user !== 'guy') res.status(403).json({message: "user name or password do not exist.."});
    
    // validate the password hase against the one stored in server
    bcrypt.compare(req.body.password,_hash,(err,match)=>{
        if(err) res.status(500).json(err);
        else if(match)
        {
            bcrypt.hash(pass,rounds,(err,hash)=>{
                if(err){
                    res.status(500).json(err);
                }
                else{
                  let token = generateToken(user);

                  // save the password hash. (this step is redundent in real full blown env)
                  //it is implemented here only because we dont use a signup API 
                  savePassHash(hash);
                  
                  // returns the token for use in subsequent step12 API calls
                  res.status(200).send({apiToken:token});
                }
            });  
        }
        else res.status(403).json({error: "worong password..."});
    })
});

function generateToken(user){
    return jwt.sign({data: user},tokenSecret,{expiresIn: '24h'});
}

function savePassHash(token){
    fs.writeFileSync('./routes/login.json', JSON.stringify({token: token}));
}
function redPassHash()
{
    let key = fs.readFileSync('./routes/passHash.json');
    let hash = JSON.parse(key).passHash;
    return hash;
}

//-----------------------------------------------------------------------------------------
module.exports = router;
