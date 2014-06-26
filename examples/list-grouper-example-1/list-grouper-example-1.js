if (Meteor.isClient) {

  Meteor.startup(function () {
    Session.set('groupBy', 'participations');
    Session.set('sortOrder', -1);
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
      if (linkText !== Session.get('groupBy'))
        Session.set('groupBy', linkText);
      else
        Session.set('sortOrder', -Session.get('sortOrder'));
    }
  });

  Template.lists.helpers({
    listItems: function () {
      var sort = {};
      sort[Session.get('groupBy')] = Session.get('sortOrder');
      return ListItems.find({}, { sort: sort });
    },
    groupList: function () {
      var sort = {};
      sort[Session.get('groupBy')] = Session.get('sortOrder');
      var options = {
        groupBy: function ( doc ) {
          return Session.get('groupBy') +
          ': ' +
          Math.floor( doc[Session.get('groupBy')] );
        },
        cursor: ListItems.find({}, { sort: sort }).fetch(),
        listParentSelector: '.list--with-headlines',
        listItemsSelector: '.listItem',
        groupHeaderEl: 'li',
        groupHeaderElClass: 'listItem listItem--header',
        groupHeaderTextElClass: 'listItem__header__text',
        sumMethods: [
        function ( group ) {
          // Return win/lose ratio sum of group.
          var wins = _.reduce(group, function(memo, doc){ return memo + doc.wins; }, 0);
          var losses = _.reduce(group, function(memo, doc){ return memo + doc.losses; }, 0);
          return 'Group wins/losses ratio: '+Math.floor(wins/losses*10)/10;
        }
        ],
        sumClass: 'listItem__header__sum'
      };

      var listGrouper = new ListGrouper( options );

    }
  });

}