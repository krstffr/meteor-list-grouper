ListGrouper = function () {

	var that = this;

	that.groupMethods = {};
	that.currentGroupMethods = {};

	// Var names
	that.baseSessionName = 'ListGrouper__';
	that.currentGroupMethod = that.baseSessionName + 'curentIndex__';

	// Either pass with specificMethodName, or it will just go to the next (or first) method
	that.toggleActiveGroupMethod = function ( groupName, specificMethodName ) {

		// First check if there are actually more than one method available
		var numberOfMethods = that.groupMethods[ groupName ].length;
		if (numberOfMethods < 2)
			return false;

		// Var for the new index pointing to the current groupMethod
		var newIndex = 0;
		// If a name of a method was passed
		if (specificMethodName) {
			// This is the index for the map-loop
			var index = 0;
			var foundNewMethod = false;
			_( that.groupMethods[ groupName ] ).map( function( groupMethod ) {
				if (groupMethod.name === specificMethodName) {
					newIndex = index;
					foundNewMethod = true;
				}
				index++;
			});
			if (!foundNewMethod)
				throw new Error('Did not find a method called '+specificMethodName+' in '+groupName+'?');
		}
		// If no name was passed
		else {
			newIndex = Session.get(that.currentGroupMethod+groupName) + 1;
			if (newIndex >= numberOfMethods)
				newIndex = 0;
		}
		Session.set(that.currentGroupMethod+groupName, newIndex );
	};

	that.addGroupMethod = function ( options ) {

		if (!options.groupMethodName)
			throw new Error('You did not pass a options.groupMethodName to addGroupMethod');

		if(typeof options.cursorSorter !== 'object')
			throw new Error('The options.cursorSorter passed to addoptions.GroupMethod should be an object, is: ' + typeof options.groupMethod );

		if(typeof options.groupMethod !== 'function')
			throw new Error('The options.groupMethod passed to addoptions.GroupMethod should be a function, is: ' + typeof options.groupMethod );

		if(options.sumMethods && typeof options.sumMethods !== 'object')
			throw new Error('options.sumMethods passed to addoptions.GroupMethod should be a object, is: ' + typeof options.sumMethods );

		if (!that.groupMethods[options.groupName])
			that.groupMethods[options.groupName] = [];

		if (!that.currentGroupMethods[options.groupName]) {
			Session.set(that.currentGroupMethod+options.groupName, 0);
			that.currentGroupMethods[options.groupName] = Session.get(that.currentGroupMethod+options.groupName);
		}

		that.groupMethods[options.groupName].push({
			name: options.groupMethodName,
			groupMethod: options.groupMethod,
			cursorSorter: options.cursorSorter,
			sumMethods: options.sumMethods
		});

	};

	that.groupCursor = function ( collection, selector, groupName ) {

		// Check that we have a method at all
		if (!that.groupMethods[groupName])
			return false;

		// Get the options for the current group
		var currGroupMethodOptions = that.groupMethods[ groupName ][ Session.get(that.currentGroupMethod+groupName) ];

		// Get a cursor based on the passed collection, it's selector and the sort object passed in options
		var cursor = collection.find( selector, { sort: currGroupMethodOptions.cursorSorter }).fetch();

		// Create groups based on the groupMethod passed in options
		var groups = _( cursor ).groupBy( function( cursorItem ) {
			return currGroupMethodOptions.groupMethod( cursorItem );
		});

		// Return it all!
		return _( groups ).map( function( groupItems, key ) {
			
			var returnObject = { groupHeadline: key, groupItems: groupItems };
			
			if (currGroupMethodOptions.sumMethods) {
				returnObject.sums = _(currGroupMethodOptions.sumMethods).map( function( sumMethod ) {
					return sumMethod( groupItems );
				});
			}

			return returnObject;
		});

	};

};

listGrouper = new ListGrouper();