'use strict';
angular.module('ubin-ui', ['ui.router', 'config','angularSpinner','ngDialog']);

angular
	.module('ubin-ui')
	.controller('mainController', mainController)
	.controller('balancePositionController' ,balancePositionController)
	.controller('bankFnController', bankFnController)
	.controller('headerController', headerController)
	.controller('queueController', queueController)
	.controller('transactionController', transactionController)
	.controller('allBalanceController', allBalanceController)
	.factory('httpService', httpService)
	.factory('serviceUrl', serviceUrl)
	.factory('constants', constants)
	.factory('sharedDataServices', sharedDataServices)
	.filter('noFractionCurrency',noFractionCurrency);

angular.module('ubin-ui').config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	$urlRouterProvider.otherwise("/landing/");

	$stateProvider
	.state('landing', {
		url: '/landing/:bankloc',
		templateUrl: 'views/landing/main.html'
	})
	.state('admin',{
		url:'/admin',
		templateUrl: 'views/landing/main.html'
	});
});