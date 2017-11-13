"use strict";

function bankFnController($scope, $rootScope, $state, httpService, serviceUrl, constants, sharedDataServices, ENV){

	$scope.submitPressedPledge = false;
	$scope.submitPressedRedeem = false;
	$scope.submitPressed = false;
	$scope.priorities = constants.priorities;
	$scope.adminView = ($state.current.url==="/admin")?true:false;
	var thisBank = sharedDataServices.getCurrentBank();
	var platformconstants = constants[ENV.platform];
	$scope.bankNodes = platformconstants.bankNodes;
	$scope.platform = ENV.platform;
	$scope.transfer = {};
	$scope.transfer.priority = 0;
	if ($scope.platform === "quorum"){
		$scope.transfer.enqueue = 0;
	}

	$scope.getCounterparties = function () {
		httpService.get(serviceUrl.loadUrl().counterparties).then(function (data) {
			if (data !== constants.error) {
				var response = angular.fromJson(data);
				$scope.counterparties = response.data;
			}
		});
	};

	$scope.submitTransfer = function() {
		$scope.submitPressed = true;
		$scope.parentVariable.showSpinner = true;
		httpService.post(serviceUrl.loadUrl().transfer, $scope.transfer).then(function (data) {
			if (data === constants.error) {
				$scope.transfer.transactionAmount = "";
				$scope.transfer.receiver = '';
				$scope.submitPressed = false;
				$scope.parentVariable.showSpinner = false;
			} else {
				var trans = angular.fromJson(data);
				$scope.transfer.transactionAmount = "";
				$scope.transfer.receiver = "";
				$scope.submitPressed = false;
				$scope.parentVariable.showSpinner = false;
				$rootScope.$broadcast('refresh');
			}
		});
	};

	$scope.submitPledge = function() {
		$scope.submitPressedPledge = true;
		$scope.parentVariable.showSpinner = true;
		$scope.pledge.receiver = thisBank;
		httpService.post(serviceUrl.loadUrl().pledge, $scope.pledge).then(function (data) {
			if (data === constants.error) {
				$scope.submitPressedPledge = false;
				$scope.parentVariable.showSpinner = false;
			} else {
				$scope.submitPressedPledge = false;
				$scope.pledge.transactionAmount = "";
				if ($scope.platform === "fabric") {
					$scope.pledge.channel = "";
				}
				$scope.parentVariable.showSpinner = false;
				$rootScope.$broadcast('refresh');
			}
		});
	};

	$scope.submitRedeem = function() {
		$scope.submitPressedRedeem = true;
		$scope.parentVariable.showSpinner = true;
		var redeem = {};
		if ($scope.platform === 'corda') {
			redeem.transactionAmount = $scope.redeem.transactionAmount;
		} else {
			redeem.sender = thisBank;
			redeem.transactionAmount = $scope.redeem.transactionAmount;
			if ($scope.platform === 'fabric') {
				redeem.channel = $scope.redeem.channel;
			}
		}
		httpService.post(serviceUrl.loadUrl().redeem, redeem).then(function (data) {
			if (data === constants.error) {
				$scope.submitPressedRedeem = false;
				$scope.parentVariable.showSpinner = false;
			} else {
				$scope.submitPressedRedeem = false;
				$scope.redeem.transactionAmount = "";
				if ($scope.platform === "fabric") {
					$scope.redeem.channel = "";
				}
				$scope.parentVariable.showSpinner = false;
				$rootScope.$broadcast('refresh');
			}
		});
	};

	$scope.submitMove = function() {
		$scope.submitPressedMove = true;
		$scope.parentVariable.showSpinner = true;
		httpService.post(serviceUrl.loadUrl().moveFunds, $scope.moveFunds).then(function (data) {
			if (data === constants.error) {
				$scope.submitPressedMove = false;
				$scope.parentVariable.showSpinner = false;
			} else {
				$scope.moveFunds.transactionAmount = '';
				$scope.moveFunds.fromChannel = '';
				$scope.moveFunds.toChannel = '';
				$scope.submitPressedMove = false;
				$scope.parentVariable.showSpinner = false;
				$rootScope.$broadcast('refresh');
			}
		});
	};

	$scope.getCounterparties();
}