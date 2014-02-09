angular.module('myApp').controller('ProjectShowController',
        function($scope, $rootScope) {

    $scope.getUserName = function () {
        return $rootScope.username;
    }
});