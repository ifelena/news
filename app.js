// const cheerio = require("cheerio");
// const express = require("express");
// const mongojs = require('mongojs');
// const request = require("request");

// const app = express();
// // Reference database "Scraper" found in the webdevdata collection
// const db = mongojs('scraper', ['webdevdata']);

// remove all documents every time so no duplication happens
// This forces data to wipe itself and get new data each time app is reloaded
// db.webdevdata.remove({});

var response = 'response.title';
var author = 'response.author';
var commentCount = 'response.commentCount';
var timestampDisplay = 'response.timestampDisplay';

var articles = [];


// function displayResults(webdevdata) {
// 	$('tbody').empty();



//displayResults();

//$jQ = jQuery.noConflict();

function refreshTable(data){

	var table = $('.results  tbody');
	table.empty();
	for (var i = 0; i < data.length; i++) {
    	var tr = $('<tr>').html(`<td>${data[i].title}</td>  <td>${data[i].author}</td> <td>${data[i].commentCount}</td>  <td>${data[i].timestampDisplay}</td>`);
		table.append(tr);
	}
}

function test() {
$.getJSON('/', function(data) {
	displayResults(data);
})
};

// Button interactions
$('.comment-sort').on('click', function() {
	//setActive('.thread-commentCount');
	
	articles =  articles.sort((a,b) => parseInt(a.commentCount) - parseInt(b.commentCount));
	refreshTable(articles);
});

//Click function for scrape news
$('.scrape-news').click(function() {

	$.getJSON('http://localhost:8080/api/getscrape', function(data) {
		//console.log(data);
		articles = data;
		refreshTable(articles);
	});	
});

//Function to empty table on Home
// $('.home').click(function() {
// 	$('.results').empty();

// });

// When user clicks the name sort button, display the table sorted by name
//$(".author-sort").on("click", function() {
  // Set new column as currently-sorted (active)
// 	setActive(".thread-author");

// 	(function($) {
// 		function test() {  
//   		// Do an api call to the back end for json with all authors sorted by name
//   			$.getJSON("/author", function(data) {
//     		// Call function to create table body
//     		displayResults(data);
//   		});
// 	};
// })(jQuery);

//});









