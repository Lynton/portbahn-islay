# PBI Critical Facts
**Source:** `/dev/CLAUDE.md` — extracted 2026-02-22
**Use:** These values must be used consistently in all content. Do not guess or approximate.

---

| Fact | Correct Value |
|------|---------------|
| Walk to Bruichladdich Distillery (Portbahn House) | 5 minutes |
| Walk to Bruichladdich Distillery (Shorefield Eco House) | 5 minutes |
| Walk to Bruichladdich Distillery (Curlew Cottage) | 10 minutes |
| Ferry to Port Askaig | 2 hours |
| Ferry to Port Ellen | 2 hours 20 minutes |
| Ferry booking window | 12 weeks in advance |
| Guests hosted | 600+ |
| Average rating | 4.97/5 |
| Communication rating | 5.0/5 |
| Distilleries on Islay | 10 |
| Barnacle geese on Islay (winter) | 30,000+ |
| Owner name spelling | Alan (not Allan) |
| Portbahn Beach walk | 5 minutes via war memorial path |
| Port Charlotte drive | 5 minutes |
| Port Charlotte walk | 40 minutes |

---

## Licence Status (all active — confirmed 2026-02-22)
| Property | Licence Ref | Status |
|----------|-------------|--------|
| Portbahn House | 230916-000028 | Active |
| Shorefield Eco House | 230916-000017 | Active |
| Curlew Cottage | AR02532F | Active |

---

## Property Names (canonical spelling)
- Portbahn House
- Shorefield Eco House
- Curlew Cottage
- Bothan Jura Retreat (BJR — not yet live)

## Routes (canonical — matches /dev)

### Canonical hubs
- `islay-travel/` — travel hub (spokes: ferry-to-islay, flights-to-islay, planning-your-trip, travelling-without-a-car, getting-around-islay, travelling-to-islay-with-your-dog, arriving-on-islay)
- `explore-islay/` — explore hub (spokes: distilleries, beaches, walks, wildlife, dog-friendly-islay, etc.)
- `accommodation/` — property hub

**Rule:** Any slug not matching a canonical hub or its spokes must redirect to the appropriate canonical hub. No orphan routes.

### Property pages
- `/accommodation/portbahn-house`
- `/accommodation/shorefield-eco-house`
- `/accommodation/curlew-cottage`

### Other routes
- `/travel-to-islay` — redirect to `islay-travel/` (legacy)
- `/getting-here` — redirect to `islay-travel/` (legacy)
- `/about-us` (redirect from `/about`) — on branch, not yet production
- `/contact` — on branch, not yet production

### Superseded
- `/guides/[slug]` — NOT in use. Do not reference.

---

## Transport & Local Services

### Taxis
| Operator | Phone | Notes |
|----------|-------|-------|
| Bruichladdich Taxis | 07899 942673 / 01496 850271 | Rhinns + island-wide |
| Attic Cabs | 07944 873323 | Island-wide |
| Full list | islayinfo.com/get-here/getting-around | Defer to this for completeness |

### Buses
| Route | Operator | Covers |
|-------|----------|--------|
| 450/451 | Islay Coaches | Portnahaven – Port Charlotte – Bruichladdich – Bowmore – Port Ellen – Ardbeg – Port Askaig |
| Timetable | argyll-bute.gov.uk | Current timetable: June 2025 – June 2026 |

### Bike Hire
| Operator | URL | Notes |
|----------|-----|-------|
| Islay Bike Hire | islay-bikehire.co.uk | Standard bikes |
| Islay E-Wheels | islayewheels.co.uk | E-bikes, Bosch system |
| Jura Cycles | juracycles.com | Jura-based; suits Port Askaig visitors |
| Islay Cycles | islaycycles.co.uk | Currently closed until further notice (as of early 2026) |

### Local Vet
| Detail | Value |
|--------|-------|
| Name | Beth Newman, Islay Vet |
| Address | 20 Shore St, Bowmore, Isle of Islay PA43 7LB |
| Phone | 01496 810205 |
| Note | Only vet on Islay |

### Cycling distances (confirmed)
| Route | Distance |
|-------|----------|
| Brodick to Lochranza (Arran) | 14 miles |
| Rhinns Loop (Bruichladdich–Port Charlotte–Portnahaven–return) | ~18 miles (verify) |
| Whisky Coast (Port Ellen–Ardbeg one way) | ~14 miles |

## Notes
- Curlew Cottage is a Bothan Jura Retreat property doing trust transfer (no guest reviews yet)
- "600+" is the live-site figure for guests hosted — used in trust-signals block and PropertyHostTrustTransfer component
- Jura ferry from Port Askaig: 5-minute crossing to Feolin
