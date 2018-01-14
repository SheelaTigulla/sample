angular.module(appName)
	.directive('horiResize', () => {
		return {
			restrict: 'EA',
			link(scope, elm, attrs) {
				let options = scope.$eval(attrs.resizeOptions);
				// let onResize = scope.$eval(attrs.onResize);

				let items = elm.find('[hori-item]')

				let totalWidth = _.reduce(items, (sum, it) => sum + $(it).width(), 0);
				// console.log('total width is ', totalWidth);

				let left = $(items[0]);
				let right = $(items[1]);
				// console.log('left width is ', left.width())
				// console.log('right width is ', right.width())


				var handlers = {
					resize: (evt, ob) => {
						// console.log(arguments);
						if (evt.target.hasAttribute('hori-item')) {
							right.width(totalWidth - ob.size.width);
						}
						evt.stopPropagation();
					}
				};

				left.resizable({
					handles: 'e',
					distance: 15
				});

				left.on(handlers);

				scope.$watch(attrs.resizable, function(value) {
					if (value == null || value === true) {
						// elm.resizable(options);
						elm.on(handlers);
					} else {
						if (elm.resizable('instance')) {
							elm.resizable('destroy');
						}
						elm.off(handlers);
					}
				});





			}

		};
	});


angular.module(appName)
	.directive('draggable', function() {
		return {
			restrict: 'EA',
			link: function(scope, elm, attrs) {
				var options = scope.$eval(attrs.dragOptions);
				//var onDrag = scope.$eval(attrs.onDrag);
				var handlers = {
					resizestop: function() {
						if (scope.onDrag) {
							scope.onDrag();
						}
						scope.$apply();
					}
				};

				scope.$watch(attrs.draggable, function(value) {
					if (value == null || value === true) {
						elm.draggable(options);
						$(document).on(handlers);
					} else {
						if (elm.draggable('instance')) {
							elm.draggable('destroy');
						}
						$(document).off(handlers);
					}
				});
			}
		};
	});


angular.module(appName)
	.directive('dynamicWidget', [function() {
		return {
			restrict: 'A',
			template: '<div ng-transclude></div>',
			transclude: true,
			link: function(scope, elm) {
				elm.css({
					// width: scope.widget.width,
					// height: scope.widget.height
				});
			}
		};
	}]);

angular.module(appName)
	.directive('widget', [function() {
		return {
			restrict: 'A',
			scope: {
				widget: '='
			},
			link: function() {}
		};
	}]);

angular.module(appName)
	.directive('columnWidget', [function() {
		return {
			restrict: 'A',
			template: '<div ng-transclude></div>',
			transclude: true,
			link: function(scope) {
				scope.$on('columnResized', function() {
					scope.$broadcast('widgetRerender');
				});
			}
		};
	}]);
