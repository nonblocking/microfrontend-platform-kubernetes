#!/bin/bash

kubectl run mysql-client --image=mysql:5.7 -it --rm --restart=Never -- mysql -h mysql -u$1 -p$2 -e 'exit'
if [ "$?" -ne 0 ]; then
    echo 'Error: MySQL not working!'
    exit 1
else
    echo 'MySQL works!'
fi