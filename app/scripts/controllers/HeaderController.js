'use strict';

function headerController($scope, $rootScope, constants, ENV) {

    $scope.platform = constants.platform[ENV.platform];
    $scope.clickRefresh = function(){
    	$rootScope.$broadcast('refresh');
    };
}