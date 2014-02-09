angular.module('myApp').controller('ProjectShowController',
        function($scope, $rootScope, $firebase, $location, $routeParams, fbUrl) {

    if ($routeParams.userId) {
        $scope.user = $routeParams.userId;
    } else {
        if (!$rootScope.auth || !$rootScope.auth.authenticated) {
            $location.path('/');
            return;
        }
        $scope.user = $rootScope.auth.user;
    }

    $scope.projectId = $routeParams.id;
    var ref = new Firebase(fbUrl + '/' + $scope.user + '/projects/' + $scope.projectId);
    $scope.project = $firebase(ref);

    // $scope.orderByDate = function(item) {
    //     return moment(item.date, "YYYY-MM-DD").valueOf();
    // }
});