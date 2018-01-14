angular.module('sessionModule')
		.factory('SiteSkuDetailService', function (SiteSkuDetailRepo,$localStorage, $translate) {

			var entries = [];

			function validateOrderInput(order) {
				function isNormalInteger(input) {
					var str = String(input);
					var n = ~~Number(str);
					return String(n) === str && n >= 0;
				}

				if (isNormalInteger(order)) {
					return {
						success: true
					};
				} else {
					return {
						success: false,
						message: $translate('Invalid number','invalidNumber')
					};
				}
			}

			function validateKeepInput(keep, onHand) {
				function isNormalInteger(input) {
					// PUL-3928 -US367: Change keep quantity to allow decimals - as per new requirement allow user to enter one decimal point no.'s' to update keep qty EX: 1.2,1.5,...
					var pattern = $localStorage.currentUser.environment == 'uap'? /^\d*([\,]\d{1})?$/ : /^\d*([\.]\d{1})?$/
					var test = pattern.test(input) == true;
					var n = $localStorage.currentUser.environment == 'uap'?parseFloat(input.replace(',','.')): parseFloat(input);
					return test && n!='NAN' && n>=0 && n == n.toFixed(1);
				}

				if (!isNormalInteger(keep)) {
					return {
						success: false,
						message: $translate('Invalid number','invalidNumber')
					};
				} else if (onHand != null && keep > onHand) {
					return {
						success: false,
						message: 'should < ' + onHand
					};
				} else {
					return {
						success: true
					};
				}

				//TODO: eslint syas unreachable code.
				//if (isNormalInteger(order)) {
				//	return {
				//		success: true
				//	};
				//} else {
				//	return {
				//		success: false,
				//		message: 'Invalid number'
				//	};
				//}
			}


			function orderDisabled(sku) {
				return sku.minQty > 0 || sku.return < 0;
			}

			function keepDisabled(sku) {
				return sku.order > 0; //TODO finish this condition
			}

			function updateOrderQty(sessionId, siteId, productId, orderQty, selectedVehicleCount) {
				return SiteSkuDetailRepo.updateOrderKeepQty(sessionId, siteId, productId, selectedVehicleCount,{
					orderQty: orderQty
				});
			}

			function updateKeepQty(sessionId, siteId, productId, keepQty, selectedVehicleCount) {
				return SiteSkuDetailRepo.updateOrderKeepQty(sessionId, siteId, productId, selectedVehicleCount,{
					keepQty: keepQty
				});
			}

			function siteSkuDetails(sessionId, productId, selectedVehicleCount) {
				return SiteSkuDetailRepo.getSiteSkuDetailData(sessionId, productId, selectedVehicleCount);
			}


			var api = {
				siteSkuDetails: siteSkuDetails,
				entries: entries,
				orderDisabled: orderDisabled,
				keepDisabled: keepDisabled,
				validateOrderInput: validateOrderInput,
				validateKeepInput: validateKeepInput,
				updateOrderQty: updateOrderQty,
				updateKeepQty: updateKeepQty
			};

			return api;
		});
