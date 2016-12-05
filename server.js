var express = require('express');
var app = express();
var path = require('path');
var util = require('util');
var webpack = require('webpack');
var cheerio = require('cheerio');
var request = require('request');
var Firebase = require('firebase');
var firebaseUrl = 'https://flickering-heat-5064.firebaseio.com/';

const baseRef = new Firebase(firebaseUrl);
const gamertagsRef = baseRef.child('gamertags');
const gameClipIdsRef = baseRef.child('gameClipIds');
process.env.PWD = process.cwd();

var isDevelopment = (process.env.NODE_ENV !== 'production');
var static_path = path.join(__dirname, '/public');
var port = process.env.PORT || 3002;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

console.log('static path is ' + static_path);

if (isDevelopment) {
  console.log('Development Environment');
  var localConfig = require('./webpack.config');
  var localCompiler = webpack(localConfig);
  app.use(require('webpack-dev-middleware')(localCompiler, {
    noInfo: true,
    publicPath: localConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(localCompiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));

  localCompiler.run(function(err, stats) {
    // ...
    console.log(stats);
  });
} else {
  console.log('Production Booting Up');

  var config = require('./webpack.production.config');
  var compiler = webpack(config);
  // compiler.run(function(err, stats) {
  //   // ...
  //   console.log(stats);
  // });
}
console.log('using static path = ' + static_path);
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
  console.log('Path=/');
});

console.log('process.env.PWD= ' + process.env.PWD);


var Nightmare = require('nightmare');


var credentials = require('./credentials');
console.log(credentials);
var phantom = require('phantom');
// phantom.args = [credentials.username, credentials.password];
//
//
// if (phantom.args.length !== 2) {
//     console.log('Usage xbox.js <username> <password>');
//     phantom.exit();
// }








// var passport = require('passport');
//
// var WINDOWS_LIVE_CLIENT_ID = "";
// var WINDOWS_LIVE_CLIENT_SECRET = "";
//
// // Passport session setup.
// //   To support persistent login sessions, Passport needs to be able to
// //   serialize users into and deserialize users out of the session.  Typically,
// //   this will be as simple as storing the user ID when serializing, and finding
// //   the user by ID when deserializing.  However, since this example does not
// //   have a database of user records, the complete Windows Live profile is
// //   serialized and deserialized.
// passport.serializeUser(function(user, done) {
//   console.log('serializeUser(user)'+user);
//   console.log(JSON.stringify(user));
//
//     // console.log(Object.keys(user)[i] + ;
//
//     baseRef.child('windows-live-accounts').child(user.id).child('id').set(user.id);
//     baseRef.child('windows-live-accounts').child(user.id).child('name').set(user.name);
//
//   done(null, user);
// });
//
// passport.deserializeUser(function(obj, done) {
//   console.log('deserializeUser(obj)'+obj);
//
//   done(null, obj);
// });
// var WindowsLiveStrategy = require('passport-windowslive');
// var OAuth2Strategy = require('passport-oauth2');
//
// passport.use(new OAuth2Strategy({
//     authorizationURL: 'https://login.live.com/oauth20_authorize.srf',
//     tokenURL: 'https://login.live.com/ppsecure/post.srf',
//     clientID: WINDOWS_LIVE_CLIENT_ID,
//     clientSecret: WINDOWS_LIVE_CLIENT_SECRET,
//     callbackURL: "https://gameclips.herokuapp.com/auth/windows-live/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log(accessToken);
//         process.nextTick(function () {
//
//
//           // To keep the example simple, the user's Windows Live profile is returned
//           // to represent the logged-in user.  In a typical application, you would
//           // want to associate the Windows Live account with a user record in your
//           // database, and return that user instead.
//           return done(null, profile);
//         });
//   }
// ));
//
// passport.use(new WindowsLiveStrategy({
//   clientID: WINDOWS_LIVE_CLIENT_ID,
//   clientSecret: WINDOWS_LIVE_CLIENT_SECRET,
//
//   callbackURL: "https://gameclips.herokuapp.com/auth/windows-live/callback",
//     passReqToCallback: true
// }, function(req, accessToken, refreshToken, profile, done) {
//   // asynchronous verification, for effect...
//   // baseRef('windows-live-accounts').child('profile.id')
//   console.log(accessToken);
//   process.nextTick(function () {
//
//
//     // To keep the example simple, the user's Windows Live profile is returned
//     // to represent the logged-in user.  In a typical application, you would
//     // want to associate the Windows Live account with a user record in your
//     // database, and return that user instead.
//     return done(null, profile);
//   });
// }));


// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/auth/xbox-live', function(req, res) {
  var FirebaseTokenGenerator = require("firebase-token-generator");
  var tokenGenerator = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);
  // var token = tokenGenerator.createToken({ uid: "uniqueId1", some: "arbitrary", data: "here" });




});
app.get('/account', ensureAuthenticated, function(req, res) {
  console.log(req.user);
  res.sendFile(__dirname + '/public/index.html');
  console.log('Looked for html at ' + __dirname + '/public/index.html');
});

// GET /auth/windowslive
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Windows Live authentication will involve
//   redirecting the user to live.com.  After authorization, Windows Live
//   will redirect the user back to this application at
//   /auth/windowslive/callback
//   app.get('/auth/windows-live',
//     passport.authenticate('oauth2', { scope: ['xboxlive.signin', 'xboxlive.offline_access'] }),
//     function(req, res){
//       // The request will be redirected to Windows Live for authentication, so*
//       // this function will not be called.
//     });
//
// app.get('/auth/windows-live/callback',
//   passport.authenticate('oauth2', { failureRedirect: '/login' }),
//   function(req, res) {
//     // console.log(req);
//     // console.log(res);
//
//     res.redirect('/?access_token=' + req.user.access_token);
//   });

app.get('/v2/oauth_callback', function(req, res) {
  //   req.query.code
  //   client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&client_secret=CLIENT_SECRET&code=AUTHORIZATION_CODE&grant_type=authorization_code
  // followAllRedirects
  //   console.log(req)
  //   console.log(res)
  var xboxApiRequest = request.defaults({
    headers: {
      "Access_Token": "EwCAAq1DBAAUGCCXc8wU/zFu9QnLdZXy+YnElFkAAVlryB3jbgAqCD0U4eRy0Y76w3I+/Zk3IE1IVtKrx7+w3pH2fey7z0vIBuvNwp8MK9cGuNS54KqUwNjBF7t6dSjvlJUEKIxJB1SgyTSY8aMSGZcHSxz57RkF0J/6STKf2UAuToPbgajdqoSQxkqaVoDQ43TcRZmJZMBZA0N5tMBYNGHj5ezuzsYAOh4fuxNX8fdgybpDa4W3fjp2NzJ7DprXviOeLhetjDkTSpTkCWk4UOhKhGTO9AflrHSHca6H9ve6Hvgi/xr+rbKd5SUAogL75omqgLSw2aoNLNdhCPM4SwqzOiQ1mGwk+UO3dMycdW/JQQ1MfdApKi/D/Xg2VK0DZgAACBNWDx18Pj7HUAEg7sglHfWM+7DcT/w0+YwDblWaxpLl3TRrO16u4saOjbXvZOMocJUT7yOPMIO8gYxbiF9ikOOUBjYjxkFc/IJ12b6GnNBtrEepNkvOUTQYydJRzDjHPxt9K5lspmTmN4IZHmP6jbobhMntpgT4vCaebytMPdzocqyN1stmvfr/W5nj/rqfdFlcx8bUuyPY74ckFsedvDPHYdAQFKfeNSG2C6qhzgVXi46Xc5VLRdD6WfGL5yBwB/sJIGkmnNpgms/kEcLg7dFdQ7MikS6hNm47I86+qQFjwqIZBmkwoGdYMQ05hzfk4VJyEn6DLTXPN4ifyqnt1HP4kJJd7dHCzn6VSIvjEHBU1yrtCjr1yJeLcItIO9kVSL0P/4SVmKd4cNjqtynj9pXOCdz0PS9VmIxzrhyxgx9ghWfwBI/k0UMKLfHaVL0gsWyb1OC91/mHiu9hAQ==",
      "Cookie": "defCulture=en-US;",
      "Accept": " */*",
      "Accept-Encoding": "gzip, deflate, sdch",
      "Accept-Language": "en-US,en;q=0.8",
      "DNT": "1",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36"
    }
  })
  var requestUrl = 'https://account.xbox.com/en-us/social/loadActivityFeed';
  console.log(requestUrl);
  xboxApiRequest.followAllRedirects = true;
  xboxApiRequest.followRedirects = true;
  xboxApiRequest({
    method: 'GET',
    uri: requestUrl
  }, function(error, response, body) {
    // console.log(res);
    // console.log(req);
    console.log(body);
    console.log(error);
    // console.log(response);
    if (!error) {
      // var gameclipsarray = JSON.parse(body)['GameClips'];

      res.send(body);
    }
    if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
      // The location for some (most) redirects will only contain the path,  not the hostname;
      // detect this and add the host to the path.
      if (url.parse(response.headers.location).hostname) {
        // Hostname included; make request to res.headers.location
        console.log(response.headers.location);
      } else {
        // Hostname not included; get host from requested URL (url.parse()) and prepend to location.
      }

    }
    console.log('statusCode=' + response.statusCode)

  });

})


