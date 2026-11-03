/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BrandItem {
  id: string;
  name: string;
  category: 'new_brands' | 'staff_picks' | 'flower_farms' | 'edibles_more' | 'vapes';
  categoryLabel: string;
  description: string;
  location: string;
  tagline: string;
  specialty: string;
  organicCertified: boolean;
  labVerified: boolean;
  founded: string;
  signatureProducts: string[];
}

export interface MegaMenuColumn {
  title: string;
  categoryKey: BrandItem['category'];
  brands: { name: string; slug: string }[];
}

export const MEGA_MENU_DATA: MegaMenuColumn[] = [
  {
    title: 'NEW BRANDS!',
    categoryKey: 'new_brands',
    brands: [
      { name: 'Cosmic Concentrates', slug: 'cosmic-concentrates' },
      { name: 'HEX Extracts', slug: 'hex-extracts' },
      { name: 'Hippo', slug: 'hippo' },
    ],
  },
  {
    title: 'STAFF PICKS',
    categoryKey: 'staff_picks',
    brands: [
      { name: 'Alice', slug: 'alice' },
      { name: 'Boost', slug: 'boost' },
      { name: 'Grounded', slug: 'grounded' },
    ],
  },
  {
    title: 'FLOWER FARMS',
    categoryKey: 'flower_farms',
    brands: [
      { name: 'Albatross', slug: 'albatross' },
      { name: 'Cream of the Crop', slug: 'cream-of-the-crop' },
      { name: 'Hoot', slug: 'hoot' },
      { name: 'MuM’s Cannabis', slug: 'mums-cannabis' },
      { name: 'Lucky Farms', slug: 'lucky-farms' },
      { name: 'Jungle Ridge', slug: 'jungle-ridge' },
      { name: 'Frost Factory', slug: 'frost-factory' },
    ],
  },
  {
    title: 'EDIBLES & MORE',
    categoryKey: 'edibles_more',
    brands: [
      { name: 'Amazeballs', slug: 'amazeballs' },
      { name: 'Apollo Edibles', slug: 'apollo-edibles' },
      { name: 'Bliss', slug: 'bliss' },
      { name: 'Candy', slug: 'candy' },
      { name: 'Dames Gummy Co.', slug: 'dames-gummy-co' },
      { name: 'Euphoria Edibles', slug: 'euphoria-edibles' },
      { name: 'Euphoria Psychedelics', slug: 'euphoria-psychedelics' },
      { name: 'Faded Cannabis Co.', slug: 'faded-cannabis-co' },
      { name: 'Haven', slug: 'haven' },
      { name: 'Kootenay Labs', slug: 'kootenay-labs' },
      { name: 'Jacks', slug: 'jacks' },
      { name: 'kleerx', slug: 'kleerx' },
      { name: 'MOTA', slug: 'mota' },
    ],
  },
  {
    title: 'VAPES',
    categoryKey: 'vapes',
    brands: [
      { name: 'Burn', slug: 'burn' },
      { name: 'So High', slug: 'so-high' },
      { name: 'Sky High', slug: 'sky-high' },
      { name: 'Straight Goods', slug: 'straight-goods' },
    ],
  },
];

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  image: string;
  strainType: 'Sativa' | 'Indica' | 'Hybrid' | 'Broad Spectrum' | 'Isolate';
  thc: string;
  cbd: string;
  terpenes: string[];
  description: string;
  effects: string[];
  aroma: string;
  labBatch: string;
  origin: string;
}

