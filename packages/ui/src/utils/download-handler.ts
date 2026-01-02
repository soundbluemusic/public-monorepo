/**
 * @fileoverview Download Page Handler Script for SSG Apps
 * @environment universal
 *
 * This script handles download and preview button clicks via event delegation,
 * ensuring functionality works even when React hydration fails in SSG mode.
 *
 * @remarks
 * React Router v7 SSG mode has known hydration issues where React fibers
 * never attach to DOM elements. This script provides a fallback that
 * works independently of React.
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

  function togglePreview(format) {
    // Find the format card containing this button
    var cards = document.querySelectorAll('[data-format-card]');
    cards.forEach(function(card) {
      var cardFormat = card.getAttribute('data-format-card');
      var preview = card.querySelector('[data-preview-panel]');
      var previewBtn = card.querySelector('[data-action="preview"]');

      if (cardFormat === format) {
        // Toggle this card's preview
        var isHidden = !preview || preview.hasAttribute('hidden') || preview.style.display === 'none';
        if (preview) {
          if (isHidden) {
            preview.removeAttribute('hidden');
            preview.style.display = '';
          } else {
            preview.setAttribute('hidden', '');
            preview.style.display = 'none';
          }
        }
        // Update button styling would be complex - React will handle it if hydration works
      }
    });
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
      // For preview, we let the click through to React if it works
      // But also try to toggle preview directly
      // This is a fallback - if React hydration works, React will handle it
      // If not, this provides basic functionality
      e.preventDefault();
      e.stopPropagation();
      togglePreview(format);
    }
  }, true); // Use capture phase to handle before React
})();`;
