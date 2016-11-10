var app = angular.module('CourseProposalApp', ['ngRoute']);

var gapi;
var auth2;

app.constant("auth_config", {
	client_id: '118685821641-30uo5v5evufhdqdlabs2a71p711qla3e.apps.googleusercontent.com',
	hosted_domain : "luther.edu",
    scope: 'profile email'
});

app.constant("GEN_ED", {

});

app.controller("mainCtrl", mainCtrl);

//initialization funciton
app.run(["$rootScope", "authSrv", "auth_config", "$location", "AUTH_EVENTS", "$log", "dataSrv",
			 function($rootScope, authSrv, auth_config, $location, AUTH_EVENTS, $log, dataSrv) {

	var postLogInRoute;

	gapi.load("auth2", function() {
		auth2 = gapi.auth2.init( auth_config );
	});

	$rootScope.$on('$locationChangeStart', function(event, next){
		//if login required (i.e. is not login page) and you're logged out, capture the current path
        if (!$rootScope.user) {
        	nextPath = next.split('#')[1];
        	if (!( nextPath == '/login')) {
	        	$rootScope.next = $location.url();
			}
        	$location.url('/login');
        }

	});
}]);

mainCtrl.$inject = ["$rootScope", "$scope", "$log", "$location", "$q", "authSrv", "dataSrv"];
function mainCtrl($rootScope, $scope, $log, $location, $q, authSrv, dataSrv) {
	$scope.logout = authSrv.logout;
	$scope.user = null;
    $scope.test = "hello";
    $scope.allProposals = {title: "All Proposals",
                            emptyMsg : "No Current Proposals"};
    $scope.recentlyViewed = {title: "Recently Viewed",
                            emptyMsg: "No recently viewed proposals or courses"};

    $scope.retrievingData = true;
    $q.all([dataSrv.getProposals(), dataSrv.getCourses()]).then(function(data){
        $scope.allProposals.elements = data[0];
        $scope.courses = data[1];
        $scope.retrievingData = false;
    });

	$rootScope.$watch(function(){
		$scope.user = $rootScope.user;
		$scope.page = $location.path();
        $scope.recentlyViewed.elements = [];
        //$scope.recentlyViewed.elements = $scope.user.recentlyViewed;
	});
};

app.directive("courseList", function() {
    return {
        restrict: "E",
        templateUrl: "templates/course-list.html",
        scope: {
            data: '=',
            user : '='
        }
    };
});

app.directive("course", function() {
    return {
        restrict: "E",
        templateUrl: "templates/course.html",
		controller: ['$scope', function MyTabsController($scope) {
			// for making the progress bar the correct colors at each stage
			$scope.getClass = function(courseStage, progressBarStage) {
		        if (courseStage == progressBarStage) {
		            return 'progress-bar-warning';
		        }
		        else if (courseStage > progressBarStage) {
		            return 'progress-bar-success';
		        }
		        else {
		            return 'progress-bar-danger';
		        }
		    };
		}]
    };
});