var Spooky = require('spooky');
var singleSpooky;
// initializeSpooky();
function initializeSpooky() {

  var apiQueue = [];
  // var apiQueueObject = { apiUrl: '', callback: func }
  singleSpooky = new Spooky({
    child: {
      "ignore-ssl-errors": true,
      "ssl-protocol": "tlsv1"
    },
    onRunComplete: function() {
      console.log('onRunComplete hit');
      // Don't exit on complete.
    },
    casper: {
      logLevel: 'debug',
      verbose: true
    }
  }, function(err) {
    if (err) {
      e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }
    singleSpooky.onRunComplete = function() {
        console.log('onRunComplete hit');

      }
      ////////// Login to Xbox Live
    singleSpooky.start(
      'https://login.live.com/ppsecure/post.srf');
    singleSpooky.then(function() {
      this.evaluate(function() {
        document.querySelector('input[id="i0116"]').value = 'respawntime@outlook.com';
        document.querySelector('input[id="i0118"]').value = 'dy2wriT6Fatt';
        document.querySelector('#idSIButton9').click();
        this.capture('screenshot.png');
        this.click('#idSIButton9');
      });
      console.log('Form filled and submitted');
    });
    singleSpooky.on('error', function(e, stack) {
      console.error(e);

      if (stack) {
        console.log(stack);
      }
    });
    singleSpooky.run();

  });
}
////////// Open api url

function xboxApi(apiUrl) {
  if (!singleSpooky) {

  }
  // HACK: without this, the `run()` call will re-execute all
  // the previous steps too!
  singleSpooky.steps = [];
  singleSpooky.step = 0;

  singleSpooky.thenOpen(apiUrl, function(response) {

  });

  ////////// Open api url
  singleSpooky.then(function() {
    this.wait(500, function() {
      this.emit('jsonResponse', this.evaluate(function() {
        return document.getElementsByTagName('pre')[0].innerHTML;
      }));
      this.emit('cookie', this.evaluate(function() {
        return document.cookie;
      }));
    });
  });
  singleSpooky.on('jsonResponse', function(html) {
    console.log('###############EMIT');
    return JSON.parse(html);
  });
  singleSpooky.on('cookie', function(cookie) {
    console.log('###############EMITTED COOKIE');
    console.log(cookie);
    cookies.push(cookie);
    // return JSON.parse(html);
  });
  singleSpooky.run();
}

var cookies = [];

app.get("/v2/game/:titleId", function(req, res) {

  var titleId = req.params.titleId;
  var searchUrl = 'https://account.xbox.com/en-us/gameclips/loadByTitle?titleId=' + titleId + '&maxItems=20';
  var Spooky = require('spooky');
  var spooky = new Spooky({
    child: {
      "ignore-ssl-errors": true,
      "ssl-protocol": "tlsv1"
    },
    casper: {
      logLevel: 'debug',
      verbose: true
    }
  }, function(err) {
    if (err) {
      e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }

    spooky.start(
      'https://login.live.com/ppsecure/post.srf');
    spooky.then(function() {
      this.evaluate(function() {
        document.querySelector('input[id="i0116"]').value = 'respawntime@outlook.com';
        document.querySelector('input[id="i0118"]').value = 'dy2wriT6Fatt';
        document.querySelector('#idSIButton9').click();
        this.capture('screenshot.png');
        this.click('#idSIButton9');
      });
      console.log('Form filled and submitted');
    });
    // spooky.thenOpen("https://account.xbox.com/en-us/gameclips/loadByUser?gamerTag="+gamertag+"&maxItems=200", function () {
    //   // this.emit('jsonResponse', this.evaluate(function () {
    //   //   return document.getElementsByTagName('pre')[0].innerHTML;
    //   // }));
    // });
    spooky.then(function() {
      this.wait(500, function() {
        // this.emit('cookie', this.evaluate(function () {
        //   return document.cookie;
        // }));
      });
    });
    spooky.thenOpen('https://account.xbox.com/en-us/', function(response) {
      this.wait(500, function() {
        this.emit('cookie', this.evaluate(function() {
          return document.cookie;
        }));
      });

    });
    spooky.thenOpen(searchUrl, function(response) {


    });
    spooky.then(function() {
      this.wait(500, function() {
        this.emit('jsonResponse', this.evaluate(function() {
          return document.getElementsByTagName('pre')[0].innerHTML;
        }));




        // if(response.status == 200){
        //     this.emit('jsonResponse', response);
        // }
      });
    });
    spooky.then(function dumpHeaders() {
      this.currentResponse.headers.forEach(function(header) {
        console.log(header.name + ': ' + header.value);
      });
    });
    spooky.on('cookie', function(cookie) {
      console.log('###############EMITTED COOKIE');
      console.log(cookie);
      cookies.push(cookie);
      console.log('cookies count=' + cookies.length + ', and the first cookie is: ' + cookies[0]);
      // return JSON.parse(html);
    });
    spooky.on('jsonResponse', function(html) {
      console.log('###############EMIT');
      res.send(html);
    });
    spooky.run();
  });
})

