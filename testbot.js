var Discord = require("discord.js");

var request = require('request');

var bot = new Discord.Client();

bot.on("message", function(message){
  var input = message.content.toLowerCase().split(" ");
  var command = input.shift();
  var subject = input.splice(1).join("+");

  if(command === "!test"){
    bot.reply(message, "1, 2 ... 1, 2")
  }

  if(command === "!ping"){
    bot.sendMessage(message, "pong")
  }
//gifs might need to be improved
  if(command === "!gif"){
    var search = "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag="+subject;
    request(search, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        body = body.split("\\").join("")
        var obj = JSON.parse(body)
        obj = obj["data"].url;
        console.log(obj);
        bot.sendMessage(message, obj);
      }
    });
  }
});

console.log("running");

bot.loginWithToken("MjIwNzU5NDU5NDg2NjI5ODg4.Cqk91Q.bKTZG1qBdsvbS6oFWrmmfyk34Zc");
