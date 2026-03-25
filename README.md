# SH39 App

Mobile app built with Expo and React Native.

## Quick start (from GitHub to running app)

### 1) Download the project from GitHub

Ask the project owner for the GitHub repository URL, then run:

```bash
git clone <GITHUB_REPOSITORY_URL>
```

Example:

```bash
git clone https://github.com/<org-or-user>/sh39-app.git
```

Then move into the project:

```bash
cd sh39-app/frontend
```

### 2) Install required software (one-time)

1. Install **Node.js 20 LTS** from [nodejs.org](https://nodejs.org/).
2. Confirm Node and npm are installed:

```bash
node -v
npm -v
```

### 3) Install project dependencies

In `sh39-app/frontend`, run:

```bash
npm install
```

### 4) Start the app

In `sh39-app/frontend`, run:

```bash
npx expo start
```

Keep this terminal open while testing.

## Test on iPhone (iOS)

1. Install `Expo Go` from the App Store.
2. Make sure iPhone and laptop are on the same Wi-Fi network.
3. Start the app on laptop:

```bash
cd sh39-app/frontend
npx expo start
```

4. Open iPhone Camera and scan the QR code from Expo.
5. Tap the prompt to open in Expo Go.

If Camera does not scan the QR:
- open Expo Go and use its built-in QR scanner.

## Test on Android

1. Install `Expo Go` from Google Play.
2. Make sure Android phone and laptop are on the same Wi-Fi network.
3. Start the app on laptop:

```bash
cd sh39-app/frontend
npx expo start
```

4. Open Expo Go.
5. Tap `Scan QR Code` and scan the QR from Expo.

## If QR code does not connect

Use tunnel mode:

```bash
npx expo start --tunnel
```

## Important compatibility note (Expo SDK 54)

This project currently runs on **Expo SDK 54**.

Expo Go may eventually drop support for SDK 54 once it moves to SDK 55+ only.  
To avoid test disruptions, turn off automatic app updates on test devices.

### Turn off auto-updates on iPhone
1. Open `Settings`.
2. Tap `App Store`.
3. Under `Automatic Downloads`, turn off `App Updates`.

### Turn off auto-updates on Android
1. Open `Google Play Store`.
2. Tap profile icon (top right) -> `Settings`.
3. Open `Network preferences` -> `Auto-update apps`.
4. Select `Don't auto-update apps`.


# Next Chapter Scotland article scraper & transformer
## Purpose
This is a Python scrapy project to scrape the [NCS Information Hub](https://www.nextchapterscotland.org.uk/information-hub) and convert it to React Native components.
## Development
- Clone this repo and install requirements using `pip install -r requirements.txt`
- To run the scraper, use `scrapy runspider ncs_infohub/spiders/infohub.py` this will output the scrape data, called `NCSInfoHubArticles.json` in your current directory.
- To run the article transformer, use `python transform_articles.py`. It expects `NCSInfoHubArticles.json` to be in `scraper_output` and will output the final transformed articles, called `articles.json` into `caddy_serve`
## Deployment
### Copy code to server
- Ensure you have `rsync` installed
- Pull the latest changes to the repo: `git pull`
- To copy your local repo files to the server, while in the parent directory of the repo, run the following :
```sh
rsync -avhP -e 'ssh -p 2223' --delete \
    --exclude-from='./ncs_infohub/rsync_exclude_list.txt' \
    --chown=api:api-data \
    --chmod=Du=rwx,Dg=rwx,Do=rx,Fu=rwx,Fg=rwx,Fo=rx \
    ./ncs_infohub \
    root@api.nextchapterscotland.org.uk:/home/api/
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