app.get("/v1/game/:titleId", function(req, res) {
    var titleId = req.params.titleId;

    var requestUrl = 'https://account.xbox.com/en-us/gameclips/loadByTitle?titleId=' + titleId + '&maxItems=20';
    var cookieRequest = request.defaults({
      headers: {
        Cookie: 'defCulture=en-US'
      }
    })
    console.log(requestUrl);
    cookieRequest({
      method: 'GET',
      uri: requestUrl
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        // var gameclipsarray = JSON.parse(body)['GameClips'];

        res.send(body);
      }
    });

  })
  // X-Auth: 4f13a9345bd5778941a6521d10f85047c6fb2a4e

app.get("/v1/titleData/:titleId", function(req, res) {
  var xboxApiRequest = request.defaults({
    headers: {
      "X-Auth": "4f13a9345bd5778941a6521d10f85047c6fb2a4e",
      "Content-Type": 'application/json'
    }
  })
  var requestUrl = '';
  console.log(requestUrl);
  xboxApiRequest({
    method: 'GET',
    uri: requestUrl
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // var gameclipsarray = JSON.parse(body)['GameClips'];

      res.send(body);
    }
  });
})


app.get("/v2/gameclip/:gameclipid", function(req, res) {
  var gameclipid = req.params.gameclipid;
  var gameclipscid, gamertag;
  gameClipIdsRef.child(gameclipid).child('Scid').once("value", function(snap) {
    gameclipscid = snap.val();
    console.log('gameclipscid ' + snap.val());
    gameClipIdsRef.child(gameclipid).child('OwnerGamerTag').once("value", function(snap) {
      gamertag = snap.val();

      var requestUrl = 'https://account.xbox.com/en-us/gameclip/' + gameclipid + '?gamerTag=' + encodeURIComponent(gamertag) + '&scid=' + gameclipscid;
      console.log(requestUrl);
      request({
        method: 'GET',
        uri: requestUrl
      }, function(error, response, body) {
        var reg = new RegExp(/(?:video: )"(.*?)"/);
        var gameClipUri = reg.exec(body);
        if (gameClipUri && gameClipUri.length > 1) {
          gameClipUri = gameClipUri[1];
          gameClipUri = gameClipUri.replace(/(\\u0026)/g, '&');
        }
        gameClipIdsRef.child(gameclipid).child('ClipUri').set(gameClipUri);
        res.send(gameClipUri);

      });
    });
  })




  app.get("/v1/gameclip/:gameclipid", function(req, res) {
    var gameclipid = req.params.gameclipid;
    var gameclipscid, gamertag;

    gameClipIdsRef.child(gameclipid).child('Scid').once("value", function(snap) {
      gameclipscid = snap.val();
      console.log('gameclipscid ' + snap.val());
      gameClipIdsRef.child(gameclipid).child('OwnerGamerTag').once("value", function(snap) {
        gamertag = snap.val();
        var cookie = cookies.length ? cookies[0] : 'defCulture=en-US';
        console.log('using cookie ' + cookie);
        var cookieRequest = request.defaults({
          headers: {
            Cookie: cookie
          }
        })
        var requestUrl = 'https://account.xbox.com/en-us/gameclip/' + gameclipid + '?gamerTag=' + encodeURIComponent(gamertag) + '&scid=' + gameclipscid;
        console.log(requestUrl);
        cookieRequest({
          method: 'GET',
          uri: requestUrl
        }, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            // var $ = cheerio.load(body);
            // console.log( $('script').get()[7].data );
            // $('span.comhead').each(function(i, element){
            //
            // }
            // var gameClipUri = body.match(/(?:video: )"(.*?)");
            var reg = new RegExp(/(?:video: )"(.*?)"/);
            var gameClipUri = reg.exec(body);
            if (gameClipUri && gameClipUri.length > 1) {
              gameClipUri = gameClipUri[1];
              gameClipUri = gameClipUri.replace(/(\\u0026)/g, '&');
            }
            console.log('gameClipUri = ' + gameClipUri);

            // console.log(body) // Show the HTML for the Google homepage.
            res.send(gameClipUri);
          } else {
            console.log('error = ' + error);
            console.log('response.statusCode = ' + response.statusCode);
            console.log('response.')
            res.send(body);

            // console.log(response);
          }
        });
      });
    });


  });
})
app.get("/v1/cookie", function(req, res) {
  console.log('fetching cookie...');
  var Spooky = require('spooky');
  var spooky = new Spooky({
    child: {
      "ignore-ssl-errors": true,
      "ssl-protocol": "tlsv1"
    },
    casper: {
      logLevel: 'debug',
      verbose: true
    }
  }, function(err) {
    if (err) {
      e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }
    console.log('started spooky');

    spooky.start('http://www.xbox.com/en-US');
    spooky.then(function() {
      this.evaluate(function() {
        document.querySelector('.msame_Header.msame_unauth').click();
        this.wait(500, function() {

        });
      });
    });

    spooky.then(function() {
      console.log('initial page loaded');
      this.evaluate(function() {
        document.querySelector('input[id="i0116"]').value = 'respawntime@outlook.com';
        document.querySelector('input[id="i0118"]').value = 'dy2wriT6Fatt';
        document.querySelector('#idChkBx_PWD_KMSI0Pwd').click();
        document.querySelector('#idSIButton9').click();
        this.capture('screenshot.png');
        this.click('#idSIButton9');
      });
      console.log('Form filled and submitted');
    });
    spooky.then(function() {
      this.wait(500, function() {
        this.emit('cookie', this.evaluate(function() {
          return document.cookie;
        }));
      });
    });
    spooky.on('cookie', function(cookie) {
      console.log('###############EMITTED COOKIE');
      console.log(cookie);
      cookies.push(cookie);
      res.send(cookie);
      // return JSON.parse(html);
    });
    spooky.run();
  });

})
app.get("/v11/gamertag/:gamertag", function(req, res) {
  var gamertag = req.params.gamertag;
  var searchUrl = 'https://account.xbox.com/en-us/gameclips/loadByUser?gamerTag=' + encodeURIComponent(gamertag) + '&maxItems=200';
  var Spooky = require('spooky');
  var spooky = new Spooky({
    child: {
      "ignore-ssl-errors": true,
      "ssl-protocol": "tlsv1"
    },
    casper: {
      logLevel: 'debug',
      verbose: true
    }
  }, function(err) {
    if (err) {
      e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }

    spooky.start(
      'https://login.live.com/ppsecure/post.srf');
    spooky.then(function() {
      this.evaluate(function() {
        document.querySelector('input[id="i0116"]').value = 'respawntime@outlook.com';
        document.querySelector('input[id="i0118"]').value = 'dy2wriT6Fatt';
        document.querySelector('#idSIButton9').click();
        this.capture('screenshot.png');
        this.click('#idSIButton9');
      });
      console.log('Form filled and submitted');
    });
    // spooky.thenOpen("https://account.xbox.com/en-us/gameclips/loadByUser?gamerTag="+gamertag+"&maxItems=200", function () {
    //   // this.emit('jsonResponse', this.evaluate(function () {
    //   //   return document.getElementsByTagName('pre')[0].innerHTML;
    //   // }));
    // });
    spooky.then(function() {
      this.wait(500, function() {
        // this.emit('cookie', this.evaluate(function () {
        //   return document.cookie;
        // }));
      });
    });
    spooky.thenOpen('https://account.xbox.com/en-us/', function(response) {
      this.wait(500, function() {
        this.emit('cookie', this.evaluate(function() {
          return document.cookie;
        }));
      });

    });
    spooky.thenOpen(searchUrl, function(response) {


    });
    spooky.then(function() {
      this.wait(500, function() {
        this.emit('jsonResponse', this.evaluate(function() {
          return document.getElementsByTagName('pre')[0].innerHTML;
        }));




        // if(response.status == 200){
        //     this.emit('jsonResponse', response);
        // }
      });
    });
    spooky.then(function dumpHeaders() {
      this.currentResponse.headers.forEach(function(header) {
        console.log(header.name + ': ' + header.value);
      });
    });
    spooky.on('cookie', function(cookie) {
      console.log('###############EMITTED COOKIE');
      console.log(cookie);
      cookies.push(cookie);
      console.log('cookies count=' + cookies.length + ', and the first cookie is: ' + cookies[0]);
      // return JSON.parse(html);
    });
    spooky.on('jsonResponse', function(html) {
      console.log('###############EMIT');
      res.send(html);
    });
    spooky.run();
  });

})
app.get("/v10/gamertag/:gamertag", function(req, res) {
  var gamertag = req.params.gamertag;
  var cookie = cookies.length ? cookies[0] : 'defCulture=en-US';
  console.log('using cookie ' + cookie);
  var cookieRequest = request.defaults({
    headers: {
      Cookie: 'defCulture=en-US'
    }
  })
  var requestUrl = 'https://account.xbox.com/en-us/gameclips/loadByUser?gamerTag=' + encodeURIComponent(gamertag) + '&maxItems=200';
  console.log(requestUrl);
  cookieRequest({
    method: 'GET',
    uri: requestUrl
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // var gameclipsarray = JSON.parse(body)['GameClips'];

      res.send(body);
    }
  });


});
app.get("/v9/gamertag/:gamertag", function(req, res) {
  var gamertag = req.params.gamertag;

  var lastFetchedDate = gamertagsRef.child(gamertag.toString()).child('lastFetchedDate');
  console.log(Date(lastFetchedDate));
  var hourInMS = 3600 * 1000;
  if (lastFetchedDate - new Date().getTime() > hourInMS) {
    var fullUrl = req.protocol + '://' + req.get('host') + '/v7/gamertag/' + gamertag;
    request(fullUrl, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body) // Show the HTML for the Google homepage.
        var gameclipsarray = JSON.parse(body)['GameClips'];
        res.send(gameclipsarray);
      }
    })
    console.log('fetched from xbox');
  } else {
    gamertagsRef.child(gamertag.toString()).child('lastFetched');
    console.log('fetch from firebase');
  }

  // var gameclipsarray = JSON.parse(request.response)['GameClips'];
  // var firebaseClipIds = gameclipsarray.map(function (obj) {
  //   var rObj = {};
  //   console.log(obj.Id);
  //   rObj[obj.Id] = obj;
  //   gameClipIdsRef.child(obj.Id).set(obj);
  //   return obj.Id;
  // });
  // gamertagsRef.child(gamertag.toString()).child('lastFetched').set(firebaseClipIds);


});
app.get("/v8/gamertag/:gamertag", function(req, res) {
  var gamertag = req.params.gamertag;

  res.send(xboxApi('https://account.xbox.com/en-us/gameclips/loadByUser?gamerTag=' + encodeURIComponent(gamertag) + '&maxItems=200'));
});

