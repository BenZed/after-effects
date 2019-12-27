/* globals $ AVLayer:false, ShapeLayer:false, TextLayer:false, CameraLayer:false, LightLayer:false,
PropertyGroup:false, Property:false, FolderItem:false, CompItem:false, FootageItem:false, LayerCollection:false,
ItemCollection:false, app:false*/

/* eslint-disable no-var */

if ($.global.is === undefined) {
	$.global.is = (function() {
		return function is(value)
		{
			var i, type, types = Array.prototype.slice.call(arguments, 1);

			//Validate value argument
			if (arguments.length === 0)
				throw new Error('is expects at least one value and optionally a variable number of type arguments');

			//Validate type arguments
			for (i = 0; i < types.length; i++) {
				type = types[i];
				if (typeof type !== 'function')
					throw new Error('types, if supplied, are expected to be of type \'function\'');
			}

			//Type not supplied
			if (types.length === 0)
				return value !== undefined && value !== null && !isNaN(value);

			//Test types
			const value_type = typeof value;
			for (i = 0; i < types.length; i++) {
				type = types[i];

				if (value_type === 'string' && type === String)
					return true;

				else if (value_type === 'boolean' && type === Boolean)
					return true;

				else if (value_type === 'number' && type === Number && !isNaN(value))
					return true;

				else if (value_type === 'function' && type === Function)
					return true;

				else if (value instanceof type)
					return true;
			}

			//All failed
			return false;
		};
	})();
}


