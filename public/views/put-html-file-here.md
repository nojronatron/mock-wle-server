# Put HTML File Here

This is the view folder for the custom HTML form.

A `get` request to this server will cause the server to find the first HTML file and parse it for the string `{FormServer}:{FormPort}`, replacing that with the local server address and port configuration.

The server will leverage middleware `src/rewrite-form-action.js` to do the parsing without editing the HTML file.

HTML files placed here will be ignored by git.
