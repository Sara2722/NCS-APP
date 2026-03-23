# Next Chapter Scotland article scraper
## Purpose
This is a Python scrapy project to scrape the [NCS Information Hub](https://www.nextchapterscotland.org.uk/information-hub) and convert it to React Native components.
## Development
- Clone this repo and install requirements using `pip install -r requirements.txt`
- To run the scraper use `scrapy runspider ncs_infohub/spiders/infohub.py` this will output the scrape data, called `NCSInfoHubArticles.json` in your current directory.
## Deployment
- SSH to api.nextchapterscotland.org.uk:2223
- 