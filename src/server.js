const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const multiparty = require('multiparty');
//const winlinkForm = 'winlink-form.html';
const winlinkForm = 'Bigfoot-Bib-Report-Initial.html';
const util = require('util');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
  console.log('received GET request');

  const options = {
    root: path.join(__dirname, '../public/views'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };

  res.sendFile(winlinkForm, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('sent:', winlinkForm);
    }
  });
});

app.post('/', (req, res) => {
  console.log('received request on post route.');
  // console.log('req.body:', req.body);

  // parse uploaded multi-part form data
  let form = new multiparty.Form();

  form.on('error', function (err) {
    console.log('Error parsing form: ', err.stack);
  });

  form.on('part', function (part) {
    // undefined filename means this is just a field
    if (part.filename === undefined) {
      console.log('got part.name:', part.name);
      console.log('part.byteCount:', part.byteCount);
      part.resume();
    }

    // filename means this is a file
    if (part.filename !== undefined) {
      console.log('got part.filename:', part.filename);
      console.log('part.byteCount:', part.byteCount);
      part.resume();
    }

    part.on('error', function (err) {
      console.log('Error parsing part: ', err.stack);
    });
  });

  // close emitted items after form is parsed
  form.on('close', function () {
    console.log('form parsing completed!');
    // res.setHeader('text/plain');
    res.status(200).end();
  });

  // use multiparty form parse() function to parse the request
  form.parse(req, function (err, fields, files) {
    console.log('form.parse() returned:');
    console.log('fields:', util.inspect(fields));
    console.log('files:', util.inspect(files));
  });
});

app.use((err, req, res, next) => {
  console.error('custom error handler received error:', err);
  if (res.headersSent) {
    console.error('headers already sent, cannot respond to client with error');
  } else {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log('Server listening on port ', port);
});
