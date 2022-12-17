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
    let newID = 0; // first, let's reserve the ID in the index.json file, we create a new index variable that is set to 0 to make it number type

    fs.readFile('data/index.json', (err, fileContent) => {
      let newIndex = []; // let's have an empty array to write after it's updated
      if (!err) {
        newIndex = JSON.parse(fileContent); // parse the string content from index.json into an array and assign it to newIndex variable
      }
      newID = newIndex.length + 1; // calculate the length of the array in order to add +1 - thus we have the new ID to use in the next method below for the user JSOn file
      this.id = newID; // here we set the correct value to the key named ID for the user object
      newIndex.push(this.user); // add the new user to the array, then write the new array to the index.json file
      fs.writeFile('data/index.json', JSON.stringify(newIndex), err => {
        console.log(err);
      });

      // now let's read the user file
      fs.readFile(`data/users/${this.user}.json`, (err, fileContent) => {
        let userFile = {};
        if (!err) {
          userFile = JSON.parse(fileContent);
        }

        let posts = userFile.posts;
        posts.push(this);

        userFile.posts = posts;
        console.log(userFile);
        fs.writeFile(`data/users/${this.user}.json`, JSON.stringify(userFile), err => {
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
