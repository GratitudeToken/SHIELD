const fs = require('fs');

module.exports = class Post {
  constructor(postData) {
    this.id = 0;
    this.user = postData.user;
    this.title = postData.title;
    this.image = `${postData.filename}`;
    this.description = postData.description;
    this.options = postData.options;
    this.date = new Date();
    this.tags = postData.tags;
    this.type = postData.type;
    this.votes = postData.votes?.map((vote) => parseInt(vote));
  }


  save() {

    let newID = 0;

    fs.readFile('data/votes.json', (err, fileContent) => {

      let newVotes = [];
      if (!err) {
        newVotes = JSON.parse(fileContent);
      }
      newID = parseInt(newVotes.length + 1);

      this.id = newID;

      let newPostData = {}

      newPostData.id = newID;
      newPostData.user = this.user;
      newPostData.datevoted = "";
      newPostData.votes = this.votes;
      newPostData.voted = false;

      newVotes.push(newPostData);
      fs.writeFile('data/votes.json', JSON.stringify(newVotes), err => {
        console.log(err);
      });

      // save the other important data from user, this will never change
      fs.readFile(`data/posts.json`, (err, fileContent) => {
        let userFile = {};
        if (!err) {
          userFile = JSON.parse(fileContent);
        }

        let newEntry = this;
        delete newEntry['votes'];


        userFile.push(newEntry);

        fs.writeFile(`data/posts.json`, JSON.stringify(userFile), err => {
          console.log(err);
        });
      });
    });
  }

  static vote(obj) {
    fs.readFile('data/votes.json', (err, fileContent) => {
      let votesFile = {};
      if (!err) {
        votesFile = JSON.parse(fileContent);
      }

      votesFile.map((el, i) => {
        if (el.id === obj.id && el.user === obj.user) {
          votesFile[i].votes[obj.vote] += 1;
          votesFile[i].voted = parseInt(obj.vote);
          votesFile[i].datevoted = new Date();
        }

        fs.writeFile('data/votes.json', JSON.stringify(votesFile), err => {
          console.log(err);
        });
      });
    });
  }
};
