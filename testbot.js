var Discord = require("discord.js");

var bot = new Discord.Client();

bot.on("message", function(message){
  if(message.content === "test")
  {
    bot.reply(message, "1, 2 ... 1, 2")
  }
});

bot.loginWithToken("MjIwNzU5NDU5NDg2NjI5ODg4.Cqk91Q.bKTZG1qBdsvbS6oFWrmmfyk34Zc");
