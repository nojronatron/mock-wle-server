const express = require('express');
const app = express();
const port = 3001;
const path = require('path');

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
  //res.set('Content-Type', 'text/html');
  // res.send('<html><body><h1>ehlo werld!</h1></body></html>');
  res.sendFile(filename, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('sent:', filename);
    }
  });
});

app.post('/', (req, res) => {
  // receive the form post data
  console.log('received POST request');
  console.log(req.body);
  console.log(req.params);
  console.log(req.query);
  res.send('POST request received');
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
