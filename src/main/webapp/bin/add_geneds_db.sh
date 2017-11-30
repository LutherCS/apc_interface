#!/bin/bash
#
# Start the MongoDB service
# echo"[info] Starting the Mongo Daemon..."
# sudo service mongod start

#	Load data included in mock_data.js into table apcdata
echo "[info] Adding geneds collection to db from file genEdData.json."
mongoimport --db apcdata --collection geneds  --type json --file ./genEdData.json  --jsonArray
