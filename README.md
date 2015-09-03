# Basicbot

Basicbot for our internal bot swarm.  Requires an options objection with commands in it.

Bots require a SLACK_TOKEN env variable.  Please pass this or declare it before initializing the bot.

Requires [slack-client](https://www.npmjs.com/package/slack-client)

## Usage:

	//Require the basicbot package - Usage is as a singleton.  
	var basicbot = require('basicbot');

	//Fly in your options for the bot (expects a cmds parameter)
	var botoptions = require('./lib/botoptions');

	//Initialize the bot
	basicbot(botoptions);

## Options:

	var options = {
		cmds: {
			projects: require("./lib/projects"),
			groups: require("./lib/groups"),
			issues: require("./lib/issues")
		}
	}

## Commands

	var projects(words, callback) {
		if (words[2] === 'destroy'){
			callback('You can't destroy projects.  They destroy you');
		}
	}
	
	module.exports = projects;

Commands should be structured to recieve an array of words of the message recieved and pass a callback containing either:

1. A string to be sent to the channel where the message was recieved.
2. A well formed Slack message object which can contain attachments, etc.  Form it cleanly and you'll have no problems.  Even a single attachment passed as an attachments property needs to be in an array.  

More info here:
[Slack Formatting](https://api.slack.com/docs/formatting)
[Slack Attachments](https://api.slack.com/docs/attachments)
	

Version 1.0.0 // Committed 9/2/2015