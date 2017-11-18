describe('Proposal controller', function() {
    var module, $controller, $rootScope, proposalCtrl;
    beforeEach(function() {
         module = angular.mock.module('CourseProposalApp');
    });
    var $controller, $rootScope, $scope, $log, $location, $routeParams, $filter, $window, params, dataSrv, userSrv, EVENTS;
    beforeEach(inject(function(_$controller_,_$rootScope_,_$log_,_$location_,_$routeParams_,_$filter_,_$window_,_params_,_dataSrv_,_userSrv_,_EVENTS_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new;
        $log = _$log_;
        $location = _$location_;
        $routeParams = _$routeParams_;
        $filter = _$filter_;
        $window = _$window_;
        params = _params_;
        dataSrv = _dataSrv_;
        userSrv = _userSrv_;
        EVENTS = _EVENTS_;
        
        proposalCtrl = $controller('proposalCtrl', {
            $rootScope : _$rootScope_,
            $scope : $scope,
            $log : _$log_,
            $location : _$location_,
            $routeParams : _$routeParams_,
            $filter : _$filter_,
            $window : _$window_,
            params : _params_,
            dataSrv : _dataSrv_,
            userSrv : _userSrv_,
            EVENTS : _EVENTS_
        });
    }));
//    beforeEach(inject(function($controller,$rootScope, $scope, $log, $location, $routeParams, $filter, $windows, params, dataSrv, userSrv, EVENTS){
//        controller = $controller('proposalCtrl', {$rootScope: $rootScope, $scope: $scope, $log: $log, $location: $location, $routeParams: $routeParams, $filter: $filter, $windows: $windows, params: params, dataSrv: dataSrv, userSrv: userSrv, EVENTS: EVENTS});
//    }));
    describe('$scope.selectedDept', function() {
        it('checks that the department matches', function() {
            $scope.selectedDept = $filter("filter")($scope.depts, {abbrev : "MUS"},true)[0];
            expect($scope.selectedDept.abbrev).toEqual("MUS");
        });
    });
    it('holds a fundamental truth', function(){
        expect(2 + 2).toEqual(4);
    });
});
