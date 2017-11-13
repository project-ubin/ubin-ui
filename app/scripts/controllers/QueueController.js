"use strict";

function queueController ($scope,$rootScope,$interval,httpService,serviceUrl,constants,usSpinnerService,ngDialog,ENV){
	$scope.showNetting = false;
	$scope.updateStatusPressed = false;
	$scope.incomingQueue = [];
	$scope.outgoingQueue = [];
	$scope.priorities = constants.priorities;
	$scope.currencySymbol = constants.currencySymbol;
	$scope.parentVariable.incomingQueueSpinner = false;
	$scope.parentVariable.outgoingQueueSpinner = false;
	$scope.platform = ENV.platform;
	var platformconstants = constants[ENV.platform];
	$scope.nettingStatus = '';
	$scope.banks = [];

	$scope.getCounterparties = function () {
		httpService.get(serviceUrl.loadUrl().counterparties).then(function (data) {
			if (data !== constants.error) {
				var response = angular.fromJson(data);
				var counterparties = response.data;
				angular.forEach(counterparties, function(value, key){
					$scope.banks.push(value.bic);
				});
			}
		});
	};

	$scope.getCounterparties();
	usSpinnerService.spin('spinner-outgoing');

	var cancelTxRef=null;
	var nettingTimer;

	$scope.showModalWindow=function(txRef){
		cancelTxRef = txRef;
		ngDialog.open({scope:$scope,
			showClose:true,
			template: 'views/landing/modal-window.html',
			className: 'ngdialog-theme-default',
			width: '25%',
			height:"auto",
			background: 'white'
		});
	};

	$scope.dialogClose = function(){
		cancelTxRef = null;
		ngDialog.close();
	};

	$scope.stopNetting = function() {
		if (angular.isDefined(nettingTimer)) {
			$interval.cancel(nettingTimer);
			nettingTimer = undefined;
			$scope.queryNettingPressed = false;
		}
	};

	$scope.executeNetting =function(){
		httpService.post(serviceUrl.loadUrl().netting,{}).then(function(data){
			if (data !== constants.error) {
				nettingTimer = $interval(function(){
					httpService.get(serviceUrl.loadUrl().nettingStatus).then(function (data) {
						$scope.nettingStatus = data.data.status;
						if ($scope.platform === 'fabric') {
							if($scope.nettingStatus === "SETTLED" || $scope.nettingStatus === "FAILED"){
								$scope.stopNetting();
								$rootScope.$broadcast('refresh');
							}
						} else if ($scope.platform === 'corda') {
							if($scope.nettingStatus === "deadlock" || $scope.nettingStatus === "complete"){
								$scope.stopNetting();
								$rootScope.$broadcast('refresh');
							}
						}
					});
				},1000);
			}
		});
	};

	$scope.queryNetting = function(){
		if ($scope.queryNettingPressed){
			$interval.cancel(nettingTimer);
			$scope.queryNettingPressed = false;
		}else{
			$scope.queryNettingPressed = true;
			nettingTimer = $interval(function(){
				httpService.get(serviceUrl.loadUrl().nettingStatus).then(function (data) {
					$scope.nettingStatus = data.data.status;
					if($scope.nettingStatus === "Deadlock" || $scope.nettingStatus === "Complete"){
						$scope.stopNetting();
						$rootScope.$broadcast('refresh');
					}
				});
			},1000);
		}
	};

	$scope.getOutgoingQueue = function () {
		$scope.parentVariable.outgoingQueueSpinner = true;
		httpService.get(serviceUrl.loadUrl().outgoing).then(function (data) {
			if (data !== "error") {
				var response = angular.fromJson(data);
				$scope.outgoingQueue = response.data;
				$scope.parentVariable.outgoingQueueSpinner = false;
			}
		});
	};

	$scope.getIncomingQueue = function () {
		$scope.parentVariable.incomingQueueSpinner = true;
		httpService.get(serviceUrl.loadUrl().incoming).then(function (data) {
			if (data !== "error") {
				var response = angular.fromJson(data);
				$scope.incomingQueue = response.data;
				$scope.parentVariable.incomingQueueSpinner = false;
			}
		});
	};

	$scope.updatePriority = function (queue) {
		$scope.updateStatusPressed = true;
		$scope.parentVariable.showSpinner = true;
		var priority = (queue.priority === 1 ? 0 : 1);
		if ($scope.platform === 'fabric'){
			httpService.put(serviceUrl.loadUrl().priority, [{"transId": queue.transId, "priority": priority, "receiver": queue.receiver}]).then(function (data) {
				if (data === constants.error) {
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				} else {
					$rootScope.$broadcast('refresh');
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				}
			});
		} else if ($scope.platform === 'quorum') {
			httpService.put(serviceUrl.loadUrl().priority, {"transId": queue.transId, "priority": priority}).then(function (data) {
				if (data === constants.error) {
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				} else {
					$rootScope.$broadcast('refresh');
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				}
			});
		} else {
			httpService.put(serviceUrl.loadUrl().priority, [{"transId": queue.transId, "priority": priority}]).then(function (data) {
				if (data === constants.error) {
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				} else {
					$rootScope.$broadcast('refresh');
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				}
			});
		}
	};

	$scope.updateStatus = function (queue) {
		$scope.updateStatusPressed = true;
		$scope.parentVariable.showSpinner = true;
		if ($scope.platform === 'fabric'){
			httpService.put(serviceUrl.loadUrl().status, [{"transId": queue.transId, "receiver": queue.receiver}]).then(function (data) {
				if (data === constants.error) {
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				} else {
					$rootScope.$broadcast('refresh');
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				}
			});
		} else if ($scope.platform === 'quorum'){
			var newStatus = queue.status === "HOLD" ? 0 : 2;
			httpService.put(serviceUrl.loadUrl().status, {"transId": queue.transId, "status": newStatus}).then(function (data) {
				if (data === constants.error) {
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				} else {
					$rootScope.$broadcast('refresh');
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				}
			});
		} else {
			httpService.put(serviceUrl.loadUrl().status, [{"transId": queue.transId}]).then(function (data) {
				if (data === constants.error) {
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				} else {
					$rootScope.$broadcast('refresh');
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				}
			});
		}
	};

	var cancelPayment = function (queue) {
		$scope.updateStatusPressed = true;
		$scope.parentVariable.showSpinner = true;
		if ($scope.platform === 'fabric'){
			httpService.put(serviceUrl.loadUrl().cancel, [{"transId": queue.transId, "receiver": queue.receiver}]).then(function (data) {
				if (data === constants.error) {
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				} else {
					$rootScope.$broadcast('refresh');
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				}
			});
		} else if ($scope.platform === 'quorum'){
			httpService.put(serviceUrl.loadUrl().cancel, {"transId": queue.transId}).then(function (data) {
				if (data === constants.error) {
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				} else {
					$rootScope.$broadcast('refresh');
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				}
			});
		} else {
			httpService.put(serviceUrl.loadUrl().cancel, [{"transId": queue.transId}]).then(function (data) {
				if (data === constants.error) {
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				} else {
					$rootScope.$broadcast('refresh');
					$scope.updateStatusPressed = false;
					$scope.parentVariable.showSpinner = false;
				}
			});
		}

	};

	$scope.proceedToCancel = function(){
		ngDialog.close();
		cancelPayment(cancelTxRef);
	};

	$scope.settleQueue = function(){
		if ($scope.platform === 'fabric') {
			angular.forEach($scope.banks, function(value){
				httpService.get(serviceUrl.loadUrl().settleQueue+"/"+value).then(function (data) {
					if (data === constants.error) {
						$scope.parentVariable.showSpinner = false;
					}
				});
				$scope.parentVariable.showSpinner = false;
				$rootScope.$broadcast('refresh');
			});
		} else {
			httpService.put(serviceUrl.loadUrl().settleQueue).then(function (data) {
				if (data === constants.error) {
					$scope.parentVariable.showSpinner = false;
				} else {
					$rootScope.$broadcast('refresh');
					$scope.parentVariable.showSpinner = false;
				}
			});
		}
	};

	$scope.refresh = function () {
		$scope.getIncomingQueue();
		$scope.getOutgoingQueue();
		$scope.stopNetting();
	};

	$scope.refresh();

	$scope.$on('getQueues',function(){
		$scope.refresh();
	});
}