# Mock Winlink Server

The purpose of this repository is to provide a Form Server for testing and developing Winlink Forms.

## Overview

This is a placeholder, more information will be added in the near future.

## Installation

1. Clone this repository and change to the clone directory root.
2. If using Windows, install WSL and select a Linux distribution of your preference (at the time of this writing, I'd recommend Ubuntu 22.04). Open a WSL shell before continuing.
3. In Linux (or WSL) update packages using `sudo apt update` etc.
4. Install NVM (Node Version Manager) from [nvm-sh on github](https://github.com/nvm-sh/nvm?tab=readme-ov-file). Use WGET or CURL as directed.
5. Use NVM to install latest Node version: `nvm install --lts`. Use it: `nvm use <version>`.
6. Verify node and NPM installation with `node --version` and `npm --version` accordingly. Fix any issues before continuing.
7. Install dependencies using `npm install`.

## Configuration & Use

1. Copy your Winlink Template and Form file(s) to the `public/views` directory.
2. Copy `.env.example` contents to a new file named `.env` and update the form name, the current server name (or localhost), and assign an available port you want the server to run on.
  - If running in CodeSpaces: See additional information below.
3. If you want the server to serve HTTPS, set `FORM_SERVER_PROTOCOL="https"` in your `.env` and provide paths to your key and cert using `SSL_KEY_PATH` and `SSL_CERT_PATH` (or place `server.key` and `server.crt` in the project root). See the "Generate SSL key/cert" section below for a quick way to create test certificates.
4. Update `.env` FORM_SERVER_HOSTNAME with the server hostname without trailing slash:
  - Local development: Use localhost and a valid, available port.
  - Local unsecured dev: Prefix server identification with 'http:' and an available port number.
5. Execute `npm run devStart` to start the server.
6. Load the form in the browser and fill it out. Click the Submit button when done.
7. Review the Server's Terminal output to see the JSON representation of the data the Form is configured to send.

### Codespaces

Codespaces uses port forwarding to allow external requests to reach the server, so you will need to discover the full servername URI before adding FORM_SERVER_HOSTNAME to `.env`.

1. Start the server: `npm run devStart`.
2. Look in the PORTS panel and copy the forwarded address (the entire URI).
3. Paste the entire URI to the `.env` as the FORM_SERVER_HOSTNAME except for the last `/` character.
4. Complete the rest of the configuration steps as listed above.

_Note_: Use the same URI in the web browser to load the form.

## Generate SSL key/cert (quick local test)

For local HTTPS testing you can create a self-signed key and certificate with OpenSSL (replace CN if needed):

```bash
openssl req -x509 -newkey rsa:2048 -nodes -keyout server.key -out server.crt -days 365 -subj "/CN=localhost"
```

Then either place `server.key`/`server.crt` at the project root or set `SSL_KEY_PATH` and `SSL_CERT_PATH` in your `.env`. The repository `.gitignore` already ignores these files.

## Notes

- By design `.gitignore` will not allow checking in your ENV file, nor any Winlink Form file(s) to copy-in to `public/views`.
