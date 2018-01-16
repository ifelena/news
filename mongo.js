const mongojs = require('mongojs');


var db = mongojs('mydb', ['screenscrapertest']);

db.screenscrapertest.insert({
	worked: true
});

db.screenscrapertest.find({}, (err, docs) => {
	if (err) {
		console.log(err);
		db.close();
		return;
	}

	console.log(docs);
	db.close();
});