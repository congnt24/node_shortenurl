// server.js
// where your node app starts

// init project
var express = require('express');
var mongo = require('mongodb').MongoClient
var app = express();
const mongoUrl ='mongodb://test:123456@ds129442.mlab.com:29442/congntdevdb'

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/:id", function (request, response) {
  // response.sendFile(__dirname + '/views/index.html');
  //get ref to collection
  var id = request.params.id
  mongo.connect(mongoUrl, (error, db) => {
    var col = db.collection('shortenurl')
    
    col.findOne({id: +id}, (error, data) => {
      response.redirect(data.url)
    })
    db.close()
  })
});

app.get("/new/*", function (request, response) {
  var url = request.url.split('/new/')[1]
  var out = { "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" }
  out.original_url = url
  //find last item
    var id = Math.floor(Math.random()*1000)
  mongo.connect(mongoUrl, (error, db) => {
    if (error != null) {
      console.error(error.message)
    }
    
    var col = db.collection('shortenurl')
    
    col.find({}).toArray(function(err, docs) {
      if (err != null){
        console.log("NULL")
      }
      if(docs.length > 0){
        id = Number(docs[docs.length-1].id) + 1
      }
      
      col.insert({id: id, url: url})
      db.close()
      
      out.short_url = request.protocol+"://"+request.get('host')+"/"+id
      response.end(JSON.stringify(out));
    });
    
    
  })
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
