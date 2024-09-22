'use client';

import { useEffect } from 'react';
import mixpanel from 'mixpanel-browser';

const MixpanelTracker = ({ pageName }: { pageName?: string }) => {
  useEffect(() => {
    const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    if (mixpanelToken) {
      mixpanel.init(mixpanelToken);
      mixpanel.track('Page View', { page: pageName ?? 'Home' });
    }
  }, [pageName]);

  return null;
};

export default MixpanelTracker;