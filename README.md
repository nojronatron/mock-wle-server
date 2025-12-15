# Mock Winlink Server

The purpose of this repository is to provide a Form Server for testing and developing Winlink Forms.

## Overview

This is a placeholder, more information will be added in the near future.

## Install

1. Clone this repository and change to the clone directory root.
2. If using Windows, install WSL and select a Linux distribution of your preference (at the time of this writing, I'd recommend Ubuntu 22.04). Open a WSL shell before continuing.
3. In Linux (or WSL) update packages using `sudo apt update` etc.
4. Install NVM (Node Version Manager) from [nvm-sh on github](https://github.com/nvm-sh/nvm?tab=readme-ov-file). Use WGET or CURL as directed.
5. Use NVM to install latest Node version: `nvm install node`.
6. Verify node and NPM installation with `node --version` and `npm --version` accordingly. Fix any issues before continuing.
7. Install dependencies using `npm install`.

## Configure and Use

1. Copy your Winlink Template and Form file(s) to the `public/views` directory.
2. Copy `.env.example` contents to a new file named `.env` and update the form name and server port (if default already in use).
3. Execute `npm run devStart` to start the server.
4. Update `.env` FORM_SERVER_HOSTNAME with the server hostname (do not include http/s protocol prefix nor any trailing slash `/`).
  - If running in VSCode, a prompt might request opening a browser. Instead, paste the forwarded address (from the PORTS panel) into a new browser/tab.
  - Otherwise, maually open a browser and point to `https://{FORM_SERVER_HOSTNAME}:{API_PORT}` to launch the configured form (where FORM_SERVER_HOSTNAME and API_PORT are values you configured in the `.env` file).
5. Fill out the loaded Form and click the Submit button.
6. Review the Terminal output to see the JSON representation of the data the Form is configured to send.

## Notes

- By design `.gitignore` will not allow checking in your ENV file, nor any Winlink Form file(s) to copy-in to `public/views`.
