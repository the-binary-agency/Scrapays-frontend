/*
  * @package Bizcraft
  * @subpackage Bizcraft HTML
  * 
  * Template Scripts
  * Created by Tripples
  
   1.    Style Switcher
   2.    Navigation
   3.    Fixed Header
   4.    Main Slideshow (Carousel)
   5.    Counter
   6.    Owl Carousel
   7.    Flex Slider
   8.    Wow Animation
   10.   Video Background
   11.   Back To Top

  
*/


jQuery(function ($) {
  'use strict';


  /* ----------------------------------------------------------- */
  /*  Style Switcher
  /* ----------------------------------------------------------- */
  $(document).ready(function () {
    $('.style-switch-button').click(function () {
      $('.style-switch-wrapper').toggleClass('active');
    });
    $('a.close-styler').click(function () {
      $('.style-switch-wrapper').removeClass('active');
    });
  });



  /* ----------------------------------------------------------- */
  /*  Fixed header
  /* ----------------------------------------------------------- */

  $(window).on('scroll', function () {

    if ($(window).scrollTop() > 100) {

      $('.header').addClass('header-solid animated fadeInDown');
    } else {

      $('.header').removeClass('header-solid animated fadeInDown');

    }

  });

  $(window).on('scroll', function () {

    if ($(window).scrollTop() > 200) {

      $('.header2').addClass('header-bgnone animated fadeInDown');
    } else {

      $('.header2').removeClass('header-bgnone animated fadeInDown');

    }

  });



  /* ----------------------------------------------------------- */
  /*  Main slideshow
  /* ----------------------------------------------------------- */

  /* Home 2 */

  $( '.flexSlideshow' ).flexslider( {
    pause: false,
    slideshowSpeed: 4000,
    animationSpeed: 600
  });

  /* Home 3 and 4 */

  $('#main-slide').carousel({
    pause: false,
    interval: 4000,
  });


  /* ----------------------------------------------------------- */
  /*  Counter
  /* ----------------------------------------------------------- */

  $('.counter').counterUp({
    delay: 10,
    time: 1000
  });



  /* ----------------------------------------------------------- */
  /*  Owl Carousel
  /* ----------------------------------------------------------- */


  //Testimonial

  $('#testimonial-carousel').owlCarousel({

    navigation: false, // Show next and prev buttons
    slideSpeed: 600,
    pagination: true,
    singleItem: true

  });

  // Custom Navigation Events
  var owl = $('#testimonial-carousel');


  // Custom Navigation Events
  $('.next').click(function () {
    owl.trigger('owl.next');
  });
  $('.prev').click(function () {
    owl.trigger('owl.prev');
  });
  $('.play').click(function () {
    owl.trigger('owl.play', 1000); //owl.play event accept autoPlay speed as second parameter
  });
  $('.stop').click(function () {
    owl.trigger('owl.stop');
  });


  //Clients

  $('#client-carousel').owlCarousel({

    navigation: false, // Show next and prev buttons
    slideSpeed: 400,
    pagination: false,
    items: 5,
    rewindNav: true,
    itemsDesktop: [1199, 3],
    itemsDesktopSmall: [979, 3],
    stopOnHover: true,
    autoPlay: true

  });

  //App gallery
  $('#app-gallery-carousel').owlCarousel({

    navigation: false, // Show next and prev buttons
    slideSpeed: 400,
    pagination: true,
    items: 4,
    rewindNav: true,
    itemsDesktop: [1199, 3],
    itemsDesktopSmall: [979, 3],
    stopOnHover: true
  });

  $('.projects-carousel').owlCarousel({
    autoPlay: true,
    navigation: true,
    loop: true,
    margin: 10,
    responsiveClass: true,
    responsive:{
      0:{
        items:2,
        nav:true
      },
      400:{
        items:2,
        nav:false
      },
      768:{
        items:3,
        nav:true,
      }
    }
  } );
  
  $( '.owl-carousel' ).owlCarousel( {
    autoplay:true,
    autoplayTimeout:1000,
    loop:true,
    margin:10,
    nav:true,
    responsiveClass:true,
    responsive:{
      0:{
        items:2,
        loop:true,
        nav:true
      },
      480:{
        items:3,
        loop:true,
        nav:true
      },
      768:{
        items:3,
        loop:true,
        nav:true,
      }
    }
  });

  /* ----------------------------------------------------------- */
  /*  Flex slider
  /* ----------------------------------------------------------- */

  //Second item slider
  $('.flexSlideshow').flexslider({
    animation: 'fade',
    controlNav: false,
    directionNav: true,
    slideshowSpeed: 8000
  });

  //Portfolio item slider
  $(window).load(function () {
    $('.flexportfolio').flexslider({
      animation: 'fade',
      controlNav: false,
      directionNav: true,
      slideshowSpeed: 8000
    });
  });


  /* ----------------------------------------------------------- */
  /*  Animation
  /* ----------------------------------------------------------- */
  //Wow
  new WOW().init();


  /* ----------------------------------------------------------- */
  /*  Prettyphoto
  /* ----------------------------------------------------------- */

  // $('a[data-rel^=\'prettyPhoto\']').prettyPhoto();


  /* ----------------------------------------------------------- */
  /* Video background
  /* ----------------------------------------------------------- */

  var resizeVideoBackground = function () {

    $('.video-background').each(function (i, el) {
      var $el = $(el),
        $section = $el.parent(),
        min_w = 300,
        video_w = 16,
        video_h = 9,
        section_w = $section.outerWidth(),
        section_h = $section.outerHeight(),
        scale_w = section_w / video_w,
        scale_h = section_h / video_h,
        scale = scale_w > scale_h ? scale_w : scale_h,
        new_video_w, new_video_h, offet_top, offet_left;


      if (scale * video_w < min_w) {
        scale = min_w / video_w;
      }

      new_video_w = scale * video_w;
      new_video_h = scale * video_h;
      offet_left = (new_video_w - section_w) / 2 * -1;
      offet_top = (new_video_h - section_h) / 2 * -1;

      $el.css('width', new_video_w);
      $el.css('height', new_video_h);
      $el.css('marginTop', offet_top);
      $el.css('marginLeft', offet_left);
    });

  };

  $(window).on('resize', function () {
    resizeVideoBackground();
  });

  resizeVideoBackground();

  /* ----------------------------------------------------------- */
  /*  Back to top
  /* ----------------------------------------------------------- */

  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  });
  // scroll body to 0px on click
  $('#back-to-top').click(function () {
    $('#back-to-top').tooltip('hide');
    $('body,html').animate({
      scrollTop: 0
    }, 800);
    return false;
  });

  $('#back-to-top').tooltip('hide');


  /* ----------------------------------------------------------- */
  /*  Custom Js
  /* ----------------------------------------------------------- */


  var images = ['home-scrap-carousel-6.png', 'home-scrap-carousel-3.png', 'home-scrap-carousel-7.png', 'home-scrap-carousel-1.png', 'home-scrap-carousel-2.png', 'home-scrap-carousel-4.png', 'home-scrap-carousel-5.png'];
  $(function () {
    var i = 0;
    $('#dvImage').css('background-image', 'url(assets/images/carousels/' + images[i] + ')');
    setInterval(function () {
      i++;
      if (i == images.length) {
        i = 0;
      }
      $('#dvImage').fadeOut('slow', function () {
        $(this).css('background-image', 'url(assets/images/carousels/' + images[i] + ')');
        $(this).fadeIn('slow');
      });
    }, 5000);
  });

  $( '#loginModalToggler' ).click( function () {
    $( '#loginModal' ).show();
  } );
  $( '.loginModalCloser' ).click( function () {
    $( '#loginModal' ).hide();
  } );

  $( '#signupModalToggler' ).click( function () {
    $( '#signupModal' ).show();
  } );
  $( '.signupModalCloser' ).click( function () {
    $( '#signupModal' ).hide();
  } );

  $( '.notificationsModalToggler' ).click( function () {
    $( '.notificationsModal' ).show();
  } );
  $( '.notificationsModalCloser' ).click( function () {
    $( '#notificationsModal' ).hide();
  } );
  $( '.notificationsModalCloser2' ).click( function () {
    $( '#notificationsModal' ).hide();
  } );
  $( '.notificationsModalCloser3' ).click( function () {
    $( '#notificationsModal' ).hide();
  } );

  $( '.modal-link' ).click( function () {
    $( '#loginModal' ).hide();
    $( '#signupModal' ).hide();
  });

  $( window ).click( function ( event ){
    if ( '#' + event.target.id == $( '#loginModal' ).selector || '#' + event.target.id == $( '#signupModal' ).selector || '#' + event.target.id == $( '#notificationsModal' ).selector ) {
      $( '#loginModal' ).hide();
      $( '#signupModal' ).hide();
      $( '#notificationsModal' ).hide();
    }
  });

} );