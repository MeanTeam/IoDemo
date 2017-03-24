#!/bin/bash

cordova plugin rm cordova-plugin-geofence
cordova plugin rm cordova-plugin-geofence-test

cordova plugin add ~/Documents/app/ionic/ionic-geofence/plugins/geofence
cordova plugin add ~/Documents/app/ionic/ionic-geofence/geofence/tests

cordova prepare
