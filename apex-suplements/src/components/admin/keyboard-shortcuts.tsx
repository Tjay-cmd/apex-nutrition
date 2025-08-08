"use client";

import React, { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onToggleBulkSelection: () => void;
  onToggleFilters: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onSearch: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onSelectAll,
  onDeselectAll,
  onToggleBulkSelection,
  onToggleFilters,
  onExport,
  onRefresh,
  onSearch
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      // Ctrl/Cmd + key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'a':
            event.preventDefault();
            onSelectAll();
            break;
          case 'd':
            event.preventDefault();
            onDeselectAll();
            break;
          case 'b':
            event.preventDefault();
            onToggleBulkSelection();
            break;
          case 'f':
            event.preventDefault();
            onToggleFilters();
            break;
          case 'e':
            event.preventDefault();
            onExport();
            break;
          case 'r':
            event.preventDefault();
            onRefresh();
            break;
          case 'k':
            event.preventDefault();
            onSearch();
            break;
        }
      }

      // Escape key
      if (event.key === 'Escape') {
        // Close any open modals or dropdowns
        const modals = document.querySelectorAll('[data-modal]');
        modals.forEach(modal => {
          const closeButton = modal.querySelector('[data-close]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSelectAll, onDeselectAll, onToggleBulkSelection, onToggleFilters, onExport, onRefresh, onSearch]);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;