export const CATEGORIES_DATA = [
  {
    id: 'flower',
    name: 'Premium Flower',
    slug: 'flower',
    count: '34 Varieties',
    description: 'Slow-cured, hand-trimmed whole botanical buds from licensed European craft growers.',
    image: '/src/assets/images/product_premium_flower_1793700802879.jpg',
  },
  {
    id: 'concentrates',
    name: 'Pure Concentrates',
    slug: 'concentrates',
    count: '18 Extractions',
    description: 'Solventless rosin, live resin, and diamond sauces preserving authentic terpene profiles.',
    image: '/src/assets/images/product_extract_concentrate_1793700803077.jpg',
  },
  {
    id: 'edibles',
    name: 'Artisanal Edibles',
    slug: 'edibles',
    count: '26 Formulations',
    description: 'Micro-dosed gourmet gummies, organic chocolates, and fruit pectin lozenges.',
    image: '/src/assets/images/product_premium_flower_1793700802879.jpg',
  },
  {
    id: 'vapes',
    name: 'Vaporizers & Pods',
    slug: 'vapes',
    count: '21 Devices',
    description: 'Medical-grade ceramic core hardware paired with pure single-origin botanical distillates.',
    image: '/src/assets/images/delivery_fleet_retail_1793700802596.jpg',
  },
  {
    id: 'tinctures',
    name: 'Tinctures & Drops',
    slug: 'tinctures',
    count: '15 Tinctures',
    description: 'Cold-pressed MCT-infused sublingual tinctures with precision metered dropper pipettes.',
    image: '/src/assets/images/hero_lab_testing_1793700802431.jpg',
  },
  {
    id: 'wellness',
    name: 'Botanical Topicals',
    slug: 'wellness',
    count: '12 Formulations',
    description: 'Therapeutic balms and transdermal creams enriched with arnica, menthol, and full-spectrum extracts.',
    image: '/src/assets/images/hero_cannabis_dispensary_1793700801902.jpg',
  },
];

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Albatross Gelato #33 Reserve',
    brand: 'Albatross',
    brandSlug: 'albatross',
    category: 'Premium Flower',
    categorySlug: 'flower',
    image: '/src/assets/images/product_premium_flower_1793700802879.jpg',
    strainType: 'Hybrid',
    thc: '24.2%',
    cbd: '< 0.5%',
    terpenes: ['Caryophyllene', 'Limonene', 'Linalool'],
    description: 'Hand-manicured dense calyxes with rich royal purple undertones. Delivers sweet citrus and earthy dessert aromas.',
    effects: ['Relaxed', 'Focused', 'Balanced'],
    aroma: 'Sweet berry, creamy vanilla, earthy pine',
    labBatch: 'DE-LAB-2026-9041',
    origin: 'Bavarian Alps Indoor Facility, Germany',
  },
  {
    id: 'prod-2',
    name: 'Cosmic Diamond Live Rosin',
    brand: 'Cosmic Concentrates',
    brandSlug: 'cosmic-concentrates',
    category: 'Pure Concentrates',
    categorySlug: 'concentrates',
    image: '/src/assets/images/product_extract_concentrate_1793700803077.jpg',
    strainType: 'Indica',
    thc: '78.5%',
    cbd: '1.2%',
    terpenes: ['Myrcene', 'Humulene', 'Pinene'],
    description: 'Solventless cold-cured live hash rosin pressed from ice water bubble hash. Preserves high monoterpene fractions.',
    effects: ['Deep Calming', 'Unwinding', 'Physical Ease'],
    aroma: 'Ripe mango, pungent fuel, herbal spice',
    labBatch: 'DE-LAB-2026-8812',
    origin: 'Berlin Precision Extraction Lab',
  },
  {
    id: 'prod-3',
    name: 'Frost Factory Polar Night Kush',
    brand: 'Frost Factory',
    brandSlug: 'frost-factory',
    category: 'Premium Flower',
    categorySlug: 'flower',
    image: '/src/assets/images/product_premium_flower_1793700802879.jpg',
    strainType: 'Indica',
    thc: '26.8%',
    cbd: '< 0.2%',
    terpenes: ['Beta-Myrcene', 'Bisabolol', 'Nerolidol'],
    description: 'Ultra-frosted trichome coverage with tight flower density. Cultivated under high-efficiency LED broad-spectrum lighting.',
    effects: ['Sedating', 'Euphoric Body Calm', 'Nighttime Rest'],
    aroma: 'Pine forest, fresh soil, subtle cedar',
    labBatch: 'DE-LAB-2026-7734',
    origin: 'Black Forest Cultivation Facility',
  },
  {
    id: 'prod-4',
    name: 'Straight Goods Live Resin Vape Cartridge',
    brand: 'Straight Goods',
    brandSlug: 'straight-goods',
    category: 'Vaporizers & Pods',
    categorySlug: 'vapes',
    image: '/src/assets/images/delivery_fleet_retail_1793700802596.jpg',
    strainType: 'Sativa',
    thc: '74.0%',
    cbd: '0.8%',
    terpenes: ['Terpinolene', 'Ocimene', 'Limonene'],
    description: 'Pristine full-spectrum extract in a 510-threaded medical grade porous ceramic cartridge. No botanical thinning agents.',
    effects: ['Uplifted', 'Creative Clarity', 'Daytime Energy'],
    aroma: 'Bright Meyer lemon, floral zest, herbal tea',
    labBatch: 'DE-LAB-2026-6190',
    origin: 'Munich Cleanroom Bottling',
  },
  {
    id: 'prod-5',
    name: 'Bliss Botanical Micro-Dose Pectin Drops',
    brand: 'Bliss',
    brandSlug: 'bliss',
    category: 'Artisanal Edibles',
    categorySlug: 'edibles',
    image: '/src/assets/images/product_premium_flower_1793700802879.jpg',
    strainType: 'Hybrid',
    thc: '5 mg/pc',
    cbd: '10 mg/pc',
    terpenes: ['Limonene', 'Linalool'],
    description: 'Vegan non-gelatin fruit pectin lozenges infused with water-soluble nano-emulsified broad-spectrum botanical cannabinoids.',
    effects: ['Gentle Mood Lift', 'Social Comfort', 'Zero Fog'],
    aroma: 'Wild raspberry, hibiscus tea, elderflower',
    labBatch: 'DE-LAB-2026-5521',
    origin: 'Hamburg Confectionery Apothecary',
  },
  {
    id: 'prod-6',
    name: 'Cream of the Crop Sour Tangie Heirloom',
    brand: 'Cream of the Crop',
    brandSlug: 'cream-of-the-crop',
    category: 'Premium Flower',
    categorySlug: 'flower',
    image: '/src/assets/images/product_premium_flower_1793700802879.jpg',
    strainType: 'Sativa',
    thc: '22.4%',
    cbd: '< 0.4%',
    terpenes: ['Valencene', 'Limonene', 'Caryophyllene'],
    description: 'Classic California heirloom genetics adapted to European organic soil greenhouse beds. Exuberant tangerine fragrance.',
    effects: ['Motivated', 'Social Ease', 'Vibrant Energy'],
    aroma: 'Mandarin peel, sour diesel, candied orange',
    labBatch: 'DE-LAB-2026-4418',
    origin: 'Rhineland Sunlight Greenhouse',
  },
  {
    id: 'prod-7',
    name: 'HEX Extracts Full Spectrum Amber Terp Sauce',
    brand: 'HEX Extracts',
    brandSlug: 'hex-extracts',
    category: 'Pure Concentrates',
    categorySlug: 'concentrates',
    image: '/src/assets/images/product_extract_concentrate_1793700803077.jpg',
    strainType: 'Hybrid',
    thc: '81.2%',
    cbd: '2.4%',
    terpenes: ['Farnesene', 'Myrcene', 'Geraniol'],
    description: 'High-terpene extract fraction layered with micro-crystallized cannabinoid facets. Exceptional viscosity and bouquet.',
    effects: ['Dynamic Euphoria', 'Sensory Depth', 'Relaxation'],
    aroma: 'Crushed pine needles, tropical fruit, black pepper',
    labBatch: 'DE-LAB-2026-3910',
    origin: 'Leipzig Analytical Center',
  },
  {
    id: 'prod-8',
    name: 'Burn All-Ceramic Terpene Pod 1.0ml',
    brand: 'Burn',
    brandSlug: 'burn',
    category: 'Vaporizers & Pods',
    categorySlug: 'vapes',
    image: '/src/assets/images/hero_lab_testing_1793700802431.jpg',
    strainType: 'Hybrid',
    thc: '76.8%',
    cbd: '1.5%',
    terpenes: ['Alpha-Pinene', 'Caryophyllene Oxide', 'Camphene'],
    description: 'Proprietary button-activated vapor pod engineered with lead-free biocompatible ceramic heating elements.',
    effects: ['Smooth Calming', 'Crisp Clarity', 'Fast Onset'],
    aroma: 'Earthy pine, spearmint, damp cedar',
    labBatch: 'DE-LAB-2026-2009',
    origin: 'Stuttgart Precision Hardware Tech',
  },
];

