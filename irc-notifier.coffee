irc = require('irc')
fs = require('fs')
exec = require('child_process').exec

batch = []
lastBatch = 0

confFile = process.argv[2]
conf = JSON.parse fs.readFileSync("#{confFile || 'default'}.conf.json")


client = new irc.Client(conf.host, conf.nick)

setTimeout(->
	client.join conf.channel, ->
		console.log "Joined #{conf.channel}"
, 3000)


postBatch = ->
	if batch.length > 0
		body = batch.join("\n")
		batch = []
		notify conf.channel, body

if conf.batchTime
	setInterval(postBatch, conf.batchTime)



client.on 'message', (from, to, msg) ->
	if not conf.batchTime
		notify "#{from}:", msg
	else
		batch.push "#{from}: #{msg}"

notify = (title, sub) ->
	console.log "Notify #{title} #{sub}"
	exec "notify-send '#{makeSafe title}' '#{makeSafe sub}'"

makeSafe = (text) ->
	text.replace("'", '`')


client.on 'error', (err) ->
	console.log "Error"
	console.log err