import React from 'react';

export default function AccessibilityHelper() {
  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {/* This region is for screen readers to announce changes and progress */}
      Accessibility features enabled.
    </div>
  );
}
