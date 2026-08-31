import type { Service } from "./types";

/**
 * The Service catalog: the single typed source of truth for everything the
 * UI sells. Prices and facts mirror the Square booking page as captured in
 * docs/research/square-booking-services.md — update Square first, then here.
 *
 * Descriptions are rewritten in the site's voice; every real fact from the
 * Square copy is preserved and the stale inline prices are not.
 */
export const services: Service[] = [
  {
    slug: "exterior-detail",
    name: "Exterior Detail",
    squareItemName: "Exterior Detail (Sedan / Mini SUV / Truck/Sprinter/SUV)",
    squareServiceId: null,
    pitch:
      "The standard wash and wax — swirl-free contact wash, ceramic sealant, dressed tires.",
    description: [
      "This is our standard wash and wax, done the way paint deserves. A high-alkaline foaming pre-rinse lifts the bulk of the dirt, road grime, and contaminants before anything touches the car, and a foamy shampoo makes the contact wash itself safe — a method that brings added swirls and scratches down to zero.",
      "We finish with a hydrophobic ceramic sealant: a sacrificial layer that boosts beading and shields the paint from UV rays and the elements. Applied monthly, it keeps your paint protected year-round.",
      "Wheels, tires, and wheel wells get their own wash. Your choice of matte or shiny tire shine. Crevices are air-dried with a blower, and the paint is hand-dried with 1300 GSM twisted-loop microfiber towels so nothing scratches when dragging across the finish.",
    ],
    included: [
      "Wheels, tires, and wheel wells washed",
      "High-alkaline foaming pre-rinse",
      "Safe two-stage contact wash — zero added swirls",
      "Hydrophobic ceramic sealant (UV + element protection)",
      "Matte or shiny tire shine",
      "Blower-dried crevices, hand-dried with 1300 GSM towels",
    ],
    duration: { minutes: 60, label: "50–60 min" },
    basePrice: 80,
    sizePrices: { sedan: 80, miniSuv: 90, truckSuv: 100 },
    largerVehiclesQuoted: false,
    related: ["clay-and-seal", "full-detail", "basic-wash"],
  },
  {
    slug: "interior-detail",
    name: "Interior Detail",
    squareItemName: "Interior Detail",
    squareServiceId: null,
    pitch:
      "Every surface cleaned, deep-vacuumed, and conditioned back to an OEM matte finish.",
    description: [
      "Our standard interior refresh. If you want every surface cleaned, a deep vacuum, and compressed air worked into the spots a vacuum can't reach, this is the one.",
      "We target the areas of highest impact — doors, dash, cup holders, pedals, steering wheel, vents — then apply a plastic and leather conditioner (where applicable) that restores an OEM-like matte finish and adds UV protection to prevent cracking.",
      "Vehicles with extra size, extra seats or rows, or in excessively dirty condition may be subject to an increased fee — text us and we'll quote it straight.",
    ],
    included: [
      "Every surface cleaned",
      "Deep vacuum + compressed air blow-out",
      "High-impact zones detailed: doors, dash, cup holders, pedals, steering wheel, vents",
      "Plastic and leather conditioner — OEM-like matte finish",
      "UV protection to prevent cracking",
    ],
    duration: { minutes: 105, label: "1 hr 45 min" },
    basePrice: 100,
    largerVehiclesQuoted: true,
    related: ["seat-carpet-shampoo", "full-detail", "maintenance-detail"],
  },
  {
    slug: "seat-carpet-shampoo",
    name: "Seat/Carpet Shampoo",
    squareItemName: "Seat/Carpet Shampoo",
    squareServiceId: null,
    pitch:
      "Steam, shampoo, and extraction for stains and odors — the deep clean for seats and carpet.",
    description: [
      "The Add-on to reach for when stains are the concern, or when it's been years since the seats were deep-cleaned.",
      "We use steam and carpet-cleaning shampoo, then extract — pulling the chemical back out along with the grime and neutralizing odors — to revive the seats and carpeting.",
    ],
    included: [
      "Steam treatment",
      "Carpet-cleaning shampoo",
      "Full extraction — no residue left behind",
      "Odor neutralization",
    ],
    duration: { minutes: 45, label: "45 min" },
    basePrice: 50,
    largerVehiclesQuoted: false,
    addOnFor: "interior-detail",
    related: ["interior-detail", "full-detail"],
  },
  {
    slug: "full-detail",
    name: "Full Detail",
    squareItemName: "Exterior Detail + Interior Detail",
    squareServiceId: null,
    pitch:
      "The complete option: our Exterior Detail and Interior Detail on the same visit.",
    description: [
      "The complete option. Your car gets our full Exterior Detail — pre-rinse, safe contact wash, ceramic sealant, dressed tires — and our full Interior Detail — every surface cleaned, deep vacuum, conditioner — in one visit.",
      "Pricing shown is for a standard sedan. Larger vehicles are quoted — text us your vehicle and we'll price it straight away.",
    ],
    included: [
      "Everything in the Exterior Detail",
      "Everything in the Interior Detail",
      "One visit, one transformed car",
    ],
    duration: { minutes: 180, label: "3 hr" },
    basePrice: 150,
    largerVehiclesQuoted: true,
    related: ["exterior-detail", "interior-detail", "clay-and-seal"],
  },
  {
    slug: "clay-and-seal",
    name: "Clay and Seal",
    squareItemName: "Clay and Seal",
    squareServiceId: null,
    pitch:
      "Decontaminate to glassy-smooth, then seal it — includes the full Exterior Detail.",
    description: [
      "This package includes the full Exterior Detail. If you've washed your car, run your hand across the paint, and felt sandpaper — this is the fix. The air carries specks of iron and other contaminants that bond to your paint as you drive; over time those ferrous deposits can rust, turn unsightly, and can't be removed except by mechanical polish or a repaint.",
      "We start with a chemical decontamination: iron remover dissolves the bulk of the embedded contamination. Then, depending on history, a clay bar (never been clayed) or a clay towel (newer paint) pulls out the rest — returning the paint to glassy-smooth, straight back to an OEM-like feel.",
      "We finish with a ceramic sealant rated to last 3–6 months. When you notice significantly less beading, that sacrificial layer is running low — time to clay again.",
    ],
    included: [
      "Full Exterior Detail included",
      "Iron remover chemical decontamination",
      "Clay bar or clay towel, matched to your paint's history",
      "Glassy-smooth, OEM-like finish",
      "Ceramic sealant rated 3–6 months",
    ],
    duration: { minutes: 120, label: "2 hr" },
    basePrice: 130,
    largerVehiclesQuoted: false,
    related: ["paint-enhancement", "exterior-detail", "full-detail"],
  },
  {
    slug: "paint-enhancement",
    name: "Paint Enhancement",
    squareItemName: "Paint Enhancement",
    squareServiceId: null,
    pitch: "A level above clay — machine gloss and clarity, minor defects removed.",
    description: [
      "A level higher than a clay bar, a step below a one-step paint correction. If your car frequents automatic car washes, its paint is carrying high amounts of swirls and scratches you can see in every light.",
      "This service restores clarity and gloss and removes minor defects, bringing the paint back to a place you'll be proud of. Most people who are curious about this one turn out to want exactly it.",
    ],
    included: [
      "Machine enhancement — above clay, below one-step correction",
      "Swirl and minor-defect reduction",
      "Restored clarity and gloss",
    ],
    duration: { minutes: 180, label: "3 hr" },
    basePrice: 250,
    largerVehiclesQuoted: false,
    related: ["clay-and-seal", "exterior-detail"],
  },
  {
    slug: "maintenance-detail",
    name: "Maintenance Detail",
    squareItemName: "Maintenance Detail",
    squareServiceId: null,
    pitch: "The monthly reset: hand wash, clean tires, dash wiped, carpets vacuumed.",
    description: [
      "The monthly reset between deep cleans. An exterior hand wash, tires cleaned, and inside: the dash wiped down, carpets blown out and vacuumed.",
      "This is not a deep clean — it's the habit that prolongs your paint and keeps the interior in condition, and we highly recommend it monthly.",
    ],
    included: [
      "Exterior hand wash",
      "Tires cleaned",
      "Dash wiped down",
      "Carpets blown out and vacuumed",
    ],
    duration: { minutes: 80, label: "1 hr 20 min" },
    basePrice: 75,
    largerVehiclesQuoted: false,
    related: ["basic-wash", "exterior-detail", "interior-detail"],
  },
  {
    slug: "basic-wash",
    name: "Basic Wash",
    squareItemName: "Basic Wash",
    squareServiceId: null,
    pitch: "Foaming pre-rinse and a careful hand wash — no protection applied.",
    description: [
      "A foaming pre-rinse and a careful hand wash. No paint protection is applied and wheels are not cleaned — this is the honest entry point, nothing more.",
      "We'll say it plainly: paint with zero protection ages faster. Having protection applied periodically prolongs the life of the paint against UV radiation and maintains the value of the car — when you're ready, the Exterior Detail is the upgrade.",
    ],
    included: [
      "Foaming pre-rinse",
      "Careful hand wash",
      "No wheels, no protection — the honest basics",
    ],
    duration: { minutes: 30, label: "30 min" },
    basePrice: 50,
    largerVehiclesQuoted: false,
    related: ["exterior-detail", "maintenance-detail"],
  },
];

/** The seven sellable Services (Add-ons excluded), in display order. */
export const sellableServices: Service[] = services.filter((s) => !s.addOnFor);

export function serviceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Add-ons sold on top of the given Service. */
export function addOnsFor(service: Service): Service[] {
  return services.filter((s) => s.addOnFor === service.slug);
}
