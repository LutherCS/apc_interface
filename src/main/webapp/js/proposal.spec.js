describe('Proposal controller', function() {
    var $controller, $rootScope;
    beforeEach(function() {
        angular.mock.module('CourseProposalApp');
    });
    var $controller, $rootScope, $scope;
    beforeEach(inject(function(_$controller_,_$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));
    it('should be defined', function() {
        expect($controller).toBeDefined();
    });
    it('has rootScope defined', function() {
        expect($rootScope).toBeDefined();
    });
    it('has rootScope.$new defined', function() {
        expect($rootScope.$new).toBeDefined();
    });
//    beforeEach(inject(function($controller,$rootScope, $scope, $log, $location, $routeParams, $filter, $windows, params, dataSrv, userSrv, EVENTS){
//        controller = $controller('proposalCtrl', {$rootScope: $rootScope, $scope: $scope, $log: $log, $location: $location, $routeParams: $routeParams, $filter: $filter, $windows: $windows, params: params, dataSrv: dataSrv, userSrv: userSrv, EVENTS: EVENTS});
//    }));
//    describe('$scope.selectedDept', function() {
//        it('checks that the department matches', function() {
//            expect().toEqual("MUS");
//        });
//    });
    it('holds a fundamental truth', function(){
        expect(2 + 2).toEqual(4);
    });
});
