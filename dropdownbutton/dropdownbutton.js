(function () {
    /**
     * @var Object Default plugin options
     */
    var defaultOptions = {
        className: 'dropdownbutton',
        classClose: 'close',
        closeTimeout: 100,
        caretWidth: 11,
        caretHeigth: 7,
        openOne: true
    };

    var settings = {};

    /**
     * @var Object all plugin methods
     */
    var methods = {
        init:function (options) {
            settings = jQuery.extend(defaultOptions, options);
            return this.each(function () {
                var $this = jQuery(this);
                var $a    = $this.find('a:first');
                var $ul   = $a.next();
                var $caret = jQuery('<span>').addClass('caret');
                var ulWidth;
                $this
                    .addClass(settings.classClose)
                    .addClass(settings.className);

                $ul.css({
                    minWidth: (parseInt($this.width()) - (parseInt($ul.css('padding-left')) + parseInt($ul.css('padding-right'))))
                });

                ulWidth = ($ul.width() + (parseInt($ul.css('padding-left')) + parseInt($ul.css('padding-right'))));

                $ul.css({
                    marginLeft: -(Math.round((ulWidth - $this.width()) / 2)),
                    top: $this.height() + settings.caretHeigth + 4 + 'px'
                });

                $caret.css({
                    left: (Math.round(ulWidth - settings.caretWidth) / 2)
                });

                $ul.append($caret);

                $a.bind({
                    click: function (e) {
                        if (settings.openOne) {
                            methods.closeAll($this);
                        }
                        methods.toggle($this, $a);
                        e.stopPropagation();
                        return false;
                    }
                });

                jQuery(window).bind({
                    click: function () {
                        setTimeout(function () {
                            $this.addClass(settings.classClose);
                            $a.removeClass('down');
                        }, settings.closeTimeout);
                    }
                });
            });
        },
        closeAll: function ($this) {
            jQuery('.' + settings.className)
                .not($this)
                .addClass(settings.classClose);

            jQuery('.' + settings.className)
                .not($this)
                .find('a')
                .removeClass('down');
        },
        toggle: function ($this, $a) {
            if ($this.hasClass(settings.classClose)) {
                $a.addClass('down');
                $this.removeClass(settings.classClose);
            } else {
                $a.removeClass('down');
                $this.addClass(settings.classClose);
            }
        }
    };

    /**
     * Plugin constructor
     * @param method
     */
    jQuery.fn.dropdownbutton = function (method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            jQuery.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };
})(jQuery);