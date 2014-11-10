meteor-list-grouper
===================

Live version of the example app: http://list-grouper.meteor.com/

Installation: ```mrt add krstffr:list-grouper```

## Usage

This package gives you access to the ListGrouper object, which has a method called ```.getGroup( options )``` which returns a grouped version of your collection. Like this:
```javascript
var groupedList = ListGrouper.getGroup({
	// Pass a MongoDB cursor or just a native Array to the collection field
	collection: WorldCupPlayers.find({}, { limit: 100 }),
	// How would you like your data to be grouped?
	// The groupBy object contains a name and a groupMethod.
	groupBy: {
		// Give the grouping a name
		name: 'Number of passes',
		// The method used for grouping the data
		groupMethod: function ( player ) {
			return Math.floor( player.passes / 10 ) * 10;
		}
	}
});
```

Now we have an array called groupedList which will look something like this:

```javascript
[{
	groupItems: [ Array containing the items in the group ],
	groupName: "Number of passes",
	groupKey: 0
}, {
	groupItems: [ Array containing the items in the group ],
	groupName: "Number of passes",
	groupKey: 10
}, {
	groupItems: [ Array containing the items in the group ],
	groupName: "Number of passes",
	groupKey: 20
}]
```

This array we can of course use in our HTML templates. See the app source inside the examples folder if you want an example on how to this, or check out the [http://list-grouper.meteor.com/](live version) of the example app.

We can also filter the results and also add sum methods (which sums up whatever data you want from the items inside the group).  
**To filter, do this:**
```javascript
filter: function ( player ) {
  // Only use players who have played at least 90 minutes,
  // all other players will not be in the groups.
  return player.playtime > 90;
}
```
**To add sum methods (any number of them!), do this:**
```javascript
sums: [{
  // Show how many shots were made by the players in each group
  name: 'Shots',
  sumMethod: function ( memo, player ) {
    return memo + player.shots;
  }
},
{
	// Show how many tackles were made by the players in each group
  name: 'Tackles',
  sumMethod: function ( memo, player ) {
    return memo + player.tackles;
  }
}]
```
When you pass sum methods, the returned object will contain a sums field, which consists of a collection of all the summed up values, like this:
```javascript
[{
	groupItems: [ Array containing the items in the group ],
	groupName: "Number of passes",
	groupKey: 0,
	sums: [{ sumName: "Shots", sum: 21 }, { sumName: "Tackles", sum: 33 }]
}, {
	groupItems: [ Array containing the items in the group ],
	groupName: "Number of passes",
	groupKey: 10,
	sums: [{ sumName: "Shots", sum: 14 }, { sumName: "Tackles", sum: 12 }]
}, {
	groupItems: [ Array containing the items in the group ],
	groupName: "Number of passes",
	groupKey: 20,
	sums: [{ sumName: "Shots", sum: 4 }, { sumName: "Tackles", sum: 68 }]
}]
```
