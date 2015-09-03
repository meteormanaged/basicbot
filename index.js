var makeMention = function (userId) {
	'use strict';
	return '<@' + userId + '>';
};

var isDirect = function (userId, messageText) {
	'use strict';
	var userTag = makeMention(userId);
	return messageText &&
		messageText.length >= userTag.length &&
		messageText.substr(0, userTag.length) === userTag;
};

var tokenProvided = function (SLACK_TOKEN) {
	'use strict';
	if (SLACK_TOKEN === undefined) {
		console.log("You should pass a SLACK_TOKEN as an environmental variable.  Otherwise, I'm not going to work.");
		return false;
	} else {
		console.log("You provided a SLACK_TOKEN");
		return SLACK_TOKEN;
	}
};

var hasOptions = function (options) {
	'use strict';
	if (typeof options === 'undefined') {
		console.log("You didn't include any commands so the bot won't do anything.");
		return false;
	}
	if (typeof options === 'object') {
		console.log("You passed an options object with the following commands: " + Object.keys(options.cmds).join(", "));
		return true;
	} else {
		console.log("You should pass it an options object so it can do something.  I don't know what to do with this.");
		return false;
	}
};

var checkMessage = function (message) {
	'use strict';
	if (!message.text) {
		console.log("Somehow I fired but didn't get the message.  Dependency bug.");
		return false;
	}

	var words = message.text.split(" ");

	if (words.length < 2) {
		console.log("No command given.");
		return false;
	} else {
		var cmd = words[1];
		return cmd;
	}

};

module.exports = function (options) {
	'use strict';
	var SLACK_TOKEN = process.env.SLACK_TOKEN;
	if (!tokenProvided(SLACK_TOKEN) || !hasOptions(options)) {
		return false;
	}
	
	var Slack = require('slack-client');
	var slack = new Slack(process.env.SLACK_TOKEN, true, true);


	slack.on('open', function () {

		var channels = Object.keys(slack.channels)
			.map(function (k) {
				return slack.channels[k];
			})
			.filter(function (c) {
				return c.is_member;
			})
			.map(function (c) {
				return c.name;
			});

		var groups = Object.keys(slack.groups)
			.map(function (k) {
				return slack.groups[k];
			})
			.filter(function (g) {
				return g.is_open && !g.is_archived;
			})
			.map(function (g) {
				return g.name;
			});

		console.log('Welcome to Slack. You are ' + slack.self.name + ' of ' + slack.team.name);

		if (channels.length > 0) {
			console.log('You are in: ' + channels.join(', '));
		} else {
			console.log('You are not in any channels.');
		}

		if (groups.length > 0) {
			console.log('As well as: ' + groups.join(', '));
		}


	});

	slack.login();

	slack.on('message', function (message) {

		var channel = slack.getChannelGroupOrDMByID(message.channel);
		var user = slack.getUserByID(message.user);

		//If mentioned or is direct
		if (message.type === 'message' && isDirect(slack.self.id, message.text)) {

			var cmd = checkMessage(message);
			if (!cmd) {
				return false;
			}

			if (!message.text) {
				console.log("bug fix for message split popped.");
				return false;
			}

			//What command and do I have it?

			if (!options.cmds.hasOwnProperty(cmd)) {
				channel.send("lolwat?  I have the following commands: " + Object.keys(options.cmds).join(", "));
				return false;
			}
			options.cmds[cmd](message.text.split(" "), function (response) {
				if (typeof response === 'object') {
					channel.postMessage(response);
					return;
				} else {
					channel.send(response);
					return;
				}
			});
		}
	});

};
