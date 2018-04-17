var app = angular.module("CourseProposalApp");

app.controller("courseCtrl", courseCtrl);
app.directive("revokeApcPrivilegesPopup", revokeApcPrivilegesPopup);
app.directive("removePropPopup", removePropPopup);
app.directive("courseInfo", courseInfo);

courseCtrl.$inject=["$rootScope", "$scope", "$filter", "$log", "$routeParams", "$location", "userSrv", "courseSrv", "archiveSrv"];
function courseCtrl($rootScope, $scope, $filter, $log, $routeParams, $location, userSrv, courseSrv, archiveSrv) {
	var courseName;
        var courseTitle;

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
        
        // (Issue 39) This function builds a printer-friendly HTML page for the
        // current course. This will help the registrar maintain a paper-based
        // workflow.
        $scope.getPrinterFriendlyPage = function(course) {
            console.log(course);
            // Set proposal type
            var status = "";
            if (course.action === "DEL") status = "DELETE";
            else if (course.oldCourse) status = "MODIFIED";
            else status = "NEW";
            // Reformat some variables so they  look nicer.
            var d = new Date(course.date);
            var approvalString = "";
            switch(course.stage) {
                case 4:
                    approvalString = "\nRegistrar: APPROVED" + approvalString;
                case 3:
                    approvalString = "\nFull Faculty: APPROVED" + approvalString;
                case 2:
                    approvalString = "\nAPC: APPROVED" + approvalString;
                case 1:
                    approvalString = "Division: APPROVED" + approvalString;
                    break;
                default:
                    approvalString = "No approvals yet."
            }
            // Define the PDF format and content
            var docDefinition = {
              content : [
                  {text: status + " COURSE PROPOSAL", style: "header"},
                  {
                      columns: [
                          [
                              {text: "COURSE IDENTIFIER", style: "subheader"},
                              {text: course.newCourse.name, style: "body"},
                              {text: "TITLE", style: "subheader"},
                              {text: course.newCourse.title, style: "body"},
                              {text: "Division", style: "subheader"},
                              {text: course.newCourse.division, style: "body"},
                              {text: "Instructors", style: "subheader"},
                              {ul: course.instructors, style: "body"},
                              {text: "General Education Categories", style: "subheader"},
                              {ul: course.newCourse.gen_ed, style: "body"}
                          ],
                          [
                              {text: "Credit Hours", style: "subheader"},
                              {text: course.newCourse.credit_hrs, style: "body"},
                              {text: "ESTIMATED ENROLLMENT", style: "subheader"},
                              {text: course.est_enrollment, style: "body"},
                              {text: "MAXIMUM CAPACITY", style: "subheader"},
                              {text: course.newCourse.capacity, style: "body"},
                              {text: "Terms", style: "subheader"},
                              {ul: course.terms, style: "body"},
                              {text: "PREREQUISITES", style: "subheader"},
                              {text: course.newCourse.pre_req, style: "body"},
                              {text: "FEES", style: "subheader"},
                              {text: course.fees, style: "body"}
                          ]
                      ]
                  },
                  {text: "CATALOG DESCRIPTION", style: "subheader"},
                  {text: course.newCourse.desc, style: "body"},
                  {text: "Rationale", style: "subheader"},
                  {text: course.rationale, style: "body"},
                  {
                      columns : [
                          [
                              {text: "STAFFING IMPLICATIONS", style: "subheader"},
                              {text: course.staffing, style: "body"}
                          ],
                          [
                              {text: "IMPACT ON OTHER DEPARTMENTS", style: "subheader"},
                              {text: course.impact, style: "body"}
                          ]
                      ]
                  },
                  {text: "Last Revised", style: "subheader"},
                  {text: d.toDateString(), style: "body"},
                  {text: "Stage", style: "subheader"},
                  {text: approvalString, style: "body"}
              ],
              styles: {
                  header: {
                      fontSize: 28,
                      bold: true
                  },
                  subheader: {
                      margin: [0, 10, 0, 0],
                      fontSize: 10,
                      bold: true
                  },
                  body: {
                      fontSize: 10
                  }
              }
            };
            pdfMake.createPdf(docDefinition).open();
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
