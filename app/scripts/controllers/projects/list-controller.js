angular.module('myApp').controller('ProjectListController',
        function($scope, $rootScope) {

    $scope.getUserName = function () {
        return $rootScope.username;
    }
});