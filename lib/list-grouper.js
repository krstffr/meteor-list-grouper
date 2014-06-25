ListGrouper = function ( options ) {
	
	var that = this;

	that.options = options;
	
	// Store the different group values in the groupValues array
	that.groupValues = [];

	// All the acutally grouped elements
	that.groups = {};

	// CSS classes
	that.cssClasses = {
		header: 'list-grouper__headline',
		headerText: 'list-grouper__headline__text',
		headerSum: 'list-grouper__headline__sum'
	};

	// HTML data attribues
	that.dataAttr = {
		groupId: 'data-list-grouper-id',
		groupBy: 'data-list-grouper-group-by',
	};

	that.addGroupDataAttr = function () {

		// Set the list-grouper-group-by based on what the that.options.groupBy( doc ) returns
		_.each(that.options.cursor, function( doc ){

			var groupValue = that.options.groupBy( doc );

			var HTMLel = $(that.options.listItemsSelector+'['+that.dataAttr.groupId+'="'+doc._id+'"]')
			.attr(that.dataAttr.groupBy, groupValue );

			console.log($(that.options.listItemsSelector).length);

			// If the groupValue is not already stored, store it
			if (that.groupValues.indexOf( groupValue ) < 0)
				that.groupValues.push( groupValue );

			// Push the doc to the groups array
			if (!that.groups[groupValue]) {
				// Create the array if there is not one yet
				that.groups[groupValue] = [ doc ];
			}
			else {
				// Push the doc to the group if the key exists
				that.groups[groupValue].push( doc );
			}

		});

	};


	// Method for clearing all currently created header/group elements
	that.clearCurrentHeaders = function () {
		$( that.options.listParentSelector + ' .' + that.cssClasses.header ).remove();
	};


	// Exexute all the sum methods which the user might have defined
	// and return an element with the sum class + the value of the sum
	// method as it's text content.
	that.executeSumMethods = function ( groupValue ) {
		// Loop over all the sumMethods, and return an array of all the elements which
		// are returned from the _map()
		return _.map(options.sumMethods, function( sumMethod ) {

			// Get the sum of the sumMethod of the docs in the group
			var sum = sumMethod( that.groups[groupValue] );

			// Create the HTML element
			var sumEl = $('<span />')
			.addClass( that.cssClasses.headerSum )
			.addClass( that.options.sumClass )
			.text( sum );

			// Return the element
			return sumEl;

		});
	};


	// Method for setting the actual headers
	that.addHeaderElements = function () {
		// Loop over all the different group values and add a header to the first element
		// which has this particular groupValue
		_.each(that.groupValues, function(groupValue) {
			
			// Selector for firstEL + firstEl of each listGroup
			var firstElSelector = that.options.listParentSelector + ' ' +
			that.options.listItemsSelector +
			'['+that.dataAttr.groupBy+'="'+groupValue+'"]';

			var firstEl = $(firstElSelector).first();

			// This is just a wrapper to store created HTML inside
			var HTMLheaderWrapper = $('<p />');

			// This is the actual HTML element
			var HTMLheader = $('<'+that.options.groupHeaderEl+' />')
			.addClass( that.cssClasses.header )
			.addClass( that.options.groupHeaderElClass );

			// The actual "text" header gets wrapped in a span with a class as well
			var HTLMheaderText = $('<span />')
			.addClass( that.cssClasses.headerText )
			.addClass( that.options.groupHeaderTextElClass )
			.text( groupValue );

			// If there are sumMethods, run them all and return elements
			// and add them to the header
			if (options.sumMethods && options.sumMethods.length)
				HTMLheader.append( that.executeSumMethods( groupValue ) );

			// Add the HTML elements to the wrapper
			HTMLheader.prepend( HTLMheaderText );
			HTMLheaderWrapper.append( HTMLheader );

			// Add the wrappers content (.html()) before the first el in the group
			firstEl.before( HTMLheaderWrapper.html() );

		});
	};


	// Sort of like the init() method
	that.groupList = function () {

		// The cursor has to contain elements, if not just quit.
		if (!that.options || !that.options.cursor || !that.options.cursor.length)
			return ;

		// Remove all currently generated headers
		// that.clearCurrentHeaders();

		// Add the data-attributes to all list elements
		that.addGroupDataAttr();

		// Add the actual group/header elements
		that.addHeaderElements();

	};


	// Time the groupList()
	console.time('groupList()');

	// "Init"
	that.groupList();

	// End the timing of groupList()
	console.timeEnd('groupList()');

};