/*
// Uncomment this block to see all of the things Casper has to say.
// There are a lot.
// He has opinions.
spooky.on('console', function (line) {
    console.log(line);
});
*/


app.get("/v7/gamertag/:gamertag", function(req, res) {
  var gamertag = req.params.gamertag;
  var searchUrl = 'https://account.xbox.com/en-us/gameclips/loadByUser?gamerTag=' + encodeURIComponent(gamertag) + '&maxItems=200';
  var Spooky = require('spooky');
  var spooky = new Spooky({
    child: {
      "ignore-ssl-errors": true,
      "ssl-protocol": "tlsv1"
    },
    casper: {
      logLevel: 'debug',
      verbose: true
    }
  }, function(err) {
    if (err) {
      e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }

    spooky.start(
      'https://login.live.com/ppsecure/post.srf');
    spooky.then(function() {
      this.evaluate(function() {
        document.querySelector('input[id="i0116"]').value = 'respawntime@outlook.com';
        document.querySelector('input[id="i0118"]').value = 'dy2wriT6Fatt';
        document.querySelector('#idSIButton9').click();
        this.capture('screenshot.png');
        this.click('#idSIButton9');
      });
      console.log('Form filled and submitted');
    });
    // spooky.thenOpen("https://account.xbox.com/en-us/gameclips/loadByUser?gamerTag="+gamertag+"&maxItems=200", function () {
    //   // this.emit('jsonResponse', this.evaluate(function () {
    //   //   return document.getElementsByTagName('pre')[0].innerHTML;
    //   // }));
    // });
    spooky.then(function() {
      this.wait(500, function() {
        this.emit('cookie', this.evaluate(function() {
          return document.cookie;
        }));
      });
    });
    spooky.thenOpen(searchUrl, function(response) {


    });
    spooky.then(function() {
      this.wait(500, function() {
        this.emit('jsonResponse', this.evaluate(function() {
          return document.getElementsByTagName('pre')[0].innerHTML;
        }));

      });
    });
    spooky.then(function dumpHeaders() {
      this.currentResponse.headers.forEach(function(header) {
        console.log(header.name + ': ' + header.value);
      });
    });
    spooky.on('cookie', function(cookie) {
      console.log('###############EMITTED COOKIE');
      console.log(cookie);
      cookies.push(cookie);
      console.log('cookies count=' + cookies.length + ', and the first cookie is: ' + cookies[0]);
      // return JSON.parse(html);
    });
    spooky.on('jsonResponse', function(html) {
      console.log('###############EMIT');
      res.send(html);
    });
    spooky.run();
  });

  spooky.on('error', function(e, stack) {
    console.error(e);

    if (stack) {
      console.log(stack);
    }
  });


  // Uncomment this block to see all of the things Casper has to say.
  // There are a lot.
  // He has opinions.
  spooky.on('console', function(line) {
    console.log(line);
  });


})
app.get("/v6/gamertag/:gamertag", function(req, res) {
  var gamertag = req.params.gamertag;
  phantom.create(function(ph) {
    console.log('created ph');
    ph.createPage(function(page) {
      console.log('created page');
      var redirectURL = null;


      page.onResourceRequested = function(request) {
        console.log('Request ' + JSON.stringify(request, undefined, 4));
      };
      page.onResourceReceived = function(resource) {
        if (url == resource.url && resource.redirectURL) {
          redirectURL = resource.redirectURL;
        }
      };
      page.onError = function(msg, trace) {
        console.log(msg);
        trace.forEach(function(item) {
          console.log('  ', item.file, ':', item.line);
        });
      };
      page.open('https://login.live.com/ppsecure/post.srf', function(status) {
        if (status !== 'success') {
          console.log('Unable to access network' + status);
        } else {
          console.log('opened page, stats = ' + status);
          page.render('loginlive.png');
          page.evaluate(function() {
            var usernameEl = document.querySelector('input[id="i0116"]');
            usernameEl.value = 'respawntime@outlook.com';
            var passwordEl = document.querySelector('input[id="i0118"]');
            passwordEl.value = 'dy2wriT6Fatt';

          }, function(result) {
            console.log('evaluated username and password, results = ' + result);
            page.render('loginlive-filled.png');

            page.evaluate(function() {
              var el = document.querySelector('#idSIButton9');
              var event = document.createEvent('MouseEvent');
              event.initEvent('click', true, false);
              el.dispatchEvent(event);
              setTimeout(function() {
                return window.location.href;
              }, 500);
            }, function(result) {
              console.log('clicked submit button, results = ' + result);
              console.log('waiting...');

              setTimeout(function() {
                page.render('loginlive-after-click.png');

                console.log('current url is ' + page.url);
                page.open(encodeURI("https://account.xbox.com/en-us/gameclips/loadByUser?gamerTag=" + gamertag + "&maxItems=200"), function(status) {
                  if (status !== 'success') {
                    console.log('Unable to access network' + status);
                  } else {
                    console.log('opened page, stats = ' + status);

                    var pageResponse = page.evaluate(function() {
                      return document.getElementsByTagName('pre')[0].innerHTML;
                    });
                    console.log(pageResponse);
                    res.send(pageResponse);
                  }
                });
              }, 2500);
              ph.exit();
            });
          });
        }
      });
    });
  });
})

