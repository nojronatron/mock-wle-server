const express = require('express');
const app = express();
// todo: replace port with an environment variable
const port = 3001;

const multiparty = require('multiparty');
const rewriteFormAction = require('./rewrite-form-action');
const util = require('util');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res, next) => {
  console.log('received GET request');
  await rewriteFormAction(req, res, next);
});

app.post('/', (req, res, next) => {
  console.log('received request on post route.');

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
