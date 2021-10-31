const express = require('express');
const router = express.Router();
const multer = require('multer');
const utils = require('../utils');
const step1Model2 = require('../models/step12')
const upload = multer({ storage: multer.memoryStorage() });

//-----------------------------------the main entry point ----------------------------------
router.post('/',upload.single('file'), async (req,res) =>{
  if(!req.file){
    res.status(400).send('No file were uploaded....');  
  }

  //console.log(req.file);
  let csvData = await utils.parseCsv(req.file.buffer);
  if(csvData.length > 20){
    res.status(400).send('file to big, due tor the exchange rate 3prt service limitation...');
  }

  let data = await step1Model.step1(csvData);
  res.status(200).send(data);
});
//-----------------------------------------------------------------------------------------
module.exports = router;
