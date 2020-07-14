TITLE PAGODA-TRANSCODER-NODE-01
%REM chcp 65001
cd ..
java -Xms256m -Xmx512m -DServiceName=PAGODA-TRANSCODER-NODE-01 -DServiceHttpdPort=8787 -DWebAppContextPath=/transcoder -Dspring.profiles.active=dev -jar Transcoder2.1-1.0-RELEASE.jar