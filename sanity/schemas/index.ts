// Documents
import canonicalBlock from './documents/canonicalBlock';
import faqCanonicalBlock from './documents/faqCanonicalBlock';
import guestReview from './documents/guestReview';
import guidePage from './documents/guidePage';
import keyFactSet from './documents/keyFactSet';
import { siteEntity } from './documents/siteEntity';

// Objects
import blockReference from './objects/blockReference';
import faqBlockReference from './objects/faqBlockReference';

// Collections
import property from './collections/property';

// Singletons — shared
import homepage from './singletons/homepage';
import aboutPage from './singletons/aboutPage';
import accommodationPage from './singletons/accommodationPage';
import gettingHerePage from './singletons/gettingHerePage';
import contactPage from './singletons/contactPage';
import exploreIslayPage from './singletons/exploreIslayPage';
import privacyPage from './singletons/privacyPage';
import termsPage from './singletons/termsPage';

// Singletons — BJR-specific
import exploreJuraPage from './singletons/exploreJuraPage';
import faqPage from './singletons/faqPage';
import collaboratePage from './singletons/collaboratePage';

// Settings
import siteSettings from './settings/siteSettings';

export const schemaTypes = [
  // Documents
  canonicalBlock,
  faqCanonicalBlock,
  guestReview,
  guidePage,
  keyFactSet,
  siteEntity,

  // Objects
  blockReference,
  faqBlockReference,

  // Collections
  property,

  // Singletons — shared
  homepage,
  aboutPage,
  accommodationPage,
  gettingHerePage,
  contactPage,
  exploreIslayPage,
  privacyPage,
  termsPage,

  // Singletons — BJR-specific
  exploreJuraPage,
  faqPage,
  collaboratePage,

  // Settings
  siteSettings,
];
