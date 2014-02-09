/**
* A service that authenticates against Fireabase using simple login
*/
// angular.module('myApp').factory('auth', function($rootScope, fbRef, $location) {

   //  var auth = new FirebaseSimpleLogin(fbRef, function(error, user) {
   //      if (error) {
   //          // an error occurred while attempting login
   //          console.log(error);

   //          $rootScope.authenticated = false;
   //          $location.path('/')
   //      } else if (user) {
   //          // user authenticated with Firebase
   //          console.log('User ID: ' + user.id + ', User: ' + user.username);
   //          $rootScope.username = user.username;
   //          $rootScope.authenticated = true;
   //          $location.path('/app')
   //       } else {
   //          // user is logged out
   //          $rootScope.authenticated = false;
   //          $location.path('/')
   //      }
   // });

   //  // provide some convenience methods to log in and out
   //  return {
   //       login: function(providerId) {
   //          auth.login('github');
   //       },

   //       logout: function() {
   //          auth.logout();
   //       }
   //  };
// });

var appServices = angular.module('myApp') //angular.module('myApp.services', ['myApp.utils']);

/**
* A service that authenticates against Fireabase using simple login
*/
appServices.factory('authManager',
    ['$rootScope', 'fbRef','authScopeUtil',
      function($rootScope, fbRef, authScopeUtil) {

    authScopeUtil($rootScope);

    var auth = new FirebaseSimpleLogin(fbRef, function(error, user) {
        if (error) {
            // an error occurred while attempting login
            console.log(error);
            $rootScope.$emit('angularFireAuth:error', error);
        } else if (user) {
            // user authenticated with Firebase
            console.log('User ID: ' + user.id + ', User: ' + user.username);
             $rootScope.$emit('angularFireAuth:login', user);
         } else {
            // user is logged out
            $rootScope.$emit('angularFireAuth:logout');
        }
    });

    // provide some convenience methods to log in and out
    return {
         login: function() {
            auth.login('github');
         },

         logout: function() {
            auth.logout();
         }
    };
}]);

/**
* A simple utility to monitor changes to authentication and set some scope values
* for use in bindings and directives
*/
appServices.factory('authScopeUtil',
    ['$log', 'updateScope', 'localStorage', '$location',
    function($log, updateScope, localStorage, $location) {

  return function($scope) {
     $scope.auth = {
        authenticated: false,
        user: null,
        name: null,
        provider: localStorage.get('authProvider')
     };

     $scope.$on('angularFireAuth:login', _loggedIn);
     $scope.$on('angularFireAuth:error', function(err) {
        $log.error(err);
        _loggedOut();
     });
     $scope.$on('angularFireAuth:logout', _loggedOut);

     function parseName(user) {
        switch(user.provider) {
           case 'persona':
              return (user.id||'').replace(',', '.');
           default:
              return user.displayName;
        }
     }

     function _loggedIn(evt, user) {
        localStorage.set('authProvider', user.provider);
        $scope.auth = {
           authenticated: true,
           user: user.id,
           name: parseName(user),
           image: user.avatar_url,
           provider: user.provider
        };
        updateScope($scope, 'auth', $scope.auth, function() {
           if( !($location.path()||'').match('/app') ) {
              $location.path('/app');
           }
        });
     }

     function _loggedOut() {
        $scope.auth = {
           authenticated: false,
           user: null,
           name: null,
           provider: $scope.auth && $scope.auth.provider
        };
        updateScope($scope, 'auth', $scope.auth, function() {
           $location.search('feed', null);
           $location.path('/');
        });
     }
  }
}]);

/**
* A common set of controller logic used by DemoCtrl and HearthCtrl for managing
* scope and synching feeds and articles with Firebase
*/
appServices.factory('FeedManager', ['$timeout', '$location', function($timeout, $location) {
  return function($scope, provider, userId) {
     var inst = {
        getFeeds: function() {
           return $scope.feeds;
        },
        fromChoice: function(choiceOrId) {
           var choice = angular.isObject(choiceOrId)? choiceOrId : findChoice(choiceOrId);
           return {
              title: choice.title,
              id: choice.$id,
              last: Date.now()
           };
        },
        removeFeed: function(feedId) {
           var auth = $scope.auth||{};
           var f = $scope.feeds[feedId];
           if( f ) {
              delete $scope.feeds[feedId];
              f.isCustom && feedTheFire.remove(auth.provider, auth.user, feedId);
              //todo remove read articles as well
           }
        },
        addFeed: function(title, url) {
           // create a custom feed
           var auth = $scope.auth||{};
           $scope.startLoading();
           feedTheFire.add(auth.provider, auth.user, url, function(error, id) {
              if( error ) {
                 $scope.$log.error(error);
                 alert(error);
              }
              else {
                 $timeout(function() {
                    $scope.feeds[id] = {
                       id: id,
                       title: title,
                       last: Date.now(),
                       isCustom: true
                    };
                    $location.search('feed', id);
                 })
              }
           });
        },
        getFeed: function(feedId) {
           return $scope.getFeed(feedId);
        },
        baseLink: _.memoize(function(feedId) {
           return findChoice(feedId).link;
        })
     };

     var findChoice = _.memoize(function(feedId) {
        return _.find($scope.feedChoices, function(f) { return f.$id === feedId })||{};
     });

     $scope.feedManager = inst;

     feedScopeUtils($scope, provider, userId);
     feedChangeApplier($scope, inst, provider, userId);

     return inst;
  }
}]);

