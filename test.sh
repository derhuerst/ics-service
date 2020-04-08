#!/bin/bash

set -e
set -x

# start server
node example.js &
sleep 1

# fetch feed
curl 'http://localhost:3000/feed'
code=$?

# clean up
kill $!

exit $code
