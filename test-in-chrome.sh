#!/usr/bin/env bash

run-temp-chrome(){
    USER_DATA_DIR=/tmp/$RANDOM
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
        --user-data-dir=${USER_DATA_DIR} \
        --incognito \
        --no-first-run \
        --window-position=$1,0 \
        --window-size=0,900 \
        "http://localhost:8080/testinchrome"
    rm -R ${USER_DATA_DIR}
}

run-temp-chrome 0 &
run-temp-chrome 150 &
run-temp-chrome 300 &
run-temp-chrome 450 &
run-temp-chrome 600 &
run-temp-chrome 750 &
run-temp-chrome 900 &
run-temp-chrome 1150 &

wait