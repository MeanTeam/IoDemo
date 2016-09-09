#!/usr/bin/env bash

printf "Param one: $1\n\n\n"
PARAM="$1"
GIT="N"
EMAIL="N"

if [ -n $1 ] && [ "$1" = "git" ]; then
    GIT="Y"
fi
if [ -n $2 ] && [ "$2" = "email" ]; then
    EMAIL="Y"
fi

printf "Is GIT = $GIT \n"
printf "Is EMAIL = $EMAIL \n"

if [ "git" = "$1" ]; then
    printf "Param received and is 'git'"
else
    printf "No param received or no evaluated"
fi
