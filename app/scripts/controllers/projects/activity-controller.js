angular.module('myApp').controller('ActivityController',
        function($scope, $rootScope, $firebase, $location, $routeParams, fbUrl) {

    if (!$rootScope.auth || !$rootScope.auth.authenticated) {
        $location.path('/');
        return;
    }

    $scope.projectId = $routeParams.projectId;
    $scope.activityId = $routeParams.id;
    if ($scope.activityId) {
        var ref = new Firebase(fbUrl + '/' + $rootScope.auth.user + '/projects/' + $scope.projectId + '/activities/' + $scope.activityId);
        $scope.activity = $firebase(ref);
    } else {
        var ref = new Firebase(fbUrl + '/' + $rootScope.auth.user + '/projects/' + $scope.projectId + '/activities');
        $scope.activities = $firebase(ref);
        $scope.activity = {
            documents: []
        };
    }

    $scope.addDocument = function() {
        if (!$scope.activity.documents) {
            $scope.activity.documents = [];
        }
        $scope.activity.documents.push({ name: '', url: ''});
    }

    $scope.removeDocument = function(index) {
        $scope.activity.documents.splice(index, 1)
    }

    $scope.updateActivity = function() {
        $scope.activity.$save();
        $location.path('/app/projects/' + $scope.projectId);
    };

    $scope.createActivity = function() {
        $scope.activities.$add($scope.activity);
        $location.path('/app/projects/' + $scope.projectId);
    };

    $scope.saveActivity = function () {
        if ($scope.activityId) {
            $scope.updateActivity();
        } else {
            $scope.createActivity();
        }
    }
});