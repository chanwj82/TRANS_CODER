#!/bin/sh
### ====================================================================== ###
##                                                                          ##
##  PAGODA-GUARDIAN-NODE-01 Service Stop Script                              ##
##                                                                          ##
### ====================================================================== ###

PID=`ps -ef | grep "PAGODA-TRANSCODER-NODE-01" | grep -v grep | awk '{print $2}'`
if [ "$PID" = "" ]
then
        echo "Process Not Running....."
else
        kill -15 $PID
        echo "Process $PID killed!"
fi