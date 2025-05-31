#!/bin/bash
cd /home/kavia/workspace/code-generation/luxmatch-pro-16493-80ec99fd/luxmatch_pro
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

