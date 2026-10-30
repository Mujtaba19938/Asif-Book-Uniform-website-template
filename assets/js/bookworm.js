
/**
 * bookworm.js
 *
 * Handles behaviour of the theme
 */
 ( function( $, window ) {
    'use strict';

    var is_rtl = $('body,html').hasClass('rtl');

      const theme = {

    /**
     * Theme's components/functions list
     * Comment out or delete the unnecessary component.
     * Some component have dependencies (plugins). Do not forget to remove dependency.
    */

    init: () => {
      theme.stickyNavbar();
    },

    stickyNavbar: () => {

      let navbar = document.querySelector('.navbar-sticky');

      if (navbar == null) return;

      let navbarClass = navbar.classList,
          navbarH = navbar.offsetHeight,
          scrollOffset = 500;
      
        window.addEventListener('scroll', (e) => {
          if (e.currentTarget.pageYOffset > scrollOffset) {
            document.body.style.paddingTop = navbarH + 'px';
            navbar.classList.add('navbar-stuck');
          } else {
            document.body.style.paddingTop = '';
            navbar.classList.remove('navbar-stuck');
          }
        });
      

    }
};


/**
* Init theme core
*/

theme.init();



    $(document).on('ready', function () {
        // initialization of unfold component
        if ( $.HSCore.components.hasOwnProperty( 'HSUnfold' ) ) {
            $.HSCore.components.HSUnfold.init($('[data-unfold-target]'));
        }

        // initialization of malihu scrollbar
        if ( $.HSCore.components.hasOwnProperty( 'HSMalihuScrollBar' ) ) {
            $.HSCore.components.HSMalihuScrollBar.init($('.js-scrollbar'));
        }

        // initialization of slick carousel
        if ( $.HSCore.components.hasOwnProperty( 'HSSlickCarousel' ) ) {
            $.HSCore.components.HSSlickCarousel.init('.js-slick-carousel');
        }

        // initialization of show animations
        if ( $.HSCore.components.hasOwnProperty( 'HSShowAnimation' ) ) {
            $.HSCore.components.HSShowAnimation.init('.js-animation-link');
        }

        // initialization of cubeportfolio
        if ( $.HSCore.components.hasOwnProperty( 'HSCubeportfolio' ) ) {
            $.HSCore.components.HSCubeportfolio.init('.cbp');
        }

        // initialization of quantity counter
        if ( $.HSCore.components.hasOwnProperty( 'HSQantityCounter' ) ) {
            $.HSCore.components.HSQantityCounter.init('.js-quantity');
        }

        // initialization of HSScrollNav component
        if ( $.HSCore.components.hasOwnProperty( 'HSScrollNav' ) ) {
            $.HSCore.components.HSScrollNav.init($('.js-scroll-nav'), {
              duration: 700
            });
        }

        // initialization of go to
        if ( $.HSCore.components.hasOwnProperty( 'HSGoTo' ) ) {
            $.HSCore.components.HSGoTo.init('.js-go-to');
        }

        // initialization of popups
        if ( $.HSCore.components.hasOwnProperty( 'HSFancyBox' ) ) {
            $.HSCore.components.HSFancyBox.init('.js-fancybox');
        }


        //initialization of HSCountdown component
        if ( $.HSCore.components.hasOwnProperty('HSCountdown') ) {
            var countdowns = $.HSCore.components.HSCountdown.init('.js-countdown', {
                yearsElSelector: '.js-cd-years',
                monthsElSelector: '.js-cd-months',
                daysElSelector: '.js-cd-days',
                hoursElSelector: '.js-cd-hours',
                minutesElSelector: '.js-cd-minutes',
                secondsElSelector: '.js-cd-seconds'
            });
        }


        // init zeynepjs
        var zeynep = $('.zeynep').zeynep({
            onClosed: function () {
                // enable main wrapper element clicks on any its children element
                $("body main").attr("style", "");

                console.log('the side menu is closed.');
            },
            onOpened: function () {
                // disable main wrapper element clicks on any its children element
                $("body main").attr("style", "pointer-events: none;");

                console.log('the side menu is opened.');
            }
        });

        // handle zeynep overlay click
        $(".zeynep-overlay").click(function () {
            zeynep.close();
        });

        // open side menu if the button is clicked
        $(".cat-menu").click(function () {
            if ($("html").hasClass("zeynep-opened")) {
                zeynep.close();
            } else {
                zeynep.open();
            }
        });

        if( typeof $.blockUI !== "undefined" ) {
            $.blockUI.defaults.message                      = null;
            $.blockUI.defaults.overlayCSS.background        = '#fff url(' + bookworm_options.ajax_loader_url + ') no-repeat center';
            $.blockUI.defaults.overlayCSS.backgroundSize    = '16px 16px';
            $.blockUI.defaults.overlayCSS.opacity           = 0.6;
        }

    /*===================================================================================*/
    /*  Add to Cart animation
    /*===================================================================================*/

        $( 'body' ).on( 'adding_to_cart', function( e, $btn, data){
            $btn.closest( '.product' ).block();
        });

        $( 'body' ).on( 'added_to_cart', function(){
            $( '.product' ).unblock();
        });

        /*===================================================================================*/
        /*  Smoth scroll
        /*===================================================================================*/

        $( '.bk-tabs > li > a' ).on( 'click', function() {
            if ( location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname ) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

                if ( target.length ) {

                    scrollTo = target.offset().top;

                    if ( $('.sticky-wrapper > .stuck' ).length > 0 ) {
                        scrollTo = scrollTo - 40;
                    }

                    $('html, body').animate({
                        scrollTop: scrollTo
                    }, 1000);
                }
            }
        });

    });

    /*===================================================================================*/
    /*  Slick Carousel
    /*===================================================================================*/
    var is_rtl = $('body,html').hasClass('rtl');

    if ( $( '.bk-carousel' ).length ) {
        $( '.bk-carousel' ).each( function() {
            if ( $( this ).find( '.js-slick-carousel' ) && $( this ).find( '.js-slick-carousel' ).length ) {
                if( is_rtl ) {
                    var slickAttributes = JSON.parse( $( this ).find( '.js-slick-carousel' ).attr( 'data-slick' ) );
                    slickAttributes = { ...slickAttributes, rtl: true }
                    $( this ).find( '.js-slick-carousel' ).attr( 'data-slick', JSON.stringify( {...slickAttributes} ) )
                }
                $( this ).find( '.js-slick-carousel' ).slick();
            }
        } )
    }

    $('[data-ride="bk-slick-carousel"]').each( function() {
        var $slick_target = false;

        if ( $(this).data( 'slick' ) !== 'undefined' && $(this).find( $(this).data( 'wrap' ) ).length > 0 ) {
            $slick_target = $(this).find( $(this).data( 'wrap' ) );
            $slick_target.data( 'slick', $(this).data( 'slick' ) );
        } else if ( $(this).data( 'slick' ) !== 'undefined' && $(this).is( $(this).data( 'wrap' ) ) ) {
            $slick_target = $(this);
        }

        if( $slick_target ) {
            $slick_target.slick();
        }
    });

} )( jQuery, window );
