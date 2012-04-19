irc-notifier.js: irc-notifier.coffee
	coffee -c $<

all: irc-notifier.js

install-deps:
	npm install irc