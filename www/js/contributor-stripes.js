/* jshint undef: true, strict:false, trailing:false, unused:false */
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
					colorscale = d3.scale.ordinal(),
					keyOrder, byKey,
					update = function(val) { 
						if (val === undefined) { return; }
						var byKey = u.dictCat($scope.data.map(function(r) {
							return [r[$scope.field], r];
						}));						
						var total = _(byKey).values()
									.map(function(entries) { return entries.length; })
									.reduce(function(a,b) { return a + b; }, 0);
						if ($scope.bars === undefined) { 
							$scope.bars = [];
							var barnames = _(byKey).keys();
							barnames.sort();
							barnames.map(function(barname) {
								$scope.bars.push({name:barname});
							});
						}
						$scope.bars.map(function(b) {
							b.pct = byKey[b.name] ? byKey[b.name].length/total : 0;
						});
					};
				$scope.$watch('data', update);
				update($scope.data);
				window.$ss = $scope;
			}
		};
	});
	