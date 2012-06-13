/**
 * @fileOverview Compare Rolling. Diff two iamges
 * @author Taynov Dmitry
 * @version 0.0.1
 * @requires jQuery
 *
 * @example
 *      <div class="compare">
 *          <img src="pic1.jpg" alt="" />
 *          <img src="pic2.jpg" alt="" />
 *      </div>
 * @example
 *      jQuery('.compare').comparerolling({color: '#ffffff', half: true});
 *
 * @param size Size splitter in a pixels
 * @param color Color of splitter
 * @param type Splitter type (css border types. Dotted, solid, dashed)
 * @param half Splitter behavior. If true: when mouse leaves region of comparing,
 *          splitter auto returned to middle.
 */
(function () {
    /**
     * @var Object Default plugin options
     */
    var defaultOptions = {
        size:   '0',
        color:  'red',
        type:   'dotted',
        half:   false
    };
    
    var $this = null;
    var settings = {};
    var $pic1 = null;
    var $pic2 = null;
    var $box  = null;
    var width  = 0;
    var height = 0;

    var Splitter = function (size, color, type) {
        return {
            size:   size,
            color:  color,
            type:   type,
            toString: function () {
                return this.size + 'px ' + this.type + ' ' + this.color
            }
        }
    };

    /**
     * @var Object all plugin methods
     */
    var methods = {
        init: function (options) {
            settings= jQuery.extend(defaultOptions, options);
            // Init splitter
            var splitter = Splitter(
                settings.size,
                settings.color,
                settings.type
            );
            var $eventObject = null;
            // Init elements
            $this = jQuery(this);
            $pic1 = $this.find('img:first');
            $pic2 = $this.find('img:last');
            $box  = $('<div>');

            return this.each(function() {
                jQuery(window).load(function () {
                    width = $pic1.width();
                    height = $pic1.height();
                    $eventObject = (settings.half?$this:$(document));
                    // Init CSS
                    methods.initCss();
                    $box.css({
                        borderLeft: splitter.toString()
                    });
                    // Remove pic2 from DOM
                    $this.find('img:last').remove();
                    $this.append(
                        $box.append(
                            $pic2
                        )
                    );
                    // Handler mouse move
                    $this.bind({
                        mouseenter: function () {
                            $eventObject.bind({
                                mousemove: function (e) {
                                    var w = width - e.clientX + $this.offset().left;
                                    if (w < 0) w = 0;
                                    if (w > (width - splitter.size)) w = width - splitter.size;
                                    $box.width(w);
                                },
                                mouseleave: function (e) {
                                    if (settings.half) {
                                        $box.width(Math.round(width / 2));
                                    }
                                }
                            });
                        },
                        mouseleave: function () {
                            setTimeout(function () {
                                $eventObject.unbind('mousemove');
                            }, 100);
                        }
                    });
                });
            });
        },
        initCss: function () {
            // Set a CSS properties to box
            $this.css({
                position:   'relative',
                width:      width,
                height:     height,
                overflow:   'hidden'
            });
            // Set compare box (for pic2) CSS prop
            $box.css({
                position:   'absolute',
                width:      Math.round(width / 2),
                height:     height,
                top:        0,
                right:      0,
                overflow:   'hidden'
            });
            // Set an pics CSS properties
            $pic1.add($pic2).css({
                position:   'absolute',
                top:        0,
                right:      0
            });
        }
    };

    /**
     * Plugin constructor
     * @param method
     */
    jQuery.fn.comparerolling = function (method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            jQuery.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };
})(jQuery);