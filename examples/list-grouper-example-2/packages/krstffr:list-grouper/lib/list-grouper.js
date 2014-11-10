ListGrouperHandler = function () {

	var that = this;

	// Method for preparing the groups.
	// Meaning: we can both accept a native array,
	// or a Mongo cursor.
	that.prepareGroup = function ( collection ) {
		
		// variable for the group items
		var groupItems;

		// If a Meteor.Collection cursor was passed, get them items using fetch()
		if ( typeof collection.fetch === 'function')
			groupItems = collection.fetch();
		// …else the collection should be an array
		else
			groupItems = collection;
		
		// Make sure items is an array
		check( groupItems, Array );

		return groupItems;

	};

	// Create the actual groups
	// Accepts an object like this:
	// {
	//   name: 'name of the group',
	//   groupMethod: Function (callback to underscore groupBy method)
	// }
	that.createGroups = function ( groupBy, collection ) {

		// Make sure we got the correct groupBy object, name and method
		check( groupBy, Object );
		check( groupBy.name, String );
		check( groupBy.groupMethod, Function );

		// Group the items by the groupBy groupMethod method, and turn into an array like this:
		// [{ groupItems: Array, groupKey: 'string (or num!)', groupName: groupBy.name }, etc… ]
		return _( collection ).chain()
		.groupBy( groupBy.groupMethod )
		.map(function( val, key ) {
			var numKey = parseFloat(key);
			if (!isNaN(numKey))
				key = numKey;
			return { groupKey: key, groupName: groupBy.name, groupItems: val };
		})
		.value();

	};

	// If the user has provided sums method, apply them (optional)
	// Accepts array of objects like this:
	// [{
	//   name: 'Name of the sum',
	//   sumMethod: Function (callback to underscore reduce method)
	// }, etc… ]
	that.createSums = function ( sums, collection ) {

		// Make sure we have an array
		check(sums, Array);

		// Iterate over all the current grouped items
		collection = _(collection).map( function( collectionItem ) {

			// The item should have a sums array for all the summed up valued
			collectionItem.sums = [];

			// Iterate over all the sum methods
			_.each(sums, function( sum ){

				// Make sure we have a name and a sumMethod!
				check(sum.name, String);
				check(sum.sumMethod, Function);

				// Push the sum (name and result of _.reduce method) to the item
				collectionItem.sums.push({
					sumName: sum.name,
					sum: _.reduce(collectionItem.groupItems, sum.sumMethod, 0)
				});
			});

			return collectionItem;

		});

		return collection;

	};

	// If the user has provided a filter method, apply it (optional)
	that.filterItems = function ( filterMethod, collection ) {
		return _.filter( collection, filterMethod );
	};

	// The main method, accepts options like this:
	// {
  // collection: WorldCupPlayers.find({}, { limit: 50 }),
  // groupBy: {
  //   name: 'Passes made in world cup',
  //   groupMethod: function ( player ) {
	//     return Math.round( player.passes / 10 ) * 10;
	//   }	
  // },
  // filter: function ( player ) {
  //   return player.playtime > 90;
  // },
  // sums: [
  //   {
  //     name: 'Shots in this group',
  //     sumMethod: function ( memo, player ) {
  //       return memo + player.shots;
  //     }
  //   }
  //   ]
  // }
  that.getGroup = function ( options ) {

		// Store the groupItems in this var
		var groupItems = that.prepareGroup( options.collection );

		// Is there a filter method?
		if (options.filter)
			groupItems = that.filterItems( options.filter, groupItems );

		// Group the items into their groups
		var groupedItems = that.createGroups( options.groupBy, groupItems );

		// Has the user provided any sum methods?
		if (options.sums)
			groupedItems = that.createSums( options.sums, groupedItems );

		// Sort the items by the groupKey
		groupedItems = _.sortBy(groupedItems, function ( item ) {
			return item.groupKey;
		});

		// Return the prepared items!
		return groupedItems;

	};

};

ListGrouper = new ListGrouperHandler();