export const BRANDS_DIRECTORY: BrandItem[] = [
  // COLUMN 1: NEW BRANDS!
  {
    id: 'cosmic-concentrates',
    name: 'Cosmic Concentrates',
    category: 'new_brands',
    categoryLabel: 'New Brands!',
    location: 'Berlin, Germany',
    tagline: 'Pure Solventless Hash Rosin & Live Terpene Fractions',
    description: 'Pioneering ice-water solventless extraction in Germany. Cosmic Concentrates works exclusively with fresh-frozen whole-plant material harvested at peak trichome maturity.',
    specialty: 'Cold-Cure Live Hash Rosin, Terp Badder',
    organicCertified: true,
    labVerified: true,
    founded: '2024',
    signatureProducts: ['Cosmic Diamond Live Rosin', 'Zero-Solvent Papaya Badder'],
  },
  {
    id: 'hex-extracts',
    name: 'HEX Extracts',
    category: 'new_brands',
    categoryLabel: 'New Brands!',
    location: 'Leipzig, Germany',
    tagline: 'Scientific Hydrocarbon & Closed-Loop Precision Extractions',
    description: 'Engineered in state-of-the-art cleanroom laboratories, HEX Extracts focuses on preserving native terpene spectra with ultra-low thermal degradation.',
    specialty: 'High-Terpene Full Spectrum Sauce, Shatter',
    organicCertified: false,
    labVerified: true,
    founded: '2024',
    signatureProducts: ['Full Spectrum Amber Terp Sauce', 'Platinum Crumble'],
  },
  {
    id: 'hippo',
    name: 'Hippo',
    category: 'new_brands',
    categoryLabel: 'New Brands!',
    location: 'Munich, Germany',
    tagline: 'Playful Flavor Formulations & Modern Botanical Blends',
    description: 'Hippo brings a fresh, vibrant aesthetic to curated lifestyle botanicals, formulating balanced hybrid pre-rolls and natural fruit terpene infusions.',
    specialty: 'Infused Pre-Roll Packs, Tropical Formulations',
    organicCertified: true,
    labVerified: true,
    founded: '2025',
    signatureProducts: ['Hippo Tropical Sunrise Pre-Rolls', 'Hippo Berry Crunch'],
  },

  // COLUMN 2: STAFF PICKS
  {
    id: 'alice',
    name: 'Alice',
    category: 'staff_picks',
    categoryLabel: 'Staff Picks',
    location: 'Cologne, Germany',
    tagline: 'Harmonious Botanical Micro-Dosing & Functional Wellness',
    description: 'Curated by master herbalists, Alice integrates full-spectrum cannabinoids with adaptogenic mushrooms like Lion’s Mane and Reishi for cognitive balance.',
    specialty: 'Adaptogenic Tinctures, Micro-Dosed Mints',
    organicCertified: true,
    labVerified: true,
    founded: '2023',
    signatureProducts: ['Alice Clarity Sublingual Drops', 'Zenith Night Mints'],
  },
  {
    id: 'boost',
    name: 'Boost',
    category: 'staff_picks',
    categoryLabel: 'Staff Picks',
    location: 'Frankfurt, Germany',
    tagline: 'Clean Terpene Velocity & High-Efficiency Botanical Edibles',
    description: 'Boost is celebrated for consistent cannabinoid bioavailability and rapid gastric uptake using proprietary nano-emulsified liposomal carriers.',
    specialty: 'Rapid-Onset Fruit Chews, Focus Drops',
    organicCertified: true,
    labVerified: true,
    founded: '2022',
    signatureProducts: ['Boost Sour Watermelon Lozenges', 'Focus 10:1 Sativa Drops'],
  },
  {
    id: 'grounded',
    name: 'Grounded',
    category: 'staff_picks',
    categoryLabel: 'Staff Picks',
    location: 'Freiburg, Germany',
    tagline: 'Biodynamic Soil Cultivation & High-CBD Restorative Botanicals',
    description: 'Rooted in regenerative farming along the Rhine Valley, Grounded cultivates heirloom cultivars nurtured with compost tea and predatory beneficial insects.',
    specialty: 'Living Soil CBD Flowers, Calming Body Salves',
    organicCertified: true,
    labVerified: true,
    founded: '2021',
    signatureProducts: ['Grounded Regenerative Harlequin Flower', 'Deep Forest Arnica Balm'],
  },

  // COLUMN 3: FLOWER FARMS
  {
    id: 'albatross',
    name: 'Albatross',
    category: 'flower_farms',
    categoryLabel: 'Flower Farms',
    location: 'Bavarian Alps, Germany',
    tagline: 'High-Altitude Alpine Cultivation & Artisanal Cold Curing',
    description: 'Nestled in pristine alpine air, Albatross utilizes glacial water filtration and precision photoperiod LED arrays to nurture award-winning flower genetics.',
    specialty: 'Gelato #33 Reserve, Alpine White Truffle',
    organicCertified: true,
    labVerified: true,
    founded: '2020',
    signatureProducts: ['Albatross Gelato #33 Reserve', 'Alpine Silver Haze'],
  },
  {
    id: 'cream-of-the-crop',
    name: 'Cream of the Crop',
    category: 'flower_farms',
    categoryLabel: 'Flower Farms',
    location: 'Rhineland, Germany',
    tagline: 'Legacy Phenotype Hunting & Small-Batch Craft Canopies',
    description: 'Dedicated to cultivating only the top 5% of canopy nodes. All cultivars undergo 21-day slow glass curing at 15°C and 60% relative humidity.',
    specialty: 'Sour Tangie Heirloom, Purple Punch Elite',
    organicCertified: true,
    labVerified: true,
    founded: '2019',
    signatureProducts: ['Sour Tangie Heirloom', 'Diamond Cut Sunset Sherbet'],
  },
  {
    id: 'hoot',
    name: 'Hoot',
    category: 'flower_farms',
    categoryLabel: 'Flower Farms',
    location: 'Brandenburg, Germany',
    tagline: 'Night-Cycle Photoperiod Botanicals with Deep Terpenic Resins',
    description: 'Hoot farms in closed-loop geothermal greenhouse structures, capturing natural German sunlight supplemented by high-PPFD horticulture fixtures.',
    specialty: 'Nocturnal Indica Strains, Terpinolene Cultivars',
    organicCertified: true,
    labVerified: true,
    founded: '2023',
    signatureProducts: ['Hoot Midnight Berry', 'Owl Wing Kush'],
  },
  {
    id: 'mums-cannabis',
    name: 'MuM’s Cannabis',
    category: 'flower_farms',
    categoryLabel: 'Flower Farms',
    location: 'Lower Saxony, Germany',
    tagline: 'Multi-Generational Agronomy & Non-GMO Botanical Purity',
    description: 'Founded by agronomy researchers transitioning traditional greenhouse vegetable acreage into EU-GMP certified medicinal cannabis cultivation.',
    specialty: 'Balanced 1:1 THC:CBD Cultivars, Classic Skunk #1',
    organicCertified: true,
    labVerified: true,
    founded: '2021',
    signatureProducts: ['MuM’s Classic Green Crack', 'Heritage Northern Lights'],
  },
  {
    id: 'lucky-farms',
    name: 'Lucky Farms',
    category: 'flower_farms',
    categoryLabel: 'Flower Farms',
    location: 'Thuringia, Germany',
    tagline: 'Sun-Drenched Organic Greenhouses & Soil Micro-Biome Health',
    description: 'Lucky Farms operates on zero synthetic pesticides or mineral salts, fertilizing exclusively with kelp meal, alfalfa, and beneficial mycorrhizal fungi.',
    specialty: 'Zkittlez Crosses, Lemon Haze Craft Flower',
    organicCertified: true,
    labVerified: true,
    founded: '2022',
    signatureProducts: ['Lucky Clover Kush', 'Sunny Citron Flower'],
  },
  {
    id: 'jungle-ridge',
    name: 'Jungle Ridge',
    category: 'flower_farms',
    categoryLabel: 'Flower Farms',
    location: 'Baden-Württemberg, Germany',
    tagline: 'Dense Canopy Aeroponics & High-THCA Exotic Phenotypes',
    description: 'Specializing in hyper-aeroponic root misting setups that accelerate root respiration, delivering extreme trichome density and dense, aromatic buds.',
    specialty: 'Runtz Terpenes, Wedding Cake Elite',
    organicCertified: false,
    labVerified: true,
    founded: '2023',
    signatureProducts: ['Jungle Ridge Gas Mask', 'Tropicanna Cookies'],
  },
  {
    id: 'frost-factory',
    name: 'Frost Factory',
    category: 'flower_farms',
    categoryLabel: 'Flower Farms',
    location: 'Black Forest, Germany',
    tagline: 'Glacial Resin Production & Cold-Room Trim Standards',
    description: 'Trimmed entirely by hand in climate-regulated 16°C cold cleanrooms to ensure trichome heads remain intact on every single bud.',
    specialty: 'Polar Night Kush, Ice Cream Cake',
    organicCertified: true,
    labVerified: true,
    founded: '2020',
    signatureProducts: ['Frost Factory Polar Night Kush', 'Glacier Mintz'],
  },

  // COLUMN 4: EDIBLES & MORE
  {
    id: 'amazeballs',
    name: 'Amazeballs',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Hamburg, Germany',
    tagline: 'Artisanal Belgian Dark Chocolate Truffles with Metered Cannabinoids',
    description: 'Handcrafted single-origin Fairtrade chocolate truffles made by master chocolatiers, formulated with precisely lab-verified distillate.',
    specialty: '72% Dark Cocoa Sea Salt Truffles',
    organicCertified: true,
    labVerified: true,
    founded: '2022',
    signatureProducts: ['72% Cocoa Truffle 10-Pack', 'Caramel Macchiato Bites'],
  },
  {
    id: 'apollo-edibles',
    name: 'Apollo Edibles',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Berlin, Germany',
    tagline: 'Precision Space-Age Micro-Dosing with Botanical Terpenes',
    description: 'Scientific confectioners crafting fruit pectin drops engineered for clean salivary breakdown and consistent pharmacokinetics.',
    specialty: 'Sublingual Sour Drops, Sleep Formulations (THC+CBN)',
    organicCertified: true,
    labVerified: true,
    founded: '2023',
    signatureProducts: ['Apollo Cosmic Cherry Gems', 'Apollo Lunar CBN Sleep Drops'],
  },
  {
    id: 'bliss',
    name: 'Bliss',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Hamburg, Germany',
    tagline: 'Organic Pectin Gummies & Balanced Ratio Formulations',
    description: 'All-natural vegan gummies made with real fruit concentrates and without artificial corn syrups, gelatin, or chemical preservatives.',
    specialty: 'Wild Raspberry 1:2 THC:CBD Drops',
    organicCertified: true,
    labVerified: true,
    founded: '2021',
    signatureProducts: ['Bliss Botanical Micro-Dose Pectin Drops', 'Bliss Citrus Sunshine Chews'],
  },
  {
    id: 'candy',
    name: 'Candy',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Munich, Germany',
    tagline: 'Classic Nostalgic Confectionery Reimagined with Modern Testing',
    description: 'Nostalgic sweet and sour gummies produced with pharmaceutical grade GMP standards in Munich, Germany.',
    specialty: 'Sour Worms, Fizzy Peach Rings',
    organicCertified: false,
    labVerified: true,
    founded: '2023',
    signatureProducts: ['Candy Sour Worms 100mg Pack', 'Candy Tangy Peach Rings'],
  },
  {
    id: 'dames-gummy-co',
    name: 'Dames Gummy Co.',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Düsseldorf, Germany',
    tagline: 'Artisan Culinary Infusions for Discerning Palates',
    description: 'Infusing culinary flair into European botanical gummies, utilizing organic tapioca syrup and botanical cold-pressed terpenes.',
    specialty: 'Champagne Strawberry Chews, Blackberry Sage',
    organicCertified: true,
    labVerified: true,
    founded: '2022',
    signatureProducts: ['Dames Royal Strawberry Gems', 'Dames Yuzu Mint Gummy'],
  },
  {
    id: 'euphoria-edibles',
    name: 'Euphoria Edibles',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Berlin, Germany',
    tagline: 'Mood-Elevating Botanical Pastilles & Herbal Synergies',
    description: 'Crafting pastilles with organic chamomile, lavender, and full-spectrum extracts for calm clarity and everyday mindfulness.',
    specialty: 'Herbal Pastilles, Honey Infusions',
    organicCertified: true,
    labVerified: true,
    founded: '2024',
    signatureProducts: ['Euphoria Honeycomb Chews', 'Euphoria Mint Pastilles'],
  },
  {
    id: 'euphoria-psychedelics',
    name: 'Euphoria Psychedelics',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Berlin, Germany',
    tagline: 'Educational Insights into Functional Mycology & Legal Nootropics',
    description: 'Dedicated to research and informational overviews of non-prohibited legal functional mushrooms: Lion’s Mane, Cordyceps, Chaga, and Reishi.',
    specialty: 'Functional Mushroom Capsules, Nootropic Elixirs',
    organicCertified: true,
    labVerified: true,
    founded: '2024',
    signatureProducts: ['Mind Expansion Mushroom Complex', 'Clarity Nootropic Elixir'],
  },
  {
    id: 'faded-cannabis-co',
    name: 'Faded Cannabis Co.',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Frankfurt, Germany',
    tagline: 'High-Potency Edibles with Stringent Batch Testing',
    description: 'Specializes in high-concentration botanical formats tested for zero residual solvents, heavy metals, or microbial contaminants.',
    specialty: 'Sour Slices, Concentrated Tincture Bottles',
    organicCertified: false,
    labVerified: true,
    founded: '2022',
    signatureProducts: ['Faded Sour Apple Slices', 'Faded Sublingual Elixir 1000mg'],
  },
  {
    id: 'haven',
    name: 'Haven',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Bremen, Germany',
    tagline: 'Holistic Herbal Infusions & Restorative Sublingual Drops',
    description: 'Focused on therapeutic calm, creating clean water-soluble formulas for stress management and sleep harmony.',
    specialty: 'Night Rest Gummies with Chamomile & CBN',
    organicCertified: true,
    labVerified: true,
    founded: '2023',
    signatureProducts: ['Haven Serenity Night Chews', 'Haven Botanical Drops'],
  },
  {
    id: 'kootenay-labs',
    name: 'Kootenay Labs',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Stuttgart, Germany',
    tagline: 'Whole-Plant RSO & Broad Spectrum Medicinal Formulations',
    description: 'Recognized for clinical precision in whole-plant Rick Simpson Oil (RSO) capsules and metered oral delivery syringes.',
    specialty: 'Medical RSO Syringes, Cannabinoid Softgels',
    organicCertified: true,
    labVerified: true,
    founded: '2021',
    signatureProducts: ['Kootenay Full-Spectrum RSO', 'Kootenay 25mg Softgels'],
  },
  {
    id: 'jacks',
    name: 'Jacks',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Dresden, Germany',
    tagline: 'Hard Candies & Long-Lasting Salivary Lozenges',
    description: 'Traditional confectioners producing sugar-free xylitol throat lozenges enriched with soothing menthol and cannabis terpenes.',
    specialty: 'Sugar-Free Hard Lozenges, Lemon Ginger Drops',
    organicCertified: true,
    labVerified: true,
    founded: '2023',
    signatureProducts: ['Jacks Lemon Ginger Drops', 'Jacks Wild Mint Drops'],
  },
  {
    id: 'kleerx',
    name: 'kleerx',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Nuremberg, Germany',
    tagline: 'Ultra-Filtered Distillates & Flavorless Edible Bases',
    description: 'Specialists in molecular distillation, producing 99%+ pure cannabinoid distillates suitable for custom culinary applications.',
    specialty: 'Pure THC Distillate Tinctures, Crystal Isolates',
    organicCertified: false,
    labVerified: true,
    founded: '2022',
    signatureProducts: ['kleerx Crystal Clear Drops', 'kleerx CBD Distillate'],
  },
  {
    id: 'mota',
    name: 'MOTA',
    category: 'edibles_more',
    categoryLabel: 'Edibles & More',
    location: 'Berlin, Germany',
    tagline: 'Comprehensive Medicinal Infusions & Therapeutic Tinctures',
    description: 'One of the most trusted names in European holistic wellness, formulating therapeutic balms, sleep teas, and ratio tinctures.',
    specialty: 'Cannabis Sleep Teas, Transdermal Patches',
    organicCertified: true,
    labVerified: true,
    founded: '2020',
    signatureProducts: ['MOTA Herbal Dream Tea', 'MOTA Green Balm 500mg'],
  },

  // COLUMN 5: VAPES
  {
    id: 'burn',
    name: 'Burn',
    category: 'vapes',
    categoryLabel: 'Vapes',
    location: 'Stuttgart, Germany',
    tagline: 'Medical Ceramic Engineering & Leak-Proof Vapor Technology',
    description: 'Engineered with aircraft-grade aluminum casing and food-safe medical ceramic heating cores that never burn oil or scorch terpenes.',
    specialty: 'All-Ceramic Terpene Pod 1.0ml, Disposable Live Resin Pens',
    organicCertified: false,
    labVerified: true,
    founded: '2022',
    signatureProducts: ['Burn All-Ceramic Terpene Pod 1.0ml', 'Burn Disposable Rosin Pen'],
  },
  {
    id: 'so-high',
    name: 'So High',
    category: 'vapes',
    categoryLabel: 'Vapes',
    location: 'Frankfurt, Germany',
    tagline: 'High-Volume Single-Strain Distillates with Native Terpenes',
    description: 'Focusing on single-origin strain profiles, re-introducing 100% cannabis-derived terpenes without synthetic PG/VG or vitamin E acetate.',
    specialty: 'Single-Strain 510 Thread Cartridges',
    organicCertified: false,
    labVerified: true,
    founded: '2023',
    signatureProducts: ['So High Maui Wowie Cartridge', 'So High Granddaddy Purple'],
  },
  {
    id: 'sky-high',
    name: 'Sky High',
    category: 'vapes',
    categoryLabel: 'Vapes',
    location: 'Berlin, Germany',
    tagline: 'Ultra-Compact Discreet Vapor Pens & Variable Voltage Batteries',
    description: 'Sleek, minimalist matte black hardware with haptic feedback, 3-stage temperature controls, and preheat functions.',
    specialty: 'Smart Battery Hardware, Broad-Spectrum Cartridges',
    organicCertified: false,
    labVerified: true,
    founded: '2024',
    signatureProducts: ['Sky High Smart Pen Battery', 'Sky High Gelato Pod'],
  },
  {
    id: 'straight-goods',
    name: 'Straight Goods',
    category: 'vapes',
    categoryLabel: 'Vapes',
    location: 'Munich, Germany',
    tagline: 'Pure Cannabis Extracts with Zero Additives or Fillers',
    description: 'Committed to 100% pure live resin and sauce vaporization. Every batch is certified with full heavy-metal and pesticide COA certificates.',
    specialty: 'Live Resin Vaporizer Cartridges, Dual-Chamber Vapes',
    organicCertified: true,
    labVerified: true,
    founded: '2022',
    signatureProducts: ['Straight Goods Live Resin Vape Cartridge', 'Straight Goods Distillate Blend'],
  },
];

