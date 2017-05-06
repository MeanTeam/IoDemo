#!/bin/bash



timestamp() {
  DD=`date "+DATE: %m/%d/%y%tTIME: %H:%M:%S%n%n"`
  printf "$DD"
}



cd ~/data/project/ionic/IoDemo

PATH=$PATH:/usr/local/bin:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
#GMAIL_ACCT
#GMAIL_PASS

DIR=$(pwd)
FILE="IoDemo.apk"
APK_PATH="platforms/android/build/outputs/apk"
KEYSTORE_FILE="$HOME/sisodemoapp.keystore"
ORIG_FILE="android-release-unsigned.apk"
DEST_APK_FILE="$DIR/$APK_PATH/$FILE"
ORIG_APK_FILE="$DIR/$APK_PATH/$ORIG_FILE"
SEND_EMAIL_PATH="$HOME/data/project/node/sendAPKmail"
GIT="N"
EMAIL="N"

if [ -n $1 ] && [ "$1" = "git" ]; then
    GIT="Y"
fi
if [ -n $2 ] && [ "$2" = "email" ]; then
    EMAIL="Y"
fi

if [ "Y" = "$GIT" ]; then
    timestamp
    printf "\n\n\t**************************"
    printf "\n\t* Pulling up from GitHub *"
    printf "\n\t**************************"
    printf "\n\n"
    git pull upstream master

else
    timestamp
    printf "\n\n\t**************************"
    printf "\n\t* Not pulled from GitHub *"
    printf "\n\t**************************"
    printf "\n\n"
fi

timestamp
printf "\n\nCurrent directory $DIR\n\n"
printf "Building IoDemo.apk file\n\n"

/usr/local/bin/gulp add-proxy
/usr/local/bin/ionic build android --release

printf "\n\nChecking if $ORIG_APK_FILE exists\n\n"

if [ -e "$ORIG_APK_FILE" ]; then

  if [ -e "$DEST_APK_FILE" ]; then
	rm $DEST_APK_FILE
  fi

  timestamp
  printf "\nrenaming $ORIG_FILE file for $FILE\n\n"
  mv "$ORIG_APK_FILE" "$DEST_APK_FILE"

  jarsigner -tsa http://timestamp.digicert.com -sigalg SHA1WithRSA -digestalg SHA1 -keystore "$KEYSTORE_FILE" -storepass demosiso "$DEST_APK_FILE" sisodemo

  if [ "Y" = "$EMAIL" ]; then
    printf timestamp
    printf "Sending email\n"
    printf "Changing to directory $SEND_EMAIL_PATH\n\n"
    cd $SEND_EMAIL_PATH
    GMAIL=$GMAIL_ACCT GMAIL_PASS=$GMAIL_PASS DEST_APK_FILE=$DEST_APK_FILE node index.js
  else
    timestamp
    printf "\n\n\t**************************"
    printf "\n\t*   Not sent by Email    *"
    printf "\n\t**************************"
    printf "\n\n"
  fi

else
	echo "The $ORIG_APK_FILE does not exist\n"
fi

