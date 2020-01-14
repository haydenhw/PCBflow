#!/usr/bin/env bash


deploy() {
    cd /home/ubuntu/portfolio/PCBflow &&
    git pull origin development &&
    pm2 start ecosystem.config.js --env production
}

ssh -i ~/.ssh/MyKeyPair.pem ubuntu@$ec2ip4 "$(typeset -f deploy); deploy"
