(function ($) {
	"use strict";

	/* Sticky Definition */

	var Sticky = function(element, options) {
		this.options = options;
		this.$element = $(element);
		this.$parent = this.$element.parent();
		this.$placeholder = $("<div class='sticky-placeholder'/>");
		
		this.init();
	};

	Sticky.prototype = {
		init: function() {
			// Create a placeholder to hold the shape of the element. 
			// Note: Using `outerHeight()` only works as long as there aren't
			// any margins on the element and the elements immediate siblings
			// or we get have with collapsing margins.
			this.$placeholder
				.css('height', this.$element.outerHeight())
				.insertAfter(this.$element).hide();

			this.staticTop = this.$element.position().top;
			this.stickyTop = this.staticTop;
			this.isSticking = false;

			this.$parent.on('scroll.sticky', this.draw.bind(this));
		},

		destroy: function() {
			this.$parent.off('scroll.sticky');
			this.positionStatic();
			this.$element.removeData('sticky');
		},

		positionStatic: function() {
			if(!this.isSticking)
				return;

			this.isSticking = false;

			this.$placeholder.hide();

			this.$element
				.css('position', 'static')
				.removeClass('is-sticking');
		},

		positionSticky: function() {
			if(this.isSticking)
				return;

			this.isSticking = true;

			this.$placeholder.show();

			this.$element
				.css('position', 'absolute')
				.addClass('is-sticking');
		},

		stickTo: function(left, top) {
			this.$element
				.css({
					"top": "0px",
					"-webkit-transform": "translateY(" + top + "px)"
				});

			this.positionSticky();
		},

		draw: function() {
			var scrollTop = this.$parent.scrollTop();

			if(this.options.autohide && scrollTop >= this.staticTop) {
				// The stickyTop is the fixed position of $element. This should
				// be between the scrollTop of the $parent and the scrollTop of 
				// the parent less the height of the element. 
				this.stickyTop = Math.min(Math.max(this.stickyTop, scrollTop-this.$element.outerHeight()), scrollTop);

				if(this.stickyTop == this.staticTop)
					this.positionStatic()
				else
					this.stickTo(0, this.stickyTop);
			}
			else if(scrollTop > this.staticTop)
				this.stickTo(0, scrollTop);
			else
				this.positionStatic();
		},

		show: function() {

		},

		hide: function() {

		}
	};


	/* jQuery PLUGIN */
	
	$.fn.sticky = function (option) {
		return this.each(function () {
			var $this = $(this), 
				data = $this.data('sticky'),
				options = $.extend({}, $.fn.sticky.defaults, typeof option == 'object' && option);

			if(!data) 
				$this.data('sticky', (data = new Sticky(this, options)));

			if(typeof option == 'string') 
				data[option]();
			
		});
	};

	$.fn.sticky.defaults = {
		autohide: false,
		
		// Roadmap: Stick to 'top', 'bottom', 'left', 'right', 'vertically', or 'horizontally'
		// to create sticky headers, footers and sidebars.  
		to: 'top'
	};

}(jQuery));