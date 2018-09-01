var express = require("express");
var app = express();
const middleware = require('webpack-dev-middleware'); //webpack hot reloading middleware
import {pageListen} as pageRequest from "./index.js"

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/url", (req, res, next) => {
 res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});

//Upon receiving a request to create a page...
//get -> GET request  post -> POST request res -> Response
pageRequest.forEach( , ()=>{
	app.get(pageRequest.pagePath, (req, res, next) => {

	});
})

//launch an fs command with what I need 