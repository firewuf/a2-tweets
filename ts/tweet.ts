class Tweet {
    private text: string;
    time: Date;

    constructor(tweet_text: string, tweet_time: string) {
        this.text = tweet_text;
        this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
    }

    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source(): string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        } else if (this.text.startsWith("Watch my") || this.text.includes("#RKLive")) {
            return "live_event";
        } else if (this.text.startsWith("Achieved") || this.text.startsWith("I just set a goal")) {
            return "achievement";
        } else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written(): boolean {
        //TODO: identify whether the tweet is written
        return this.writtenText != "";
    }

    get writtenText(): string {
        //TODO: parse the written text from the tweet
        let dashIndex = this.text.indexOf(" - ");
        if (dashIndex == -1) {
            return "";
        }
        let linkIndex = this.text.indexOf("http", dashIndex);
        if (linkIndex == -1) {
            linkIndex = this.text.length;
        }
        let userText = this.text.substring(dashIndex + 3, linkIndex).replace(/#Runkeeper/gi, "").trim();
        if (userText.toLowerCase().indexOf("tomtom") != -1) {
            return "";
        }
        return userText;
    }

    get activityType(): string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        let distanceMatch = this.text.match(/^Just (?:completed|posted) an? [\d.]+ (?:km|mi) (.+?)(?: with @?Runkeeper| - )/);
        if (distanceMatch) {
            return distanceMatch[1];
        }
        let timeMatch = this.text.match(/^Just (?:completed|posted) an? (.+?) in [\d:]+/);
        if (timeMatch) {
            return timeMatch[1];
        }
        return "unknown";
    }

    get distance(): number {
        if (this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        let match = this.text.match(/^Just (?:completed|posted) an? ([\d.]+) (km|mi) /);
        if (!match) {
            return 0;
        }
        let amount = parseFloat(match[1]);
        return match[2] == "km" ? amount / 1.609 : amount;
    }

    getHTMLTableRow(rowNumber: number): string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        let linkedText = this.text.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>');
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + linkedText + "</td></tr>";
    }
}
