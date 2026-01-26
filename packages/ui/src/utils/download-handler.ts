/**
 * @fileoverview Download Page Handler Script for SSR Apps
 * @environment universal
 *
 * This script handles download and preview button clicks via event delegation,
 * ensuring functionality works even when React hydration fails.
 *
 * @remarks
 * React hydration can have issues where React fibers never attach to DOM elements.
 * This script provides a fallback that works independently of React.
 */

/**
 * Script to handle download page button clicks.
 * Should be placed at end of <body>.
 *
 * Uses event delegation with capture phase to intercept clicks
 * before React's event system (if it exists).
 *
 * Expects window.__downloadData to be set with:
 * - entries: Array of entry objects
 * - locale: 'en' | 'ko'
 */
export const DOWNLOAD_PAGE_SCRIPT = `(function() {
  'use strict';

  // Conversion functions (must match download.tsx)
  function toJSON(entries) {
    return JSON.stringify(entries, null, 2);
  }

  function toTXT(entries, locale) {
    var header = locale === 'ko'
      ? '한국어\\t로마자\\t번역\\t설명\\t카테고리\\t난이도'
      : 'Korean\\tRomanization\\tTranslation\\tExplanation\\tCategory\\tDifficulty';

    var rows = entries.map(function(entry) {
      var translation = entry.translations[locale];
      return [
        entry.korean,
        entry.romanization,
        translation.word,
        translation.explanation.replace(/\\n/g, ' '),
        entry.categoryId,
        entry.difficulty
      ].join('\\t');
    });

    return [header].concat(rows).join('\\n');
  }

  function toMarkdown(entries, locale) {
    var title = locale === 'ko' ? '# 한국어 어휘 목록\\n\\n' : '# Korean Vocabulary List\\n\\n';
    var tableHeader = locale === 'ko'
      ? '| 한국어 | 로마자 | 번역 | 설명 | 카테고리 | 난이도 |\\n|---|---|---|---|---|---|'
      : '| Korean | Romanization | Translation | Explanation | Category | Difficulty |\\n|---|---|---|---|---|---|';

    var rows = entries.map(function(entry) {
      var translation = entry.translations[locale];
      return '| ' + entry.korean + ' | ' + entry.romanization + ' | ' + translation.word + ' | ' +
        translation.explanation.replace(/\\n/g, ' ').replace(/\\|/g, '\\\\|') + ' | ' +
        entry.categoryId + ' | ' + entry.difficulty + ' |';
    });

    return title + tableHeader + '\\n' + rows.join('\\n');
  }

  function toCSV(entries, locale) {
    var header = locale === 'ko'
      ? 'ID,한국어,로마자,번역,설명,카테고리,난이도,품사,태그'
      : 'ID,Korean,Romanization,Translation,Explanation,Category,Difficulty,Part of Speech,Tags';

    function escapeCSV(str) {
      if (str.indexOf(',') !== -1 || str.indexOf('"') !== -1 || str.indexOf('\\n') !== -1) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    }

    var rows = entries.map(function(entry) {
      var translation = entry.translations[locale];
      return [
        entry.id,
        entry.korean,
        entry.romanization,
        escapeCSV(translation.word),
        escapeCSV(translation.explanation),
        entry.categoryId,
        entry.difficulty,
        entry.partOfSpeech,
        entry.tags.join(';')
      ].join(',');
    });

    return [header].concat(rows).join('\\n');
  }

  var FORMAT_INFO = {
    json: { extension: 'json', mimeType: 'application/json' },
    txt: { extension: 'txt', mimeType: 'text/plain' },
    md: { extension: 'md', mimeType: 'text/markdown' },
    csv: { extension: 'csv', mimeType: 'text/csv' }
  };

  function generateContent(format, entries, locale) {
    switch (format) {
      case 'json': return toJSON(entries);
      case 'txt': return toTXT(entries, locale);
      case 'md': return toMarkdown(entries, locale);
      case 'csv': return toCSV(entries, locale);
      default: return '';
    }
  }

  function triggerDownload(content, format, locale) {
    var info = FORMAT_INFO[format];
    if (!info) return;

    var blob = new Blob([content], { type: info.mimeType + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'context-vocabulary-' + locale + '.' + info.extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  var PREVIEW_COUNT = 3;
  var FORMAT_LABELS = {
    json: 'JSON',
    txt: 'TXT',
    md: 'Markdown',
    csv: 'CSV'
  };

  function showPreviewModal(format, entries, locale) {
    // Remove existing modal if any
    var existingModal = document.getElementById('download-preview-modal');
    if (existingModal) {
      existingModal.remove();
    }

    var sampleEntries = entries.slice(0, PREVIEW_COUNT);
    var previewContent = generateContent(format, sampleEntries, locale);
    var totalCount = entries.length;

    // Create modal overlay
    var modal = document.createElement('div');
    modal.id = 'download-preview-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);';

    // Get CSS variables for theming
    var computedStyle = getComputedStyle(document.documentElement);
    var bgPrimary = computedStyle.getPropertyValue('--bg-primary').trim() || '#ffffff';
    var bgSecondary = computedStyle.getPropertyValue('--bg-secondary').trim() || '#f5f5f5';
    var bgTertiary = computedStyle.getPropertyValue('--bg-tertiary').trim() || '#e5e5e5';
    var textPrimary = computedStyle.getPropertyValue('--text-primary').trim() || '#171717';
    var textSecondary = computedStyle.getPropertyValue('--text-secondary').trim() || '#525252';
    var textTertiary = computedStyle.getPropertyValue('--text-tertiary').trim() || '#737373';
    var borderPrimary = computedStyle.getPropertyValue('--border-primary').trim() || '#e5e5e5';
    var accentPrimary = computedStyle.getPropertyValue('--accent-primary').trim() || '#3b82f6';

    var labelText = locale === 'ko' ? '미리보기' : 'Preview';
    var sampleText = locale === 'ko'
      ? PREVIEW_COUNT + '개 샘플'
      : PREVIEW_COUNT + ' samples';
    var moreText = locale === 'ko'
      ? '외 ' + (totalCount - PREVIEW_COUNT) + '개 더...'
      : 'and ' + (totalCount - PREVIEW_COUNT) + ' more...';
    var closeText = locale === 'ko' ? '닫기' : 'Close';

    modal.innerHTML = '<div style="background:' + bgPrimary + ';border-radius:1rem;max-width:48rem;width:100%;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;border-bottom:1px solid ' + borderPrimary + ';">' +
        '<div style="display:flex;align-items:center;gap:0.75rem;">' +
          '<span style="font-weight:600;color:' + textPrimary + ';">' + FORMAT_LABELS[format] + ' ' + labelText + '</span>' +
          '<span style="font-size:0.75rem;padding:0.25rem 0.5rem;background:' + bgTertiary + ';border-radius:0.25rem;color:' + textTertiary + ';">' + sampleText + '</span>' +
        '</div>' +
        '<button id="close-preview-modal" type="button" style="padding:0.5rem;border-radius:0.5rem;border:none;background:transparent;cursor:pointer;color:' + textSecondary + ';" aria-label="' + closeText + '">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
        '</button>' +
      '</div>' +
      '<div style="flex:1;overflow:auto;padding:1rem;">' +
        '<pre style="margin:0;padding:1rem;background:' + bgTertiary + ';border-radius:0.5rem;font-size:0.75rem;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;white-space:pre-wrap;word-break:break-all;color:' + textSecondary + ';overflow-x:auto;">' + escapeHtml(previewContent) + '</pre>' +
      '</div>' +
      '<div style="padding:0.75rem 1.5rem;border-top:1px solid ' + borderPrimary + ';background:' + bgSecondary + ';border-radius:0 0 1rem 1rem;">' +
        '<p style="margin:0;font-size:0.75rem;color:' + textTertiary + ';">' + moreText + '</p>' +
      '</div>' +
    '</div>';

    document.body.appendChild(modal);

    // Set up event handlers after appending to DOM
    modal.setAttribute('tabindex', '-1');

    // Helper function to close modal and clean up handlers
    function closeModal() {
      var m = document.getElementById('download-preview-modal');
      if (m) {
        m.remove();
        document.removeEventListener('keydown', escapeHandler, true);
        document.removeEventListener('click', clickHandler, true);
      }
    }

    // Store keydown handler reference for cleanup
    function escapeHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }

    // Click handler for backdrop and close button
    function clickHandler(e) {
      var m = document.getElementById('download-preview-modal');
      if (!m) {
        document.removeEventListener('click', clickHandler, true);
        return;
      }

      // Check if clicked on close button or its children (svg, line elements)
      var target = e.target;
      var closeBtn = document.getElementById('close-preview-modal');
      if (closeBtn && (target === closeBtn || closeBtn.contains(target))) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
        return;
      }

      // Close if clicking directly on the modal backdrop (not inner content)
      if (target === m) {
        closeModal();
      }
    }

    // Register document-level handlers
    document.addEventListener('click', clickHandler, true);
    document.addEventListener('keydown', escapeHandler, true);

    modal.focus();
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('click', function(e) {
    // Check for download/preview buttons
    var btn = e.target.closest('button[data-action][data-format]');
    if (!btn) return;

    var action = btn.getAttribute('data-action');
    var format = btn.getAttribute('data-format');

    if (!action || !format) return;

    // Get data from window.__downloadData (embedded in the page)
    var data = window.__downloadData;
    if (!data || !data.entries || !data.entries.length) {
      console.error('[Download] No data available');
      return;
    }

    var entries = data.entries;
    var locale = data.locale || 'en';

    if (action === 'download') {
      // Prevent default and stop propagation
      e.preventDefault();
      e.stopPropagation();

      var content = generateContent(format, entries, locale);
      if (content) {
        triggerDownload(content, format, locale);
      }
    } else if (action === 'preview') {
      // Show preview in a modal popup
      e.preventDefault();
      e.stopPropagation();
      showPreviewModal(format, entries, locale);
    }
  }, true); // Use capture phase to handle before React
})();`;