app.get("/v5/gamertag/:gamertag", function(req, res) {
  var gamertag = req.params.gamertag;


  // var xboxlive = new Nightmare()

  var xboxlive = new Nightmare()
    .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
    .goto('https://login.live.com/ppsecure/post.srf')
    .wait(100)
    .type('input[id=i0116]', 'respawntime@outlook.com')
    .wait(500)
    .type('input[id=i0118]', 'dy2wriT6Fatt')
    .wait(500)
    .screenshot('windowslive-filled.png')
    .click('#idSIButton9')
    .wait('#site-header')
    .goto("https://account.xbox.com/en-us/gameclips/loadByUser?gamerTag=" + gamertag + "&maxItems=200")
    .screenshot('windowslive.png')
    .evaluate(function() {
      return document.getElementsByTagName('pre')[0].innerHTML;
    })
    .run(function(err, nightmare) {
      if (err) return console.log(err);
      res.send(nightmare);
      console.log('Done!');
    });


})
app.get("/v4/gamertag/:gamertag", function(req, res) {
  phantom.create(function(ph) {
    ph.createPage(function(page) {
      console.log('ph = ' + ph);
      console.log('page = ' + page);
      page.open("https://login.live.com/ppsecure/post.srf", function(status) {
        console.log("opened google? ", status);
        if (status !== "success") {
          console.log("Unable to access network");
        } else {
          var url = getPageUrl(page);
          switch (true) {
            case /login.srf/.test(url):
              // Step 1 - Login
              page.evaluate(fillFormFunctionAsString());
              break;
            case /post.srf/.test(url):
              // Step 2 - Process Cookies
              break;
            case /Friends$/.test(url):
              // We did it!
              parseFriends(page);
              phantom.exit();
              break;
            default:
              // uh oh we hit an unexpected url
              console.log('directed to url: ' + url);
              phantom.exit(1);
          }
        }
      });
    });
  });
})
app.get("/v3/gamertag/:gamertag", function(req, res) {
  loginToXboxLive();

  res.send('attempting to login to xbox live');

})
app.get("/v2/gamertag/:gamertag", function(req, res) {
  var gameClipData = '';
  var gamertag = req.params.gamertag;



  var request = require('request');
  var jar = request.jar();

  var loginUrl = "https://login.live.com/ppsecure/post.srf?bk=1449864833&uaid=c6976dbb72df4bbd9a74c27466fcfb50&pid=0";
  (function(username, password) {
    request.post({
      uri: loginUrl,
      jar: jar,
      format: {
        loginfmt: username,
        passwd: password,
        KMSI: 1,
        SI: "Sign in",
        login: username,
        type: 11,
        PPSX: "PassportR",
        idsbho: 1,
        sso: 0,
        NewUser: 1,
        LoginOptions: 1
      },
    }, function(err, res, body) {
      gameClipData = 'res = ' + res.toString() + 'body = ' + body.toString();
    });
  })('rampaging_joker@live.com', 'ERRRRRRRRRR');
  res.send(gameClipData);
});
app.get("/v1/gamertag/:gamertag", function(req, res) {
  var gameClipData;
  var gamertag = req.params.gamertag;

  var request = require('request');
  var jar = request.jar();

  var loginUrl = "https://login.live.com/ppsecure/post.srf";
  (function(username, password) {
    request.post({
      uri: loginUrl,
      jar: jar,
      format: {
        loginfmt: username,
        passwd: password,
        KMSI: 1,
        SI: "Sign in",
        login: username,
        type: 11,
        PPSX: "PassportR",
        idsbho: 1,
        sso: 0,
        NewUser: 1,
        LoginOptions: 1
      },
    }, function(err, res, body) {
      // console.log()
      if (err) {
        // callback.call(null, new Error('Login failed'));
        gameClipData = "[err: 'Error fetching game clips']";
        // return;
      }
      console.log(gameClipData);
      console.log(res);
      console.log(err);


      var requestURL = "https://account.xbox.com/en-us/gameclips/loadByUser?gamerTag=" + gamertag + "&maxItems=20";
      request(requestURL, function(_err, _res, _body) {

        gameClipData = _res || "{test: 'hi'}";

      });
      // do scraping
    });
  })('rampaging_joker@live.com', 'EERRRRRRR');
  console.log(gameClipData);
  res.json(gameClipData);
});