export const EXPERIENCE_CARDS = [
  {
    title: 'Certified Lab Testing',
    description: 'Every product profile links directly to third-party ISO/IEC 17025 accredited laboratory certificates of analysis (COAs).',
    iconName: 'ShieldCheck',
    rating: '5.0 Rating Standard',
  },
  {
    title: 'Discreet Express Logistics',
    description: 'Temperature-controlled couriers operating across German metropolitan hubs with unmarked, odor-proof packaging.',
    iconName: 'Truck',
    rating: 'Same-Day Dispatch',
  },
  {
    title: 'Artisanal Cultivators',
    description: 'Strict vetting criteria focusing on living organic soil, pesticide-free canopies, and patient 21-day cold curing.',
    iconName: 'Sprout',
    rating: '100% Verified Origin',
  },
  {
    title: 'Expert Educational Guidance',
    description: 'Comprehensive terpene monographs, cannabinoid ratios, and pharmacokinetics vetted by medical cannabis pharmacists.',
    iconName: 'BookOpen',
    rating: 'Medical Pharmacist Vetted',
  },
];

export const DELIVERY_FEATURES = [
  {
    title: 'Climate-Controlled Vans',
    description: 'Maintained at a steady 18°C and 55% RH to preserve delicate monoterpene profiles during transit.',
    iconName: 'ThermometerSnowflake',
  },
  {
    title: 'Discreet Odor-Proof Packaging',
    description: 'Triple-sealed unbranded recycled cardboard shipping boxes with tamper-evident security holographic strips.',
    iconName: 'Box',
  },
  {
    title: 'Real-Time Courier Tracking',
    description: 'Live GPS dispatch updates with 30-minute estimated delivery arrival windows across Berlin and Munich.',
    iconName: 'Clock',
  },
  {
    title: 'Secure Age-Verified Delivery',
    description: 'Mandatory government photo ID verification at recipient handoff to comply with German legal age standards.',
    iconName: 'UserCheck',
  },
];

