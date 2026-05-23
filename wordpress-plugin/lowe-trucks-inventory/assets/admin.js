(function ($) {
  'use strict';

  function initLangTabs() {
    var $tabs = $('.lti-lang-tab');
    var $panels = $('.lti-lang-panel');
    if (!$tabs.length) return;

    $tabs.on('click', function () {
      var lang = $(this).data('lang');
      $tabs.removeClass('is-active');
      $panels.removeClass('is-active');
      $(this).addClass('is-active');
      $('[data-lang-panel="' + lang + '"]').addClass('is-active');
    });
  }

  function initGallery() {
    var $input = $('#lti_gallery_ids');
    var $preview = $('#lti-gallery-preview');
    var $pick = $('#lti-gallery-pick');
    var $clear = $('#lti-gallery-clear');
    if (!$input.length || !$pick.length) return;

    var frame;

    function renderPreview(ids) {
      $preview.empty();
      if (!ids.length) return;

      ids.forEach(function (id) {
        var attachment = wp.media.attachment(id);
        attachment.fetch().then(function () {
          var url = attachment.get('sizes') && attachment.get('sizes').thumbnail
            ? attachment.get('sizes').thumbnail.url
            : attachment.get('url');
          var $item = $('<div class="lti-gallery-item" data-id="' + id + '">');
          $item.append($('<img>', { src: url, alt: '' }));
          $item.append(
            $('<button type="button" class="lti-gallery-remove" aria-label="Remove">&times;</button>')
          );
          $preview.append($item);
        });
      });
    }

    function currentIds() {
      var raw = ($input.val() || '').trim();
      if (!raw) return [];
      return raw.split(',').map(function (v) { return parseInt(v, 10); }).filter(Boolean);
    }

    function setIds(ids) {
      $input.val(ids.join(','));
      renderPreview(ids);
    }

    $pick.on('click', function (e) {
      e.preventDefault();
      if (frame) {
        frame.open();
        return;
      }

      frame = wp.media({
        title: 'Product gallery',
        button: { text: 'Add to gallery' },
        multiple: true,
        library: { type: 'image' },
      });

      frame.on('select', function () {
        var selection = frame.state().get('selection');
        var ids = currentIds();
        selection.each(function (attachment) {
          var id = attachment.get('id');
          if (ids.indexOf(id) === -1) ids.push(id);
        });
        setIds(ids);
      });

      frame.open();
    });

    $clear.on('click', function (e) {
      e.preventDefault();
      setIds([]);
    });

    $preview.on('click', '.lti-gallery-remove', function () {
      var id = parseInt($(this).closest('.lti-gallery-item').data('id'), 10);
      setIds(currentIds().filter(function (v) { return v !== id; }));
    });

    renderPreview(currentIds());
  }

  $(function () {
    initLangTabs();
    initGallery();
  });
})(jQuery);
