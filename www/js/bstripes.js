/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, FastClick, device, document, window, setTimeout, d3 */

angular
	.module('bstripes', ['ngAnimate']) 
	.factory('loader', function(utils) { 
		return {
			load:function(files) {
				var u = utils;
				return u.when(_(files).keys().map(function(project) { 
					var f = files[project], d = u.deferred();
					console.log('loading ', f);
					d3.tsv(f, function(rows) {
						console.log('rows ', rows);
						rows.map(function(r) { 
							r.project = project;
							r.created = new Date(r['created_at']);
						});
						d.resolve(rows);
					});
					return d.promise();
				}));
			}
		};
	}).controller('main', function($scope, loader, utils) { 
		var files = {
			snapshot: 'data/snapshot_serengeti_anon_comments_DO_NOT_PUBLISH-06-10-2014.tsv',
			galaxyzoo: 'data/galaxy_zoo_anon_comments_DO_NOT_PUBLISH-06-10-2014.tsv'
		}, u = utils;
		loader.load(files).then(function(rows) { 
			console.log('continuation ', rows);
			var all = u.flatten(rows);
			all.sort(function(a, b) { return a.created.valueOf() - b.created.valueOf(); });
			console.log('all > ', all);
		}).fail(function(x) { 
			console.error('error', x);
		});
	});