export const WHY_CHOOSE_US_CARDS = [
  {
    id: 'why-1',
    category: 'QUALITY ASSURANCE',
    title: 'Zero Pesticides & Clean Growth',
    description: 'Our partnered cultivation farms adhere to strict European pharmacopoeia guidelines without chemical pesticides or heavy metals.',
    linkText: 'Learn About Testing Standards',
    linkSlug: 'about',
    image: '/src/assets/images/hero_lab_testing_1793700802431.jpg',
  },
  {
    id: 'why-2',
    category: 'FULL TRANSPARENCY',
    title: 'Public Batch Certificates',
    description: 'Instant verification of cannabinoid potency, residual solvent limits, and microbial safety profiles for every batch.',
    linkText: 'View Verification Process',
    linkSlug: 'faq',
    image: '/src/assets/images/product_extract_concentrate_1793700803077.jpg',
  },
  {
    id: 'why-3',
    category: 'LOGISTICS EXCELLENCE',
    title: 'Discreet & Secure Transit',
    description: 'Same-day and next-day scheduled dispatch throughout Germany via specialized temperature-regulated courier networks.',
    linkText: 'Explore Delivery Logistics',
    linkSlug: 'about',
    image: '/src/assets/images/delivery_fleet_retail_1793700802596.jpg',
  },
  {
    id: 'why-4',
    category: 'EDUCATIONAL ARCHITECTURE',
    title: 'Pharmacist-Led Research',
    description: 'Unbiased scientific articles detailing endocannabinoid receptors, entourage synergy, and responsible harm-reduction.',
    linkText: 'Read Scientific Articles',
    linkSlug: 'blog',
    image: '/src/assets/images/hero_cannabis_dispensary_1793700801902.jpg',
  },
];

