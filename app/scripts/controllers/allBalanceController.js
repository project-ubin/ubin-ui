"use strict";

function allBalanceController($scope, $filter, httpService, serviceUrl, constants, ENV){
	var platformconstants = constants[ENV.platform];
	$scope.bankNodes = platformconstants.bankNodes;
	$scope.bankBalances = [];
	$scope.parentVariable.balanceAllSpinner = true;

	$scope.currencySymbol = constants.currencySymbol;

	httpService.get(serviceUrl.loadUrl().balanceAll).then(function(data) {
		if (data !== constants.error) {
			$scope.parentVariable.balanceAllSpinner = false;
			$scope.bankBalances = angular.fromJson(data.data);
		}
	});
}