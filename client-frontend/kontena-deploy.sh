#!/usr/bin/env bash

set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)
SERVICE_NAME=client-frontend
PROJECT_NAME=f
PROJECT_NAME_LONG=example-kontena-feature-branches
REGISTRY_NAME=registry.dev.kontena.local
SERVICE=${PROJECT_NAME}-${SERVICE_NAME}-${BRANCH}

ARGS="--grid dev
-e PORT=8080
-e KONTENA_LB_INTERNAL_PORT=8080
-e KONTENA_LB_KEEP_VIRTUAL_PATH=true
-e KONTENA_LB_VIRTUAL_PATH=/${BRANCH}
-e API_HOST=${PROJECT_NAME}-client-backend
-e API_URL=http://${PROJECT_NAME}-client-backend:3000/api/
-l ${PROJECT_NAME}-client-backend
-l ${PROJECT_NAME}-lb-client"

npm run docker:build
npm run docker:tag
npm run docker:push

if kontena service show ${SERVICE} > /dev/null 2>&1
then
  echo "Updating kontena service"
  kontena service update ${ARGS} ${SERVICE}
else
  echo "Creating kontena service"
  kontena service create ${ARGS} ${SERVICE} ${REGISTRY_NAME}/${PROJECT_NAME_LONG}/${SERVICE_NAME}:${BRANCH}
fi

echo "Deploying kontena service"
kontena service deploy ${SERVICE}

kontena service show ${SERVICE}