app.use(express.static(static_path));

app.get("*", function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
  console.log('Looked for html at ' + __dirname + '/public/index.html');
});


// }
console.log('static path is ' + static_path);
// We point to our static assets

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  }
  console.log('app listening at localhost:' + port);
});


function createNewPhantomPage() {
  var phatnomjsbrowser;

  phantom.create(function(ph) {
    phatnomjsbrowser = ph;
    phatnomjsbrowser.createPage(function(page) {
      return page;
    });
  });

}

function loginToXboxLive() {
  console.log('attempting to login to xbox live');
  var loginPage = createNewPhantomPage();
  loginPage.open(encodeURI('https://live.xbox.com/en-US/Friends'), function(status) {
    if (status !== "success") {
      console.log("Unable to access network");
    } else {
      var url = getPageUrl(loginPage);
      switch (true) {
        case /login.srf/.test(url):
          // Step 1 - Login
          loginPage.evaluate(fillFormFunctionAsString());
          break;
        case /post.srf/.test(url):
          // Step 2 - Process Cookies
          break;
        case /Friends$/.test(url):
          // We did it!
          parseFriends(loginPage);
          phantom.exit();
          break;
        default:
          // uh oh we hit an unexpected url
          console.log(url);
          phantom.exit(1);
      }
    }
  });
}


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}
/*
 * Callback to process page when finshed loading
 */
