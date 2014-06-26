meteor-list-grouper
===================

Demo: http://list-grouper.meteor.com/

**There is a currently a bug in this package which makes it dumb to use it. So don't**

Sometimes you have lists of stuff in your meteor.js applications. Let's say invoices. Let's say you want to group these invoices by month, and add a little headline where a new month starts in the list. And then maybe you want to group by week number. Or by invoice amount. This is (?) not as easy as it might seem in meteor. But this package does it for you. **OR SOON IT WILL**

## Currently, this is how it works (will change SOON):
- Iterate over the list you want to group. For example like this:
```
<ul class="invoices__ul">
{{#each invoices }}
	<li class="invoices__li">{{ name }}, $ {{ amount }}</li>
{{/each}}
</ul>
```
- For every invoice element, add an data-list-grouper-id field with the mongo _id, like this:
```
<li class="invoices__li" data-list-grouper-id="{{ _id }}">{{ name }}, $ {{ amount }}</li>
```
- **WILL CHANGE** Now add another helper after your `each` loop. Call it something clever.
```
{{ addHeadlines }}
```
- **WILL CHANGE** Then add a helper to the template for the addHeadlines method. Add something like this to the method:
```javascript

var options = {
	// What will the docs be grouped by?
	// The groupBy callback recieves every document from the list, and here you can
	// choose to group them using whatever you want.
	// In this example we use year and month (like this: 2014 06), using moment.js
	groupBy: function ( doc ) {
		return moment( doc.date ).format('YYYY MM');
	},
	// Pass the fetched cursor which is used for the list
	cursor: Invoies.find({}, { sort: { date: -1 } }).fetch(),
	// Set the selector for the parent element of the list
	listParentSelector: '.invoices__ul',
	// Set the selector for the list items
	listItemsSelector: '.invoices__li',
	// What kind of element would you like the header to be?
	groupHeaderEl: 'li',
	// Add some sweet CSS to the header
	groupHeaderElClass: 'invoices__li__header',
	// The actual text (2014 06) will be wrapped in a <span> element which you can
	// add CSS to as well.
	groupHeaderTextElClass: 'invoices__li__header__text',
	// You can define multiple sum methods, each one will recieve all the docs
	// from every group and you can return some sum-method on them.
	// The example below will return the sum of all the invoices for the current
	// month. So the header <li> element will contain two elements, like this:
	// <li> <span>2014 05</span> <span>50621</span> </li>
	sumMethods: [
		function ( group ) {
			var sum = _.reduce(group, function(memo, doc){ return memo + doc.amount; }, 0);
			return sum;
		}
	],
	// These classes will be added to the sum span element
	sumClass: 'invoices__li__header__sum'
};

// This creates the actual list.
var listGrouper = new ListGrouper( options );

```

## TODO
- The handlars-call-the-listGrouper-creation-aproach is super un-cool. To run it in the .rendered() callback would be cool, but if we don't know if the list is populated yet it won't do anything.