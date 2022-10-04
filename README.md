# SHIELD
A powerful open-source NPPoS (Non-Profit Proof of Stake) biosphere software for vetting and voting.


v1.0 (BETA) SPECS:

**THE UI**
Needs to be simple, github style perhaps.
The main function of the UI is to display the list of open and passed proposals and issues.

In this regard, it needs to display simple information for each post like:

Post type (issue or proposal)
Post title
Post image (link to an image uploaded on the server when you create the post you can upload one)
Post description
Post tags
Post date
Username (author)
Countdown (til it expires)
Buttons to vote on the issue or proposal


**THE API**
The API and storage will be moved to a blockchain eventually, but not for now.
We will not be using any database, for the versatility, longevity and flexibility of the project, to begin with we will instead use JSON files to store each issue or proposal and the results for each will be updated in each file.
We need to pay extra attention to security for this API, we will add 2 layers of validation for the input data:

1. Validation on the form when a member submits a post, limiting the number and type of characters for example on each input element.
2. Validation on the backend using a module like Joi, again limiting the data to certain type of data and size of it, for each parameter / value supplied.

The API will have the following methods:

GET
POST
UPDATE

**The JSON file**
Every time a user posts an issue or a proposal, the first thing we do is to check with FS module if the a file named exactly as the username posting exists, if it does, we add to it, if it doesn't we create it.

The json file data structure looks like this:

```
{
"post-title": "The post title",
"post-image": "url-to-image",
"post-description": "A very detailed description",
"post-date": "Date format either the standard in JS or UNIX",
"active": "true",
"post-tags": "tag1, tag2, tag3"
}
```

