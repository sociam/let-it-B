/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, FastClick, device, document, window, setTimeout, d3 */

angular
	.module('bstripes', ['ngAnimate']) 
	.factory('loader', function(utils) { 
		return {
			load:function(files) {
				var u = utils;
				return u.when(files.map(function(f) { 
					var d = u.deferred();
					console.log('loading ', f);
					d3.tsv(f, function(rows) {
						console.log('rows ', rows);
						d.resolve(rows);
					});
					return d.promise();
				}));
			}
		};
	}).controller('main', function($scope, loader) { 
		var files = [
			'data/snapshot_serengeti_anon_comments_DO_NOT_PUBLISH-06-10-2014.tsv',
			'data/galaxy_zoo_anon_comments_DO_NOT_PUBLISH-06-10-2014.tsv'
		];
		loader.load(files).then(function(rows) { 
			console.log('continuation ', rows);
		}).fail(function(x) { 
			console.error('error', x);
		});
	});