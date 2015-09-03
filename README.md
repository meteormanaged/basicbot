# Basicbot

Basicbot for our internal bot swarm.  Accepts an options objection with commands in it.

Example usage:

```//Require the basicbot package
var basicbot = require('basicbot');

//Fly in your options for the bot (expects a cmds parameter)
var botoptions = require('./lib/botoptions');

//Initiate the bot
basicbot(botoptions);```
