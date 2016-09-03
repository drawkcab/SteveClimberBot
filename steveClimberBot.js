var env = require('./config.json');

var champlist = require('./champion.json');

var Discord = require("discord.js");

var bot = new Discord.Client();

var request = require('request');

//Hash table for weather emoji based off of api response
var weatherEmoji = {
"01d":":sun_with_face:", "01n":":full_moon_with_face:",
"02d":":white_sun_small_cloud:","02n":":white_sun_small_cloud:",
"03d":":cloud:","03n":":cloud:",
"04d":":white_sun_cloud:","04n":":white_sun_cloud:",
"09d":":cloud_rain:","09n":":cloud_rain:",
"10d":":white_sun_rain_cloud:","10n":":cloud_rain:",
"11d":":thunder_cloud_rain:","11n":":thunder_cloud_rain:",
"13d":":cloud_snow:","13n":":cloud_snow:",
"50d":":fog:","50n":":fog:"};

var position = ["Top ", "Middle ", "Jungle ", "Bot "];
var role = ["Duo ", "Support ", "Carry ", "Solo "];

var summonerid = "";
var summonername = "";
var summonerlevel = "";
var subject = "";

bot.on("message", function(message){
  var input = message.content.toLowerCase().split(" ");
  var command = input.shift();
  subject = input.join("+");
  var channelt = message.channel;
  var channelv = message.author.voiceChannel;
  var user = message.author.username;
  var connection = bot.internal.voiceConnection;

  var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
  };

  bot.setStatus('here',"with the Flextrek 37,000,000,000,000 Whip Snake Edition");

  if(command === "!help"){
    bot.sendMessage(message, "Here is everything I have in my Flextrek 37,000,000,000,000 Whip Snake Edition: \n"+
      "`!cat` Provides you with amazing facts about cats.\n"+
      "`!gif [content]` Provides a random gif based on given content. \n"+
      "`!help` How you got here.... \n"+
      "`!lmgtfy [content]` Let Me Google That For You. \n"+
      "`!lol [content]` Based on the summoner name provided this shows stats from the last three games played. \n"+
      "`!ping` pong. \n"+
      "`!w [content]` Provides the weather forecast for a given location.");
  }

  if(command === "!ping"){
    bot.sendMessage(message, "pong")
  }

  if(command === "!cat"){
    var search = "http://catfacts-api.appspot.com/api/facts";
    request(search, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        var obj = JSON.parse(body);
        console.log(obj.facts);
        bot.sendMessage(message, obj.facts);
      }
    });
  }

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

  if(command === "!lol"){
    if(subject != ""){
      function userNameReq(sub){
        var search = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/"+sub+"?api_key="+env.league;
        request(search, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log(body);
            var obj = JSON.parse(body);
            var count = 0;
            for (var key in obj){
              if (count != 1){
                summonerid = obj[key].id;
                summonername = obj[key].name;
                summonerlevel = obj[key].summonerLevel;
                console.log(summonerid);
                count = 1;
              }
            }
            count = 0;
          }
        });
        var timer = setTimeout(function () {
          gameReq(summonerid);
        }, 1000);
      }

      function gameReq(summonerid){
        var search2 = "https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/"+ summonerid +"/recent?api_key="+env.league;
        console.log(summonerid + " second");
        request(search2, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log(body);
            var line = "~~                                                                                                   ~~"
            var obj = JSON.parse(body);
            var topthree = [];
            for (var key in obj.games){
              topthree.push(obj.games[key].gameId);
              topthree.sort(function(a, b){return b-a});
              console.log(topthree);
            }
            bot.sendMessage(message, "**Here are the last 3 games played by "+ summonername+":** \n"+line);
            var timer = setTimeout(function () {
              var maxLoops = 3;
              var counter = 0;
              topthree = topthree.slice(0, 3);
              console.log("here"+topthree);
              (function next() {
                  if (counter++ >= maxLoops) return;
                  setTimeout(function() {
                    for(var keys in obj.games){
                      if(obj.games[keys].gameId === topthree[counter-1]){
                        console.log("inside"+ obj.games[keys].gameId +" "+topthree[counter-1]);
                        var countgame = obj.games[keys],
                        date = new Date(countgame.createDate),
                        gametype = countgame.subType.split("_").join(" "),
                        stat = countgame.stats,
                        champ = countgame.championId.toString(),
                        ckill = (stat.championsKilled != undefined ?  stat.championsKilled : 0),
                        cdeath = (stat.numDeaths != undefined ?  stat.numDeaths : 0),
                        assist = (stat.assists != undefined ?  stat.assists : 0),
                        side = (countgame.teamId === 100 ?  "Blue" : "Red"),
                        minions = (stat.minionsKilled != undefined ?  stat.minionsKilled : 0),
                        turrets = (stat.turretsKilled != undefined ?  stat.turretsKilled : 0),
                        barracks = (stat.barracksKilled != undefined ?  stat.barracksKilled : 0),
                        totalDamDealt = (stat.totalDamageDealt != undefined ?  stat.totalDamageDealt : 0),
                        mDamDealt = (stat.magicDamageDealtPlayer != undefined ?  stat.magicDamageDealtPlayer : 0),
                        pDamDealt = (stat.physicalDamageDealtPlayer != undefined ?  stat.physicalDamageDealtPlayer : 0),
                        tDamDealt = (stat.trueDamageDealtPlayer != undefined ?  stat.trueDamageDealtPlayer : 0),
                        totalDamTaken = (stat.totalDamageTaken != undefined ?  stat.totalDamageTaken : 0),
                        mDamTaken= (stat.magicDamageTaken != undefined ?  stat.magicDamageTaken : 0),
                        pDamTaken = (stat.physicalDamageTaken != undefined ?  stat.physicalDamageTaken : 0),
                        tDamTaken = (stat.trueDamageTaken != undefined ?  stat.trueDamageTaken : 0),
                        wards = (stat.wardKilled != undefined ?  stat.wardKilled : 0),
                        largestMultiKill = (stat.largestMultiKill != undefined ?  stat.largestMultiKill : 0),
                        goldEarned = (stat.goldEarned != undefined ?  stat.goldEarned : 0),
                        totalHeal = (stat.totalHeal != undefined ?  stat.totalHeal : 0),
                        wardPlaced = (stat.wardPlaced != undefined ?  stat.wardPlaced : 0),
                        jungle = (stat.neutralMinionsKilledYourJungle != undefined  ?  stat.neutralMinionsKilledYourJungle : 0),
                        smonster = (stat.superMonsterKilled != undefined  ?  stat.superMonsterKilled : 0),
                        victory = (stat.win ? "Victory" : "Defeat");

                        var finalPosition = "";

                        if (role[stat.playerRole-1] === undefined){
                          finalPosition = ""+champlist.data[champ].name;
                        } else {
                          finalPosition = ""+role[stat.playerRole-1]+position[stat.playerPosition-1]+champlist.data[champ].name;
                        }



                        console.log(countgame.gameId);
                        console.log(countgame.stats.neutralMinionsKilledYourJungle);

                        bot.sendMessage(message," \n "+gametype +" on "+
                          date.toLocaleTimeString("en-us", options)+" on "+ side +" side. \n```"+ victory +" as "+
                          finalPosition+" "+ckill+"/"+cdeath+"/"+assist+
                          " \n\nKilled:\nMinions:"+minions+" Turrets:"+turrets+
                          " Barracks:"+barracks+" Monsters:"+jungle+
                          " Super Monsters:"+smonster+" Wards:"+wards+"\n\nDamage Dealt:\nTotal:"+
                          totalDamDealt+" Magic:"+mDamDealt+" Physical:"+pDamDealt+" True:"+tDamDealt+
                          "\n\nDamage Received:\nTotal:"+totalDamTaken+" Magic:"+mDamTaken+" Physical:"+
                          pDamTaken+" True:"+tDamTaken+"\n\nOther:\nLargest Multi Kill:"+largestMultiKill+
                          " Gold Earned:"+goldEarned+" Total Heal:"+totalHeal+" Wards Placed:"+wardPlaced+"```\n");
                      }
                    }
                    next();
                  }, 200);
              })();
            }, 500);
          }
        });
      }

      userNameReq(subject);


    } else {
      console.log("No subject with lol.");
      bot.sendMessage(message, "The !lol command requires content after the command. Please try !lol [Summoner name].");
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
