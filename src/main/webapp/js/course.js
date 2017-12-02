var app = angular.module("CourseProposalApp");

app.controller("courseCtrl", courseCtrl);
app.directive("revokeApcPrivilegesPopup", revokeApcPrivilegesPopup);
app.directive("removePropPopup", removePropPopup);
app.directive("courseInfo", courseInfo);

courseCtrl.$inject=["$rootScope", "$scope", "$filter", "$log", "$routeParams", "$location", "userSrv", "courseSrv", "archiveSrv", "dataSrv", "$q"];
function courseCtrl($rootScope, $scope, $filter, $log, $routeParams, $location, userSrv, courseSrv, archiveSrv, dataSrv, $q) {
	var courseName;
        var courseTitle;

        // ISSUE 11: Link sharing does not work. This may be as simple as making
        // sure the course are loaded every time the view is opened.
        if (!$scope.courses) {
            console.debug("AH!!! WHERE HAVE ALL THE COURSES GONE!?!");
            initData();
            function pastAllStages(proposal) {
                return proposal.stage == 4;
            }
            function initData() { 
                return $q.all([dataSrv.getProposals(), dataSrv.getCourses(), dataSrv.getDepts()]).then(function(data){
                    $scope.allProposals.elements = data[0];
                    $scope.registrarData.elements = data[0].filter(pastAllStages);
                    $log.debug($scope.registrarData);
                    $log.debug($scope.user);
                    $scope.courses = data[1];
                    $scope.depts = data[2];
                    $scope.retrievingData = false;
                });
            }
        }
        
        $scope.$watch(function(){
	//if we are viewing a course, add it to recently viewed.
	if (!$scope.course) {
//		if (!$routeParams || !$routeParams.course || !$routeParams.courseTitle) {
//			// this is from the archive scope
//			courseName = $scope.courseName;
//                        courseTitle = $scope.courseTitle;
//		} else {
			// this is from the route params
			courseName = $routeParams.course;
                        courseTitle = $routeParams.courseTitle;
		//}
		$scope.course = userSrv.addToRecentlyViewed(courseName, courseTitle, $scope.courses, $scope.allProposals);
	}
        });

	$scope.canApprove = userSrv.canApprove;

	$scope.approve = courseSrv.approve;
	$scope.reject = courseSrv.reject;
	$scope.deleteProp = courseSrv.deleteProp;

	$scope.getArchiveById = archiveSrv.getArchiveById;
        $scope.archiveProp = archiveSrv.archiveProposal;

	$scope.stageName = function(stageNum) {
		if (stageNum == 0) {
			return "Just created, not under review"
		} else if (stageNum == 1) {
			return "Division Review"
		} else if (stageNum == 2) {
			return "APC Review"
		} else if (stageNum == 3) {
			return "Full Faculty Review"
		} else if (stageNum == 4) {
			return "Sent to Registrar"
		}
	}

	$scope.displayListData = function(list) {
		if (list == null || list.length == 0){
			return "None";
		}
		listStr = "";
		for (item in list) {
			listStr += list[item] + ", ";
		}
		listStr = listStr.substring(0, listStr.length-2);
		return listStr;
	}

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
}

app.factory("courseSrv", ["$rootScope", "$location", "userSrv", "dataSrv", "EVENTS", function($rootScope, $location, userSrv, dataSrv, EVENTS){
	approve = function(course){
		course.stage++;
		dataSrv.saveProposal(course);
	}

	reject = function(course) {
		var modal = angular.element("#remove-prop-modal-"+course.newCourse.name);
		modal.modal("show");
	}

	deleteProp = function(course) {
		var modal = angular.element("#remove-prop-modal-"+course.newCourse.name);
		modal.modal('hide');
		userSrv.removeFromRecentlyViewed(course);
    	dataSrv.deleteProposal(course).then(function(data) {
    		angular.element(".modal-backdrop")[0].remove();
    		angular.element("body").removeClass("modal-open");
    		$location.path("/");
    	});
        }
        

	return {
		approve : approve,
		reject : reject,
		deleteProp : deleteProp,
	}

}])

app.directive("courseList", function() {
    return {
        restrict: "E",
        templateUrl: "templates/course-list.html",
        controller : "courseListCtrl",
        scope: {
            data: '=',
            user : '=',
            extendedview : "=",
            courses : "=",
            allProposals : "=proposals"
        }
    };
});

app.directive("course", function() {
    return {
        restrict: "E",
        templateUrl: "templates/course.html",
        controller: "courseCtrl"
    }
});


function removePropPopup(){
	return {
		restrict : "E",
		templateUrl : "templates/confirmation-popup.html",
		controller : ["$scope", "$log", "courseSrv", function($scope, $log, courseSrv) {
			$scope.deleteProp = courseSrv;
		}],
		scope : {
			modalId : "@",
			action : "@",
			msg : "@",
			confirmFunc : "=",
			course : "="
		}
	}
}

function revokeApcPrivilegesPopup() {
	return {
		restrict : "E",
		templateUrl : "templates/confirmation-popup.html",
		scope : {
			modalId : "@",
			action : "@",
			msg : "@",
			confirmFunc : "="
		}
	}
}

function courseInfo() {
	return {
		restrict : "E",
		templateUrl : "templates/course-info.html",
		controller : "courseCtrl"
	}
}