export const HOW_TO_EXPLORE_STEPS = [
  {
    step: '01',
    title: 'Browse Verified Brands',
    description: 'Explore our 5-column directory of certified German and European flower farms, solventless extractors, and artisanal edible makers.',
    actionText: 'Explore Brands',
    targetPage: 'brands',
  },
  {
    step: '02',
    title: 'Inspect Detailed Lab Metrics',
    description: 'Review strain terpenes, THC:CBD ratios, terpene percentages, harvest dates, and independent analytical testing certificates.',
    actionText: 'Browse Catalog',
    targetPage: 'shop',
  },
  {
    step: '03',
    title: 'Access Educational Resources',
    description: 'Deepen your knowledge of the German CanG legal framework, extraction science, and responsible consumption guidelines.',
    actionText: 'Read Insights',
    targetPage: 'blog',
  },
];

export const BLOG_POSTS = [
  {
    id: 'post-1',
    title: 'Understanding the German CanG Framework & Cultivation Standards',
    category: 'LEGAL & REGULATION',
    slug: 'german-cang-framework-standards',
    date: 'February 28, 2026',
    author: 'Dr. Florian Weber, PharmD',
    readTime: '6 min read',
    excerpt: 'An authoritative review of Germany’s legal milestones under the Cannabis Act (CanG), consumer safety thresholds, and non-commercial social club protocols.',
    image: '/src/assets/images/hero_cannabis_dispensary_1793700801902.jpg',
    content: `
      <h3>The Evolution of German Cannabis Policy</h3>
      <p>Following the landmark passage of the German Cannabis Act (CanG), the landscape for cannabis cultivation, possession, and non-commercial distribution in Germany underwent a monumental paradigm shift. Under the current federal framework, adult consumers are granted defined personal limits, while cultivation associations (Anbauvereinigungen) operate under rigorous governmental supervision.</p>
      
      <h3>Key Quality Metrics Mandated by Federal Authorities</h3>
      <p>Unlike unregulated black-market goods, all legally grown botanical material must satisfy stringent testing parameters:</p>
      <ul>
        <li><strong>Microbial Purity:</strong> Total aerobic microbial count (TAMC) and total combined yeasts/molds count (TYMC) conforming to European Pharmacopoeia (Ph. Eur.) monographs.</li>
        <li><strong>Zero Heavy Metals:</strong> Lead, cadmium, mercury, and arsenic levels kept strictly below analytical thresholds.</li>
        <li><strong>Absence of Adulterants:</strong> Zero synthetic cannabinoids, heavy mineral sprays, or sugar-water weighting agents.</li>
      </ul>

      <h3>Consumer Safety and Social Responsibility</h3>
      <p>At Canabis Hub, our mission is empowering German adults with transparent, factual data. Knowing exactly what is inside your botanicals is the first principle of responsible harm reduction.</p>
    `,
  },
  {
    id: 'post-2',
    title: 'Terpenes Decoded: Myrcene, Limonene & Caryophyllene Synergies',
    category: 'SCIENCE & BOTANY',
    slug: 'terpenes-decoded-synergies',
    date: 'February 19, 2026',
    author: 'Elena Reinhardt, Biochemist',
    readTime: '5 min read',
    excerpt: 'Explore the organic aromatic hydrocarbons that dictate therapeutic entourage effects, aroma profiles, and physiological responses.',
    image: '/src/assets/images/product_premium_flower_1793700802879.jpg',
    content: `
      <h3>More Than Just Scent Molecules</h3>
      <p>While THC and CBD take the promotional spotlight, secondary plant metabolites called terpenes serve as the true conductors of the cannabis symphony. Synthesized in the glandular trichomes alongside phytocannabinoids, terpenes modulate how cannabinoids bind to human CB1 and CB2 receptors.</p>

      <h3>The Primary Trinity of Cannabis Terpenes</h3>
      <p><strong>Beta-Myrcene:</strong> Known for earthy, musky, herbal notes reminiscent of hops and lemongrass. Studies indicate myrcene enhances blood-brain barrier permeability, facilitating deeper bodily relaxation.</p>
      <p><strong>D-Limonene:</strong> Delivering zesty citrus notes of rind and sweet lemon. Limonene has demonstrated notable mood-elevating and stress-relieving properties in clinical aromatherapy trials.</p>
      <p><strong>Beta-Caryophyllene:</strong> A rare dietary terpene that directly binds to peripheral CB2 receptors as an agonist, conferring anti-inflammatory support without psychotropic intoxication.</p>
    `,
  },
  {
    id: 'post-3',
    title: 'Solventless Live Rosin vs CO2 Extraction: A Technical Analysis',
    category: 'EXTRACTION TECH',
    slug: 'solventless-rosin-vs-co2-extraction',
    date: 'February 12, 2026',
    author: 'Markus Braun, Extraction Director',
    readTime: '7 min read',
    excerpt: 'A deep comparative study examining yield, residual volatile solvent risks, and monoterpene preservation across modern extraction methods.',
    image: '/src/assets/images/product_extract_concentrate_1793700803077.jpg',
    content: `
      <h3>The Quest for Botanical Fidelity</h3>
      <p>As consumer sophistication across Germany matures, extraction methodology has moved from crude distillation to delicate artisanal refinement. Among high-end connoisseurs, solventless live rosin is hailed as the pinnacle of purity.</p>

      <h3>How Solventless Ice Water Hash is Pressed</h3>
      <p>Rather than dissolving trichome heads with chemical butane, propane, or supercritical carbon dioxide, solventless hash makers wash fresh-frozen cannabis flowers in chilled reverse-osmosis ice water. The brittle trichome heads snap off naturally, are sifted through micrometer-graded mesh bags (73μm to 120μm), freeze-dried to eliminate moisture, and pressed between heated stainless steel plates under hydraulic pressure.</p>
      
      <p>The result is a golden, glistening oil containing zero residual hydrocarbons, ensuring that what you consume is pure unadulterated plant resin.</p>
    `,
  },
  {
    id: 'post-4',
    title: 'Purity & Heavy Metal Testing in European Medical Cannabis',
    category: 'QUALITY ASSURANCE',
    slug: 'purity-heavy-metal-testing-europe',
    date: 'February 04, 2026',
    author: 'Dr. Florian Weber, PharmD',
    readTime: '4 min read',
    excerpt: 'How ICP-MS and HPLC analytical machines safeguard patients and consumers from environmental contaminants.',
    image: '/src/assets/images/hero_lab_testing_1793700802431.jpg',
    content: `
      <h3>Cannabis: A Hyperaccumulating Bio-Remediator</h3>
      <p>Cannabis plants are renowned natural bio-accumulators, meaning their roots greedily draw heavy metals and contaminants from soil. If cultivated in uncertified industrial dirt, plants will absorb lead, cadmium, arsenic, and agricultural toxins directly into their floral tissues.</p>

      <h3>State-of-the-Art Chromatography Standards</h3>
      <p>To prevent harmful ingestion, accredited German analytical labs employ Inductively Coupled Plasma Mass Spectrometry (ICP-MS) to detect trace elemental impurities down to parts per billion (ppb). High-Performance Liquid Chromatography (HPLC) is simultaneously deployed to confirm exact cannabinoid concentrations down to 0.01% precision.</p>
    `,
  },
];

