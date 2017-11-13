'use strict';

function serviceUrl(sharedDataServices, ENV, constants) {
	var currentBank = sharedDataServices.getCurrentBank();
	var mepsEndpoint = constants[ENV.platform].mepsEndpoint;
	return {
		"loadUrl":function(){
			if (ENV.platform === 'corda') {
				return {
					"me": sharedDataServices.getCurrentApi() + "/api/bank/info",
					"counterparties": sharedDataServices.getCurrentApi() + "/api/bank/counterparties",
					"outgoing": sharedDataServices.getCurrentApi() + "/api/queue/out",
					"incoming": sharedDataServices.getCurrentApi() + "/api/queue/in",
					"transfer": sharedDataServices.getCurrentApi() + "/api/fund/transfer",
					"transactions": sharedDataServices.getCurrentApi() + "/api/bank/transactions",
					"pledge": mepsEndpoint + "/meps/pledge",
					"redeem": sharedDataServices.getCurrentApi() + "/api/fund/redeem",
					"priority": sharedDataServices.getCurrentApi() + "/api/queue/priority",
					"status": sharedDataServices.getCurrentApi() + "/api/queue/status",
					"cancel": sharedDataServices.getCurrentApi() + "/api/queue/cancel",
					"nettingStatus": sharedDataServices.getCurrentApi() + "/api/netting/status",
					"netting": sharedDataServices.getCurrentApi() + "/api/netting",
					"settleQueue": sharedDataServices.getCurrentApi() + "/api/queue/settle",
					"balanceAll": sharedDataServices.getCurrentApi() + "/api/bank/balance/all",
					"moveFunds": sharedDataServices.getCurrentApi() + "/api/fund/interchannel/transfer"
				}; 
			} else {
				return {
					"me": sharedDataServices.getCurrentApi() + "/api/bank/info",
					"counterparties": sharedDataServices.getCurrentApi() + "/api/bank/counterparties",
					"outgoing": sharedDataServices.getCurrentApi() + "/api/queue/out",
					"incoming": sharedDataServices.getCurrentApi() + "/api/queue/in",
					"transfer": sharedDataServices.getCurrentApi() + "/api/fund/transfer",
					"transactions": sharedDataServices.getCurrentApi() + "/api/bank/transactions",
					"pledge": mepsEndpoint + "/meps/pledge",
					"redeem": mepsEndpoint + "/meps/redeem",
					"priority": sharedDataServices.getCurrentApi() + "/api/queue/priority",
					"status": sharedDataServices.getCurrentApi() + "/api/queue/status",
					"cancel": sharedDataServices.getCurrentApi() + "/api/queue/cancel",
					"nettingStatus": sharedDataServices.getCurrentApi() + "/api/netting/status",
					"netting": sharedDataServices.getCurrentApi() + "/api/netting",
					"settleQueue": sharedDataServices.getCurrentApi() + "/api/queue/settle",
					"balanceAll": sharedDataServices.getCurrentApi() + "/api/bank/balance/all",
					"moveFunds": sharedDataServices.getCurrentApi() + "/api/fund/interchannel/transfer"
				}; 
			}
			
		}
	};
}
