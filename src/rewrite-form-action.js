const fs = require('fs');
const path = require('path');

// find the html file, open it, then find and replace the form action attribute with a custom one
async function rewriteFormAction(req, res, next) {
  // todo: replace winlinkForm with an environment variable
  const winlinkForm = 'Bigfoot-Bib-Report-Initial.html';
  // todo: replace actualFormServer with an environment variable
  const actualFormServer = 'localhost:3001';
  const textToReplace = '{FormServer}:{FormPort}';
  const basePath = '../public/views';
  // find filename
  const filePath = path.join(__dirname, basePath, winlinkForm);

  // open file and read its contents
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log('error reading file:', err);
      next(err);
    } else {
      // replace search string with replacement string
      const result = data.replace(textToReplace, actualFormServer);
      res.send(result);
    }
  });
}

module.exports = rewriteFormAction;
