/**
 * @fileOverview Lazypage. Lazy load content by scrolling page
 * or clicking next button.
 * Button element required. It can be disabled
 * via parameters
 * 
 * @author Taynov Dmitry
 * @version 0.0.1
 * @requires jQuery
 * @example jQuery('.button').lazypager({step: 20, onlyScroll: true});
 * @param options Plugin options object
 * @param options.step Step count
 * @param options.max Max element to load
 * @param options.url Content url
 * @param options.preloader Preloader image url
 * @param options.onlyScroll Disable next button
 * @param options.scrollLoad Enable scroll loading
 */
(function () {
    /**
     * @var Object Default plugin options
     */
    var defaultOptions = {
        step:       15,
        max:        999,
        url:        '/',
        preloader:  '/images/lazy-preloader.gif',
        onlyScroll: false,
        scrollLoad: true
    };
    /**
     * @private {object} Extended settings box
     */
    var settings    = {};
    /**
     * @private {int} Next page start position
     */
    var next        = 0;
    /**
     * @this {jQuery} jQuery element. Next button.
     */
    var $this       = null;
    /**
     * @param {jQuery} jQuery element. Preloader img
     */
    var $preloader  = null;

    /**
     * @param {object} All plugin methods
     */
    var methods = {
        init: function (options) {
            settings = jQuery.extend(defaultOptions, options);
            // Set first step
            next = settings.step;
            return this.each(function() {
                var $img = null;
                // If preload url not net then call exception
                if (settings.url == '')
                    throw new Error ('Content url not set.');
                $this = jQuery(this);
                // Is scroll load disable then auto disable onlyScroll param
                if (settings.scrollLoad === false)
                    settings.onlyScroll = false;
                // True Only scroll parameter hide button
                if (settings.onlyScroll)
                    $this.hide();
                // Preloader init
                $img = $('<img>');
                $img.attr({
                    src: settings.preloader,
                    alt: 'Loading',
                    title: 'Loading',
                    'class': 'lazypager-preloader'
                });
                $preloader = jQuery('<div>').attr('class', 'lazypager-preloader-box');
                $preloader.append($img);
                $preloader.proccess = false;
                // Count scroll top margin
                jQuery(window).scroll(function (e){
                    // Total document height
                    var dHeight = jQuery(document).height();
                    // Total scrolled height
                    var sHeight = jQuery(window).scrollTop() + jQuery(window).height();
                    if (dHeight == sHeight && !$preloader.proccess) {
                        methods.next();
                    }
                });

                $this.bind({
                    click: function (e) {
                        methods.next();
                    }
                });
            });
        },
        next: function () {
            var diff = 0;
            // Iterate step count
            next += settings.step;
            // Check max boundary
            if ((diff = (settings.max - next)) < 0) {
                // Example: max = 100, next 105, diff = -5. Then 105 + (-5) = 100 (Normalized!!!)
                next += diff;
                // And Hide next button
                $this.hide();
            }
            // Append preloader
            $('div.lazypager-box').append($preloader);
            $preloader.proccess = true;
            // Do request to get content
            $.ajax({
                type: 'POST',
                url: settings.url,
                data: {
                    next: next
                },
                success: function (r) {
                    $('.lazypager-preloader-box').remove();
                    $preloader.proccess = false;
                    $('div.lazypager-box').append(r);
                }
            });
        }
    };

    jQuery.fn.lazypager = function (method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            jQuery.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };
})(jQuery);