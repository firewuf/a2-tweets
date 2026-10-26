function formatPct(count, total) {
	return math.format(count / total * 100, {notation: 'fixed', precision: 2}) + '%';
}

function setText(className, value) {
	Array.from(document.getElementsByClassName(className)).forEach(function(element) {
		element.innerText = value;
	});
}

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	const times = tweet_array.map(tweet => tweet.time.getTime());
	const dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
	document.getElementById('firstDate').innerText = new Date(Math.min(...times)).toLocaleDateString('en-US', dateOptions);
	document.getElementById('lastDate').innerText = new Date(Math.max(...times)).toLocaleDateString('en-US', dateOptions);

	const categories = {completed_event: 'completedEvents', live_event: 'liveEvents', achievement: 'achievements', miscellaneous: 'miscellaneous'};
	for (const [source, className] of Object.entries(categories)) {
		const count = tweet_array.filter(tweet => tweet.source == source).length;
		setText(className, count);
		setText(className + 'Pct', formatPct(count, tweet_array.length));
	}

	const completed = tweet_array.filter(tweet => tweet.source == 'completed_event');
	const written = completed.filter(tweet => tweet.written).length;
	setText('written', written);
	setText('writtenPct', formatPct(written, completed.length));
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
