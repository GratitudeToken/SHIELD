const fs = require('fs');

module.exports = class Post {
  constructor(postData) {
    this.id = 0;
    this.user = postData.user;
    this.title = postData.title;
    this.image = `/uploads/${postData.filename}`;
    this.description = postData.description;
    this.options = postData.options;
    this.date = new Date();
    this.tags = postData.tags;
    this.type = postData.type;
    this.votes = postData.votes?.map((vote) => parseInt(vote));
    this.vote = postData.vote;
    this.members = 10;
  }


  save() {
    // save the new post inside the user JSON file
    fs.readFile('data/users/' + this.user + '.json', (err, fileContent) => {
      let posts = [];
      if (!err) {
        posts = JSON.parse(fileContent);
      }
      const id = posts.posts.length + 1;
      this.id = id;
      posts.posts.push(this);
      fs.writeFile(p, JSON.stringify(posts), err => {
        console.log(err);
      });

      // save the username in the index.json file to have the ID of the new post (which is the index.json array location + 1) associated with the new user
      fs.readFile('data/users/index.json', (err, fileContent) => {
        let index = [];
        if (!err) {
          index = JSON.parse(fileContent);
        }
        index.push(this.user);
        fs.writeFile('data/users/index.json', JSON.stringify(index), err => {
          console.log(err);
        });
      });
    });
  }

  static vote(obj) {
    fs.readFile('data/users/' + obj.user + '.json', (err, fileContent) => {
      let posts = [];
      if (!err) {
        posts = JSON.parse(fileContent);
      }
      console.log(posts)
      // posts.filter((post, index) => {
      //   post.id == obj.id
      // });
      // posts[obj.id - 1].votes[obj.vote] += 1;
      // fs.writeFile(p, JSON.stringify(posts), err => {
      //   console.log(err);
      // });
    });
  }
};
