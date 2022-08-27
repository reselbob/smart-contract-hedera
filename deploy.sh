#!/usr/env bash

# ensure that the contact binary exists, if not exit
FILE=sol/bin/PhoneBookContract_sol_PhoneBookContract.bin
if [ -f "$FILE" ]; then
    echo "$FILE exists."
else
    echo "The $FILE does not exist.\nNavigate to the directory named sol and run the bash script compile_byte_code.sh.\nThen, run this script again."
    exit 1
fi

# build the source
npm run build

# copy the env file
cp ./src/.env ./dist/.env

echo "Start the API server.\mOpen a new terminal window and execute the following command after the server starts:\ncurl http://127.0.0.1:5010/ping"

# start the server
node ./dist/index.js

