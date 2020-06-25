const express=require('express');
const fetch = require('node-fetch');
const ejs = require('ejs');
const app = express();
app.listen(8081,function(){
	console.log("Express is running on port 8081");
});

app.set('view engine', ejs);

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

app.get('/',asyncMiddleware(async (req,res, next)=> {
    const convResponse =  await fetch('https://extractify.spot.im/conversation/sp_ly3RvXf6/p0st2');
    const convHtml = await convResponse.text();

	res.render('pages/html.ejs', {body: convHtml})

}));