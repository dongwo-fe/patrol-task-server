#!/bin/bash

git pull
export NODE_ENV=production && npm run build

pm2 restart patrol@18007