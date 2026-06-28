export const popularCurrencies = [
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
];


export const units = [
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "pck", label: "Packs" },
  { value: "ea", label: "Each (ea)" },
  { value: "set", label: "Sets" },
  { value: "pair", label: "Pairs" },
  { value: "box", label: "Boxes" },
  { value: "bundle", label: "Bundles" },
  { value: "reel", label: "Reels" },
  { value: "bags", label: "Bags" },
  { value: "rim", label: "Rim" },
  { value: "sheet", label: "Sheets" },
  { value: "roll", label: "Rolls" },
  { value: "kg", label: "Kilograms (kg)" },
  { value: "g", label: "Grams (g)" },
  // { value: "mt", label: "Metric Tons (MT)" },
  { value: "ton", label: "Tons" },
  { value: "l", label: "Liters (L)" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "m2", label: "Square Meters (m²)" },
  { value: "ft2", label: "Square Feet (ft²)" },
  { value: "m", label: "Meters (m)" },
  { value: "cm", label: "Centimeters (cm)" },
  { value: "mm", label: "Millimeters (mm)" },
];

export const company = {
  name: "ENVIRONMENTAL PROTECTION AUTHORITY",
  address: "P.O. Box M326, Accra, Ghana",
  phone: "050 6694760 / 050 669946",
  email: "info@epa.gov.gh",
};


export const parseDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);

  return `${day}-${month}-${year}`;
};


