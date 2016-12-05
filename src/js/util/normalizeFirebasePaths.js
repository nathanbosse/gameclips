import { firebaseUrl } from '../util/constants';
let baseRef = new Firebase(firebaseUrl);


module.exports = function normalizePaths(id, startingPath, callback) {
    var returnCount = 0;
    var expectedCount = 0;
    var currentCount = 0;
    var mergedObject = {};

    baseRef.child(startingPath+'/'+id).once('value', function(snap) {
        mergedObject = snap.val();
          if (mergedObject['gameClipIds']) {
            mergedObject.gameclips = [];
            var keys = Object.keys(mergedObject['gameClipIds']);
            expectedCount = keys.length;
            snap.child('gameClipIds').forEach(function (key) {
              baseRef.child('gameClipIds' + '/' + key.key()).once('value', function (snap) {

                mergedObject.gameclips.push(snap.val());
                currentCount = mergedObject.gameclips.length;
                if (currentCount === expectedCount) {
                  callback(null, mergedObject);
                }
              })
            })
          }
        })


    // baseRef.child(startingPath+'/'+id).once('value', function(snap) {
    //     mergedObject = snap.val();
    //     valuePaths.forEach(function (p) {
    //       if (mergedObject[p]) {
    //         var keys = Object.keys(mergedObject[p]);
    //         keys.forEach(function (key) {
    //           baseRef.child(p + '/' + key).once('value', function (snap) {
    //             extend(mergedObject, snap.val());
    //           })
    //         })
    //       }
    //     })
    //     callback(null, mergedObject);
    //
    // })

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
