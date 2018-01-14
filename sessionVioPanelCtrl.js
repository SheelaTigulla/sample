angular.module('sessionModule')
	.controller('SessionVioPanelCtrl', function($scope, VioRepo) {

		$scope.tabs = [{
			id: 'positiveTab',
			title: 'Vehicle Registration > 0',
			model: null,
			fetchFn: VioRepo.positiveRegistrations,
			active: true,
			cols: [{
				id: 'vehicleDescription',
				label: 'Description',
				width: '60%',
				format: 'text'
			}, {
				id: 'years',
				label: 'Years',
				width: '20%',
				format: 'center'
			}, {
				id: 'vehicleCount',
				label: 'Vehicle Count',
				width: '20%',
				format: 'number'
			}],
			getColClass: function (colIndex) {return cols[colIndex].class}
		}, {
			id: 'zeroTab',
			title: 'Vehicle Registration = 0',
			model: null,
			fetchFn: VioRepo.zeroRegistrations,
			cols: [{
				id: 'vehicleDescription',
				label: 'Description',
				width: '60%',
				format: 'text'
			}, {
    			id: 'years',
    			label: 'Years',
    			width: '20%',
				format: 'center'
    		}, {
				id: 'vehicleCount',
				label: 'Vehicle Count',
				width: '20%',
				format: 'number'
			}]
		}, {
			id: 'applicationTab',
			title: 'Application',
			model: null,
			fetchFn: VioRepo.applications,
			cols: [{
				id: 'vehicleDescription',
				label: 'Description',
				width: '80%',
				format: 'text'
			}, {
				id: 'years',
				label: 'Years',
				width: '20%',
				format: 'center'
			}]
		}];

		$scope.clickTab = function(tab) {
			_.forEach($scope.tabs, function(t){
				t.active = t.id == tab.id;
			});
			fetchTabData(tab);
		};

		var activeTab = _.find($scope.tabs, {active: true});
		$scope.clickTab(activeTab);

		function fetchTabData(tab){
			if(tab.fetched) return;
			tab.loading = true;
			tab.fetchFn($scope.activeSkuDetail.siteId, $scope.pageShare.activeProduct.productId).then(function(data){
				tab.model = data;
				tab.fetched = true;
			}).finally(function(){
				tab.loading = false;
			});

		}
	});
