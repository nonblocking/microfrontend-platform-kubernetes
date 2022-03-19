#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

source ${DIRECTORY}/../../k3d/set-env.sh

envsub ${DIRECTORY}/values_template.yaml ${DIRECTORY}/values.yaml