/** Personenkraftwagen (PKW) — getrennt von Nutzfahrzeugen / LKW */
export type Car = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  power: number;
  condition: "Neu" | "Gebraucht";
  bodyType: "Limousine" | "SUV" | "Kombi" | "Kompakt" | "Coupé";
  fuel: "Benzin" | "Diesel" | "Hybrid" | "Elektro";
  engine?: string;
  transmission?: "Manual" | "Automatic";
  fuelEconomy?: string;
  images: string[];
  description: string;
  features: string[];
  videoUrl?: string;
  featured?: boolean;
};

export const cars: Car[] = [
  {
    id: "c-001",
    title: "BMW 320d Touring M Sport",
    brand: "BMW",
    model: "320d Touring",
    year: 2022,
    mileage: 42000,
    price: 38900,
    power: 190,
    condition: "Gebraucht",
    bodyType: "Kombi",
    fuel: "Diesel",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Gepflegter 320d Touring mit M Sportpaket, Navi Professional und LED-Scheinwerfer. Ideal für Familie und Business.",
    features: ["M Sportpaket", "LED Scheinwerfer", "Navi Professional", "Kamera", "Sitzheizung", "PDC vo/hi"],
    featured: true,
  },
  {
    id: "c-002",
    title: "Mercedes-Benz GLC 300 4MATIC",
    brand: "Mercedes-Benz",
    model: "GLC 300",
    year: 2021,
    mileage: 68000,
    price: 45900,
    power: 258,
    condition: "Gebraucht",
    bodyType: "SUV",
    fuel: "Benzin",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Komfortabler SUV mit 4MATIC, AIR BODY CONTROL optional, MBUX und großzügigem Kofferraum.",
    features: ["4MATIC", "MBUX", "Spurhalteassistent", "Keyless-Go", "Panoramadach", "AHK vorbereitet"],
    featured: true,
  },
  {
    id: "c-003",
    title: "VW Golf 8 GTI",
    brand: "Volkswagen",
    model: "Golf 8 GTI",
    year: 2023,
    mileage: 12000,
    price: 36900,
    power: 245,
    condition: "Gebraucht",
    bodyType: "Kompakt",
    fuel: "Benzin",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Sportlicher GTI mit DSG, IQ.Light und digitalem Cockpit — wenig gefahren, scheckheftgepflegt.",
    features: ["DSG", "IQ.Light", "Digital Cockpit Pro", "ACC", "DCC", "Winterpaket"],
    featured: true,
  },
  {
    id: "c-004",
    title: "Audi A5 Sportback 40 TDI quattro",
    brand: "Audi",
    model: "A5 Sportback",
    year: 2020,
    mileage: 89000,
    price: 32900,
    power: 190,
    condition: "Gebraucht",
    bodyType: "Coupé",
    fuel: "Diesel",
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Eleganter Sportback mit quattro-Antrieb, Matrix LED und Bang & Olufsen Sound.",
    features: ["quattro", "Matrix LED", "B&O Sound", "Virtual Cockpit", "S line Exterieur"],
    featured: false,
  },
];

export type Truck = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number; // in km
  price: number; // in EUR
  power: number; // in PS (HP)
  condition: "Neu" | "Gebraucht";
  engine?: string;
  transmission?: "Manual" | "Automatic";
  fuelEconomy?: string;
  category: "Sattelzugmaschine" | "Festaufbau" | "Kipper" | "Kastenwagen" | "Auflieger";
  images: string[];
  description: string;
  features: string[];
  videoUrl?: string;
  featured?: boolean;
};

