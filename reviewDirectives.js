angular.module(appName)
	.directive('maxHeightMap', function($timeout, NgMap) {
		return {
			restrict: 'A',
			link: function(scope, elm, attrs) {

				// var mapContainer = elm.find('.angular-google-map-container');
				var mapContainer = elm.find('ng-map');
				var orignialHeight;
				var marginBottom = 50;

				var handler = {
					resize: function() {
						setMaxHeight();
					}
				};

				scope.$watch(attrs.maxHeightMap, function(newValue) {

					NgMap.getMap().then(map => {

						if (newValue) {
							orignialHeight = mapContainer.css('height');
							setMaxHeight();
							$(window).on(handler);
							$timeout(function() {
								google.maps.event.trigger(map, 'resize'); //eslint-disable-line no-undef
							});
						} else {
							mapContainer.css('height', orignialHeight);
							$(window).off(handler);
							$timeout(function() {
								google.maps.event.trigger(map, 'resize'); //eslint-disable-line no-undef
							});
						}

					})
				});

				function setMaxHeight() {
					var winHeight = $(window).height();
					var toTop = $('.widgets-workspace').offset().top;

					var maxHeight = winHeight - toTop - marginBottom;
					mapContainer.css('height', maxHeight);
				}
			}
		};
	});