/****************************************************************/
// Console
// This Object is used by the after-effects package to log console
// outputs made in After Effects back into the node.js environment
/****************************************************************/

/* globals $ */
/* eslint-disable no-var */

if (typeof console != 'object') {
	$.global.console = (function(){

		var log_cache = [];

		return {
			log: function() {
				var str = '';
				for (var i = 0; i < arguments.length; i++) {
					str += String(arguments[i]);
				}
				log_cache.push(str);
			},
			clearCache: function()
			{
				var results = [];
				while (log_cache.length > 0)
					results.push(log_cache.shift());

				return results;
			}
		};
	})();
}
