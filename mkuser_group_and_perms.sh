#!/usr/bin/env bash
useradd -r -m -s /bin/bash api
groupadd api-data

usermod -aG api-data api
usermod -aG api-data caddy

mkdir -p /var/www/api

chown -R api:api-data /home/api/ncs_infohub
chown -R api:api-data /var/www/
chmod -R 775 /home/api/ncs_infohub
chmod -R 775 /var/www/
sudo chmod g+s /home/api/ncs_infohub