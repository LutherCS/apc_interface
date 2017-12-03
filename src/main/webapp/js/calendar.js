/* 
 * The javascript describing the calendar controller.
 * Date: 12.02.2017
 * Author: Joshua Jackson
 */

var app = angular.module("CourseProposalApp");

app.controller("calendarCtrl", calendarCtrl);

calendarCtrl.$inject=["$rootScope", "$scope", "$filter", "$log", "$routeParams", "$q", "$location", "userSrv", "dataSrv", "courseSrv", "archiveSrv"];
function calendarCtrl($rootScope, $scope, $filter, $log, $routeParams, $q, $location, userSrv, dataSrv, courseSrv, archiveSrv) {
    
    $scope.retrievingData = true;
    
    initCalendar();
    
    function initCalendar() {
        return $q.all([dataSrv.getEvents()]).then(function(data){
            $scope.calendar = data[0]
            $scope.retrievingData = false;
            console.debug($scope.calendar)
        });
    }
}