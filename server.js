var Future = Npm.require("fibers/future");

// Add the underscore string methods to the global `_` object.
// Altenatively, once could use the underscore-string package on
// Atmosphere, but then you'd be forced to use Meteorite. Once Meteor
// supports third-party packages, switch over.
_.mixin(Npm.require("underscore.string"));

// @export AWSSum
AWSSum = {
  load: function(moduleName, className) {

    var awssum = Npm.require('awssum');
    var module = awssum.load(moduleName);

    if (!className)
      return module;

    // Get a reference to the original interface
    var interface = awssum.load(moduleName)[className];

    // Make sure to only wrap once
    if (interface.prototype._wrappedForMeteor)
      return interface;

    _.each(interface.prototype, function(fn, name) {

      // Make sure it's a method and it conforms to the awssum naming
      // scheme for functions with a callback as a last argument
      if (!_.isFunction(fn) || (name !== _.classify(name)))
        return;

      // Wrap it! Unfortunately we can't use Future.wrap, which looks at the wrapped
      // function's arity. This doesn't work well with optional arguments, as used by
      // awssum: https://github.com/appsattic/node-awssum/blob/master/lib/awssum.js#L325
      interface.prototype[name] = function() {

        var fut = new Future();

        // Make a copy of the arguments that's easier to work with
        var args = _.toArray(arguments);

        // If called without a callback add Future-ized callback
        //
        // XXX missing here: If called with a callback, wrap that
        // callback with `Meteor.bindEnvironment`
        if (!_.isFunction(_.last(args)))

          // Build up a callback backed by Future
          args.push(function(error, data) {
            // This notifies `fut.wait()` below to either return a
            // value or throw an exception.
            if (error)
              fut.throw(error);
            else
              fut.return(data);
          });

        // Run the method with our Future-ized callback
        fn.apply(this, args);

        return fut.wait();
      };
    });

    interface.prototype._wrappedForMeteor = true;
    return interface;
  }
};
