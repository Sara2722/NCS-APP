#!/usr/bin/env bash
# WorkingDirectory=/home/api/ncs_infohub set in article-scripts.service
source .venv/bin/activate
cd scraper_output &&
scrapy runspider ../ncs_infohub/spiders/infohub.py &&
cd ../caddy_serve &&
python ../transform_articles.py &&
cp -f articles.json /var/www/api/