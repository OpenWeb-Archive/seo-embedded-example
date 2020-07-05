const express = require("express");
const fetch = require("node-fetch");
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
    res.set('Content-Encoding', 'gzip');
    res.set('Accept-Encoding', 'gzip')
    res.set('Content-type', 'text/html; charset=utf-8');
    const convResponse = await fetch(
      "http://extractify.spot.im/conversation/sp_IjnMf2Jd/24540557"
    );
    const convHtml = await convResponse.text();
    res.render("pages/html.ejs", { body: convHtml });
  })
);
