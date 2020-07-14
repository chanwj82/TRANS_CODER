set SERVICE_NAME=PAGODA-TRANSCODER-NODE-01

cd ..

bin\nssm.exe install "%SERVICE_NAME%" "%JAVA_HOME%\bin\java.exe"

bin\nssm.exe set "%SERVICE_NAME%" AppDirectory "%cd%"

bin\nssm.exe set "%SERVICE_NAME%" AppParameters "-Xms256m -Xmx512m -DServiceName=%SERVICE_NAME% -DServiceHttpdPort=8787 -DWebAppContextPath=/transcoder -Dspring.profiles.active=dev -jar Transcoder2.1-1.0-RELEASE.jar"

bin\nssm.exe set "%SERVICE_NAME%" Description "Transcoder web application"
bin\nssm.exe set "%SERVICE_NAME%" Start SERVICE_AUTO_START

bin\nssm.exe set "%SERVICE_NAME%" AppStderr "%cd%/logs/console.log"

msg * Service "%SERVICE_NAME%" installed successfully!