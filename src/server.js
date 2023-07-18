const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const multiparty = require('multiparty');

app.get('/', (req, res, next) => {
  console.log('received GET request');
  //  const alpha = 'public\views\winlink-form.html';

  const options = {
    root: path.join(__dirname, '../public/views'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };

  const filename = 'winlink-form.html';
  res.sendFile(filename, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('sent:', filename);
    }
  });
});

app.post('/', (req, res) => {
  console.log('received request on post / route.');
  // parse uploaded multi-part form data
  const form = new multiparty.Form();

  form.on('error', function (err) {
    console.log('Error parsing form: ', err.stack);
  });

  form.on('part', function (part) {
    // undefined filename means this is just a field
    if (part.filename === undefined) {
      console.log('got part', part, 'name', part.name);
      part.resume();
    }

    // filename means this is a file
    if (part.filename !== undefined) {
      console.log('got file named', part.name);
      part.resume();
    }

    part.on('error', function (err) {
      console.log('Error parsing part: ', err.stack);
    });
  });

  // console.log(req.body);
  // res.send('POST request received');
  // close emitted items after form is parsed
  form.on('close', function () {
    console.log('form parsing completed!');
    // res.setHeader('text/plain');
    res.status(200).end();
  });

  // use multiparty form parse() function to parse the request
  form.parse(req);
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
