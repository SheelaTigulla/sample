angular.module('sessionModule')
	.controller('SessionReviewGridCtrl', function($scope, $stateParams, $state, ExpandedReviewLayoutService, $localStorage) {

		$scope.standardItems = [{
			sizeX: 3,
			sizeY: 3,
			minSizeY: 2,
			row: 0,
			col: 0,
			id: 'skuTable',
			template: config.jsRoot + '/session/review/desktopWidgets/skuTable.html'
		}, {
			sizeX: 4,
			sizeY: 3,
			row: 3,
			col: 0,
			minSizeY: 2,
			id: 'siteSkuDetail',
			template: config.jsRoot + '/session/review/gridWidgets/siteSkuDetail.html'
		}, {
			sizeX: 1,
			sizeY: 3,
			row: 3,
			col: 4,
			id: 'skuInfo',
			template: config.jsRoot + '/session/review/desktopWidgets/skuInfo.html'
		}, {
			sizeX: 3,
			sizeY: 3,
			row: 0,
			col: 3,
			id: 'reviewMap',
			template: config.jsRoot + '/session/review/desktopWidgets/reviewMap.html'
		}, {
			sizeX: 1,
			sizeY: 3,
			row: 3,
			col: 5,
			id: 'Sample Widget',
			template: 'sampleWidget.html'
		}];

		$scope.defaultJSON = JSON.stringify($scope.standardItems);
		var unwatch = $scope.$watch(function() {
			return $('.less-stat-panel').height()
		}, function(newValue) {
			if (newValue) {
				$scope.gridsterOpts.rowHeight = (newValue - 50) / 6;
				unwatch();
			}
		})

		$scope.itemOptions = $localStorage.savedItemOptions || JSON.parse($scope.defaultJSON);

		$scope.$watch('itemOptions', newValue => $localStorage.savedItemOptions = newValue, true);

		$scope.resetLayout = () => {
			// $scope.itemOptions = JSON.parse($scope.defaultJSON);
			let defaultLayout = JSON.parse($scope.defaultJSON);
			$scope.itemOptions.forEach(item => {

				let def = defaultLayout.find(i => i.id == item.id)
				item.sizeX = def.sizeX;
				item.sizeY = def.sizeY;
				item.row = def.row;
				item.col = def.col;
				item.hide = false;
			});

		}

		$scope.gridsterOpts = {
			minColumns: 0,
			draggable: {
				enabled: true,
				handle: '.panel-heading'
			},
			swapping: true
		};

		$scope.filterWidget = function(widget) {
			return !widget.hide
		}

		$scope.toggleWidget = widget => widget.hide = !!!widget.hide;

		// $scope.toggleWidget = function(widget) {

		// 	widget.hide = !!!widget.hide;

		// 	// var w = _.find($scope.itemOptions, {
		// 	// 	id: widget.id
		// 	// })
		// 	// w.hide = !!!w.hide;
		// }


		var sessionId = $scope.session.sessionId;
		if (!sessionId) {
			$state.go('sessionLanding');
		}

		$scope.layout = {};

		$scope.vm = {};
		$scope.pageShare = {};

		$scope.columnWidth = function(width) {
			var total = 0;
			_.forEach($scope.vm.columns, function(c) {
				total += c.width;
			});

			return (width / total * 100) + '%';
		};

		function columnTotalWidth() {
			var total = 0;
			_.forEach($scope.vm.columns, function(c) {
				total += c.width;
			});
			return total;
		}


		ExpandedReviewLayoutService.layout().then(function(data) {
			$scope.layout.columns = data;
		});
		$scope.widgetSortableOptions = {
			placeholder: '',
			connectWith: '.widget-sort',
			items: '[widget]',
			handle: '[drag-handle]'
				// ,
				// start: function(event, ui) {
				//    ui.item.addClass('sorting-rotate');
				// },
				// stop: function  (event, ui) {
				//     ui.item.removeClass('sorting-rotate');
				// }
		};

		$scope.columnSortableOptions = {
			placeholder: '',
			handle: '.col-sort'
		};

		$scope.columnResizeOptions = {
			distance: 10,
			handles: 'e,w',
			stop: function() {

			}
		};

		$scope.widgetResizeOptions = {
			distance: 10,
			handles: 'n,s'
		};

	});
