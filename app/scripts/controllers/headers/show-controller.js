angular.module('myApp').controller('HeaderShowController',
        function($scope, $rootScope) {

    $scope.getUserName = function () {
        return $rootScope.username;
    }
});
