(function() {
  var client, conf, confFile, exec, fs, irc, makeSafe, notify, notifyTime;
  irc = require('irc');
  fs = require('fs');
  exec = require('child_process').exec;
  notifyTime = 1000;
  confFile = process.argv[2];
  conf = JSON.parse(fs.readFileSync("" + (confFile || 'default') + ".conf.json"));
  client = new irc.Client(conf.host, conf.nick);
  setTimeout(function() {
    return client.join(conf.channel, function() {
      return console.log("Joined " + conf.channel);
    });
  }, 3000);
  client.on('message', function(from, to, msg) {
    return notify("" + from + ":", msg);
  });
  notify = function(title, sub) {
    console.log("Notify " + title + " " + sub);
    return exec("notify-send -t " + notifyTime + " '" + (makeSafe(title)) + "' '" + (makeSafe(sub)) + "'");
  };
  makeSafe = function(text) {
    return text.replace("'", '`');
  };
  client.on('error', function(err) {
    console.log("Error");
    return console.log(err);
  });
}).call(this);
