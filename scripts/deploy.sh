#!/usr/bin/env sh

ssh deploy@178.128.92.164 "cd /home/deploy/easygo-test/easygo-server && git checkout . && git pull"
