/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, FastClick, device, document, window, setTimeout */

angular
	.module('bstripes', ['ngAnimate']) 
	.factor('loader', function() { 
		return {
			load:function(fnames) {
				var d = $.Deferred();
				
			}
		};
	}).controller('main', function($scope, loader) { 
		var files = [
			'data/snapshot_serengeti_anon_comments_DO_NOT_PUBLISH-06-10-2014.tsv',
			'data/galaxy_zoo_anon_comments_DO_NOT_PUBLISH-06-10-2014.tsv'
		];
		loader.load(files).then(function() { });
	});