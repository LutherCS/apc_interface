/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module("CourseProposalApp");

app.controller("helpCtrl", helpCtrl);
helpCtrl.$inject=["$rootScope","$scope", "$log", "$location", "$routeParams", "$window", "dataSrv", "userSrv"];
function helpCtrl($rootScope, $scope, $log, $location, $routeParams, $window, dataSrv, userSrv) {
    $scope.user = $rootScope.user;
}