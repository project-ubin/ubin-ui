"use strict";

function balancePositionController($scope, $rootScope, serviceUrl, httpService, $filter, constants, sharedDataServices, $location, ENV){
	$scope.balance = 0;
	$scope.position = 0;
	$scope.banklist = sharedDataServices.getBankList();
	var platformconstants = constants[ENV.platform];
	$scope.bankNodes = platformconstants.bankNodes;
	$scope.currencySymbol = constants.currencySymbol;
	$scope.parentVariable.balanceSpinner = false;
	$scope.platform = ENV.platform;

	$scope.getBalance = function () {
		$scope.parentVariable.balanceSpinner = true;
		httpService.get(serviceUrl.loadUrl().me).then(function (data) {
			if (data !== constants.error) {
				var response = angular.fromJson(data);
				$scope.balance = response.data.balance;
				if ($scope.platform === 'fabric') {
					$scope.bankChannelList = response.data.channels;
				} else {
					$scope.position = response.data.position;
				};
				$scope.parentVariable.balanceSpinner = false;
			}
		});
	};

	$scope.clickRefresh = function(){
		$rootScope.$emit('refresh');
	};

	$scope.getBalance();
	$scope.$on('getBalance',function(){
		$scope.getBalance();
	});

}

