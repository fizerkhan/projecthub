//
// Starting point of the application
//
angular.module('myApp', [
    'ngRoute',
    'ngResource',
    'firebase',
    //'ui.bootstrap',
    //'dialogs',
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'scripts/views/index.html',
                controller: 'HeaderShowController'
            })

            .when('/app', {
                templateUrl: 'scripts/views/projects/list.html',
                controller: 'ProjectListController'
            })

            .when('/app/projects/:id', {
                templateUrl: 'scripts/views/projects/show.html',
                controller: 'ProjectShowController'
            })

            //isAuthenticated is set below in the .run() command
            .otherwise({redirectTo: function() { return isAuthenticated? '/app' : '/'; }});
    })
   .constant('version', '0.1')
   .constant('fbRef', new Firebase('https://projecthub12.firebaseio.com'));

angular.module('myApp')

    /** AUTHENTICATION
    ***************/
    .run(['$rootScope', 'authManager', function($rootScope, authManager) {
        $rootScope.login = authManager.login;
        $rootScope.logout = authManager.logout;
    }])

    /** LOAD LIST OF FEEDS
    ***************/
    // .run(['$rootScope', 'angularFireCollection', 'fbRef', function($rootScope, angularFireCollection, fbRef) {
    //     // use angularFireCollection because this list should be read-only, and it should be filterable
    //     // by using | filter command, which doesn't work with key/value iterators
    //     $rootScope.feedChoices = angularFireCollection(fbRef('meta'));
    // }])

    /** ROOT SCOPE AND UTILS
    *************************/
    .run(['$rootScope', '$location', '$log', function($rootScope, $location, $log) {
        $rootScope.$log = $log;

        $rootScope.keypress = function(key, $event) {
            $rootScope.$broadcast('keypress', key, $event);
        };

        // this can't be done inside the .config() call because there is no access to $rootScope
        // so we hack it in here to supply it to the .config routing methods
        $rootScope.$watch('auth.authenticated', function() {
            isAuthenticated = $rootScope.auth.authenticated;
        });
    }]);


angular.module('myApp').controller('MainController', function($scope) {
});
