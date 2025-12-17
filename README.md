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

1. Copy your Winlink Form file to the `public/views` directory.
2. Copy `.env.example` contents to a new file named `.env`
3. Update `WINLINK_FORM_NAME` with the file name of the Winlink Form.
4. If you want the server to serve HTTPS (not usually necessary):
  1. Set `FORM_SERVER_PROTOCOL="https"` in your `.env`
  2. Provide paths to your key and cert using `SSL_KEY_PATH` and `SSL_CERT_PATH` (or place `server.key` and `server.crt` in the project root).
    - See "Generate SSL key/cert" section below for instructions how to create these for testing.
5. Update `FORM_SERVER_HOSTNAME` with the server hostname without trailing slash:
  - Use localhost for most scenarios including CodeSpaces.
  - Using a fully qualified hostname or IP address is acceptable.
  - Local development: Use 'localhost' and update `FORM_SERVER_PORT` with a valid, available port.
6. Execute `npm run devStart` to start the server.
6. Load the form in the browser and fill it out. Click the Submit button when done.
7. Review the Server's Terminal output to see the JSON representation of the data the Form is configured to send.

### Codespaces

The rewrite form action code will check for headers, telling it to configure a Code Spaces PORT url.

- Leave `FORM_SERVER_HOSTNAME` as 'localhost'
- Leave `FORM_SERVER_PORT` unchanged / 3001.

When you run the project, console log output should show you the correct rewritten form action that should _not_ include `:3001` (port).

## Generate SSL key/cert (quick local test)

In the unlikely event you need to test using HTTPS, you can create a self-signed key and certificate with OpenSSL (replace CN if needed):

```bash
openssl req -x509 -newkey rsa:2048 -nodes -keyout server.key -out server.crt -days 365 -subj "/CN=localhost"
```

Then either place `server.key`/`server.crt` at the project root or set `SSL_KEY_PATH` and `SSL_CERT_PATH` in your `.env`. The repository `.gitignore` already ignores these files.

## Notes

- By design `.gitignore` will not allow checking in your ENV file, nor any Winlink Form file(s) to copy-in to `public/views`.
