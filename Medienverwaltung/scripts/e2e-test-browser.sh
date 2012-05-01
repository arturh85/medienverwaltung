#!/bin/bash
ICEWEASEL=`which iceweasel`
if [ "$?" -eq 1 ];
then
  echo "Iceweasel not found."
  exit 1
fi

BASE_DIR=`dirname $0`

java -jar "$BASE_DIR/../test/lib/jstestdriver/JsTestDriver.jar" \
     --port 9876 \
     --browser $ICEWEASEL \
     --config "$BASE_DIR/../jsTestDriver-scenario.conf" \
     --basePath "$BASE_DIR/.." \
     --testOutput "js-test-reports" \
     --tests all --reset

RESULT=$?
exit $RESULT
