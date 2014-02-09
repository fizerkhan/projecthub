angular.module('myApp').controller('ProjectEditController',
        function($scope, $rootScope, $firebase, $location, $routeParams, fbUrl) {

    if (!$rootScope.auth || !$rootScope.auth.authenticated) {
        $location.path('/');
        return;
    }

    var ref = new Firebase(fbUrl + '/' + $rootScope.auth.user + '/projects/' + $routeParams.id);
    $scope.project = $firebase(ref);

    $scope.updateProject = function() {
        $scope.project.$save();
        $location.path('/app');
    };
});