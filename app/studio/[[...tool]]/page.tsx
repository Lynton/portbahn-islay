'use client';

import { NextStudio } from 'next-sanity/studio';
import { StyleSheetManager } from 'styled-components';
import config from '@/sanity.config';
import '../custom-styles.css';

// Filter out props that React 19 doesn't recognize on DOM elements
// This fixes the disableTransition prop warning from Sanity UI components
const shouldForwardProp = (prop: string) => {
  // Filter out disableTransition and other non-standard props that React 19 doesn't recognize
  const invalidProps = ['disableTransition'];
  return !invalidProps.includes(prop);
};

export default function StudioPage() {
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <NextStudio 
        config={config}
        unstable_globalStyles
      />
    </StyleSheetManager>
  );
}

