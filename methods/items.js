const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename), "data", "items.json");

module.exports = class Item {
  constructor(itemData) {
    this.id = 0;
    this.user = itemData.user;
    this.title = itemData.title;
    this.image = `/uploads/${itemData.filename}`;
    this.description = itemData.description;
    this.options = itemData.options;
    this.date = new Date();
    this.tags = itemData.tags;
    this.type = itemData.type;
    this.votes = itemData.votes?.map((vote) => parseInt(vote));
    this.vote = itemData.vote;
    this.members = 10;
  }


  save() {
    fs.readFile(p, (err, fileContent) => {
      let items = [];
      if (!err) {
        items = JSON.parse(fileContent);
      }
      const id = items.length + 1;
      this.id = id;
      items.push(this);
      fs.writeFile(p, JSON.stringify(items), err => {
        console.log(err);
      });
    });
  }

  static vote(obj) {
    fs.readFile('data/users/' + obj.user + '.json', (err, fileContent) => {
      let items = [];
      if (!err) {
        items = JSON.parse(fileContent);
      }
      console.log(items)
      // items.filter((item, index) => {
      //   item.id == obj.id
      // });
      // items[obj.id - 1].votes[obj.vote] += 1;
      // fs.writeFile(p, JSON.stringify(items), err => {
      //   console.log(err);
      // });
    });
  }
};
