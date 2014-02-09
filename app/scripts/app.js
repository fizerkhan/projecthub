//
// Starting point of the application
//
angular.module('myApp', [
    'ngRoute',
    'ngResource'
    //'ui.bootstrap',
    //'dialogs',
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'scripts/views/index.html'
            })

            .when('/app', {
                templateUrl: 'scripts/views/projects/list.html'
                //controller: 'ListController'
            })

            .when('/app/projects/:id', {
                templateUrl: 'scripts/views/projects/show.html'
                //controller: 'ShowController'
            })

            // .otherwise({
            //     redirectTo: '/'
            // });
    })
   .constant('version', '0.1')
   .constant('FIREBASE_URL', 'https://projecthub12.firebaseio.com/');


angular.module('myApp').controller('MainController', function($scope) {

});

//79cygAm0zeDtfCXgOM5L1EIBGkibKobgTesvVcDy

