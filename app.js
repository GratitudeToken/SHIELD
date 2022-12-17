const path = require('path');
const express = require('express');
const multer = require("multer"); // we use this for storing images and other files sent from the user
const Joi = require('joi'); // this is for data validation sent from front-end
const fs = require('fs'); // this is for saving or reading files to the server

const Post = require('./methods/posts');

// configuration for multer
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

// GETs all data from posts.json file 
app.get('/getposts/:user', (req, res) => {
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
  //   let data = JSON.parse(fs.readFileSync('data/' + req.params.user + '.json'));
  //   res.send(data);
  // }

  const user = req.params.user;
  let data = JSON.parse(fs.readFileSync('data/users/' + user + '.json')); // ADD GUARDIAN AND VISIONARY MEMBERSHIP TYPE in json structure
  res.send(data);
});

// app.get('/:postName', (req, res) => {
//   const postName = req.params.postName
//   const data = JSON.parse(fs.readFileSync('data/' + req.params.user + '.json'));
//   let correctPost = data.posts.filter(post => {
//     let fixedPostName = post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
//     return fixedPostName === postName
//   })
//   console.log(correctPost[0].title)

// })

// app.get('/tag/:tagName', (req, res) => {
//   const tagName = req.params.tagName
//   const data = JSON.parse(fs.readFileSync('data/' + req.params.user + '.json'));
//   let correctTag = data.filter(post => post.tags.includes(tagName))
//   console.log(correctTag)

// })

// POST to the posts.json file
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
    votes: Joi.array().required()
  }

  const { error } = Joi.validate(req.body, schema)

  if (error) {
    res.status(401).send(error.details[0].message)
    return
  } else {
    res.send({ "status": 200 })
  }

  const post = new Post({ ...req.body, ...req.file });
  post.save();
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

  Post.vote(req.body);
});

// HERE WE HAVE TO CHECK IF THE USER THAT MADE THE POST IS AUTHENTICATED !!!!!!!!!!!!!!!!
///////////////////////////////////////////////////
app.put('/delete', (req, res) => {
  const data = JSON.parse(fs.readFileSync(`data/users/${req.body.user}.json`));
  const filteredPosts = data.posts.filter(post => post.id != req.body.id);
  data.posts = filteredPosts;
  fs.writeFileSync(`data/users/${req.body.user}.json`, JSON.stringify(data))
  res.send({ "status": 200 })
})

app.listen(3333);
