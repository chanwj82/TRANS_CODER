#!/bin/sh
### ====================================================================== ###
##                                                                          ##
##  PAGODA-GUARDIAN-NODE-01 Service Start Script                             ##
##                                                                          ##
### ====================================================================== ###

PID=`ps -ef | grep "PAGODA-TRANSCODER-NODE-01" | grep -v grep | awk '{print $2}'`
if [ "$PID" != "" ]
then
        echo ""
        echo "PAGODA-TRANSCODER-NODE-01 Already Running! PID=$PID"
        echo ""
        exit;
fi

cd ..

echo java -Xms256m -Xmx512m -DServiceName=PAGODA-TRANSCODER-NODE-01 -DServiceHttpdPort=8787 -DWebAppContextPath=/transcoder -Dspring.profiles.active=dev -jar Transcoder2.1-1.0-RELEASE.jar
nohup java -Xms256m -Xmx512m -DServiceName=PAGODA-TRANSCODER-NODE-01 -DServiceHttpdPort=8787 -DWebAppContextPath=/transcoder -Dspring.profiles.active=dev -jar Transcoder2.1-1.0-RELEASE.jar >> logs/console.log &