// Documents
import canonicalBlock from './documents/canonicalBlock';
import faqCanonicalBlock from './documents/faqCanonicalBlock';

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
import faqItem from './collections/faqItem';

// Singletons
import homepage from './singletons/homepage';
import aboutPage from './singletons/aboutPage';
import gettingHerePage from './singletons/gettingHerePage';
import contactPage from './singletons/contactPage';
import faqPage from './singletons/faqPage';
import beachesHubPage from './singletons/beachesHubPage';
import distilleriesHubPage from './singletons/distilleriesHubPage';
import walksHubPage from './singletons/walksHubPage';
import villagesHubPage from './singletons/villagesHubPage';
import islayGuidesIndexPage from './singletons/islayGuidesIndexPage';
import exploreIslayPage from './singletons/exploreIslayPage';
import privacyPage from './singletons/privacyPage';
import termsPage from './singletons/termsPage';

// Settings
import siteSettings from './settings/siteSettings';
import navigationSettings from './settings/navigationSettings';

export const schemaTypes = [
  // Documents
  canonicalBlock,
  faqCanonicalBlock,

  // Objects
  blockReference,
  faqBlockReference,

  // Collections
  property,
  beach,
  distillery,
  walk,
  village,
  faqItem,

  // Singletons
  homepage,
  aboutPage,
  gettingHerePage,
  contactPage,
  faqPage,
  beachesHubPage,
  distilleriesHubPage,
  walksHubPage,
  villagesHubPage,
  islayGuidesIndexPage,
  exploreIslayPage,
  privacyPage,
  termsPage,

  // Settings
  siteSettings,
  navigationSettings,
];
