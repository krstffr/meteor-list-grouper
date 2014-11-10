Package.describe({
  summary: "Group the content in your lists.",
  name: "krstffr:list-grouper",
  version: "2.0.0",
  git: "https://github.com/krstffr/meteor-list-grouper.git",
});

Package.onUse(function (api) {

  api.add_files('lib/list-grouper.js', 'client');

  // The main object.
  api.export('ListGrouper', 'client');

});
