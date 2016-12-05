import { firebaseUrl } from '../util/constants';
let baseRef = new Firebase(firebaseUrl);


module.exports = function joinPaths(id, paths, callback) {
    var returnCount = 0;
    var expectedCount = paths.length;
    var mergedObject = {};

    paths.forEach(function (p) {
        baseRef.child(p + '/' + id).once('value',
            // success
            function (snap) {
                // add it to the merged data
                extend(mergedObject, snap.val());

                // when all paths have resolved, we invoke
                // the callback (jQuery.when would be handy here)
                if (++returnCount === expectedCount) {
                    callback(null, mergedObject);
                }
            },
            // error
            function (error) {
                returnCount = expectedCount + 1; // abort counters
                callback(error, null);
            }
        );
    });
    function extend(base) {
        var parts = Array.prototype.slice.call(arguments, 1);
        parts.forEach(function (p) {
            if (p && typeof (p) === 'object') {
                for (var k in p) {
                    if (p.hasOwnProperty(k)) {
                        base[k] = p[k];
                    }
                }
            }
        });
        return base;
    }
}
