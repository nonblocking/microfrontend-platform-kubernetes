#!/bin/bash

pods=$(kubectl get pods -o=name | grep "$1" | sed "s/^.\{4\}//")
firstPodInList=$(echo $pods | cut -d' ' -f1)
if [ "$firstPodInList" = "" ]; then 
    echo "Error: "$1" not found"
    exit 1
fi

isPodReady() {
    if [ "$(kubectl get pods $firstPodInList -o 'jsonpath={.status.conditions[?(@.type=="Ready")].status'})" == "True" ] 
        then
            return 0
        else
            return 1
    fi
}

while ! isPodReady;
    do
        echo ""$1" is not ready yet. Please wait until it is ready. This can take a minute or two..."
        sleep 2;

done

echo ""$1" is running and ready."
