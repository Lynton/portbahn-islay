export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

/** Primary navigation — used by Header */
export const primaryNav: NavItem[] = [
  {
    label: 'Accommodation',
    href: '/accommodation',
    children: [
      { label: 'Portbahn House', href: '/accommodation/portbahn-house' },
      { label: 'Shorefield Eco House', href: '/accommodation/shorefield-eco-house' },
      { label: 'Curlew Cottage', href: '/accommodation/curlew-cottage' },
    ],
  },
  {
    label: 'Travel to Islay',
    href: '/travel-to-islay',
    children: [
      { label: 'Ferry to Islay', href: '/guides/ferry-to-islay' },
      { label: 'Flights to Islay', href: '/guides/flights-to-islay' },
      { label: 'Planning Your Trip', href: '/guides/planning-your-trip' },
    ],
  },
  {
    label: 'Availability',
    href: '/availability',
  },
  {
    label: 'Explore Islay',
    href: '/explore-islay',
    children: [
      { label: 'Whisky Distilleries', href: '/guides/islay-distilleries' },
      { label: 'Beaches', href: '/guides/islay-beaches' },
      { label: 'Wildlife & Birdwatching', href: '/guides/islay-wildlife' },
      { label: 'Family Holidays', href: '/guides/family-holidays' },
      { label: 'Food & Drink', href: '/guides/food-and-drink' },
    ],
  },
];

/** Footer navigation columns */
export const footerNav: FooterColumn[] = [
  {
    heading: 'Our Accommodation',
    links: [
      { label: 'Portbahn House', href: '/accommodation/portbahn-house' },
      { label: 'Shorefield Eco House', href: '/accommodation/shorefield-eco-house' },
      { label: 'Curlew Cottage', href: '/accommodation/curlew-cottage' },
    ],
  },
  {
    heading: 'Islay Guides',
    links: [
      { label: 'Check Availability', href: '/availability' },
      { label: 'Travel to Islay', href: '/travel-to-islay' },
      { label: 'Explore Islay', href: '/explore-islay' },
    ],
  },
];