export const FAQ_ITEMS = [
  {
    question: 'What is Canabis Hub and what services does it provide?',
    answer: 'Canabis Hub is Germany’s premier educational cannabis directory and brand intelligence platform. We provide comprehensive brand profiles, verified third-party laboratory data, cultivation insights, strain genetics, and legal compliance guides for adult consumers and medical patients.',
  },
  {
    question: 'Does Canabis Hub sell or ship controlled substances directly online?',
    answer: 'No. Canabis Hub operates strictly as an informational and educational directory in full compliance with German federal regulations (CanG). We do not conduct commercial cannabis transactions, checkout processing, or illegal remote mail-orders of controlled substances. All product listings are educational monographs.',
  },
  {
    question: 'How are brands vetted before being listed in the directory?',
    answer: 'Every brand featured across our 5 mega-menu columns must submit verified certificates of analysis (COA) from ISO/IEC 17025 accredited European testing laboratories, prove organic pesticide-free cultivation practices, and demonstrate compliance with German agricultural and safety standards.',
  },
  {
    question: 'What is the age requirement to access Canabis Hub content?',
    answer: 'In strict accordance with German youth protection laws and harm-reduction mandates, access to our platform requires users to be at least 18 years of age. An age verification confirmation is required prior to entering educational catalog sections.',
  },
  {
    question: 'How does same-day express courier dispatch work in Germany?',
    answer: 'In authorized metropolitan regions like Berlin and Munich, licensed pharmaceutical couriers and botanical distribution partners operate temperature-controlled electric vehicle fleets with discreet unbranded packaging and mandatory in-person photo ID verification.',
  },
  {
    question: 'Where can I find independent Certificate of Analysis (COA) reports?',
    answer: 'Each product detail card displays a unique laboratory batch code (e.g., DE-LAB-2026-9041) along with complete cannabinoid and terpene breakdowns verified by accredited European analytical facilities.',
  },
];

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    headline: 'Welcome to Canabis Hub',
    subheading: 'Germany’s premier botanical directory & verified cannabis knowledge platform. Discover licensed flower farms, artisanal concentrates, and pharmaceutical testing standards.',
    primaryCta: 'Explore Directory',
    primaryLink: 'shop',
    secondaryCta: 'Our Standards',
    secondaryLink: 'about',
    backgroundImage: '/src/assets/images/hero_cannabis_dispensary_1793700801902.jpg',
    tag: 'German Cannabis Directory 2026',
  },
  {
    id: 'slide-2',
    headline: 'Artisanal Cultivation & Certified Standards',
    subheading: 'Partnering exclusively with European organic soil growers, alpine greenhouse cultivators, and craft canopies practicing patient 21-day cold-curing.',
    primaryCta: 'View Flower Farms',
    primaryLink: 'flower-farms',
    secondaryCta: 'Cultivation Science',
    secondaryLink: 'blog',
    backgroundImage: '/src/assets/images/product_premium_flower_1793700802879.jpg',
    tag: '100% Pesticide-Free Cultivation',
  },
  {
    id: 'slide-3',
    headline: 'Precision Extracts & Solventless Purity',
    subheading: 'Explore cold-cured live hash rosin, high-terpene full spectrum sauces, and biocompatible ceramic hardware tested down to parts per billion.',
    primaryCta: 'Discover Concentrates',
    primaryLink: 'shop',
    secondaryCta: 'Extraction Guide',
    secondaryLink: 'blog',
    backgroundImage: '/src/assets/images/product_extract_concentrate_1793700803077.jpg',
    tag: 'Solventless Ice-Water Purity',
  },
  {
    id: 'slide-4',
    headline: 'Same-Day Express Logistics in Berlin & Munich',
    subheading: 'Temperature-controlled climate fleet maintaining 18°C and 55% relative humidity for optimal monoterpene preservation during transit.',
    primaryCta: 'Logistics Overview',
    primaryLink: 'about',
    secondaryCta: 'Contact Advisory',
    secondaryLink: 'contact',
    backgroundImage: '/src/assets/images/delivery_fleet_retail_1793700802596.jpg',
    tag: 'Discreet Climate-Controlled Transit',
  },
];
