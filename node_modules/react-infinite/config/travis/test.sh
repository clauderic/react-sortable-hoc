#!/bin/bash

if [ "$TEST" = 1 ]; then
    npm run test
fi;

if [ "$TYPECHECK" = 1 ]; then
    npm run typecheck
fi;

if [ "$LINT" = 1 ]; then
    npm run lint
fi;
