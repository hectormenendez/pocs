const Twitter = require('twitter');
const FS = require('fs');
const Path = require('path');

const track = '#AppleEvent';
const filename = '20171209_iphonex-launch.json';

const path = {};
// if this does not resolve, it means that you're not me ;)
path.root = Path.join(process.env.HOME, 'Source', 'data');
path.dest = Path.join(path.root, 'tweet-streams');
path.config = Path.join(path.root, 'etor', 'credentials-twitter-bot.json');

var client = new Twitter(require(path.config));

const file = Path.join(path.dest, filename);
try { FS.unlinkSync(file); } catch(e) { }

client.stream('statuses/filter', {track},  function(stream) {
  stream.on('data', function(tweet) {
      FS.appendFile(file, JSON.stringify(tweet) + ',\n', function(err){
          if (!err) console.log(tweet.text);
      })
  });

  stream.on('error', function(error) {
      console.error('ERROR', error);
  });

});
