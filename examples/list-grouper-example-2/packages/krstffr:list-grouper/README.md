meteor-list-grouper
===================

Demo: http://list-grouper.meteor.com/

**Note: v. 0.1.0 is totally redone. Won't be compatible with versions below 0.1.0**

## Usage

1. Setup the grouping you want. Before calling the loop, setup like this:
```javascript

listGrouper.addGroupMethod({
	groupName: 'invoices',
	groupMethod: function ( invoice ) {
		return invoice.client.name;
	},
	sumMethods: [
	function ( groupOfInvoices ) {
		return _.reduce(groupOfInvoices, function(memo, invoice) { return memo + invoice.amount; }, 0);
	}
	],
	groupMethodName: 'Paid or not',
	cursorSorter: { isPaid: 1, amount: 1 }
});

```
Now you're ready to group your invoices by the client name, and also get the total sum of the invoices in each group so you easily get an overview of your best paying clients.
2. In your HTML file, instead of using a regular `{{ #each invoices }}{{/each}}` loop for your list, use an outer (invoice groups) and an inner (invoices), like this: `{{ #each invoicesGrouped }}{{ #each groupItems }}{{/each}}{{/each}}`.
3. And the helper for this new loop would look like this: 
```javascript
Template.someTemplate.helpers({
	invoiceGroup: function () {
		// Pass the collection you want for the query, the mongoDB selector, 
		// and the name of the group (which is set in the listGrouper.addGroupMethod
		// method with groupName: 'invoices').
		// The groups will be returned.
		return listGrouper.groupCursor( Invoices, {}, 'invoices' );
	}
});
```
4. Do whatever you want in the HTML. The name of the group (the value returned of the groupMethod()) will be reachable in the `{{ groupHeadline }}` handlebars helper, and the actual group items will be in a `groupItems` helper (see above in the inner loop).
5. You can also sum stuff in the group. Just add methods to the sumMethods array and those will be return in a `sums` helper. So you can iterate over them using `{{ #each groups }}{{#each sums}}{{/each}}{{/each}}`.