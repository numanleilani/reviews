const express = require("express");
require("./db");
const app = express();
const path = require("path");
const rateLimit = require('express-rate-limit');
const cors = require("cors"); 
const hpp = require("hpp");
const expressSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const helmet = require("helmet");
const routes = require('./routes/routes');  
const userRoute = require('./routes/users')
const PORT = process.env.PORT || 5000; 
const bodyParser = require('body-parser');
/************** Middlewares ****************/
app.use(helmet());
app.use(express.static(path.resolve('./public')));
app.use(express.json({limit: '10kb'}));
app.use(expressSanitize());
app.use(xss());
app.use(hpp());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next();
});
let corsOptions = {
    origin: '*',
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions));
 
const limiter = rateLimit({
  max:100,
  windowMs: 60*60*1000,
  message: "Too many requests, please Comeback after an Hour!"
})
app.use("/", limiter);
/************** Routes ****************/
app.use('/' ,routes); /*** Application Route ***/ 
app.use('/users', userRoute); /*** Application Route ***/ 

app.all('*', (req,res,next) =>{
  res.send({message:"Invalid Route"})
})


/*** Listen to Port ***/
app.listen(PORT, () => {
  console.log("listening on port", PORT)
});
module.exports = app;


