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
    let newFileName = file.fieldname + '-' + Date.now() + '.' + extension;
    cb(null, newFileName)
  }
});

const upload = multer({ storage: storage });

const app = express();


// express.json to decifer json data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// GETs all data from posts.json file 
app.get('/getposts', (req, res) => {
  let readPosts = JSON.parse(fs.readFileSync('data/posts.json')); // ADD GUARDIAN AND VISIONARY MEMBERSHIP TYPE in json structure
  let readVotes = JSON.parse(fs.readFileSync('data/votes.json'));

  if (req.query.title) {
    const posts = readPosts.filter(title => title.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') === req.query.title);
    const votes = readVotes.filter(votes => votes.id === posts[0].id);
    res.send({ posts, votes });
  }
  else if (req.query.tag) {
    const posts = readPosts.filter(post => post.tags.includes(req.query.tag));
    let votes = [];
    posts.forEach((el, i) => {
      let oneObject = readVotes.filter(votes => votes.id === el.id);
      votes.push(oneObject[0]);
    });

    res.send({ posts, votes });
  } else {
    const posts = readPosts;
    const votes = readVotes;
    res.send({ posts, votes });
  }
});

// POST to the posts.json file
// IF THERE IS NO AUTHENTICATED USER THE ADD BUTTON WILL NOT BE SHOWN !!!!!!!!!!!!!!!!
app.post('/post', upload.single("image"), (req, res) => {


  // Joi Schema = how the incoming input data is validated
  const schema = {
    user: Joi.string().max(23).required(),
    title: Joi.string().max(124).required(),
    description: Joi.string().max(1025).required(), // apparently you need to add 1 extra character because it does not match front-end otherwise
    options: Joi.array().max(1025).required(),
    tags: Joi.string().max(124).required(),
    type: Joi.string().max(13).required(),
    votes: Joi.array().max(1025).required()
  }

  const { error } = Joi.validate(req.body, schema)

  if (error) {
    res.status(401).send(error.details[0].message)
    return
  } else {
    const post = new Post({ ...req.body, ...req.file });
    post.save();
    res.send({ "status": 200 })
  }
});


app.post('/vote', (req, res) => {
  // Joi Schema = how the incoming input data is validated
  const schema = {
    id: Joi.number().integer().max(23000).precision(0).required(),
    user: Joi.string().max(13).required(),
    vote: Joi.number().integer().max(10).precision(0).required()
  }

  const { error } = Joi.validate(req.body, schema)

  if (error) {
    res.status(401).send(error.details[0].message)
    return
  } else {
    Post.vote(req.body);
    res.send({ "status": 200 })
  }
});

// HERE WE HAVE TO CHECK IF THE USER THAT MADE THE POST IS AUTHENTICATED !!!!!!!!!!!!!!!!
///////////////////////////////////////////////////
app.put('/delete', (req, res) => {
  try {
    const posts = JSON.parse(fs.readFileSync(`data/posts.json`));
    const votes = JSON.parse(fs.readFileSync(`data/votes.json`));
    const imageToDelete = posts.filter(post => post.id === parseInt(req.body.id));
    const filteredPosts = posts.filter(post => post.id !== parseInt(req.body.id));
    const filteredVotes = votes.filter(vote => vote.id !== parseInt(req.body.id));

    fs.unlinkSync('public/uploads/' + imageToDelete[0].image);


    fs.writeFileSync(`data/posts.json`, JSON.stringify(filteredPosts));
    fs.writeFileSync(`data/votes.json`, JSON.stringify(filteredVotes));

    res.send({ "status": 200 });
  } catch (err) {
    console.error(err)
  }
})

app.listen(2030);
