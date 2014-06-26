ListItems = new Meteor.Collection('listItems');

if (Meteor.isClient) {
  Meteor.startup(function () {
    Meteor.subscribe('listItems');
  });
}

if (Meteor.isServer) {
  Meteor.publish('listItems', function () {
    return ListItems.find({}, { limit: 50 });
  });
}