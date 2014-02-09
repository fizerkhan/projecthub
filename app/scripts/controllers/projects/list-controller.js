angular.module('myApp').controller('ProjectListController',
        function($scope, $rootScope, $location, $firebase, fbUrl) {

    if (!$rootScope.auth || !$rootScope.auth.authenticated) {
        $location.path('/');
        return;
    }

    var ref = new Firebase(fbUrl + '/' + $rootScope.auth.user + '/projects');
    $scope.projects = $firebase(ref);
    $scope.addProject = function() {
        $scope.projects.$add({name: $scope.projectName});
        $scope.projectName = "";
    };
    $scope.removeProject = function(id) {
        $scope.projects.$remove(id);
    };
});