if ($.global.get === undefined) {
	$.global.get = (function(is){

		/************************************************************************/
		//	Valid Types
		/************************************************************************/
		const Types = [
			/* eslint-disable */
			CompItem,
			FolderItem,
			FootageItem,
			AVLayer,
			ShapeLayer,
			TextLayer,
			CameraLayer,
			LightLayer,
			Property,
			PropertyGroup
			/* eslint-enable */
		];

		/************************************************************************/
		//	Qualifiers
		/************************************************************************/

		function arg_is_type(arg)
		{
			for (var i = 0; i < Types.length; i++) {
				if (arg === Types[i])
					return true;
			}

			return false;
		}

		function arg_is_selector(arg)
		{
			return is(arg, Function, String, RegExp, Number);
		}

		function has_properties(obj)
		{
			return is(obj, AVLayer, ShapeLayer, TextLayer, CameraLayer, LightLayer, PropertyGroup);
		}

		function property_is_hidden(prop) {
			if (is(prop, PropertyGroup))
				return property_group_is_hidden(prop);

			try {
				prop.setValue(prop.value);
			} catch (err) {
				return err.message.includes('hidden') || err.message.includes('PropertyValueType.NO_VALUE');
			}

			return false;
		}

		function property_group_is_hidden(pGroup) {
			var all_hidden = true;
			for (var i = 1; i <= pGroup.numProperties; i++) {
				var prop = pGroup.property(i);
				if (is(prop, Property) && !property_is_hidden(prop))
					all_hidden = false;
			}
			return all_hidden;
		}


		function types_match(types, obj)
		{
			for (var i = 0; i < types.length; i++)
				if (is(obj, types[i]))
					return true;

			return false;
		}

		function types_include_layer(types)
		{
			for (var i = 0; i < types.length; i++) {
				var type = types[i];
				if (type === AVLayer || type === ShapeLayer || type === TextLayer || type === CameraLayer ||type === LightLayer)
					return true;
			}

			return false;
		}

		function types_include_item(types)
		{
			for (var i = 0; i < types.length; i++) {
				var type = types[i];
				if (type === FolderItem || type === CompItem || type === FootageItem)
					return true;
			}

			return false;
		}

		function types_include_property(types)
		{
			for (var i = 0; i < types.length; i++) {
				var type = types[i];
				if (type === Property || type === PropertyGroup)
					return true;
			}

			return false;
		}


		/************************************************************************/
		//	Creators
		/************************************************************************/

		//Simplified the writing style of this function so that
		//minify wouldn't destroy it.
		function create_selector(arg)
		{
			var selector = null;
			if (is(arg, String)) {
				selector = function(input) { return input.name === arg; };
			}

			if (is(arg, RegExp) && selector == null) {
				selector = function(input) { return input.name.match(arg) !== null; };
			}

			if (is(arg, Number) && selector == null) {
				selector = function(input) { return input.label === arg; };
			}

			if (is(arg, Function) && selector == null) {
				selector = arg;
			}

			if (!is(selector, Function))
				selector = function() { return true; };


			//Just in case minify breaks this again.
			if (!is(selector, Function))
				throw new Error('Minify mangled selection creation again.');

			return selector;
		}

		function get_all_of_types(types, context_arr)
		{
			var do_layers = types_include_layer(types);
			var do_items = types_include_item(types);
			var do_props = types_include_property(types);

			for (var i = app.project.items.length; i > 0; i --) {
				var item = app.project.items[i];
				if (do_items && types_match(types, item))
					context_arr.push(item);
				if ((do_layers || do_props) && item instanceof CompItem) {
					for (var ii = item.numLayers; ii > 0; ii--) {
						var layer = item.layer(ii);
						if (do_layers && types_match(types, layer))
							context_arr.push(layer);
						if (do_props)
							rec_properties_to_array(layer, types, context_arr);
					}
				}
			}
		}

		function rec_properties_to_array(group, types, arr)
		{
			for (var i = group.numProperties; i > 0; i --) {
				var prop = group.property(i);
				if (is(prop, PropertyGroup))
					rec_properties_to_array(prop, types, arr);

				if (!property_is_hidden(prop) && types_match(types, prop))
					arr.push(prop);

			}
		}

		function create_context(types, context)
		{
			var context_arr = [];

			if (context === undefined)
				get_all_of_types(types, context_arr);

			else if (types_match(types, context))
				context_arr.push(context);

			else if (is(context, ItemCollection, LayerCollection))
				add_collection_to_array (context, types, context_arr);

			else if (has_properties(context) && types_include_property(types))
				rec_properties_to_array (context, types, context_arr);

			else if (is(context, Array))
				for (var i = 0; i < context.length; i++)
					context_arr = context_arr.concat(create_context(types, context[i]));

			return context_arr;
		}

		/************************************************************************/
		//	Converters
		/************************************************************************/
		function add_collection_to_array(collection, types, arr)
		{
			for (var i = collection.length; i > 0; i--) {
				var select = collection[i];
				if (types_match(types, select))
					arr.push(select);
			}
		}

		function parse_arguments(args)
		{
			var context_defined = false, i = 0, arg = null;
			var selector = null, context = [], types = [];
			// Get Types
			for (i = 0; i < args.length; i++) {
				arg = args[i];
				if (arg === undefined)
					continue;

				var do_splice = false;

				if (arg_is_type(arg)) {
					types.push(arg);
					do_splice = true;

				} else if (is(arg, Array)) {
					var all_types = true;
					for (var ii = 0; ii < args.length; ii++) {
						var maybe_type = arg[ii];
						if (arg_is_type(maybe_type))
							types.push(maybe_type);
							else
							all_types = false;
					}
					if (all_types)
						do_splice = true;
				}

				if (do_splice) { //Remove types from args so they arn't reused when getting selector and context
					args.splice(i, 1);
					i--;
				}
			}

			if (types.length == 0)
				types = types.concat(Types);

			//Get selector and contexts
			for (i = 0; i < args.length; i++)
			{
				arg = args[i];
				if (arg === undefined) {
					continue;
				}
				if (selector === null && arg_is_selector(arg)) {
					selector = create_selector(arg);
				}
				else {
					context = context.concat(create_context(types, arg));
					context_defined = true;
				}
			}

			return {
				types: types,
				selector: selector !== null ? selector : create_selector(undefined),
				context: context_defined ? context : create_context(types, undefined)
			};
		}

		function get_selection(selector, context, types)
		{
			var selection = [];
			for (var i = 0; i < context.length; i++) {
				var select = context[i];
				if (!selector(select))
					continue;
				for (var ii = 0; ii < types.length; ii++) {
					if (select instanceof types[ii]) {
						selection.push(select);
						break;
					}
				}
			}

			return selection;
		}

		/************************************************************************/
		//	Main
		/************************************************************************/

		function Query(args)
		{
			var parsed = parse_arguments(args);
			var selected = get_selection(parsed.selector, parsed.context, parsed.types);

			this.count = function()
			{
				return selected.length;
			};

			this.selection = function(index)
			{
				var index_supplied = arguments.length > 0 && is(index, Number);

				if (index_supplied)
					return selected[index];

				var selected_copy = [];
				for (var i = 0; i < this.count(); i++)
					selected_copy.push(selected[i]);

				return selected_copy;
			};

			this.types = function()
			{
				return parsed.types;
			};
		}

		Query.prototype.each = function(callback)
		{
			if (!is(callback, Function))
				throw new Error('.each expects a function.');

			for (var i = 0; i < this.count(); i++)
				callback(this.selection(i), i);

			return this;
		};

		Query.prototype.set = function(prop, value)
		{
			if (!is(prop, String))
				throw new Error('.set expects the the first argument to be a string, representing a member name.');

			return this.each(function(select) {
				if (prop in select === false)
					return;

				var curr_value = is(value, Function) ? value(select) : value;

				if (!is(select[prop], Function))
					select[prop] = curr_value;
			});
		};

		Query.prototype.get = function(prop)
		{
			if (!is(prop, String))
				throw new Error('.set expects the the first argument to be a string, representing a member name.');

			var values = [];
			this.each(function(select, i) {
				if (prop in select === false || is(select[prop], Function)) {
					values[i] = undefined;
					return;
				}

				values[i] = select[prop];
			});

			return values;
		};

		Query.prototype.call = function(method /*args*/)
		{
			if (!is(method, String))
				throw new Error('.call expects the the first argument to be a string, representing a method.');

			var args = Array.prototype.slice.call(arguments);
			args.shift();
			return this.each(function(select) {
				if (method in select === false || !is(select[method], Function))
					return;

				select[method].apply(select, args);
			});
		};

		Query.prototype.filter = function(/*args*/)
		{
			var args = [this.types(), this.selection()].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		Query.prototype.comps = function(/*args*/)
		{
			var args = [CompItem, this.selection()].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		Query.prototype.items = function(/*args*/)
		{
			var args = [CompItem, FolderItem, FootageItem, this.selection()].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		Query.prototype.sources = function(/*args*/)
		{
			var args = [CompItem, FootageItem, this.selection()].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		Query.prototype.folders = function(/*args*/)
		{
			var args = [FolderItem, this.selection()].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		Query.prototype.footage = function(/*args*/)
		{
			var args = [FootageItem, this.selection()].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		Query.prototype.layers = function(/*args*/)
		{
			var args = [AVLayer, ShapeLayer, TextLayer, LightLayer, CameraLayer, this.selection()].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		Query.prototype.props = function(/*args*/)
		{
			var args = [Property, PropertyGroup, this.selection()].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		Query.prototype.children = function(/*args*/)
		{
			var new_contexts = [];
			this.each(function(select) {
				if (is(select, FolderItem))
					new_contexts.push(select.items);

				if (is(select, CompItem))
					new_contexts.push(select.layers);

				if (has_properties(select))
					rec_properties_to_array(select, [Property, PropertyGroup], new_contexts);
			});

			var args = Array.prototype.slice.call(arguments);
			args.push(new_contexts);
			return new Query(args);
		};

		function get(/*args*/)
		{
			return new Query(Array.prototype.slice.call(arguments));
		}

		get.comps = function(/*args*/) {
			var args = [CompItem].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		get.items = function(/*args*/) {
			var args = [CompItem, FolderItem, FootageItem].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		get.sources = function(/*args*/) {
			var args = [CompItem, FootageItem].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		get.folders = function(/*args*/) {
			var args = [FolderItem].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		get.footage = function(/*args*/) {
			var args = [FootageItem].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		get.layers = function(/*args*/) {
			var args = [AVLayer, ShapeLayer, TextLayer, LightLayer, CameraLayer].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		get.props = function(/*args*/) {
			var args = [Property, PropertyGroup].concat(Array.prototype.slice.call(arguments));
			return new Query(args);
		};

		get.root = function(/*args*/) {
			var args = Array.prototype.slice.call(arguments);
			var root_folder = new Query([FolderItem, app.project.rootFolder]);
			return root_folder.children.apply(root_folder, args);
		};

		return get;
	})($.global.is);
}
