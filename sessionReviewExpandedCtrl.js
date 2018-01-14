angular.module('sessionModule')
		.controller('SessionReviewExpandedCtrl', function ($scope, $stateParams, $state, ExpandedReviewLayoutService) {

			var sessionId = $scope.session.sessionId;
			if (!sessionId) {
				$state.go('sessionLanding');
			}

			$scope.layout = {};

			$scope.vm = {};
			$scope.pageShare = {};

			$scope.columnWidth = function (width) {
				var total = 0;
				_.forEach($scope.vm.columns, function (c) {
					total += c.width;
				});

				return (width / total * 100) + '%';
			};

			function columnTotalWidth() {
				var total = 0;
				_.forEach($scope.vm.columns, function (c) {
					total += c.width;
				});
				return total;
			}


			ExpandedReviewLayoutService.layout().then(function (data) {
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
				stop: function () {

				}
			};

			$scope.widgetResizeOptions = {
				distance: 10,
				handles: 'n,s'
			};

		});
