irc = require('irc')
fs = require('fs')
exec = require('child_process').exec

notifyTime = 1000

confFile = process.argv[2]
conf = JSON.parse fs.readFileSync("#{confFile || 'default'}.conf.json")

client = new irc.Client(conf.host, conf.nick)

setTimeout(->
	client.join conf.channel, ->
		console.log "Joined #{conf.channel}"
, 3000)


client.on 'message', (from, to, msg) ->
	notify "#{from}:", msg

notify = (title, sub) ->
	console.log "Notify #{title} #{sub}"
	exec "notify-send -t #{notifyTime} '#{makeSafe title}' '#{makeSafe sub}'"

makeSafe = (text) ->
	text.replace("'", '`')


client.on 'error', (err) ->
	console.log "Error"
	console.log err