#!/usr/bin/env sh

ssh $REMOTEUSER@$REMOTEHOST
cd  $REMOTEAPPDIR
git checkout .
git pull
pm2 restart easygo

# tar -czf package.tgz build && \
# scp package.tgz $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR && \
# ssh $REMOTE_USER@$REMOTE_HOST 'bash -s' < ./scripts/untar.sh