var app = angular.module("CourseProposalApp");
app.controller('dashboardCtrl', ['$rootScope', '$scope', '$log', '$q', '$filter', 'dataSrv',
                                function($rootScope, $scope, $log, $q, $filter, dataSrv) {
    $scope.user = $rootScope.user;
    console.log($scope.user);
}]);