// var onPageLoadFinished = function(page, status) {
//     if (status !== "success") {
//         console.log("Unable to access network");
//     } else {
//         var url = getPageUrl();
//         switch (true) {
//         case /login.srf/.test(url):
//             // Step 1 - Login
//             page.evaluate(fillFormFunctionAsString());
//             break;
//         case /post.srf/.test(url):
//             // Step 2 - Process Cookies
//             break;
//         case /Friends$/.test(url):
//             // We did it!
//             parseFriends(page);
//             phantom.exit();
//             break;
//         default:
//             // uh of we hit an unexpected url
//             phantom.exit(1);
//         }
//     }
// }

function getPageUrl(page) {
  return page.evaluate(function() {
    return location.href
  });
}

/*
 * TODO: Parse HTML script
 */
function parseFriends(page) {
  console.log(page.content);
}

/*
 * Hack due to phantomjs page.evaluate limitations:-
 * http://code.google.com/p/phantomjs/issues/detail?id=132
 */
function fillFormFunctionAsString() {
  return "function() {" +
    "var form = document.querySelector(\"form[name='f1']\"); " +
    "var login = form.querySelector(\"input[name='login']\"); " +
    "login.value = '" + phantom.args[0] + "'; " +
    "var passwd = form.querySelector(\"input[name='passwd']\"); " +
    "passwd.value = '" + phantom.args[1] + "'; " +
    "var kmsi = form.querySelector(\"input[name='KMSI']\"); " +
    "kmsi.value = '2'; " +
    "form.querySelector('#idSIButton9').click();}";
};

// page.open(encodeURI('https://live.xbox.com/en-US/Friends'));
