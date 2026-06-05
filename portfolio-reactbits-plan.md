# React Bits Component Plan
## Amrit Podder Portfolio — reactbits.dev

Strategic mapping of React Bits components across all pages.
Only components that genuinely serve the design are used — no decorative noise.

---

## Full React Bits Component Inventory (Relevant Subset)

### Text Animations
| Component | Effect |
|-----------|--------|
| Split Text | Splits text into chars/words, each animates independently |
| Blur Text | Text blurs in from invisible to sharp |
| Shiny Text | Shimmering light sweep across text |
| Gradient Text | Animated gradient colour shift on text |
| Glitch Text | Digital glitch distortion |
| Scramble Text / Decrypted Text | Random chars → real text reveal |
| Variable Proximity | Font weight/size shifts as cursor moves near |
| True Focus | Surrounding words blur, hovered word sharpens |
| Typewriter | Classic character-by-character reveal |
| Word Rotate | Words flip/rotate to cycle through list |
| Circular Text | Text laid out along a circular path |
| Falling Text | Characters fall into position |

### Backgrounds
| Component | Effect |
|-----------|--------|
| Aurora | Soft, shifting aurora borealis colour bands |
| Threads | Flowing silk-like thread lines, mouse-reactive |
| Silk | Smooth iridescent gradient fluid |
| Beams | Light beam streaks |
| Letter Glitch | Background filled with glitching characters |
| Hyperspeed | Warp-speed star tunnel |
| Grid / Dot Grid | Animated grid or dot pattern |
| Orb | Glowing floating orb |
| Noise | Film grain / noise texture overlay |
| Meteors | Shooting star streaks |
| Ballpit | Physics-based bouncing balls |

### Components & Effects
| Component | Effect |
|-----------|--------|
| Magnet | Element magnetically pulls toward cursor |
| Spotlight Card | Torch-light spotlight follows cursor inside card |
| Tilt Card | Card tilts in 3D toward cursor |
| Animated Beam | SVG beam connecting two elements |
| Animated List | List items reveal with staggered animation |
| Stack Cards | Cards stack/unstack driven by scroll |
| Scroll Stack | Elements stack as page scrolls |
| Infinite Scroll (Marquee) | Seamless looping horizontal strip |
| Image Trail | Images spawn and trail cursor movement |
| Masonry | Responsive masonry photo grid |
| Count Up | Animated number counter |
| Pixel Transition | Pixel-dissolve page transition |
| Splash Cursor | Liquid ink-splash cursor effect |
| Blob Cursor | Soft blob follows cursor |
| StarBorder | Animated orbiting star border on element |
| Flowing Menu | Navigation with fluid hover wave |
| Expandable Card | Card expands on click to reveal more |
| Flip Card | 3D flip to show reverse side |
| Glass Icons | Frosted glass icon badges |
| Ribbon | Decorative corner ribbon |
| Elastic Slider | Rubber-band physics slider |

---

## Page-by-Page Assignments

---

### Loading Screen
*No React Bits here — custom DrawSVG "hello." animation owns this moment entirely.*
React Bits would dilute the Apple-inspired purity of a single traced word.

---

### Landing — Hero
| Component | Placement | Why |
|-----------|-----------|-----|
| **Aurora** | Full-screen background | Replaces HLS video — deep dark aurora (navy/blue tones) sets the premium mood without bandwidth cost. Can overlay subtly behind video too. |
| **Splash Cursor** | Sitewide from hero onward | Liquid ink splash on click — immediately signals this is a crafted, interactive experience |
| **Split Text** | "Amrit Podder" headline | Each character animates in with custom easing on load |
| **Scramble Text** | WHO / WHAT / IMPACT labels | Small muted labels scramble → reveal: "FRONTEND LEAD", "REACT · SHOPIFY · NEXTJS" etc. |
| **Variable Proximity** | Tagline: "Turning pixels into products" | Font weight shifts dynamically as cursor moves near — subtle, sophisticated |
| **Magnet** | Both CTA buttons | "See Work" and "About Me" buttons magnetically pull toward cursor |
| **Shiny Text** | "@ NetBramha" WHERE line | Light sweep across the company name — draws the eye to current role |
| **Infinite Scroll** | Tech stack marquee strip below hero | Logos/names of React · Shopify · NextJS · PHP · Three.js scroll seamlessly |

---

### Landing — Stats Strip
| Component | Placement | Why |
|-----------|-----------|-----|
| **Count Up** | 8+ · 40+ · 98% · 8 | Numbers count from 0 on scroll-enter — satisfying, proves the numbers |
| **Spotlight Card** | Each stat block | Cursor torch highlights the stat you're looking at |

---

### Landing — Featured Projects Teaser
| Component | Placement | Why |
|-----------|-----------|-----|
| **Stack Cards** | 3 featured project cards | Cards stack on top of each other, scroll to reveal each one |
| **Magnet** | "View all work →" button | Subtle pull toward the CTA |

---

### Landing — Football Teaser Strip
| Component | Placement | Why |
|-----------|-----------|-----|
| **Glitch Text** | "MIA SAN MIA" or "⚽ FOOTBALL" | Brief glitch effect on the Bayern red text — raw, punchy |
| **Threads** | Strip background | Flowing red/white threads evoke Bayern colours subtly |

---

