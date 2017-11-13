'use strict';


function mainController($scope, usSpinnerService, httpService, $state, $stateParams, constants, sharedDataServices, serviceUrl, $rootScope, ENV) {

	$scope.balance = 0;
	$scope.position = 0;
	$scope.toggleMenu = false;
  $scope.outgoingQueue = [];//out
  $scope.incomingQueue = []; //in
  $scope.parentVariable = {};
  $scope.parentVariable.showSpinner = false;
  $scope.parentVariable.thisbank = '';
  $scope.banklist = sharedDataServices.getBankList();
  var platformconstants = constants[ENV.platform];
  $scope.bankNodes = platformconstants.bankNodes;
  $scope.platform = ENV.platform;
  $scope.spinnerConfig = {
  	color: "#23B7E5",
  	top: "55%",
  	position: 'sticky'
  };

  $scope.adminView = ($state.current.url==="/admin")?true:false;
  var bankloc;
  var MAS = constants.MAS;
  $scope.parentVariable.showSpinner = $scope.parentVariable.balanceSpinner || $scope.parentVariable.balanceAllSpinner || $scope.parentVariable.incomingQueueSpinner || $scope.parentVariable.outgoingQueueSpinner;

  $scope.startSpinner = function () {
  	usSpinnerService.spin('spinner-loading');
  };

  if ($stateParams.bankloc) {
  	bankloc = $stateParams.bankloc;
  	if($scope.bankNodes[bankloc].centralBank || $scope.bankNodes[bankloc].regulator){
  		$state.go('admin');
  	}
  } else {
  	bankloc = ($scope.adminView)?constants.regulator:constants.defaultBankLoc;
  }


  $scope.parentVariable.thisbank = bankloc;
  sharedDataServices.setCurrentBank($scope.parentVariable.thisbank);
  sharedDataServices.setCurrentApi(platformconstants.bankNodes[bankloc].host + ":" + platformconstants.bankNodes[bankloc].port);
  

  $scope.refresh = function(){
  	console.log("inside refresh in main");
  	$rootScope.$broadcast('getBalance');
  	$rootScope.$broadcast('getQueues');
  	$rootScope.$broadcast('getAllTransactions');
  };

  $scope.refresh();

  $scope.$on('refresh', function(){
  	console.log("rootscope refresh");
  	$scope.refresh();
  });

}