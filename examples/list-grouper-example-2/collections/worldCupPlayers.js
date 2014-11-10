WorldCupPlayers = new Meteor.Collection('worldCupPlayers');

if (Meteor.isServer) {

	Meteor.publish('players', function () {
		return WorldCupPlayers.find();
	});

}

if (Meteor.isClient)
	Meteor.subscribe('players');