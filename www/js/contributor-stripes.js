/* jshint undef: true, strict:false, trailing:false, unused:false, quotmark:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, FastClick, device, document, window, setTimeout, d3 */

angular
	.module('bstripes')
	.directive('contributorStripes', function() {
		return {
			restrict:'E',
			scope:{ data:'=', field:'@' },
			templateUrl:'tmpl/contributor-stripes.html',
			controller:function($scope, utils) { 
				// $scope.data will be the raw data
				// console.log('stripes scope ', $scope);
				var u = utils,
					sa = function(f) { utils.safeApply($scope, f); }, 
					colorscale = $scope.color = d3.scale.category20(),
					byKey, total,
					update = function(val) { 
						if (val === undefined) { return; }
						// update bykey
						byKey = u.dictCat($scope.data.map(function(r) {
							return [r[$scope.field], r];
						}));												
						total = _(byKey).values()
								.map(function(v) { return v.length; })
								.reduce(function(a,b) { return a + b; }, 0);

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
							$scope.total = total;
						});
					};

				$scope.toPCT = function(v) { 
					if (!v || !$scope.total) { return "0px"; }
					return (v.length/(1.0*$scope.total))*100;
				};
				$scope.$watch('data', update);
				update($scope.data);
				window.$ss = $scope;
			}
		};
	});
	