#!/bin/sh

while true
do
	inotifywait -q -r -e close_write *.coffee
	make all
done
