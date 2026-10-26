let written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	written_tweets = runkeeper_tweets
		.map(tweet => new Tweet(tweet.text, tweet.created_at))
		.filter(tweet => tweet.written);
}

function updateTable(searchText) {
	const query = searchText.toLowerCase();
	const matches = query == '' ? [] : written_tweets.filter(tweet => tweet.writtenText.toLowerCase().includes(query));

	document.getElementById('searchText').innerText = searchText;
	document.getElementById('searchCount').innerText = matches.length;
	document.getElementById('tweetTable').innerHTML = matches.map((tweet, i) => tweet.getHTMLTableRow(i + 1)).join('');
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	updateTable('');
	document.getElementById('textFilter').addEventListener('input', function(event) {
		updateTable(event.target.value);
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
