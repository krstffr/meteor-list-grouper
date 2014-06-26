// This is for populating data.
// More on https://github.com/krstffr/meteor-spreadsheet-to-mongodb
var options = [];

options.push({
  name: 'listItems',
  collection: ListItems,
  fields: [
  { name: 'team', idpart: true },
  { name: 'participations', type: 'number' },
  { name: 'played', type: 'number' },
  { name: 'wins', type: 'number' },
  { name: 'draws', type: 'number' },
  { name: 'losses', type: 'number' },
  { name: 'goalsFor', type: 'number' },
  { name: 'goalDifference', type: 'number' },
  { name: 'bestFinish' }
  ]
});

spreadsheetToMongoDB = new SpreadsheetToMongoDB( options );