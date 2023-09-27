#!/bin/bash

git pull
npm run build

pm2 restart patrol@18007