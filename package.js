Package.describe({
  summary: "AwsSum (Amazon Web Services API lib) repackaged for Meteor"
});

Npm.depends({
  "awssum": "0.12.2",
  "underscore.string": "2.3.1"
});

Package.on_use(function (api) {
  api.add_files('server.js', 'server');
});
