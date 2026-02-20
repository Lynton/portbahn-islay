// Documents
import canonicalBlock from './documents/canonicalBlock';
import faqCanonicalBlock from './documents/faqCanonicalBlock';
import guidePage from './documents/guidePage';

// Objects
import blockReference from './objects/blockReference';
import faqBlockReference from './objects/faqBlockReference';
// Note: contentSection removed - using flat contentBlocks + faqBlocks structure

// Collections
import property from './collections/property';
import beach from './collections/beach';
import distillery from './collections/distillery';
import walk from './collections/walk';
import village from './collections/village';

// Singletons
import homepage from './singletons/homepage';
import aboutPage from './singletons/aboutPage';
import accommodationPage from './singletons/accommodationPage';
import gettingHerePage from './singletons/gettingHerePage';
import contactPage from './singletons/contactPage';
import faqPage from './singletons/faqPage';
import beachesHubPage from './singletons/beachesHubPage';
import distilleriesHubPage from './singletons/distilleriesHubPage';
import walksHubPage from './singletons/walksHubPage';
import villagesHubPage from './singletons/villagesHubPage';
import exploreIslayPage from './singletons/exploreIslayPage';
import privacyPage from './singletons/privacyPage';
import termsPage from './singletons/termsPage';

// Settings
import siteSettings from './settings/siteSettings';

export const schemaTypes = [
  // Documents
  canonicalBlock,
  faqCanonicalBlock,
  guidePage,

  // Objects
  blockReference,
  faqBlockReference,

  // Collections
  property,
  beach,
  distillery,
  walk,
  village,

  // Singletons
  homepage,
  aboutPage,
  accommodationPage,
  gettingHerePage,
  contactPage,
  faqPage,
  beachesHubPage,
  distilleriesHubPage,
  walksHubPage,
  villagesHubPage,
  exploreIslayPage,
  privacyPage,
  termsPage,

  // Settings
  siteSettings,
];