export const trucks: Truck[] = [
  {
    id: "t-001",
    title: "Mercedes-Benz Actros 1845 LS GigaSpace",
    brand: "Mercedes-Benz",
    model: "Actros 1845",
    year: 2021,
    mileage: 235000,
    price: 64500,
    power: 450,
    condition: "Gebraucht",
    category: "Sattelzugmaschine",
    images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Hervorragend gepflegter Mercedes-Benz Actros mit GigaSpace Kabine. Ideal für den Fernverkehr. Scheckheftgepflegt beim Vertragshändler.",
    features: ["Klimaanlage", "Standheizung", "Retarder/Intarder", "Navigationssystem", "Abstandstempomat", "Kühlschrank"],
    featured: true,
  },
  {
    id: "t-002",
    title: "Volvo FH 500 Globetrotter XL",
    brand: "Volvo",
    model: "FH 500",
    year: 2022,
    mileage: 180000,
    price: 78900,
    power: 500,
    condition: "Gebraucht",
    category: "Sattelzugmaschine",
    images: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1628043644026-c2baae80a9c6?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Leistungsstarker Volvo FH 500 mit der geräumigen Globetrotter XL Kabine. Bietet maximalen Fahrerkomfort und ausgezeichnete Kraftstoffeffizienz.",
    features: ["I-Shift Getriebe", "Standklimaanlage", "Voll-Luftfederung", "Spurhalteassistent", "LED-Scheinwerfer", "Alufelgen"],
    featured: true,
  },
  {
    id: "t-003",
    title: "Scania R 450 Highline",
    brand: "Scania",
    model: "R 450",
    year: 2023,
    mileage: 45000,
    price: 95000,
    power: 450,
    condition: "Neu",
    category: "Sattelzugmaschine",
    images: [
      "https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Fast neuer Scania R 450 mit Highline-Kabine. Erstklassige Verarbeitung und bewährter, sparsamer 13-Liter Motor.",
    features: ["Opticruise", "Retarder", "Ledersitze", "Premium Infotainment", "Xenon-Scheinwerfer"],
    featured: false,
  },
  {
    id: "t-004",
    title: "MAN TGX 18.510 XXL",
    brand: "MAN",
    model: "TGX 18.510",
    year: 2020,
    mileage: 380000,
    price: 49500,
    power: 510,
    condition: "Gebraucht",
    category: "Sattelzugmaschine",
    images: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Zuverlässiger MAN TGX mit großer XXL-Kabine. Perfekt für lange Touren und anspruchsvolle Transportaufgaben.",
    features: ["MAN BrakeMatic", "Kühlschrank", "Standheizung", "2 Liegen", "Differentialsperre"],
    featured: true,
  },
  {
    id: "t-005",
    title: "Ford F-Max 500 Mega",
    brand: "Ford",
    model: "F-Max 500",
    year: 2021,
    mileage: 260000,
    price: 52000,
    power: 500,
    condition: "Gebraucht",
    category: "Sattelzugmaschine",
    images: [
      "https://images.unsplash.com/photo-1628043644026-c2baae80a9c6?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Der innovative Ford F-Max bietet ein exzellentes Preis-Leistungs-Verhältnis. Geräumiges Interieur und moderne Assistenzsysteme.",
    features: ["Ecotorq Motor", "ConnecTruck", "Klimaautomatik", "Adaptive Cruise Control"],
    featured: false,
  }
];

/** Spare parts — all shown on a single page (no per-item route). */
export type SparePart = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export const spareParts: SparePart[] = [
  {
    id: 'p-demo-1',
    title: 'Kupplungssatz · MAN TGX',
    description:
      '<p>Neuwertiger Kupplungssatz, passend für ausgewählte MAN TGX Baujahre. Lieferung innerhalb Deutschlands möglich.</p>',
    imageUrl:
      'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'p-demo-2',
    title: 'Luftfeder · Hinterachse',
    description:
      '<p>Gebrauchte Luftfeder, geprüft und funktionsfähig. Bitte Fahrgestellnummer für Kompatibilität mit angeben.</p>',
    imageUrl:
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
  },
];

export const testimonials = [
  {
    id: "rev-1",
    name: "Thomas Müller",
    company: "Müller Spedition GmbH",
    text: "Wir haben nun unseren dritten Actros bei TruckMaster gekauft. Einwandfreier Service, ehrliche Beratung und extrem schnelle Kaufabwicklung via WhatsApp!",
    rating: 5,
  },
  {
    id: "rev-2",
    name: "Johannes Schmidt",
    company: "Schmidt Logistik",
    text: "Tolle Plattform, sehr detaillierte Fahrzeugpräsentationen. Der Volvo FH 500 war genau im beschriebenen Zustand. Sehr empfehlenswert.",
    rating: 5,
  },
  {
    id: "rev-3",
    name: "Klaus Wagner",
    company: "Wagner Tiefbau",
    text: "Einfache Suchfunktion und schnelle Antwort vom Service-Team. Haben hier einen tollen MAN für unseren Fuhrpark gefunden.",
    rating: 4,
  }
];
