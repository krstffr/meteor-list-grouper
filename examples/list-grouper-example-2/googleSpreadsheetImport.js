// This is for populating data.
// More on https://github.com/krstffr/meteor-spreadsheet-to-mongodb
var formOptions = {
  formName: 'worldCupPlayers',
  collection: WorldCupPlayers,
  fields: [
  { name: 'surname', idpart: true },
  { name: 'team', idpart: true },
  { name: 'position', idpart: true },
  { name: 'playtime', type: 'number' },
  { name: 'shots', type: 'number' },
  { name: 'passes', type: 'number' },
  { name: 'tackles', type: 'number' },
  { name: 'saves', type: 'number' }
  ]
};

SpreadsheetToMongoDB.addForm( formOptions );