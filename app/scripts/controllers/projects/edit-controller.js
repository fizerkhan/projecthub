angular.module('myApp').controller('ProjectEditController',
        function($scope, $rootScope) {

    $scope.getUserName = function () {
        return $rootScope.username;
    }
});