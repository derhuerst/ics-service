#!/bin/bash

set -e
set -x

# start server
node example.js &
sleep 1

# kill child processes on exit
# https://stackoverflow.com/questions/360201/how-do-i-kill-background-processes-jobs-when-my-shell-script-exits/2173421#2173421
trap 'exit_code=$?; kill -- $(jobs -p); exit $exit_code' SIGINT SIGTERM EXIT

# fetch feed
curl 'http://localhost:3000/feed' -sS | grep -m1 'DTSTART:20200808T080800'
code=$?

exit $code
