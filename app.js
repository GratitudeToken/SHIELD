const path = require('path');
const express = require('express');
const multer = require("multer");
const Joi = require('joi');
const fs = require('fs');

const Item = require('./methods/items');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
  }
});

const upload = multer({ storage: storage });

const app = express();


// express.json to decifer json data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// GETs all data from items.json file 
app.get('/items', (req, res) => {
  //if (req.params.parameter) {
  // do this
  //   if (req.params.parameter === 'tag') {

  //   }

  //   if (req.params.parameter === 'proposal') {

  //   }

  //   if (req.params.parameter === 'poll') {

  //   }

  //   if (req.params.parameter === 'issue') {

  //   }

  // } else {
  //   let data = JSON.parse(fs.readFileSync('data/items.json'));
  //   res.send(data);
  // }
  let data = JSON.parse(fs.readFileSync('data/items.json'));
  res.send(data);
});

app.get('/item/:itemName', (req, res) => {
  const itemName = req.params.itemName
  const data = JSON.parse(fs.readFileSync('data/items.json'));
  let correctItem = data.filter(item => {
    let fixedItemName = item.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    return fixedItemName === itemName
  })
  console.log(correctItem[0].title)
  
})

app.get('/tag/:tagName', (req, res) => {
  const tagName = req.params.tagName
  const data = JSON.parse(fs.readFileSync('data/items.json'));
  let correctTag = data.filter(item => item.tags.includes(tagName))
  console.log(correctTag)
  
})

// POSTs items to the items.json file
// IF THERE IS NO AUTHENTICATED USER THE ADD BUTTON WILL NOT BE SHOWN !!!!!!!!!!!!!!!!
app.post('/post', upload.single("image"), (req, res) => {


  // Joi Schema = how the incoming input data is validated
  const schema = {
    user: Joi.string().min(6).max(12).required(),
    title: Joi.string().min(5).required(),
    description: Joi.string().min(2).max(500).required(),
    options: Joi.array().required(),
    tags: Joi.string().required(),
    type: Joi.string().required(),
    votes: Joi.array().required(),
    vote: Joi.number().integer().max(9).precision(0)
  }

  const { error } = Joi.validate(req.body, schema)

  if (error) {
    res.status(401).send(error.details[0].message)
    return
  } else {
    res.send({ "status": 200 })
  }

  const item = new Item({ ...req.body, ...req.file });
  item.save();
});

app.post('/vote', (req, res) => {
  // Joi Schema = how the incoming input data is validated
  const schema = {
    id: Joi.number().integer().max(2300000).precision(0).required(),
    user: Joi.string().min(6).max(12).required(),
    vote: Joi.number().integer().max(9).precision(0).required()
  }

  const { error } = Joi.validate(req.body, schema)

  if (error) {
    res.status(401).send(error.details[0].message)
    return
  } else {
    res.send({ "status": 200 })
  }

  Item.vote(req.body);
});

// HERE WE HAVE TO CHECK IF THE USER THAT MADE THE POST IS AUTHENTICATED !!!!!!!!!!!!!!!!
///////////////////////////////////////////////////
app.put('/delete', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data/items.json'));
  const filteredItems = data.filter(item => item.id != req.body.id)
  fs.writeFileSync('data/items.json', JSON.stringify(filteredItems))
  res.send({ "status": 200 })
})

app.listen(3333);
