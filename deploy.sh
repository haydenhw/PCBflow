#!/usr/bin/env bash


deploy() {
    cd /home/ubuntu/portfolio/PCBflow &&
    git pull origin development &&
    pm2 restart ecosystem.config.js --env production
}

# TODO the -A option is not secure. Come up with a differnt solution
ssh -A -i ~/.ssh/MyKeyPair.pem ubuntu@$ec2ip4 "$(typeset -f deploy); deploy"
