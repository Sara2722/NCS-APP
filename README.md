# Next Chapter Scotland article scraper & transformer
## Purpose
This is a Python scrapy project to scrape the [NCS Information Hub](https://www.nextchapterscotland.org.uk/information-hub) and convert it to React Native components.
## Development
- Clone this repo and install requirements using `pip install -r requirements.txt`
- To run the scraper, use `scrapy runspider ncs_infohub/spiders/infohub.py` this will output the scrape data, called `NCSInfoHubArticles.json` in your current directory.
## Deployment
### Copy code to server
- Ensure you have `rsync` installed
- Pull the latest changes to the repo: `git pull`
- To copy your local repo files to the server, while in the parent directory of the repo, run the following :
```sh
rsync -avhP -e 'ssh -p 2223' --delete --exclude-from='./ncs_infohub/rsync_exclude_list.txt' --chown=api:api-data --chmod=Du=rwx,Dg=rwx,Do=rx,Fu=rwx,Fg=rwx,Fo=rx ./ncs_infohub root@api.nextchapterscotland.org.uk:/home/api/
```
- If not done already, when prompted, add `api.nextchapterscotland.org.uk` to known hosts.
- Type in the root password
- Next, verify the files copied correctly by SSHing to the api server and checking the directory structure at `/home/api/ncs_infohub`

### Python virtual environment

The Python environment should already be present by default, but if there is no `.venv` directory, you can recreate the venv by running (as root):
```sh
su api
cd ~/ncs_infohub
python3 -m venv .venv
source ./.venv/bin/activate
python3 -m pip install -r requirements.txt
```

### If you modified the systemd configuration
You will need to copy the new config to the corresponding place on the server's file system i.e.
```sh
cp ./ncs_infohub/root/etc/systemd/system/article-scripts.* /etc/systemd/system/
```
Then reload, enable and start with 
```sh
systemctl daemon-reload
systemctl enable article-scripts.timer
systemctl start article-scripts.timer
```
You can check the logs with `journalctl -u article-scripts`

### If you modified the Caddyfile
Validate the new file with:
```sh
caddy validate --config root/etc/caddy/Caddyfile
```
Overwrite the existing Caddyfile:
```sh
cp -f root/etc/caddy/Caddyfile /etc/caddy/Caddyfile
```
Finally, restart Caddy:
```sh
systemctl restart caddy
```
Check logs with `journalctl -u caddy`

## Testing
If you need to run the scrape and transform manually, then run the following (as root):
```sh
su api
cd ~/ncs_infohub
./scrape_and_transform.sh
```
The scraper output will be stored in `scraper_output`, and the final transformed articles in `caddy_serve`. `articles.json` is then copied to `/var/www/api/` where it is served by Caddy.