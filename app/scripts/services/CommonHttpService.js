'use strict';
function httpService($http, constants) {

	return {
		get: function(endpoint) {
			return $http({
				url: endpoint,
				method: "GET"
			}).then(function(response){
				return response;
			}, function(error){
				return constants.error;
				console.log("The server is not available. Please try again later.",error);
			});
		},
		post: function(endpoint,data){
			return $http({
				url: endpoint,
				method: "POST",
				data:data
			}).then(function(response){
				if (response){
					return response;
				}
			}, function(error) {
				return constants.error;
				console.log("The server is not available. Please try again later.",error);
			});
		},
		put: function(endpoint,data){
			return $http({
				url: endpoint,
				method: "PUT",
				data:data
			}).then(function(response){
				if (response){
					return response;
				}
			}, function(response){
				console.log("The server is not available. Please try again later.",response);
			});
		}
	};

}