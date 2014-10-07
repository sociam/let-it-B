/* jshint undef: true, strict:false, trailing:false, unused:false, quotmark:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, FastClick, device, document, window, setTimeout, d3 */

angular
	.module('bstripes')
	.directive('contributorStripes', function() {
		return {
			restrict:'E',
			scope:{ data:'=', field:'@', colorscheme:'@' },
			templateUrl:'tmpl/contributor-stripes.html',
			controller:function($scope, utils) { 
				// $scope.data will be the raw data
				// console.log('stripes scope ', $scope);
				var u = utils,
					sa = function(f) { utils.safeApply($scope, f); },
					colors = { 
						category20:d3.scale.category20(),
						category20b:d3.scale.category20b(),
						category20c:d3.scale.category20c()
					}, 
					colorscale = $scope.color = colors[$scope.colorscheme] || d3.scale.category20(),
					byKey, total,
					MULTIPLIER = 0.20,
					update = function(val) { 
						if (val === undefined) { return; }
						// update bykey
						byKey = u.dictCat($scope.data.map(function(r) {
							return [r[$scope.field], r];
						}));												
						total = _(byKey).values()
								.map(function(v) { return v.length; })
								.reduce(function(a,b) { return a + b; }, 0);

						// console.log('values : ', _(byKey).values().map(function(v) { return v.length; }), total);

						var newKeys = _($scope.keys || []).union(_(byKey).keys());
						if (!$scope.keys || $scope.keys.length !== newKeys.length) { 
							newKeys.sort();
							colorscale.domain(newKeys);
						}
						sa(function() { 
							$scope.keys = newKeys; 
							$scope.byKey = $scope.byKey || {};
							$scope.lastcolor = $scope.color(newKeys[newKeys.length - 1]);
							_(byKey).map(function(v,k) {
								$scope.byKey[k] = $scope.byKey[k] || {};
								$scope.byKey[k].width = $scope.toPCT(v);
							});
							var empties = _($scope.byKey).chain().keys().difference(_(byKey).keys()).value();
							// console.log('difference -- ', _($scope.byKey).keys().length);
							empties.map(function(r) { $scope.byKey[r].width = $scope.toPCT([]); });
							$scope.total = total;
						});
					};

				$scope.toPCT = function(v) { 
					if (!v || !$scope.total) { return 0; }
					return MULTIPLIER*Math.min(100.0,((v.length/(1.0*$scope.total))*100).toFixed(2));
				};
				$scope.$watch('data', update);
				update($scope.data);
				window.$ss = $scope;
			}
		};
	});
	