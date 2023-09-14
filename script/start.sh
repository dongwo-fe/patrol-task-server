#!/bin/bash

pm2 list

cd /home/www

pm2 start pm2.json

pm2 logs