"use strict";

function sharedDataServices(constants, ENV) {
	var currentBank = constants.defaultBankLoc;
	var currentApi;
	var platformconstants = constants[ENV.platform];
	var bankList=_.map(platformconstants.bankNodes,function (val,key) {
		return{
			"bic":key
		};
	});
	return{
		setCurrentApi:function(data){
			currentApi="http://"+data;
		},
		getCurrentApi:function(){
			return currentApi;
		},
		setCurrentBank:function(data){
			currentBank = data;
		},
		getCurrentBank:function(){
			return currentBank;
		},
		setBankList:function(data){
			bankList = data;
		},
		getBankList:function(){
			return bankList;
		}
	};
}