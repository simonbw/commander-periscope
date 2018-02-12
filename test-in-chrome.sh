#!/usr/bin/env bash

run-temp-chrome(){
    USER_DATA_DIR=/tmp/$RANDOM
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
        --user-data-dir=${USER_DATA_DIR} \
        --incognito \
        --no-first-run \
        --window-position=$1,0 \
        --window-size=0,900 \
        ${URL}
    rm -R ${USER_DATA_DIR}
}

URL="http://localhost:8080/$RANDOM"

# Sleep so that the windows open up in order.
run-temp-chrome 0 &
sleep 0.5
run-temp-chrome 150 &
sleep 0.5
run-temp-chrome 300 &
sleep 0.5
run-temp-chrome 450 &
sleep 0.5
run-temp-chrome 600 &
sleep 0.5
run-temp-chrome 750 &
sleep 0.5
run-temp-chrome 900 &
sleep 0.5
run-temp-chrome 1150 &

wait