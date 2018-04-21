var app = angular.module("CourseProposalApp");

app.controller("proposalCtrl", proposalCtrl);

proposalCtrl.$inject=["$rootScope","$scope", "$log", "$location", "$routeParams", "$filter", "$window",  "params", "dataSrv", "userSrv", "EVENTS"];
function proposalCtrl($rootScope, $scope, $log, $location, $routeParams, $filter, $window, params, dataSrv, userSrv, EVENTS) {
	$scope.user = $rootScope.user;
        
        $rootScope.$on('user-updated', function() {
           $scope.user = $rootScope.user; 
        });

	$scope.selectedDept = null;
	$scope.selectedInstructor = null;
	$scope.courseNum = null;

	$scope.depts = params.depts;
	$scope.faculty = params.faculty;
	$scope.prevPage = params.prevPage;

	$scope.chosenGenEd = null;
	
        // ISSUE 29 (Database-driven gen eds):
        // Previously, gen eds were hard-coded like so:
        // $scope.gen_eds = ["BL", "SKL", "WEL", "REL", "NWL", "NWNL", "HB", "HBSSM", "HE", "HEPT", "INTCL", "HIST", "QUANT", "WRITING", "J2"];
        // This is not a particularly effective approach because we may need to,
        // say, add more gen eds to the database. The solution is to make gen eds
        // database driven. In issue-4 we added gen eds to a database. Here we
        // retrieve those gen eds from the database. In the database, each gen ed
        // has four attributes: name (INTCL), title (Intercultural), effective 
        // (the date the gen ed takes effect in (new Date).toJSON()) format), and
        // end (the date the gen ed is removed from effect in the same format as
        // before). The code below filters the gen eds queried from the database
        // in initData in app.js by whether they are effective. This is when
        // the condition effective < today < end is true. Then we create a list
        // using map of all of the names of the gen eds to get an array in the
        // format expected in the hard-coded string above.
        // Also see dataSrv.js, app.js, ApcDao.java, ApcController.java.
        var someGenEds = $filter("filter")($scope.allGenEds, function(val, idx, all) {
            today = (new Date()).toJSON();
            genEdIsInEffect = false;
            if (val.effective < today) {
                if (val.end === null || today < val.end) {
                    genEdIsInEffect = true;
                }
            }
            return genEdIsInEffect;
        }, true);
        $scope.gen_eds = $scope.allGenEds.map(function(ed) {return ed.name});

	initProposal();

	function initProposal() {
		var courseName = $routeParams.course;
                var courseTitle = $routeParams.courseTitle;

		$scope.proposal =   {
								"terms": [],
								"owner": "",
								"stage": 0,
								"staffing": "",
								"rationale": "",
								"impact": "",
								"date": new Date(),
								"oldCourse": null,
								"fees": "",
								"est_enrollment": 0,
								"instructors": [],
                                                                "files": [],
								"comments":  []
							  };

		var newCourse = {
								    "division": "",
								    "capacity": 0,
								    "name": "",
								    "title": "",
								    "pre_req": "",
								    "dept": "",
								    "credit_hrs": 4,
								    "desc": "",
								    "gen_ed" : []
						};

		if (!courseName) {
			$scope.proposal["newCourse"] = newCourse;
                        $scope.proposal.action = "NEW";
		} else {
			//load data
			var course = userSrv.addToRecentlyViewed(courseName, courseTitle, $scope.courses, $scope.allProposals);

			// if $scope.proposal has a name key, it is a course and we need to build our proposal obj from scratch
			if (course.name) {
				$scope.proposal.oldCourse = course;
				//make a copy of the old Course data
				$scope.proposal["newCourse"] = {
												    "division": course.division,
												    "capacity": course.capacity,
												    "name": course.name,
												    "title": course.title,
												    "pre_req": course.pre_req,
												    "dept": course.dept,
												    "credit_hrs": course.credit_hrs,
												    "desc": course.desc,

									};
                                $scope.proposal.action = "MOD";
                                // ISSUE 21 (Gen eds do not properly populate the edit form): 
                                // Though the gen_ed property of newCourse contains its gen eds,
                                // the course object holds its gen eds in the gen_eds property. This is a
                                // subtle but important difference. Furthermore, gen_eds is a comma
                                // separated string, but our template edit-proposal.js requires an array
                                // of strings. So we split gen_eds along the commas. This solves issue 21.
				if (course.gen_eds) {
				 	$scope.proposal.newCourse["gen_ed"] = course.gen_eds.split(",");
				} else {
					$scope.proposal.newCourse["gen_ed"] = [];
				}

			} else {
				//if it is already a proposal, set scope.proposal
				$scope.proposal = course;
			}
                        // ISSUE 1 (Upon editing a music proposal, the department changes to museum studies):
                        // To make sure we don't return both Museum Studies and Music at the same time, we simply
                        // make sure the last argument we pass to filter is "true", as in the following line.
			$scope.selectedDept = $filter("filter")($scope.depts, { abbrev : $scope.proposal.newCourse.dept}, true)[0];
			$scope.courseNum = $scope.proposal.newCourse.name.split("-")[1];
		}
	}

	$scope.saveProposal = function() {
		$scope.proposal.newCourse.name = $scope.selectedDept.abbrev+"-"+$scope.courseNum;
		$scope.proposal.newCourse.dept = $scope.selectedDept.abbrev;
		$scope.proposal.newCourse.division = $scope.selectedDept.division;
		$scope.proposal.owner = $scope.user.name;

		if ($scope.proposal.instructors.length == 0) {
			$scope.$parent.errMsg = "Oh no! No one is teaching this course. Please "
							+"select at least one instructor for the course. You can change it later if "
							+"you need to!"
			var errModal = angular.element("#error-modal");
			errModal.modal('show');
			return;
		}

		if ($scope.proposal._id) {
			dataSrv.saveProposal($scope.proposal).then(function(data) {
				$location.path("#/"+$scope.proposal.newCourse.name+"/"+$scope.proposal.newCourse.title).replace();
			}, function(err) {
				$log.err("Proposal not saved: "+err);
			});
		} else {
			dataSrv.createProposal($scope.proposal).then(function(data) {
				$location.path("#/"+$scope.proposal.newCourse.name+"/"+$scope.proposal.newCourse.title).replace();
			}, function(err) {
				$log.err("Proposal not saved: "+err);
			});
		}
	}

	$scope.addGenEd = function() {
		if ($scope.chosenGenEd == null){
			$scope.chooseGenEd = true;
		}
		if (!$scope.proposal.newCourse.gen_ed) {
			$scope.proposal.newCourse.gen_ed = [];
		}
		if ($scope.proposal.newCourse.gen_ed.indexOf($scope.chosenGenEd) == -1){
			$scope.proposal.newCourse.gen_ed.push($scope.chosenGenEd);
		}
	}

	$scope.removeGenEd = function(genEd) {
		$scope.proposal.newCourse.gen_ed.splice($scope.proposal.newCourse.gen_ed.indexOf(genEd),1);
	}

	$scope.addInstructor = function() {
		if ($scope.proposal.instructors.indexOf($scope.selectedInstructor) == -1){
			$scope.proposal.instructors.push($scope.selectedInstructor);
		}
	}

	$scope.removeInstructor = function(instructor){
		$scope.proposal.instructors.splice($scope.proposal.instructors.indexOf(instructor),1);
	}

	$scope.returnToPrev = function() {
		$window.history.back();
	}
        
        // A function added to resolve issue 3 where users can upload attachments.
        // This function will add a file to the list of files contained in a proposal.
        $scope.addFile = function() {
            var f = document.getElementById('apc-file-upload').files[0];
            var reader = new FileReader();
            
            var fileName = f.name;
            var fileMime = f.type;
            if (!$scope.proposal.files) $scope.proposal.files = [];
            
            reader.onloadend = function(file) {
                var fileBuffer = file.target.result;
                //var fileDataView = new DataView(fileBuffer);
                //var fileData = new Blob([fileDataView], {"type": fileMime})
                $scope.proposal.files.push({"name": fileName, "type": fileMime, "data": fileBuffer});
                $scope.$apply();
            }
            
            reader.readAsDataURL(f);
            //reader.readAsArrayBuffer(f);
        }
        
        // Likewise, this function will remove a file from the list of files 
        // contained in a proposal.
        $scope.removeFile = function(file) {
            $scope.proposal.files.splice($scope.proposal.files.indexOf(file),1);
        }
}

app.filter("facultyFilter", ["$filter", function($filter){
	return function(faculty, query) {
		return $filter("filter")(faculty, {name: query});
	}
}]);
