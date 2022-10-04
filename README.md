# SHIELD
A powerful open-source NPPoS (Non-Profit Proof of Stake) biosphere software for vetting and voting.


v1.0 (BETA) SPECS:


## THE UI

Needs to be simple, github style perhaps.
The main function of the UI is to display the list of open and passed proposals and issues.


In this regard, it needs to display simple information for each post like:


* Post type (issue or proposal)
* Post title
* Post image (link to an image uploaded on the server when you create the post you can upload one)
* Post description
* Post tags
* Post date
* Username (author)
* Countdown (til it expires)
* Buttons to vote on the issue or proposal



## THE API

The API and storage will be moved to a blockchain eventually, but not for now.
We will not be using any database, for the versatility, longevity and flexibility of the project, to begin with we will instead use JSON files to store each issue or proposal and the results for each will be updated in each file.
We need to pay extra attention to security for this API, we will add 2 layers of validation for the input data:


1. Validation on the form when a member submits a post, limiting the number and type of characters for example on each input element.
2. Validation on the backend using a module like Joi, again limiting the data to certain type of data and size of it, for each parameter / value supplied.


The API will have the following methods:


#### GET
#### POST
#### UPDATE


# The user file

Every time a user posts an issue or a proposal, the first thing we do is to check with FS module if the a file named exactly as the username posting exists, if it does, we add to it, if it doesn't we create it.

We check on page reload if the issues/proposals of each user is older than 1 month, if any of them are older than 1 month we set the status key to one of 3 parameters: _active, passed, cancelled_.


The json file data structure looks like this:

```
[
{
"post-title": "The post title",
"post-image": "url-to-image",
"post-description": "A very detailed description",
"post-date": "Date format either the standard in JS or UNIX",
"post-tags": "tag1, tag2, tag3",
"status": "passed"
},
{
"post-title": "The post title",
"post-image": "url-to-image",
"post-description": "A very detailed description",
"post-date": "Date format either the standard in JS or UNIX",
"post-tags": "tag1, tag2, tag3",
"status": "active",
}
]
```

# Memberships

For the membership system we will have a JSON file with all members with the following structure:

```
[
{"user": "catalina", "staked": 100, "type": "visionary", "expiration": "date", "status": "active"},
{"user": "maria", "staked": 1, "type": "guardian", "expiration": "date", "status": "expired"}
]
```


Every time a user sends the right amount of tokens to the SHIELD wallet, we check all their TX or transactions received from their user to the SHIELD wallet and see if the total amount is correct and if the staking date is less than 6 months old for GUARDINS and 12 months for VISIONARY - compared to the current date.

We do this check on every page reload.

After a membership expires we return all the tokens staked by the user to the user account.


# Authentication

Authentication will be done using the Proton web SDK, the user will use the mobile wallet to sign and authenticate.

This system will be used for BiiP (Biospheric Identity Internet Protocol) as well.
