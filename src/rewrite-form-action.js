const fs = require('fs');
const path = require('path');
require('dotenv').config();

// find the html file, open it, then find and replace the form action attribute with a custom one
async function rewriteFormAction(req, res, next) {
  const basePath = '../public/views';
  const winlinkForm = process.env.WINLINK_FORM_NAME;
  const textToReplace = process.env.TEXT_TO_REPLACE || '{FormServer}:{FormPort}';
  const actualFormServer = process.env.FORM_SERVER_HOSTNAME || 'localhost';
  const actualFormPort = process.env.FORM_SERVER_PORT || 3000;
  
  // Construct form server URL based on hostname format:
  // - https:// prefix -> use as-is (no port)
  // - http:// prefix -> use with port appended
  // - no prefix -> default to https with hostname and port
  let formServerAndPort;
  if (actualFormServer.startsWith('https')) {
    formServerAndPort = actualFormServer;
  } else if (actualFormServer.startsWith('http')) {
    formServerAndPort = `${actualFormServer}:${actualFormPort}`;
  } else {
    formServerAndPort = `https://${actualFormServer}:${actualFormPort}`;
  }

  // find filename
  if (winlinkForm === undefined) {
    next(new Error('No form name specified.'));
  }

  const filePath = path.join(__dirname, basePath, winlinkForm);

  // open file and read its contents
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log('error reading file:', err);
      next(err);
    } else {
      // replace search string with replacement string
      const result = data.replace(textToReplace, formServerAndPort);
      res.send(result);
    }
  });
}

module.exports = rewriteFormAction;
