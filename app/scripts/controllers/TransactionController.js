"use strict";

function transactionController ($scope, $rootScope, httpService, serviceUrl, constants, ENV, sharedDataServices){
	$scope.currencySymbol = constants.currencySymbol;
	var platform = ENV.platform;
	var platformconstants = constants[platform];
	var bankNodes = platformconstants.bankNodes;
	var channelList;
	if (platform === "fabric"){
		$scope.typeMap = platformconstants["type"];
	} else if (platform === "quorum"){
		$scope.statusMap = platformconstants["historyStatus"];
	}
	
	$scope.getAllTransactions = function() {
		httpService.get(serviceUrl.loadUrl().transactions).then(function (data) {
			if (data !== constants.error) {
				var response = angular.fromJson(data);
				$scope.allTransactions = response.data;
			}
		});
	};

	$scope.getCounterparties = function () {
		httpService.get(serviceUrl.loadUrl().counterparties).then(function (data) {
			if (data !== constants.error) {
				var response = angular.fromJson(data);
				channelList = response.data;
			}
		});
	};

	$scope.mapChannelName = function(channel) {
		var counterpartyName = "";
		for (var i = 0; i < channelList.length; i++) {
			if (channelList[i].channel === channel) {
				counterpartyName = channelList[i].bic;
				break;
			}
		}
		if (counterpartyName !== "") {
			return bankNodes[counterpartyName].shortName + " Channel";
		} else {
			return channel;
		}
	};

	$scope.getCounterparties();
	$scope.getAllTransactions();
	$scope.$on('getAllTransactions',function(){
		$scope.getAllTransactions();
	});
}