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
2. Copy `.env.example` contents to a new file named `.env` and update the form name, the current server name (or localhost), and assign an available port you want the server to run on.
  - If running in CodeSpaces: See additional information below.
3. Update `.env` FORM_SERVER_HOSTNAME with the server hostname without trailing slash:
  - Local development: Use localhost and a valid, available port.
  - Local unsecured dev: Prefix server identification with 'http:' and an available port number.
4. Execute `npm run devStart` to start the server.
5. Fill out the loaded Form in the browser. Click the Submit button when done.
6. Review the Server's Terminal output to see the JSON representation of the data the Form is configured to send.

### Codespaces

Codespaces uses port forwarding to allow external requests to reach the server, so you will need to discover the full servername URI before adding FORM_SERVER_HOSTNAME to `.env`.

1. Start the server: `npm run devStart`.
2. Look in the PORTS panel and copy the forwarded address (the entire URI).
3. Paste the entire URI to the `.env` as the FORM_SERVER_HOSTNAME except for the last `/` character.
4. Complete the rest of the configuration steps as listed above.

_Note_: Use the same URI in the web browser to load the form.

## Notes

- By design `.gitignore` will not allow checking in your ENV file, nor any Winlink Form file(s) to copy-in to `public/views`.
