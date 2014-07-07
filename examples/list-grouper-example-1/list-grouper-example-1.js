if (Meteor.isClient) {

  Session.set('groupBy', 'wins');
  Session.set('sortOrder', -1);

  var getWinsAndLosses = function ( group ) {
    // Return win/lose ratio sum of group.
    var wins = _.reduce(group, function(memo, doc){ return memo + doc.wins; }, 0);
    var losses = _.reduce(group, function(memo, doc){ return memo + doc.losses; }, 0);
    return { sum: 'Group wins/losses ratio: '+Math.floor(wins/losses*10)/10 };
  };

  listGrouper.addGroupMethod({
    groupName: 'teams',
    groupMethod: function ( doc ) {
      var groupValue = Math.floor( doc.wins/5 )*5;
      return 'Wins: ' + groupValue + '–' + (groupValue + 5);
    },
    sumMethods: [
    getWinsAndLosses
    ],
    groupMethodName: 'Wins',
    cursorSorter: { wins: -1 }
  });

  listGrouper.addGroupMethod({
    groupName: 'teams',
    groupMethod: function ( doc ) {
      var groupValue = Math.floor( doc.losses/5 )*5;
      return 'Losses: ' + groupValue + '–' + (groupValue + 5);
    },
    sumMethods: [
    getWinsAndLosses
    ],
    groupMethodName: 'Losses',
    cursorSorter: { losses: -1 }
  });

  Template.insertData.helpers({
    // If there are no records, show the form.
    noRecords: function () {
      return ListItems.find({}).count() < 1;
    }
  });

  Template.changeGrouping.events({
    'click a': function ( e ) {
      var clickedLink = $(e.currentTarget);
      var linkText = clickedLink.text();
      listGrouper.toggleActiveGroupMethod('teams', linkText);
    }
  });

  Template.lists.helpers({
    listItems: function () {
      var sort = {};
      sort[Session.get('groupBy')] = Session.get('sortOrder');
      return ListItems.find({}, { sort: sort });
    },
    listItemsGrouped: function () {
      return listGrouper.groupCursor( ListItems, {}, 'teams' );
    },
    // groupList: function () {
    //   var sort = {};
    //   sort[Session.get('groupBy')] = Session.get('sortOrder');
    //   var options = {
    //     groupBy: function ( doc ) {
    //       return Session.get('groupBy') +
    //       ': ' +
    //       Math.floor( doc[Session.get('groupBy')] );
    //     },
    //     cursor: ListItems.find({}, { sort: sort }).fetch(),
    //     listParentSelector: '.list--with-headlines',
    //     listItemsSelector: '.listItem',
    //     groupHeaderEl: 'li',
    //     groupHeaderElClass: 'listItem listItem--header',
    //     groupHeaderTextElClass: 'listItem__header__text',
    //     sumMethods: [
    //     function ( group ) {
    //       // Return win/lose ratio sum of group.
    //       var wins = _.reduce(group, function(memo, doc){ return memo + doc.wins; }, 0);
    //       var losses = _.reduce(group, function(memo, doc){ return memo + doc.losses; }, 0);
    //       return 'Group wins/losses ratio: '+Math.floor(wins/losses*10)/10;
    //     }
    //     ],
    //     sumClass: 'listItem__header__sum'
    //   };

    //   var listGrouper = new ListGrouper( options );

    // }
  });

}