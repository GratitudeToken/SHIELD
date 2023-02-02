const path = require('path')
const express = require('express')
const multer = require("multer") // we use this for storing images and other files sent from the user
const Joi = require('joi') // this is for data validation sent from front-end
const fs = require('fs') // this is for saving or reading files to the server
const Post = require('./methods/posts')
const sharp = require('sharp')
const { JsonRpc } = require("@proton/hyperion")
const fetch = require("isomorphic-fetch")
const endpoint = "https://eos.hyperion.eosrio.io"

const V1Point = 'https://proton.greymass.com/v1/history/get_transaction'
const v2Point = '/v2/history/get_actions?account=lucianape3&act.name=lucianape3'






// configuration for multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public_html/uploads')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/")
    let extension = extArray[extArray.length - 1]
    let newFileName = file.fieldname + '-' + Date.now() + '.' + extension
    cb(null, newFileName)
  }
})

const upload = multer({ storage: storage })

const app = express()


// express.json to decifer json data from incoming requests
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public_html')))



// const rpc = new JsonRpc(endpoint + v2Point, { fetch })

// const test = async () => {
//   let response
//   try {
//     response = await rpc.get_transaction('e14d9104a1e9d12864a06a2dfe5f448af7b24a71911190eb990c1dde3544b36f')
//     console.log(response);

//   }

//   catch (error) {
//     console.log(error)
//     console.log(response);
//   }
// }

// test()


app.post('/trx', (req, res) => {
  fetch(V1Point, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: req.body.trx
    })
  }).then(response => {
    return response.json()
  }).then(data => {
    const receivedTRX = data
    res.send(receivedTRX)
    // data.traces[1].receipt.receiver
  }).catch(err => {
    res.send(err)
  })

})



// GETs all data from posts.json file 
app.get('/getposts', (req, res) => {
  let readPosts = JSON.parse(fs.readFileSync('data/posts.json'))
  let readVotes = JSON.parse(fs.readFileSync('data/votes.json'))

  if (req.query.title) {
    const posts = readPosts.filter(title => title.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') === req.query.title)
    const votes = readVotes.filter(votes => votes.id === posts[0].id)
    res.send({ posts, votes })
  }

  else if (req.query.tag) {
    const posts = readPosts.filter(post => post.tags.includes(req.query.tag))
    let votes = []
    posts.forEach((el, i) => {
      let oneObject = readVotes.filter(votes => votes.id === el.id)
      votes.push(oneObject[0])
    })

    res.send({ posts, votes })
  }

  else if (req.query.search) {
    const s = req.query.search
    let votes = []
    let posts = []

    const searchStringInJSON = (str, json) => {
      json.forEach(object => {

        for (var key in object) {
          if (key === 'title' && object[key].includes(str)) {
            posts.push(object)
            votes.push(readVotes.filter(votes => votes.id === object.id)[0])
            break
          }
          if (key === 'tags' && object[key].includes(str)) {
            posts.push(object)
            votes.push(readVotes.filter(votes => votes.id === object.id)[0])
            break
          }
          if (key === 'options') {
            const stringifiedOptions = JSON.stringify(object.options).toLowerCase().replace(/ /g, '').replace(/[^\w-]+/g, ',')
            if (stringifiedOptions.includes(str)) {
              posts.push(object)
              votes.push(readVotes.filter(votes => votes.id === object.id)[0])
              break
            }
          }
        }

      })
      return posts
    }

    posts = searchStringInJSON(s, readPosts)
    res.send({ posts, votes })
  }

  else {
    const posts = readPosts
    const votes = readVotes
    res.send({ posts, votes })
  }

})

// POST to the posts.json file
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
    const post = new Post({ ...req.body, ...req.file })
    post.save()
    res.send({ "status": 200 })
  }
})


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
    Post.vote(req.body)
    res.send({ "status": 200 })
  }
})


app.put('/delete', (req, res) => {
  try {
    const posts = JSON.parse(fs.readFileSync(`data/posts.json`))
    const votes = JSON.parse(fs.readFileSync(`data/votes.json`))
    const imageToDelete = posts.filter(post => post.id === parseInt(req.body.id))
    const filteredPosts = posts.filter(post => post.id !== parseInt(req.body.id))
    const filteredVotes = votes.filter(vote => vote.id !== parseInt(req.body.id))

    imageToDelete[0].image !== '' ? fs.unlinkSync('public_html/uploads/' + imageToDelete[0].image) : null


    fs.writeFileSync(`data/posts.json`, JSON.stringify(filteredPosts))
    fs.writeFileSync(`data/votes.json`, JSON.stringify(filteredVotes))

    res.send({ "status": 200 })
  } catch (err) {
    console.error(err)
  }
})


app.post('/avatarsave', (req, res) => {
  // create buffer for sharp
  const imgBuffer = Buffer.from(req.body.ava, 'base64')
  sharp(imgBuffer)
    .resize(320)
    .toFile(`public_html/avatars/${req.body.user}.webp`, (err, info) => {
      console.log('Error saving avatar ?: ' + err)
      err === null ? res.send({ "avatar": "saved" }) : null
    })
})

app.listen(9632)
