var groupByPasses = {
  name: 'Total passes',
  groupMethod: function ( player ) {
    return Math.round( player.passes / 40 ) * 40;
  }
};

var groupByPassesPerMinute = {
  name: 'Passes by minute',
  groupMethod: function ( player ) {
    return (player.passes / player.playtime).toFixed(1);
  }
};

var groupByShotsPerMinute = {
  name: 'Shots per minute',
  groupMethod: function ( player ) {
    return (player.shots / player.playtime).toFixed(3);
  }
};

var groupMethods = [
groupByPasses, groupByPassesPerMinute, groupByShotsPerMinute
];

// Use this integer to select what method to use for grouping
Session.setDefault('groupByMethod', 0);

Template.insertData.helpers({
  // If there are no records, show the form.
  noRecords: function () {
    return WorldCupPlayers.find({}).count() < 1;
  }
});

Template.changeGrouping.events({
  'click .toggle-group-by-method': function ( e ) {
    Session.set('groupByMethod', Session.get('groupByMethod')+1 );
    if (Session.get('groupByMethod') > (groupMethods.length-1) )
      Session.set('groupByMethod', 0);
  }
});

Template.lists.helpers({
  listItems: function () {
    return WorldCupPlayers.find({}, { limit: 100 });
  },
  listItemsGrouped: function () {
    return ListGrouper.getGroup({
      // Use the entire collection!
      // You can of course also limit which players to return.
      collection: WorldCupPlayers.find({}, { limit: 100 }),
      filter: function ( player ) {
        // Only show players who have played at least 90 minutes
        return player.playtime > 90;
      },
      sums: [
      {
        // Show how many shots were shot by this group
        name: 'Shots',
        sumMethod: function ( memo, player ) {
          return memo + player.shots;
        }
      },
      {
        name: 'Tackles',
        sumMethod: function ( memo, player ) {
          return memo + player.tackles;
        }
      }
      ],
      // The group by method
      groupBy: groupMethods[ Session.get('groupByMethod') ]
    }).reverse();
  }
});