#!/bin/bash

source ./set-env.sh


echo "Creating registry '${LOCAL_REGISTRY_NAME}'..."

k3d registry create ${LOCAL_REGISTRY_NAME} --port ${LOCAL_REGISTRY_PORT}

echo "Adding k3d-${LOCAL_REGISTRY_NAME} to /etc/hosts."

# credit for the next view lines goes to https://gist.github.com/irazasyed/a7b0a079e7727a4315b9
IP="127.0.0.1"
HOSTNAME="k3d-${LOCAL_REGISTRY_NAME}"
HOSTS_LINE="$IP\t$HOSTNAME"
if [ -n "$(grep $HOSTNAME /etc/hosts)" ]
then
    echo "$HOSTNAME already exists : $(grep $HOSTNAME $ETC_HOSTS)"
else
    echo "Adding $HOSTNAME to your $ETC_HOSTS";
    sudo -- sh -c -e "echo '$HOSTS_LINE' >> /etc/hosts";

    if [ -n "$(grep $HOSTNAME /etc/hosts)" ]
    then
        echo "$HOSTNAME was added succesfully \n $(grep $HOSTNAME /etc/hosts)";
    else
        echo "Failed to Add $HOSTNAME, Try again!";
    fi
fi
