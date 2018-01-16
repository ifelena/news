const cheerio = require("cheerio");
const express = require("express");
const mongojs = require('mongojs');
const request = require("request");

const app = express();
// Reference database "Scraper" found in the webdevdata collection
const db = mongojs('scraper', ['webdevdata']);

var port = process.env.PORT || 8080;

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Grab data from reddit
request("https://www.reddit.com/r/webdev", (error, response, html) => {
	// Initialize $ variable with the page's DOM
	var $ = cheerio.load(html);
	
	// Iterate over each 'div.top-matter' element (each post on page)
	$("div.top-matter").each(function(i, element) {
		//console.log('---------'); // Puts a line between each article for readability
	  	//console.log($(element).text());
	  	//Grab title
	  	var title = $(element).find("a.title").text();
	  	//console.log(title);

	  	// Grab comment count
	  	//option for comments: var comments = $(element).find('li.first').text();
	  	var comments = $(element).find("a.comments").text();
	  	var match = comments.match(/(\d) comment/);
	  	comments = match ? match[1] : 0;
	  	
	  	//console.log(comments);

	  	// Grab author
	  	var author = $(element).find('a.author').text();
	  	//console.log(author);

	  	// Grab timestamps
	  	var timestampHuman = $(element).find('time.live-timestamp').text();
	  	var timestampMachine = $(element).find('time.live-timestamp').attr('datetime');
	  	//console.log(timestamp);

	  	// Create data object
	  	var post = {
	  		title: title,
	  		author: author, 
	  		commentCount: comments,
	  		timestamp: timestampMachine,
	  		timestampDisplay: timestampHuman
	  	};
	  	//console.log(JSON.stringify(post, null, 2));
	
		// Insert into database
		db.webdevdata.insert(post);
		//console.log('record inserted!');

		// db.webdevdata.find(function (err, docs) {
		// 	console.log(JSON.stringify(docs, null, 2));
	 //  	});
	});

	//db.close();	
});	 

// Data route alphabetical
app.get('/api/getscrape', (req, res) => {
	// Get posts from db
	// console.log(db.webdevdata.find({}));
	db.webdevdata.find(function (err, docs) {
		res.send( docs);
    // docs is an array of all the documents in mycollection 
});
	//db.webdevdata.find({}).sort({ title: 1}, (err, posts) => res.json(posts));
});

// //Add route to post data to page
// app.get('/', (req, res) => {


// });


// Data route reverse alphabetical
//app.get('/', (req, res) => {
	// Get posts from db
//	db.webdevdata.find({}).sort({ title: -1}, (err, posts) => res.json(posts));
//});

app.get('/api/posts/:id', (req, res) => {
	//get posts from db
	db.webdevdata.findOne({ _id: mongjs.ObjectId(req.params.id) }, (err, posts) => res.json(posts));
});

// Data route for up votes
app.post('/api/posts/:id/upvote', (req, res) => {
	//get posts from db
	db.webdevdata.findOne({ _id: mongjs.ObjectId(req.params.id) }, 
		(err, post) => {
			if (!post.score)
				post.score = 1;
			else
				post.score++;
			console.log(post);
			db.webdevdata.update({ _id: mongjs.ObjectId(req.params.id) }, post(
				() => {
					db.webdevdata.findOne({ _id: mongjs.ObjectId(req.params.id) }, 	
					(err, post) => res.json(post));
					
			}));
		});
});

// Data route for down votes
app.post('/api/posts/:id/downvote', (req, res) => {
	//get posts from db
	db.webdevdata.findOne({ _id: mongjs.ObjectId(req.params.id) }, 
		(err, post) => {
			if (!post.score)
				post.score = -1;
			else
				post.score--;
			console.log(post);
			db.webdevdata.updateOne({ _id: mongjs.ObjectId(req.params.id) }, post( 
				() => {
					db.webdevdata.findOne({ _id: mongjs.ObjectId(req.params.id) }, 	
					(err, post) => res.json(post));
					
			}));
		});
});



// Start express server
//app.listen(port, () => console.log('App listening on port 8080!'));
app.listen(port, function() {
    console.log("App is running on port " + port);
});
