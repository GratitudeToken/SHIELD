const path = require('path');
const express = require('express');
const multer = require("multer"); // we use this for storing images and other files sent from the user
const Joi = require('joi'); // this is for data validation sent from front-end
const fs = require('fs'); // this is for saving or reading files to the server
const Post = require('./methods/posts');
const sharp = require('sharp');
const { ApiClass } = require('@proton/api');

// configuration for multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public_html/uploads')
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
app.use(express.static(path.join(__dirname, 'public_html')));

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
  }

  else if (req.query.search) {
    const s = req.query.search;

    // const searchString = (string, searchTerm) => {
    //   let regex = new RegExp(searchTerm, 'gi');
    //   return string.match(regex) !== null;
    // }
    let votes = [];
    let posts = [];

    const searchStringInJSON = (str, json) => {
      json.forEach(object => {

        for (var key in object) {
          if (key === 'title' && object[key].includes(str)) {
            posts.push(object);
            votes.push(readVotes.filter(votes => votes.id === object.id)[0]);
            break;
          }
          if (key === 'tags' && object[key].includes(str)) {
            posts.push(object);
            votes.push(readVotes.filter(votes => votes.id === object.id)[0]);
            break;
          }
          if (key === 'options') {
            const stringifiedOptions = JSON.stringify(object.options).toLowerCase().replace(/ /g, '').replace(/[^\w-]+/g, ',');
            if (stringifiedOptions.includes(str)) {
              posts.push(object);
              votes.push(readVotes.filter(votes => votes.id === object.id)[0]);
              break;
            }
          }
        }

      });
      return posts;
    }

    posts = searchStringInJSON(s, readPosts);
    res.send({ posts, votes });
  }

  else {
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

    imageToDelete[0].image !== '' ? fs.unlinkSync('public_html/uploads/' + imageToDelete[0].image) : null;


    fs.writeFileSync(`data/posts.json`, JSON.stringify(filteredPosts));
    fs.writeFileSync(`data/votes.json`, JSON.stringify(filteredVotes));

    res.send({ "status": 200 });
  } catch (err) {
    console.error(err)
  }
})

app.get('/avatarsave', async (req, res) => {
  try {
    if (fs.existsSync(`public_html/avatars/${req.query.user}.webp`)) {
      //file exists
      res.send({ "avatar": 'exists' });
    }
  } catch (err) {
    console.error(err)

    const api = new ApiClass('proton');
    const actorAvatar = await api.getProtonAvatar(req.query.user);

    const imgBuffer = Buffer.from(actorAvatar.avatar, 'base64');

    sharp(imgBuffer)
      .resize(320)
      .toFile(`public_html/avatars/${req.query.user}.webp`, (err, info) => {
        console.log('Error saving avatar ?: ' + err);
        res.send({ "avatar": "saved" });
      });
  }
})

app.listen(9632);
