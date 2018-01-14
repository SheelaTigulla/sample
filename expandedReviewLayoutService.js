
angular.module(appName)

		.factory('ExpandedReviewLayoutService', function ($http, PreferenceSettingRepo) {

			var layoutKey = 'REVIEWLAYOUT';
			var defaultWidgetIds = [
				['skuTable', 'skuSiteTable'],
				['skuInfo'],
				['map']
			]

			function defaultLayout() {
				var layout = [];

				_.forEach(defaultWidgetIds, function (ids) {
					var widgets = [];
					_.forEach(ids, function (widgetId) {
						widgets.push(findWidgetById(widgetId));
					});

					layout.push({
						relativeWidth: 4,
						widgets: widgets
					});
				});

				return layout;
			}

			function findWidgetById(widgetId) {
				return angular.copy(_.find(app.review.expandedWidgets, {
					id: widgetId
				}));
			}

			var api = {
				layout: function () {
					return PreferenceSettingRepo.serverPreferenceSetting(layoutKey).then(function (res) {
						if ($.isEmptyObject(res.data)) {
							return defaultLayout();
						}
						return res.data;
					});
				}
			};
			return api;
		});

app.review = {};

app.review.expandedWidgetsTempRoot = config.jsRoot + '/session/review/expandedWidgets';

app.review.expandedWidgets = [{
	id: 'skuTable',
	title: 'Sku Table',
	ratio: 2,
	keepRatio: false,
	bodyTemplate: app.review.expandedWidgetsTempRoot + '/skuTable.html'
}, {
	id: 'skuSiteTable',
	title: 'Site/Sku Details',
	ratio: 2,
	keepRatio: false,
	bodyTemplate: app.review.expandedWidgetsTempRoot + '/skuTable.html'
}, {
	id: 'skuInfo',
	title: 'Part Info',
	ratio: 2,
	keepRatio: false,
	bodyTemplate: app.review.expandedWidgetsTempRoot + '/skuTable.html'
}, {
	id: 'map',
	title: 'Map',
	ratio: 2,
	keepRatio: false,
	bodyTemplate: app.review.expandedWidgetsTempRoot + '/skuTable.html'
}, {
	id: 'helloTest',
	title: 'Test WIdget',
	ratio: 2,
	keepRatio: false,
	bodyTemplate: app.review.expandedWidgetsTempRoot + '/skuTable.html'
}];
