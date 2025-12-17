const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { URL } = require('url');

// find the html file, open it, then find and replace the form action attribute with a custom one
async function rewriteFormAction(req, res, next) {
  const basePath = '../public/views';

  // Helper to remove surrounding quotes and trim whitespace from env values
  const stripQuotes = (s) => (typeof s === 'string' ? s.trim().replace(/^['"]|['"]$/g, '') : s);

  const winlinkForm = stripQuotes(process.env.WINLINK_FORM_NAME);
  const textToReplace = stripQuotes(process.env.TEXT_TO_REPLACE) || 'http://{FormServer}:{FormPort}';
  const actualFormServer = stripQuotes(process.env.FORM_SERVER_HOSTNAME) || 'localhost';
  const actualFormPort = stripQuotes(process.env.FORM_SERVER_PORT) || 3000;

  // Detect Codespaces or other forwarded environment
  const forwardedProto = req.headers['x-forwarded-proto'];
  const forwardedHost = req.headers['x-forwarded-host'] || req.headers['host'];

  let formServerAndPort;

  // If forwarded headers are present, use them to build the form action URL
  if (forwardedProto && forwardedHost) {
    formServerAndPort = `${forwardedProto}://${forwardedHost}`;
    console.log('Detected forwarded request, using:', formServerAndPort);
  } else {
    // build a canonical form action URL from env vars
    const protocolPref = stripQuotes(process.env.FORM_SERVER_PROTOCOL) || 'http';
    let hostWithProto = String(actualFormServer);

    if (!/^https?:\/\//i.test(hostWithProto)) {
      hostWithProto = `${protocolPref}://${hostWithProto}`;
    }

    // Parse and ensure a port is present
    try {
      const urlObj = new URL(hostWithProto);
      if (!urlObj.port) {
        urlObj.port = String(actualFormPort);
      }
      formServerAndPort = urlObj.toString().replace(/\/$/, '');
    } catch (err) {
      // Fallback: build manually
      const protoMatch = hostWithProto.match(/^([^:\/]+):\/\//);
      const proto = protoMatch ? protoMatch[1] : protocolPref;
      const hostname = hostWithProto.replace(/^https?:\/\//i, '');
      formServerAndPort = `${proto}://${hostname}:${actualFormPort}`;
    }
  }

  // find filename
  if (!winlinkForm) {
    return next(new Error('No form name specified.'));
  }

  const filePath = path.join(__dirname, basePath, winlinkForm);

  // open file and read its contents
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log('error reading file:', err);
      return next(err);
    }

    // Debugging help: log what we will replace
    console.log('rewrite-form-action: replacing', textToReplace, 'with', formServerAndPort);

    // replace all occurrences of the placeholder
    const safeSearch = textToReplace.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&');
    // Match the placeholder whether or not it's prefixed by a protocol (http:// or https://)
    const replacePattern = new RegExp(`(?:https?:\\/\\/)?${safeSearch}`, 'g');
    const result = data.replace(replacePattern, formServerAndPort);
    res.send(result);
  });
}

module.exports = rewriteFormAction;