### About Page `/about` — Glassmorphism
| Component | Placement | Why |
|-----------|-----------|-----|
| **Blur Text** | Bio paragraphs | Each paragraph blurs in as it enters viewport — editorial feel |
| **True Focus** | Section headings (Skills · Experience · Education) | Surrounding text softens, heading sharpens on scroll — guides attention |
| **Spotlight Card** | Every skill card | Cursor torch illuminates individual skill cards in the frosted grid |
| **Animated List** | Career timeline entries | Each role slides/fades in sequentially as timeline draws |
| **Tilt Card** | Certification cards | 3D tilt on hover — makes flat certs feel tangible |
| **Glass Icons** | Skill category icons | Frosted glass icon badge per category (Frontend / Backend / Design / Tools) |
| **Count Up** | "8+ Years" in bio hero | Counts up when section loads |
| **Circular Text** | Optional: around profile photo placeholder | "Frontend Lead · Bayern Fan · Photographer ·" rotating around avatar |

---

### Work Grid `/work` — Bento
| Component | Placement | Why |
|-----------|-----------|-----|
| **Spotlight Card** | All 8 project cards | The single best component for a dark portfolio — cursor torch on each card |
| **Magnet** | Each card's "View project →" label | Pull toward the action |
| **Shiny Text** | Project titles on cards | Light sweep on the title makes each card feel premium |
| **Infinite Scroll** | Bottom strip: client logos | Unilever · Wipro · Langoor · NetBramha |
| **StarBorder** | Featured/flagship card (Ponds India) | Animated orbiting star border to highlight the hero project |

---

### Project Detail `/work/:slug` — Clean/Editorial
| Component | Placement | Why |
|-----------|-----------|-----|
| **Animated Beam** | Process step connectors | SVG beam draws between Step 1 → Step 2 → Step 3 as you scroll |
| **Count Up** | Impact metrics (35% uplift, 98% retention) | Numbers animate in when the results section enters view |
| **Blur Text** | Long-form body copy | Paragraphs blur-in on scroll — reduces visual overwhelm on long reads |
| **Expandable Card** | "Tech deep dive" sections | Click to expand technical decision callouts |
| **Tilt Card** | Screenshot/mockup images | Mockups tilt in 3D — feels like holding the actual device |
| **Ribbon** | "Live Site" corner badge on cover | Red/accent ribbon: "LIVE ↗" |

---

### Football Page `/football` — Neobrutalism
| Component | Placement | Why |
|-----------|-----------|-----|
| **Letter Glitch** | Full-page background | Dense field of glitching characters behind hero — raw, chaotic energy |
| **Glitch Text** | "MIA SAN MIA" hero headline | The Bayern motto glitches into view — high impact |
| **Falling Text** | "Supporting since 2002" | Characters fall into place — like a scoreboard flipping |
| **Count Up** | Personal stats wall | "500+ Matches · 22 Years · 5am Wake-ups" all count up |
| **Spotlight Card** | Favourite moment cards | Torch cursor on match memory cards |
| **Flip Card** | Player highlight cards | Front: player photo/name. Back: why they matter to Amrit |
| **Threads** | Section dividers | Bayern red threads flow between sections |
| **Elastic Slider** | "Favourite Moments" gallery | Rubber-band physics — kinetic, sporty feel |
| **Magnet** | "Football × Code" CTA | Pull toward the personal essay |

---

### Photography Page `/photography` — Artistic
| Component | Placement | Why |
|-----------|-----------|-----|
| **Masonry** | Main photo grid | Native masonry layout from React Bits — responsive, elegant |
| **Image Trail** | Hero area | As cursor moves, recent photos spawn and trail it — immediately signals "this is a photo portfolio" |
| **Tilt Card** | Individual photos | 3D tilt makes each photo feel physical |
| **Blob Cursor** | Page-wide | Soft blob replaces Splash Cursor here — quieter, more gallery-appropriate |
| **Noise** | Subtle overlay | Film grain over the whole page — photographic, tactile |

---

### Contact Page `/contact` — Paper
| Component | Placement | Why |
|-----------|-----------|-----|
| **Magnet** | Email button + LinkedIn button | Strong magnetic pull — invites interaction |
| **Spotlight Card** | Main contact card | Warm torch light on the card |
| **Shiny Text** | "Let's build something" headline | Single light sweep — clean, confident |
| **Typewriter** | Availability status: "Open to new opportunities" | Types itself out — feels like a live signal |
| **StarBorder** | Email CTA button | Animated star orbit around the primary action |

---

## Summary Matrix

| Page | Text FX | Background | Components |
|------|---------|------------|-----------|
| Hero | Split, Scramble, Variable Proximity, Shiny | Aurora | Splash Cursor, Magnet ×2, Infinite Scroll |
| Stats | Count Up | — | Spotlight Card |
| Work Teaser | — | — | Stack Cards, Magnet |
| Football Teaser | Glitch | Threads | — |
| About | Blur, True Focus, Circular | — | Spotlight ×N, Animated List, Tilt, Glass Icons, Count Up |
| Work Grid | Shiny | — | Spotlight ×8, Magnet, StarBorder, Infinite Scroll |
| Project Detail | Blur | — | Animated Beam, Count Up, Expandable, Tilt, Ribbon |
| Football | Glitch, Falling, Count Up | Letter Glitch, Threads | Spotlight, Flip Card, Elastic Slider, Magnet |
| Photography | — | Noise | Masonry, Image Trail, Tilt, Blob Cursor |
| Contact | Shiny, Typewriter | — | Magnet ×2, Spotlight, StarBorder |

---

## Install Note
React Bits components are copy-paste (no npm package).
Each component is grabbed from reactbits.dev and placed in `src/components/reactbits/`.
Dependencies vary per component — most use Framer Motion or GSAP which are already installed.
Some need: `npm install @tauri-apps/api` (rare), most need nothing new.
