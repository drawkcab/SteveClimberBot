var env = require('./config.json');

var Discord = require("discord.js");

var bot = new Discord.Client();

var request = require('request');

//Hash table for weather emoji based off of api response
var weatherEmoji = {
"01d":":sun_with_face:", "01n":":full_moon_with_face:",
"02d":":white_sun_small_cloud","02n":":white_sun_small_cloud",
"03d":":cloud:","03n":":cloud:",
"04d":":white_sun_cloud:","04n":":white_sun_cloud:",
"09d":":cloud_rain:","09n":":cloud_rain:",
"10d":":white_sun_rain_cloud:","10n":":cloud_rain:",
"11d":":thunder_cloud_rain:","11n":":thunder_cloud_rain:",
"13d":":cloud_snow:","13n":":cloud_snow:",
"50d":":fog:","50n":":fog:"};

bot.on("message", function(message){
  var input = message.content.toLowerCase().split(" ");
  var command = input.shift();
  var subject = input.join("+");
  var channelt = message.channel;
  var channelv = message.author.voiceChannel;
  var user = message.author.username;
  var connection = bot.internal.voiceConnection;
  bot.setStatus('here',"with the Flextrek 37,000,000,000,000 Whip Snake Edition");

  if(command === "!help"){
    bot.sendMessage(message, "Hi! welcome to channel. Here is a list of commands I know: \n!ping : pong, \n!help : How you got here...., \n!gif [content] : Provides a random gif based on given content., \n!lmgtfy [content] : Let Me Google That For You, \n!w [content] : Provides the weather forcast for given location.");
  }

  if(command === "!ping"){
    bot.sendMessage(message, "pong")
  }

//gifs might need to be improved
  if(command === "!gif"){
    if(subject != ""){
      console.log(subject);
      var search = "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag="+subject;
      request(search, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          body = body.split("\\").join("");
          var obj = JSON.parse(body);
          obj = obj["data"].url;
          console.log(obj);
          bot.sendMessage(message, obj);
        }
      });
    } else {
      console.log("No subject with gif.");
      bot.sendMessage(message, "The !gif command requires content after the command. Please try !gif [content].");
    }
  }

  if(command === "!lmgtfy"){
    if(subject != ""){
      console.log(subject);
      bot.sendMessage(message, "http://lmgtfy.com/?q="+subject);
    } else {
      console.log("No subject with lmgtfy.");
      bot.sendMessage(message, "The !lmgtfy command requires content after the command. Please try !lmgtfy [content].");
    }
  }

  if(command === "!w"){
    if(subject != ""){
      console.log(subject);
      var search = "http://api.openweathermap.org/data/2.5/weather?q="+subject+"&appid="+env.weather+"&units=imperial";
      console.log(search);
      request(search, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
          var obj = JSON.parse(body);
          bot.sendMessage(message, weatherEmoji[obj.weather[0].icon]);
          bot.sendMessage(message, "The weather for "+obj.name+", "+obj.sys.country+
            ":\nCurrent Temp: "+obj.main.temp+"F\nHigh: "+obj.main.temp_max+"F\nLow: "+obj.main.temp_min
            +"F\nWeather: "+obj.weather[0].main+" - "+obj.weather[0].description+"\nWind: "+obj.wind.speed);
          // obj = obj["data"].url;
          // console.log(obj);
          // bot.sendMessage(message, obj);
        }
      });
    } else {
      console.log("No subject with weather.");
      bot.sendMessage(message, "The !w command requires content after the command. Please try !w [content].");
    }
  }

  if(command === "!3"){
      bot.joinVoiceChannel(channelv);
      bot.sendMessage(message, "im in "+ channelv);
      bot.leaveVoiceChannel(channelv);
      // .playFile("./sounds/airhornTriple.mp3",{volume:0.5});
      // bot.leaveVoiceChannel("General");
    // join(channel);
    // bot.voiceConnection.playFile('./sounds/airhornTriple.mp3').then(intent => {
    //   intent.on("end", () => {
    //     bot.leaveVoiceChannel(channel);
    //   })
    // })
  }
});

console.log("running");

bot.loginWithToken(env.discord);
