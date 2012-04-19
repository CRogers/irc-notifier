(function() {
  var batch, client, conf, confFile, exec, fs, irc, lastBatch, makeSafe, notify, postBatch;
  irc = require('irc');
  fs = require('fs');
  exec = require('child_process').exec;
  batch = [];
  lastBatch = 0;
  confFile = process.argv[2];
  conf = JSON.parse(fs.readFileSync("" + (confFile || 'default') + ".conf.json"));
  client = new irc.Client(conf.host, conf.nick);
  setTimeout(function() {
    return client.join(conf.channel, function() {
      return console.log("Joined " + conf.channel);
    });
  }, 3000);
  postBatch = function() {
    var body;
    if (batch.length > 0) {
      body = batch.join("\n");
      batch = [];
      return notify(conf.channel, body);
    }
  };
  if (conf.batchTime) {
    setInterval(postBatch, conf.batchTime);
  }
  client.on('message', function(from, to, msg) {
    if (!conf.batchTime) {
      return notify("" + from + ":", msg);
    } else {
      return batch.push("" + from + ": " + msg);
    }
  });
  notify = function(title, sub) {
    console.log("Notify " + title + " " + sub);
    return exec("notify-send '" + (makeSafe(title)) + "' '" + (makeSafe(sub)) + "'");
  };
  makeSafe = function(text) {
    return text.replace("'", '`');
  };
  client.on('error', function(err) {
    console.log("Error");
    return console.log(err);
  });
}).call(this);
