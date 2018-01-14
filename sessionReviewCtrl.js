angular.module('sessionModule')
.controller('SessionReviewCtrl', function ($scope, $rootScope, $filter, $interval, $stateParams, $state, $uibModal, $translate, hotkeys) {

	window.scope = $scope;
	window.r = $rootScope;
	var sessionId = $stateParams.sessionId;
	$scope.nodeId = $stateParams.nodeId;
	$scope.expensiveItem = $stateParams.expensiveItem;
	$scope.highSkuEdit = $stateParams.highSkuEdit;
	$scope.highSkuEditHierarchyId = $stateParams.highSkuEditHierarchyId;
	$scope.largerOrderQty = $stateParams.largerOrderQty;
	$scope.nodeName = $stateParams.nodeName;

	if (!sessionId) {
		$state.go('session');
		return;
	}

	$scope.vm = {};
	$scope.pref = {};
	$scope.display = {};
	$scope.filter = {};
	$scope.pageShare = {};

	$scope.session.isNotParameterPage = true

	$scope.vm.sessionId = $scope.session.sessionId = sessionId;

	$scope.vm.regularReviewWidgets = regularReviewWidgets;
	$scope.vm.maxWidget = null;           //reference to current full-view widget, if any

	$scope.session.updateStatBoxData();

	$scope.reviewImgRoot = config.jsRoot + '/session/review/images/';

	$scope.filter.defaultAdvancedFilters = [{
		id: 'displayFlag',
		key: 'displayFlag',
		value: 'isDisplayFlag',
		label: 'Display Flag',
		dialogFilter: true
	}, {
		id: 'lostSales',
		key: 'lostSales',
		value: 'isLostSales',
		label: 'Sales/Lost Sales',
		color: '#F2DEDD',
		dialogFilter: true,
		quickFilter: true
	}, {
		id: 'prospectParts',
		key: 'prospectParts',
		value: 'isProspectParts',
		label: 'Prospect Parts',
		color: '#9FD3A2',
		quickFilter: true,
		dialogFilter: true
	}, {
		id: 'lowVehicleCount',
		key: 'lowVehicleCount',
		value: 'lowVehicleCount',
		label: 'Low Vehicle Count',
		color: '#ffff66',
		quickFilter: true,
		dialogFilter: true,
		templateUrl: 'filterVehicleCountSelect.html'
	}, {
		id: 'keepFlag',
		key: 'keepFlag',
		value: 'isKeepFlag',
		label: 'Keep Flag',
		dialogFilter: true
	}, {
		id: 'obsoleteSkus',
		key: 'obsoleteSKUs',
		value: 'isObsoleteSkus',
		label: 'Obsolete SKUs',
		color: '#C09A73',
		quickFilter: true
	}, {
		id: 'survivingParts',
		key: 'survivingParts',
		value: 'isSurvivingParts',
		label: 'Surviving Parts',
		quickFilter: true,
		color: '#ffffff',
		dialogFilter: true,
	}];

	$scope.vehicleFilterDropdown = [{
		key: 'lt10Vehicles',
		label: $translate('<10 Vehicles','lt10Vehicles'),
		value: 10
	}, {
		key: 'lt25Vehicles',
		label: $translate('<25 Vehicles','lt25Vehicles'),
		value: 25
	}, {
		key: 'lt50Vehicles',
		label: $translate('<50 Vehicles','lt50Vehicles'),
		value: 50
	}, {
		key: 'lt100Vehicles',
		label: $translate('<100 Vehicles','lt100Vehicles'),
		value: 100
	}, {
		key: 'lt250Vehicles',
		label: $translate('<250 Vehicles','lt250Vehicles'),
		value: 250
	}];

	$scope.avgAgeDropdown = [
		{
			key: 'gt20Years',
			label: $translate('>20 Years','gt20Years'),
			avgMin: 21,
			avgMax: 200
		}, {
			key: 'gt15Years',
			label: $translate('>15 Years','gt15Years'),
			avgMin: 16,
			avgMax: 200
		}, {
			key: 'five_15Years',
			label: $translate('5-15 Years','five_15Years'),
			avgMin: 5,
			avgMax: 15
		}, {
			key: 'lt10Years',
			label: $translate('<10 Years','lt10Years'),
			avgMin: -10,
			avgMax: 10
		}, {
			key: 'lt5Years',
			label: $translate('<5 Years','lt5Years'),
			avgMin: -10,
			avgMax: 5
		}];


	$scope.filter.defaultGenericFilters = [{
		id: 'lineAbbr',
		key: 'lineAbbr',
		label: 'Line Abbr',
		on: false,
		templateUrl: 'filterLineAbbrTextInput.html'
	}, {
		id: 'order',
		key: 'order',
		value: 'isOrder',
		label: 'Order',
		on: true
	}, {
		id: 'return',
		key: 'return',
		value: 'isReturn',
		label: 'Return',
		on: true
	}, {
		id: 'partNumber',
		key: 'partNumber',
		label: 'Part Number',
		on: false,
		templateUrl: 'filterPartNumberTextInput.html'
	}, {
		id: 'groupCode',
		key: 'group',
		label: 'Group',
		on: false,
		templateUrl: 'filterGroupCodeTextInput.html'
	}, {
		id: 'averageAge',
		key: 'averageAge',
		value: 'averageAge',
		label: 'Average Age',
		quickFilter: false,
		dialogFilter: true,
		templateUrl: 'filterAverageAgeSelect.html'
	}];

	$scope.filter.defaultFilters = {
		advancedFilters: angular.copy($scope.filter.defaultAdvancedFilters),
		genericFilters: angular.copy($scope.filter.defaultGenericFilters)
	};

	$scope.filter.inUseFilters = angular.copy($scope.filter.defaultFilters);
	$scope.filter.inUseFilters.selectedVehicleOption = $scope.vehicleFilterDropdown[0];
	$scope.filter.inUseFilters.selectedAvgAgeOption = $scope.avgAgeDropdown[0];

	if ($scope.nodeId) {
		$scope.filter.inUseFilters.nodeId = $scope.nodeId;
	}
	if ($scope.expensiveItem) {
		$scope.filter.inUseFilters.expensiveItem = $scope.expensiveItem;
	}
	if ($scope.highSkuEdit) {
		$scope.filter.inUseFilters.highSkuEdit = $scope.highSkuEdit;
	}
	if ($scope.highSkuEditHierarchyId) {
		$scope.filter.inUseFilters.highSkuEditHierarchyId = $scope.highSkuEditHierarchyId;
	}
	if ($scope.largerOrderQty){
		$scope.filter.inUseFilters.largerOrderQty = $scope.largerOrderQty;
	}


	// $scope.filter.advancedFilters = angular.copy($scope.filter.defaultAdvancedFilters);
	// $scope.filter.genericFilters = angular.copy($scope.filter.defaultGenericFilters);

	$scope.colWidth = function (col) {
		if (col.width != null)
			return {
				width: col.width
			};
		return {};
	};

	$scope.crossPage.configClick = function () {

		$scope.filter.edittingFilters = angular.copy($scope.filter.inUseFilters);
		// $scope.filter.edittingAdvancedFilters = angular.copy($scope.filter.advancedFilters);
		// $scope.filter.edittingGenericFilters = angular.copy($scope.filter.genericFilters);

		$uibModal.open({
			templateUrl: config.jsRoot + '/session/review/templates/sessionReviewFilterPanel.html',
			windowClass: 'modal-dialog-center',
			controller: 'SessionReviewFilterCtrl',
			scope: $scope
		});
	};

	if ($rootScope.roleId == 1) {
		hotkeys.bindTo($scope)
		.add({
			combo: 'ctrl+8',
			description: 'Review Filter',
			callback: function () {
				$scope.crossPage.configClick();
			}
		});
	}

})
.controller('SessionReviewFilterCtrl', function ($scope, $uibModalInstance) {

	if ($scope.filter.edittingFilters.selectedVehicleOption == null) {
		$scope.filter.edittingFilters.selectedVehicleOption = $scope.vehicleFilterDropdown[0];
	}

	if ($scope.filter.edittingFilters.selectedAvgAgeOption == null) {
		$scope.filter.edittingFilters.selectedAvgAgeOption = $scope.avgAgeDropdown[0];
	}

	$scope.clearAll = function () {
		$scope.filter.edittingFilters = angular.copy($scope.filter.defaultFilters);
		// $scope.filter.edittingAdvancedFilters = angular.copy($scope.filter.defaultAdvancedFilters);
		// $scope.filter.edittingGenericFilters = angular.copy($scope.filter.defaultGenericFilters);

		if ($scope.filter.edittingFilters.selectedVehicleOption == null) {
			$scope.filter.edittingFilters.selectedVehicleOption = $scope.vehicleFilterDropdown[0];
		}

		if ($scope.filter.edittingFilters.selectedAvgAgeOption == null) {
			$scope.filter.edittingFilters.selectedAvgAgeOption = $scope.avgAgeDropdown[0];
		}
	};

	$uibModalInstance.result.then(function () {
		$scope.filter.inUseFilters = angular.copy($scope.filter.edittingFilters);
		// $scope.filter.genericFilters = angular.copy($scope.filter.edittingGenericFilters);
		// $scope.filter.advancedFilters = angular.copy($scope.filter.edittingAdvancedFilters);
	}, function () {
	});

	// $scope.$watch('filter.edittingFilters.selectedVehicleOption', function(newValue, oldValue) {
	//     if (newValue != null && oldValue!=null) {
	//         $scope.filter.edittingFilters.selectedAdvancedCategory = _.find($scope.filter.edittingFilters.advancedFilters, {
	//             id: 'lowVehicleCount'
	//         });
	//     }
	// });

	$scope.$watch('filter.edittingFilters.lineAbbrInput', function (newValue, oldValue) {

		oldValue = oldValue || "";
		newValue = newValue || "";
		if (newValue.toString() !== oldValue.toString()) {
			_.find($scope.filter.edittingFilters.genericFilters, {
				id: 'lineAbbr'
			}).on = ($.trim(newValue).length > 0);
		}

	});

	$scope.$watch('filter.edittingFilters.partNumberInput', function (newValue, oldValue) {

		oldValue = oldValue || "";
		newValue = newValue || "";
		if (newValue.toString() !== oldValue.toString()) {
			_.find($scope.filter.edittingFilters.genericFilters, {
				id: 'partNumber'
			}).on = ($.trim(newValue).length > 0);
		}
	});

	$scope.$watch('filter.edittingFilters.groupCodeInput', function (newValue, oldValue) {

		oldValue = oldValue || "";
		newValue = newValue || "";
		if (newValue.toString() !== oldValue.toString()) {
			_.find($scope.filter.edittingFilters.genericFilters, {
				id: 'groupCode'
			}).on = ($.trim(newValue).length > 0);
		}
	});
});


var regularReviewWidgets = [{
	id: 'skuTable',
	class: 'col-md-6 col-xs-6',
	template: config.jsRoot + '/session/review/desktopWidgets/skuTable.html'
}, {
	id: 'siteSkuDetail',
	class: 'col-md-6 col-xs-6',
	template: config.jsRoot + '/session/review/desktopWidgets/siteSkuDetail.html'
}, {
	id: 'skuInfo',
	class: 'col-md-4 col-xs-4 clear-both sku-info-widget',
	template: config.jsRoot + '/session/review/desktopWidgets/skuInfo.html'
}, {
	id: 'reviewMap',
	class: 'col-md-8 col-xs-8 sku-map-widget',
	template: config.jsRoot + '/session/review/desktopWidgets/reviewMap.html'
}];
