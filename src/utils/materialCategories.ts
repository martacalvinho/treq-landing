
export const MATERIAL_CATEGORIES = {
  "Flooring": [
    "Hardwood",
    "Laminate", 
    "Tile",
    "Carpet",
    "Vinyl",
    "Stone"
  ],
  "Paint": [
    "Interior Paint",
    "Exterior Paint",
    "Specialty Coatings"
  ],
  "Surfaces": [
    "Countertops",
    "Wall Panels",
    "Backsplashes", 
    "Cladding"
  ],
  "Hardware": [
    "Cabinet Hardware",
    "Door Hardware",
    "Window Hardware",
    "Locks",
    "Handles"
  ],
  "Lighting": [
    "Fixtures",
    "Bulbs / Lamps",
    "Controls / Switches"
  ],
  "Plumbing": [
    "Fixtures (sinks, faucets, toilets)",
    "Pipes / Fittings",
    "Accessories"
  ],
  "Glass & Glazing": [
    "Windows",
    "Shower Glass",
    "Specialty Glass"
  ],
  "Millwork / Carpentry": [
    "Built-ins",
    "Trim / Moulding",
    "Custom Joinery"
  ],
  "Stone": [
    "Natural Stone",
    "Engineered Stone",
    "Pavers"
  ],
  "Metalwork": [
    "Structural",
    "Decorative",
    "Railings"
  ],
  "Tile": [
    "Wall Tile",
    "Floor Tile",
    "Mosaic Tile"
  ],
  "Fabric / Textiles": [
    "Upholstery",
    "Curtains",
    "Wallcoverings"
  ],
  "Ceiling": [
    "Tiles",
    "Panels",
    "Treatments"
  ],
  "Wall Finishes": [
    "Plaster",
    "Wallpaper",
    "Specialty Finishes"
  ],
  "Exterior Materials": [
    "Siding / Cladding",
    "Roofing",
    "Decking",
    "Fencing"
  ]
} as const;

export type MaterialCategory = keyof typeof MATERIAL_CATEGORIES;
export type MaterialSubcategory = typeof MATERIAL_CATEGORIES[MaterialCategory][number];
