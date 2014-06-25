Package.describe({
  "summary": "Group the content in your lists."
});

Package.on_use(function (api) {

  // api.use('templating', 'client');

  api.add_files('lib/list-grouper.js', 'client');

  if (typeof api.export !== 'undefined') {

    // The main object.
    api.export('ListGrouper', 'client');

  }

});
