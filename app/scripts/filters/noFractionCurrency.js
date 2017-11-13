'use strict';

function noFractionCurrency($filter, $locale){
	var currencyFilter = $filter('currency');
	var formats = $locale.NUMBER_FORMATS;
	return function(amount, currencySymbol) {
		amount = amount ? (amount*1).toFixed(2) : 0.00;
		var value = currencyFilter(amount, currencySymbol);
		if (amount<0) {
			return value = value.replace("-", "(") + ")";
		} else {
			return value;
		}
	};
}