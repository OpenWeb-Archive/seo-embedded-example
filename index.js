const express = require("express");
const fetch = require("node-fetch");
const zlib = require("zlib");
const ejs = require("ejs");
const app = express();

app.listen(process.env.PORT || 8081, function () {
  console.log("Express is running on port 8081");
});

app.set("view engine", ejs);

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


app.get(
  "/",
  asyncMiddleware(async (req, res, next) => {
    const { spotId, postId} = req.query;
    res.set('Content-Encoding', 'gzip');
    res.set('Accept-Encoding', 'gzip');
    res.set('Content-type', 'text/html; charset=utf-8');
    const convResponse = await fetch(
`https://extractify.spot.im/conversation/${spotId}/${postId}`
    );
    const convHtml = await convResponse.text();
    const wrappedHtml = `<!DOCTYPE html>
    <html lang="en" dir="ltr">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Demo SpotIM SEO Conversation</title>
    
    <body>
      ${convHtml}
    </body>
    
    </html>`
    const zipped = zlib.gzipSync(Buffer.from(wrappedHtml, 'utf-8'));
    res.status(200).end(zipped)
  })
);
