function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const completed = tweet_array.filter(tweet => tweet.source == 'completed_event' && tweet.activityType != 'unknown');

	const counts = {};
	completed.forEach(tweet => counts[tweet.activityType] = (counts[tweet.activityType] || 0) + 1);
	const activityCounts = Object.entries(counts)
		.map(([activityType, count]) => ({activityType: activityType, count: count}))
		.sort((a, b) => b.count - a.count);

	document.getElementById('numberActivities').innerText = activityCounts.length;
	document.getElementById('firstMost').innerText = activityCounts[0].activityType;
	document.getElementById('secondMost').innerText = activityCounts[1].activityType;
	document.getElementById('thirdMost').innerText = activityCounts[2].activityType;

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCounts
	  },
	  "mark": "bar",
	  "encoding": {
	    "x": {"field": "activityType", "type": "nominal", "sort": "-y", "title": "Activity type"},
	    "y": {"field": "count", "type": "quantitative", "title": "Number of Tweets"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	const topThree = activityCounts.slice(0, 3).map(activity => activity.activityType);
	const distances = completed
		.filter(tweet => topThree.includes(tweet.activityType))
		.map(tweet => ({activityType: tweet.activityType, distance: tweet.distance, time: tweet.time}));

	const dayEncoding = {"field": "time", "timeUnit": "day", "type": "ordinal", "title": "Day of the week"};
	const colorEncoding = {"field": "activityType", "type": "nominal", "title": "Activity type"};

	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distances of the three most tweeted-about activities by day of the week.",
	  "data": {"values": distances},
	  "mark": "point",
	  "encoding": {
	    "x": dayEncoding,
	    "y": {"field": "distance", "type": "quantitative", "title": "Distance (mi)"},
	    "color": colorEncoding
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distances of the three most tweeted-about activities by day of the week.",
	  "data": {"values": distances},
	  "mark": "point",
	  "encoding": {
	    "x": dayEncoding,
	    "y": {"field": "distance", "aggregate": "mean", "type": "quantitative", "title": "Mean distance (mi)"},
	    "color": colorEncoding
	  }
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';
}

function addEventHandlerForAggregate() {
	const button = document.getElementById('aggregate');
	const all = document.getElementById('distanceVis');
	const aggregated = document.getElementById('distanceVisAggregated');
	aggregated.style.display = 'none';

	button.addEventListener('click', function() {
		const showingMeans = aggregated.style.display != 'none';
		all.style.display = showingMeans ? '' : 'none';
		aggregated.style.display = showingMeans ? 'none' : '';
		button.innerText = showingMeans ? 'Show means' : 'Show all activities';
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForAggregate();
	loadSavedRunkeeperTweets().then(parseTweets);
});
