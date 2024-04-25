const express = require('express');
const app = express();
const multiparty = require('multiparty');
const rewriteFormAction = require('./rewrite-form-action');
const util = require('util');

require('dotenv').config();
const PORT = process.env.FORM_SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res, next) => {
  console.log('\nreceived GET request\n');
  await rewriteFormAction(req, res, next);
});

app.post('/', (req, res, next) => {
  console.log('\n***** received a form *****\n');

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
    console.log('vvv parsed form data vvv');
    console.log('fields:', util.inspect(fields));
    console.log('files:', util.inspect(files));
    console.log('\n***** end of form *****\n\n');
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

app.listen(PORT, () => {
  console.log('Server listening on port ', PORT);
});
