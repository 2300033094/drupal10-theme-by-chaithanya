/**
 * @file
 * Drupal 10 Theme JavaScript functionality.
 */

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.drupal10Theme = {
    attach: function (context, settings) {
      initActivityTabs(context);
      initHeroSlider(context);
      initResponsiveNav(context);
      initScrollEffects(context);
      initColorCustomization(context);
      initSmoothScrolling(context); // Ensure anchor scroll
    }
  };

  function initActivityTabs(context) {
    $('.activity-tab-header', context).once('activity-tabs').on('click', function () {
      const $tab = $(this).closest('.activity-tab');
      const $allTabs = $tab.siblings('.activity-tab').addBack();

      $allTabs.removeClass('active');
      $tab.addClass('active');

      $allTabs.find('.activity-tab-content').slideUp(200);
      $tab.find('.activity-tab-content').slideDown(200);
    });

    $('.activity-tab', context).first().addClass('active');
    $('.activity-tab.active .activity-tab-content', context).show();
  }

  function initHeroSlider(context) {
    const $slider = $('.hero-slider', context);
    if ($slider.length && $slider.children().length > 1) {
      $slider.once('hero-slider').each(function () {
        const $this = $(this);
        const slides = $this.children('.hero-slide');
        let currentSlide = 0;
        const slideCount = slides.length;

        slides.hide().first().show();

        const $dots = $('<div class="slider-dots" role="tablist" aria-label="Hero Slider Controls"></div>');
        for (let i = 0; i < slideCount; i++) {
          const $dot = $('<span class="dot" role="tab" tabindex="0" aria-selected="false" data-slide="' + i + '"></span>');
          $dots.append($dot);
        }
        $this.append($dots);

        function updateDots() {
          $dots.find('.dot')
            .removeClass('active')
            .attr('aria-selected', 'false')
            .eq(currentSlide).addClass('active')
            .attr('aria-selected', 'true');
        }

        updateDots();

        $dots.on('click keypress', '.dot', function (e) {
          if (e.type === 'click' || (e.type === 'keypress' && (e.which === 13 || e.which === 32))) {
            const targetSlide = $(this).data('slide');
            if (targetSlide !== currentSlide) {
              slides.eq(currentSlide).fadeOut(300);
              slides.eq(targetSlide).fadeIn(300);
              currentSlide = targetSlide;
              updateDots();
            }
          }
        });

        setInterval(() => {
          const nextSlide = (currentSlide + 1) % slideCount;
          slides.eq(currentSlide).fadeOut(300);
          slides.eq(nextSlide).fadeIn(300);
          currentSlide = nextSlide;
          updateDots();
        }, 5000);
      });
    }
  }

  function initResponsiveNav(context) {
    const $nav = $('.navigation-section', context);

    if (!$nav.find('.mobile-menu-toggle').length) {
      $nav.prepend(`
        <button class="mobile-menu-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="main-menu">
          <span></span><span></span><span></span>
        </button>
      `);
    }

    $('.mobile-menu-toggle', context).once('mobile-nav').on('click', function () {
      const $btn = $(this);
      $btn.toggleClass('active');

      const isOpen = $btn.hasClass('active');
      $btn.attr('aria-expanded', isOpen);

      $nav.find('.navbar-nav').slideToggle(250).attr('aria-hidden', !isOpen);
    });

    $(window).resize(function () {
      if ($(window).width() > 768) {
        $nav.find('.navbar-nav').show().attr('aria-hidden', false);
        $('.mobile-menu-toggle').removeClass('active').attr('aria-expanded', false);
      } else {
        if (!$('.mobile-menu-toggle').hasClass('active')) {
          $nav.find('.navbar-nav').hide().attr('aria-hidden', true);
        }
      }
    });
  }

  function initScrollEffects(context) {
    $(window).once('scroll-effects').on('scroll', function () {
      const scrollTop = $(this).scrollTop();

      // Sticky header
      if (scrollTop > 100) {
        $('.header-section').addClass('sticky');
      } else {
        $('.header-section').removeClass('sticky');
      }

      // Parallax
      $('.hero-section').css('transform', 'translateY(' + (scrollTop * 0.5) + 'px)');

      // Fade-in
      $('.activity-section, .features-section').each(function () {
        const $this = $(this);
        const elementTop = $this.offset().top;
        const windowBottom = scrollTop + $(window).height();

        if (elementTop < windowBottom - 100) {
          $this.addClass('fade-in');
        }
      });
    });
  }

  function initColorCustomization(context) {
    if (drupalSettings.drupal10Theme && drupalSettings.drupal10Theme.primaryColor) {
      $(':root').css('--primary-color', drupalSettings.drupal10Theme.primaryColor);
    }
  }

  function initSmoothScrolling(context) {
    $('a[href^="#"]', context).once('smooth-scroll').on('click', function (e) {
      const target = $(this.getAttribute('href'));
      if (target.length) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - 100
        }, 700);
      }
    });
  }

})(jQuery, Drupal);
