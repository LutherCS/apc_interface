/* 
 * The javascript describing the calendar controller.
 * Date: 12.02.2017
 * Author: Joshua Jackson
 */

var app = angular.module("CourseProposalApp");

app.controller("calendarCtrl", calendarCtrl);

calendarCtrl.$inject=["$rootScope", "$scope", "$filter", "$log", "$routeParams", "$location", "userSrv", "courseSrv", "archiveSrv"];
function calendarCtrl($rootScope, $scope, $filter, $log, $routeParams, $location, userSrv, courseSrv, archiveSrv) {

}