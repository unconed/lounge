/* global jQuery */
(function($) {
	$.fn.autogrow = function(opts) {
		var that = $(this),
			selector = that.selector,
			formDiff = 0,
			defaults = {
				context: $(document),
				animate: true,
				speed: 200,
				fixMinHeight: true,
				cloneClass: "autogrowclone",
				onInitialize: true
			};
		opts = $.isPlainObject(opts) ? opts : {
			context: opts ? opts : $(document)
		};
		opts = $.extend({}, defaults, opts);
		that.each(function(i, elem) {
			var min, formMin;
			elem = $(elem);
			min = 34;
			formMin = 47;
			formDiff = formMin - min;
			if (opts.fixMinHeight) {
				elem.data("autogrow-start-height", min);
			}
			elem.css("height", min);
			$("#form").css("height", formMin);

			if (opts.onInitialize && elem.length) {
				resize.call(elem[0]);
			}
		});
		opts.context.on("keyup paste", selector, resize);

		function resize(e) {
			var box = $(this),
				oldHeight = box.innerHeight(),
				newHeight = this.scrollHeight,
				minHeight = box.data("autogrow-start-height") || 0,
				clone, formClone;
			if (oldHeight < newHeight) { // user is typing
				this.scrollTop = 0; // try to reduce the top of the content hiding for a second
				opts.animate ? box.stop().animate({
					height: newHeight
				}, opts.speed) : box.innerHeight(newHeight);
				opts.animate ? $("#form").stop().animate({
					height: newHeight + formDiff
				}, opts.speed) : $("#form").innerHeight(newHeight);
			} else if (!e || e.which === 8 || e.which === 46 || (e.ctrlKey && e.which === 88)) { // user is deleting, backspacing, or cutting
				if (oldHeight > minHeight) {
					// this cloning part is not particularly necessary. however, it helps with animation
					// since the only way to cleanly calculate where to shrink the box to is to incrementally
					// reduce the height of the box until the $.innerHeight() and the scrollHeight differ.
					// doing this on an exact clone to figure out the height first and then applying it to the
					// actual box makes it look cleaner to the user
					clone = box.clone()
						.addClass(opts.cloneClass)
						.css({
							position: "absolute",
							zIndex: -10,
							height: ""
						})
						.val(box.val());
					formClone = $("#form").clone()
						.addClass(opts.cloneClass)
						.css({
							position: "absolute",
							zIndex: -10,
							height: ""
						})
						.val(box.val());
					box.after(clone);
					$("#form").after(formClone);
					do { // reduce height until they don"t match
						newHeight = clone[0].scrollHeight - 1;
						clone.innerHeight(newHeight);
						formClone.innerHeight(newHeight);
					} while (newHeight === clone[0].scrollHeight);
					newHeight++; // adding one back eliminates a wiggle on deletion
					clone.remove();
					formClone.remove();
					box.focus(); // Fix issue with Chrome losing focus from the textarea.

					// if user selects all and deletes or holds down delete til beginning
					// user could get here and shrink whole box
					newHeight < minHeight && (newHeight = minHeight);
					oldHeight > newHeight && opts.animate ? box.stop().animate({
						height: newHeight
					}, opts.speed) : box.innerHeight(newHeight);
					oldHeight > newHeight && opts.animate ? $("#form").stop().animate({
						height: newHeight + formDiff
					}, opts.speed) : $("#form").innerHeight(newHeight + formDiff);
				} else { // just set to the minHeight
					box.innerHeight(minHeight);
					$("#form").innerHeight(minHeight + formDiff);
				}
			}
		}
		return that;
	};
})(jQuery);
