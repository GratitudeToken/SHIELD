const fs = require('fs');

function addHoursToUTC(date, H) {
  const passedDate = new Date(date);
  passedDate.setUTCHours(passedDate.getUTCHours() + H);
  return passedDate
}

//console.log(addHoursToUTC(new Date(), 3)); //adds 3 hours to the current UTC date and returns the new date

//This function takes 2 arguments, date and H. date is the passed date string and H is the number of hours to add to the current UTC date.

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
    // read votes file first
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
      newPostData.expires = addHoursToUTC(this.date, 720);
      newPostData.votes = this.votes;
      newPostData.voted = false;

      newVotes.push(newPostData);

      // save votes file first
      fs.writeFile('data/votes.json', JSON.stringify(newVotes), err => {
        console.log(err);
      });

      // save the rest of the important data from user, this will never change
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
          let votingUsers = [];
          votingUsers.push(obj.user)
          votesFile[i].voted = votingUsers;
        }

        fs.writeFile('data/votes.json', JSON.stringify(votesFile), err => {
          console.log(err);
        });
      });
    });
  }
};
