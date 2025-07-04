#!/bin/bash
cd /home/kavia/workspace/code-generation/sketchguess-challenge-105745-105766/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

