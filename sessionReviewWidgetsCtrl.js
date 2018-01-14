import {isEmpty, isNil} from 'ramda';
import RichArray from '../../utils/richArray';
angular
.module('sessionModule')
.controller('SkuTableCtrl', function ($rootScope,
																			$scope,
																			$element,
																			$timeout,
																			$log,
																			SessionPreferenceSettingService,
																			SkuTableRepo,
																			ArrayUtils,
																			SessionRepo) {
	$scope.headerUrl =
			config.jsRoot + '/session/review/desktopWidgets/skuTableHeader.html';
	$scope.bodyUrl =
			config.jsRoot + '/session/review/desktopWidgets/skuTableBody.html';
	$scope.setting.skuTable = {
		loading: true,
		showConfigPanel: false
	};
	$scope.filter.skuTable = {
		sort: {
			field: 'sku',
			order: 'asc'
		},
		page: {
			recordsPerPage: 100,
			currentPage: 1,
			totaRecords: null
		}
	};
	$scope.vm.skuTableDataIndex = 0;
	$scope.includesDCs = 0;

	var filter = $scope.filter.skuTable;
	SessionPreferenceSettingService.getSkuDetailPreference().then(function (data) {
		$scope.pref.skuTablePref = data;
		$scope.setting.skuTable.loading = false;
	});

	$scope.ajaxUpdatePreference = function () {
		if ($scope.pref.skuTablePref) {
			SessionPreferenceSettingService.saveSkuDetailPreference(
					$scope.pref.skuTablePref
			);
		}
	};

	$scope.changeSort = function (col) {
		var filterSort = $scope.filter.skuTable.sort;
		if (col.id == filterSort.field) {
			filterSort.order = filterSort.order == 'asc' ? 'desc' : 'asc';
		} else {
			filterSort.field = col.id;
			filterSort.order = 'asc';
		}

		$scope.initLoad();
		$('#skuTableContainer').scrollTop(0);
	};

	/**
	 * Return false if this column should not be shown
	 * @param col
	 * @returns {boolean}
	 */
	$scope.showColumn = function (col) {
		if (col.id == 'national12' || col.id == 'national24') {
			if ($scope.includesDCs === 1) return $rootScope.accessItems[26];
			else return false;
		}
		return true;
	};

	$scope.onClickSkuTableRow = function (sku) {
		$scope.pageShare.activeProduct = sku;
		$scope.vm.skuTableDataIndex = ArrayUtils.arrayIndex(
				$scope.vm.skuTableData,
				sku,
				'productId'
		);
	};

	$scope.initLoad = function () {
		$scope.vm.skuTableDataIndex = 0;
		$scope.skuTableLoading = true;
		filter.page.currentPage = 1;

		SkuTableRepo.getSkuTableDataCount(
				$scope.vm.sessionId,
				$scope.filter
		).then(function (data) {
			$scope.skuTableDataCount = data.count;
			$scope.totalPages =
					Math.floor((data.count - 1) / filter.page.recordsPerPage) + 1;
		});

		SkuTableRepo.getSkuTableData(
				$scope.vm.sessionId,
				$scope.filter,
				$scope.filter.skuTable
		).then(function (data) {
			$scope.vm.skuTableData = data;
			$scope.skuTableLoading = false;
			$scope.pageShare.activeProduct = data[0];
		});

		SessionRepo.sessionDetail($scope.vm.sessionId).then(res => {
			$scope.includesDCs = res.data[0].includesDCs;
		});
	};

	$scope.$watch(
			'filter.inUseFilters',
			function (newValue, oldValue) {
				if (newValue && newValue != oldValue) $scope.initLoad();
			},
			true
	);

	$scope.loadMore = function () {
		if ($scope.loadingMore || filter.page.currentPage >= $scope.totalPages)
			return;
		$scope.loadingMore = true;
		filter.page.currentPage++;
		SkuTableRepo.getSkuTableData(
				$scope.vm.sessionId,
				$scope.filter,
				$scope.filter.skuTable
		).then(function (data) {
			$scope.vm.skuTableData = $scope.vm.skuTableData.concat(data);
			$scope.loadingMore = false;
		});
	};

	$scope.skuTableColumnWidthPerc = function (col) {
		return (
				col.relativeWidth * 100 / $scope.pref.skuTableColumnTotalWidth + '%'
		);
	};

	$scope.initLoad();
})
.controller('SiteSkuDetailCtrl', function ($rootScope,
																					 $stateParams,
																					 $scope,
																					 $timeout,
																					 $uibModal,
																					 $filter,
																					 $localStorage,
																					 SessionPreferenceSettingService,
																					 SiteSkuDetailService,
																					 Top3FactorsRepo,
																					 SessionRepo) {
	$scope.includesDCs = 0;
	$scope.setting.siteSkuDetail = {
		loading: true,
		showConfigPanel: false
	};
	$scope.filter.siteSkuDetail = {
		sort: {
			field: 'site',
			order: 'asc'
		},
		page: {
			recordsPerPage: 20,
			currentPage: 1
		}
	};

	$scope.constraint = {
		defaultListLimit: 20
	};

	var pageInfo = $scope.filter.siteSkuDetail.page;

	SessionPreferenceSettingService.getSiteSkuDetailPreference().then(function (data) {
		$scope.pref.siteSkuDetailPref = data;
		$scope.setting.siteSkuDetail.loading = false;
	});

	$scope.ajaxUpdatePreference = function () {
		if ($scope.pref.siteSkuDetailPref) {
			SessionPreferenceSettingService.saveSiteSkuDetailPreference(
					$scope.pref.siteSkuDetailPref
			);
		}
	};

	$scope.changeSort = function (col) {
		//$rootScope.$emit('focus-sku'); //return focus to the sku table/row to keep keyboard scrolling
		var filterSort = $scope.filter.siteSkuDetail.sort;
		if (col.id == filterSort.field) {
			filterSort.order = filterSort.order == 'asc' ? 'desc' : 'asc';
		} else {
			filterSort.field = col.id;
			filterSort.order = 'asc';
		}
		pageInfo.currentPage = 1;
	};

	$scope.calcColumnValue = function (col, sku) {
		var retVal = null;
		if (col.id === 'peerSales') {
			if (accessItems[19]) {
				retVal = $filter('criticalityPercent')(sku[col.id], 0) + '%';
			}
		} else {
			retVal = sku[col.id];
		}
		return retVal;
	};

	$scope.orderDisabled = SiteSkuDetailService.orderDisabled;
	$scope.keepDisabled = SiteSkuDetailService.keepDisabled;
	// $scope.validateOrderInput = SiteSkuDetailService.validateOrderInput;

	$scope.updateOrderQty = function (newOrder, sku, index) {
		//$rootScope.$emit('focus-sku');
		if (newOrder == sku.order) return;
		var validateResult = SiteSkuDetailService.validateOrderInput(newOrder);
		if (!validateResult.success) return validateResult.message;

		return SiteSkuDetailService.updateOrderQty(
				$scope.session.sessionId,
				sku.siteId,
				$scope.pageShare.activeProduct.productId,
				newOrder,
				$scope.vm.selectedVehicleCount
		).then(function (result) {
			if (result.hasOwnProperty('success')) {
				if (result.success) {
					if (result.item[0] != null) {
						$scope.vm.siteSkuDetailData[index] = result.item[0];
						$scope.vm.siteSkuDetailData[index].firstStockDate = $filter(
								'date'
						)(
								Date.parse($scope.vm.siteSkuDetailData[index].firstStockDate),
								'MM/dd/yy'
						);
					}
					$scope.session.updateStatBoxData();
					toastr.success('Order Quantity Updated', 'orderQuantityUpdated');
				} else {
					toastr.warning(result.message); //translated by service
				}
			} else {
				//server error
				result.success = false;
			}
			return result.success;
		});
	};

	$scope.updateKeepQty = function (newKeep, sku, index) {
		//$rootScope.$emit('focus-sku');
		//if ($localStorage.currentUser.environment == 'uap') newKeep = newKeep.replace(',','.');
		if (newKeep == sku.keep) return;
		var onHand = sku.onHand;
		if (newKeep > onHand) newKeep = onHand;
		var validateResult = SiteSkuDetailService.validateKeepInput(
				newKeep,
				onHand
		);
		if (!validateResult.success) {
			return validateResult.message;
		}
		newKeep = $localStorage.currentUser.environment == 'uap'? newKeep.replace(',','.') : newKeep;
		return SiteSkuDetailService.updateKeepQty(
				$scope.session.sessionId,
				sku.siteId,
				$scope.pageShare.activeProduct.productId,
				newKeep,
				$scope.vm.selectedVehicleCount
		).then(function (result) {
			if (result.hasOwnProperty('success')) {
				if (result.success) {
					if (result.item[0] != null) {
						$scope.vm.siteSkuDetailData[index] = result.item[0];
						$scope.vm.siteSkuDetailData[index].firstStockDate = $filter(
								'date'
						)(
								Date.parse($scope.vm.siteSkuDetailData[index].firstStockDate),
								'MM/dd/yy'
						);
						if($localStorage.currentUser.environment == 'uap'){
							var keepStr = $scope.vm.siteSkuDetailData[index].keep.toString();
						 	$scope.vm.siteSkuDetailData[index].keep = keepStr.toString().replace('.',',');
						}
					}
					$scope.session.updateStatBoxData();
					toastr.success('Keep Quantity Updated', 'keepQuantityUpdated');
				} else {
					toastr.warning(result.message); //xlate by service
				}
			} else {
				result.success = false;
			}
			return result.success;
		});
	};

	$scope.validateKeepInput = function (keep) {
		var onHand = $scope.vm.skuInEdit ? $scope.vm.skuInEdit.onHand : null;
		return SiteSkuDetailService.validateKeepInput(keep, onHand);
	};

	/**
	 * Used to pre-select the content of an xeditable field.
	 * Requires a dynamic id on each field/row
	 * @param parentId
	 */
	$scope.selectText = function (parentId) {
		setTimeout(function () {
			document
			.querySelector('#' + parentId + ' > form > div > input')
			.select();
		}, 0);
	};

	$scope.vioClick = function (sku) {
		$scope.activeSkuDetail = sku;
		$uibModal.open({
			templateUrl: config.jsRoot + '/session/review/templates/vioDetailPanel.html',
			windowClass: 'modal-dialog-center vio-dialog',
			controller: 'SessionVioPanelCtrl',
			scope: $scope
		});
	};

	$scope.siteClick = function (sku) {
		$scope.activeSkuDetail = sku;
		$scope.factors = [];
		Top3FactorsRepo.factors(
				$scope.activeSkuDetail.siteId,
				$scope.pageShare.activeProduct.productId
		).success(function (data) {
			_.forEach(data, function (item) {
				$scope.factors.push(item);
				$scope.factorlongDesc = item.PREDICTOR_LONG_DESC;
			});
			$uibModal.open({
				templateUrl: config.jsRoot + '/session/review/templates/top3FactorsPanel.html',
				windowClass: 'modal-dialog-center info-modal-dialog',
				scope: $scope
			});
		});
	};

	$scope.vm.orderNotEditable = function (sku) {
		return !$scope.session.sessionEditable || sku.orderNotEditable || $rootScope.accessItems[35];
		// return !$scope.session.sessionEditable || sku.blockOrder=='Y' || sku.min > 0 || sku.return > 0;
	};

	$scope.vm.keepNotEditable = function (sku) {
		return !$scope.session.sessionEditable || sku.keepNotEditable || $rootScope.accessItems[35];
		// return !$scope.session.sessionEditable || sku.blockReturn == 'Y'
	};

	$scope.loadingMore = false;
	$scope.loadMore = function () {
		if (
				pageInfo.currentPage <
				($scope.vm.siteSkuDetailData - 1) / pageInfo.recordsPerPage + 1
		)
			pageInfo.currentPage++;
	};

	$scope.orderFocus = function (sku) {
		_.forEach($scope.vm.siteSkuDetailData, function (s) {
			s.orderEditting = false;
			s.keepEditting = false;
		});

		$scope.vm.skuInEdit = sku;

		sku.orderEditting = true;
	};

	$scope.keepFocus = function (sku) {
		_.forEach($scope.vm.siteSkuDetailData, function (s) {
			s.orderEditting = false;
			s.keepEditting = false;
		});

		$scope.vm.skuInEdit = sku;
		sku.keepEditting = true;
	};

	$scope.$watch('pageShare.activeProduct', function (newValue) {
		if (newValue) {
			initLoad();
		} else {
			$scope.vm.siteSkuDetailData = null; //ensures that the widgets clear out previous data
		}
	});

	function initLoad() {
		$scope.setting.siteSkuDetail.loading = false;
		$scope.loadingMore = true;

		$scope.vm.selectedVehicleCount =
				$scope.filter.inUseFilters.selectedVehicleOption.value;
		$scope.vm.avgAgeMin =
				$scope.filter.inUseFilters.selectedAvgAgeOption.avgMin;
		$scope.vm.avgAgeMax =
				$scope.filter.inUseFilters.selectedAvgAgeOption.avgMax;

		SiteSkuDetailService.siteSkuDetails(
				$scope.vm.sessionId,
				$scope.pageShare.activeProduct.productId,
				$scope.vm.selectedVehicleCount,
				$scope.vm.avgAgeMin,
				$scope.vm.avgAgeMax
		)
		.then(function (data) {
			$scope.vm.siteSkuDetailData = data;
			if($localStorage.currentUser.environment == 'uap'){
				_.forEach($scope.vm.siteSkuDetailData,function(siteSku){
					siteSku.keep != null? siteSku.keep = siteSku.keep.toString().replace('.',',') : null;
			});
		 }
			$scope.setting.siteSkuDetail.loading = false;
			$scope.loadingMore = false;

			$scope.vm.siteSkuListLimit = Math.min(
					$scope.constraint.defaultListLimit,
					data.length
			);
			//                    _.forEach($scope.vm.siteSkuDetailData,function(v,i){
			//                      if($scope.pageShare.activeProduct.colorCode)
			//                          v.colorCode = $scope.pageShare.activeProduct.colorCode;
			//                    });
		})
		.catch(function () {
			toastr.error(
					'Error loading Site/Sku Detail Data',
					'errorLoadingSiteSkuData'
			);
		});
	}

	SessionRepo.sessionDetail($scope.vm.sessionId).then(res => {
		$scope.includesDCs = res.data[0].includesDCs;
	});

	$scope.showColumn = function (col) {
		if (col.id == 'peerSales') {
			return $rootScope.accessItems[19];
		}
		if (col.id == 'dcSales12' || col.id == 'dcSales24') {
			return $rootScope.accessItems[1] && $scope.includesDCs == 1;
		}
		return true;
	};

	$scope.loadMore = function () {
		$scope.vm.siteSkuListLimit = Math.min(
				$scope.vm.siteSkuListLimit + $scope.constraint.defaultListLimit,
				$scope.vm.siteSkuDetailData.length
		);
	};

	$scope.statusColorMap = {
		prospectParts: '#9FD3A2',
		obsolete: '#C09A73',
		lostSales: '#F2DEDD',
		lowVehicle: '#ffff66',
		systems: '#D9EBF5',
		averageAge: '#ADD8E6'
	};
})
.controller('SkuInfoCtrl', function ($rootScope,
																		 $scope,
																		 $state,
																		 $location,
																		 SkuInfoRepo) {
	$scope.$watch('pageShare.activeProduct', function (newValue) {
		if (newValue && newValue.productId) loadSkuInfo(newValue);
	});

	$scope.vm.popoverEnable = widget => {
		let bEnable = false;
		if ($scope.vm.skuInfoData && $scope.vm.skuInfoData.product[0]) {
			bEnable =
					$scope.vm.maxWidget != widget &&
					$scope.vm.skuInfoData.product[0].imageUrlLarge.length > 0;
		}
		return bEnable;
	};

	$scope.vm.getImageUrl = (widget, forceLarge) => {
		let sUrl = $rootScope.global.fileNotFoundSrc;
		if ($scope.vm.skuInfoData && $scope.vm.skuInfoData.product[0]) {
			if ($scope.vm.maxWidget === widget || forceLarge) {
				sUrl = $scope.vm.skuInfoData.product[0].imageUrlLarge;
			} else {
				sUrl = $scope.vm.skuInfoData.product[0].imageUrl;
			}
		}
		return sUrl;
	};

	$scope.onLevelClick = function (clickedNode) {
		if (clickedNode) {
			var nodes = $scope.vm.skuInfoData.hierarchy
			.filter(function (node) {
				return node.hierarchyLevel <= clickedNode.hierarchyLevel;
			})
			.map(function (node) {
				return {
					hierarchyId: node.hierarchyId,
					hierarchyName: node.hierarchyName,
					level: node.hierarchyLevel,
					parentId: node.parentId
				};
			});
			$state.go('session.dashboard', {
				sessionId: $scope.session.sessionId,
				nodesFromReview: nodes
			});
		}
	};

	function loadSkuInfo(product) {
		SkuInfoRepo.skuInfo(product.productId).success(function (data) {
			data.sku = product.sku;
			data.description = product.description;
			if (data.product[0] && data.product[0].imageUrl) {
				data.product[0].imageUrl = data.product[0].imageUrl.replace(
						/^http:/,
						'https:'
				);
				data.product[0].imageUrlLarge = data.product[0].imageUrl.replace(
						'?$thumb$',
						''
				);
			}
			$scope.vm.skuInfoData = data;
		});
	}
})
.controller(
		'ReviewMapCtrl',
		($rootScope, $scope, $timeout, ReviewMapRepo, $filter, NgMap) => {
			var reviewImageRoot = 'resources/js/session/review/images/';

			$scope.gmap = {
				markersFit: 'true'
			};

			$scope.setting.map = {
				loading: false,
				showConfigPanel: false
			};

			$scope.mapDefault = {
				center: [33.9105844, -84.458416],
				defaultCenter: {
					latitude: 33.9105844,
					longitude: -84.458416
				},
				zoom: 9,
				control: {}
			};

			$scope.gmap.markerIcons = [
				{
					type: 'R',
					key: 'return',
					label: 'Return',
					iconUrl: reviewImageRoot + 'return_key.png',
					markerUrl: reviewImageRoot + 'return.png'
				},
				{
					type: 'S',
					key: 'stocked',
					label: 'Stocked',
					iconUrl: reviewImageRoot + 'stocked_key.png',
					markerUrl: reviewImageRoot + 'stocked.png'
				},
				{
					type: 'O',
					key: 'order',
					label: 'Order',
					iconUrl: reviewImageRoot + 'ordered_key.png',
					markerUrl: reviewImageRoot + 'ordered.png'
				},
				{
					type: 'NS',
					key: 'notStocked',
					label: 'Not Stocked',
					iconUrl: reviewImageRoot + 'notstocked_key.png',
					markerUrl: reviewImageRoot + 'notstocked.png'
				}
			];

			let firstLoad = true;
			const fitMapBound = () => {
				NgMap.getMap().then(map => {
					$scope.map = map;
					var bounds = new google.maps.LatLngBounds();
					$scope.gmap.markerList.forEach(m => {
						let pos = new google.maps.LatLng(m.pos[0], m.pos[1]);
						bounds.extend(pos);
					});
					map.fitBounds(bounds);
					map.setOptions({
						keyboardShortcuts: false
					});
					if($scope.gmap.markerList.length == 1) {
						map.setZoom(8);
					}
				});
			};
			$scope.$watchCollection('vm.siteSkuDetailData', (newValue, oldValue) => {
				if (isEmpty(newValue) || isNil(newValue)) {
					return;
				}
				$scope.gmap.markerList = RichArray(newValue).map(marker => ({
					...marker,
					pos: [marker.LATITUDE, marker.LONGITUDE],
					icon: {
						url: RichArray($scope.gmap.markerIcons).find(
							m => m.type == marker.mapFlag
						)
							? RichArray($scope.gmap.markerIcons).find(
									m => m.type == marker.mapFlag
								).markerUrl
							: null,
						scaledSize: [23, 33]
					}
				}));
				if (firstLoad || newValue.length != (oldValue && oldValue.length)) {
					firstLoad = false;
					fitMapBound();
				}
			});


			$scope.vm.markerClick = (pos, model) => {
				//$rootScope.$emit('focus-sku');
				if (
						$rootScope.accessItems[35] ||
						!$scope.session.sessionEditable ||
						($scope.vm.orderNotEditable(model) && model.mapFlag == 'O') ||
						($scope.vm.keepNotEditable(model) && model.mapFlag == 'R')
				) {
					return;
				}

				let index = $scope.vm.siteSkuDetailData
				.map(d => d.siteId)
				.indexOf(model.siteId);

				ReviewMapRepo.changeMapFlag(
						$scope.vm.sessionId,
						model.siteId,
						$scope.pageShare.activeProduct.productId,
						model.mapFlag,
						$scope.vm.selectedVehicleCount
				).then(function (res) {
					var d = res[0];
					if (d) {
						if (d.firstStockDate) {
							d.firstStockDate = $filter('date')(
									Date.parse(d.firstStockDate),
									'MM/dd/yy'
							);
						}
						$scope.vm.siteSkuDetailData[index] = d;
					}
					$scope.session.updateStatBoxData();
				});
				$scope.$apply();
			};

			$scope.vm.markerMouseover = (pos, model) => {
				model.highlighted = true;
				$scope.$apply();
			};
			$scope.vm.markerMouseout = (pos, model) => {
				model.highlighted = false;
				$scope.$apply();
			};
		}
)
.directive('mouseWheel', function () {
	return {
		restrict: 'A',
		link: function (scope, elm) {
			function wheelEvent() {
				scope.vm.disableZoomToFit = true;
			}

			elm[0].addEventListener('mousewheel', wheelEvent, true);
			elm[0].addEventListener('DOMMouseScroll', wheelEvent, true);
		}
	};
})
.directive('keyNavRow', function ($document, RxDom) {
	return {
		restrict: 'A',
		link: function (scope, elm) {
			var codes = {
				down: 40,
				up: 38,
				left: 37,
				right: 39
			};
			var activeIndex = 0;
			var container = $('#skuTableContainer');

			$(document).keydown(function (e) {
				if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
					e.preventDefault();
				}
			});

			var downs = RxDom.keydown($(document))
			.filter(function (e) {
				return e.keyCode == codes.down || e.keyCode == codes.right;
			})
			.share();

			var ups = RxDom.keydown($(document))
			.filter(function (e) {
				return e.keyCode == codes.up || e.keyCode == codes.left;
			})
			.share();

			var keyStream = downs
			.map(() => 1)
			.merge(ups.map(() => -1))
			.map(function (e) {
				activeIndex = activeIndex + e >= 0 ? activeIndex + e : activeIndex;
				if (activeIndex >= scope.vm.skuTableData.length) {
					activeIndex = scope.vm.skuTableData.length - 1;
				}
				return {
					index: activeIndex,
					up: e == -1
				};
			})
			.distinctUntilChanged()
			.map(function (res) {
				var activeRow = getActiverow(res.index);
				return {
					index: res.index,
					up: res.up,
					activeRow: activeRow
				};
			})
			.filter(function (item) {
				return item.activeRow && item.activeRow.length > 0;
			})
			.catch(function () {
				return keyStream;
			})
			.share();

			function getActiverow(index) {
				var id = scope.vm.skuTableData[index].productId;
				return elm.find('tr[product=' + id + ']');
			}

			keyStream.subscribe(function (res) {
				var activeRow = res.activeRow;

				elm.find('tr').removeClass('active');
				activeRow.addClass('active');

				var up = res.up;
				var height = container.height();

				var offsetTop = activeRow.offset().top;
				var containerOffsetTop = container.offset().top;
				if (!up && offsetTop > containerOffsetTop + height - 20)
					container.scrollTop(container.scrollTop() + height / 2);
				else if (up && offsetTop < containerOffsetTop + 30) {
					container.scrollTop(container.scrollTop() - height / 2);
				}
			});

			keyStream.debounceTime(300).subscribe(function (res) {
				scope.pageShare.activeProduct = scope.vm.skuTableData[res.index];
				scope.$apply();
			});

			scope.$watch('pageShare.activeProduct', function (newValue) {
				if (newValue) {
					activeIndex = scope.vm.skuTableData.indexOf(
							scope.pageShare.activeProduct
					);
				}
			});
		}
	};
});
