// Helper functions for zodiac calculations and data

// Function to calculate zodiac sign based on birth date
export function calculateZodiacSign(date: string): string {
  const birthDate = new Date(date);
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1; // JavaScript months are 0-based
  
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "Kova";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "Balık";
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "Koç";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "Boğa";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return "İkizler";
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return "Yengeç";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "Aslan";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "Başak";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return "Terazi";
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return "Akrep";
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return "Yay";
  } else {
    return "Oğlak";
  }
}

// Calculate ascendant based on birth time and date
// This is simplified and not astronomically accurate
export function calculateAscendant(date: string, time: string): string {
  const birthDate = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  
  // Simple calculation based on birth hour
  // In a real application, this would involve more complex astronomical calculations
  const ascendantIndex = (birthDate.getMonth() + Math.floor(hours / 2)) % 12;
  
  const ascendants = [
    "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak",
    "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"
  ];
  
  return ascendants[ascendantIndex];
}

// Calculate moon sign
// This is simplified and not astronomically accurate
export function calculateMoonSign(date: string): string {
  const birthDate = new Date(date);
  const day = birthDate.getDate();
  const month = birthDate.getMonth();
  
  // Simple algorithm for demo purposes
  // In a real app, this would use lunar cycle calculations
  const moonIndex = (month + day % 30) % 12;
  
  const moonSigns = [
    "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak",
    "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"
  ];
  
  return moonSigns[moonIndex];
}

// Get Mercury sign (simplified)
export function calculateMercurySign(date: string): string {
  const sunSign = calculateZodiacSign(date);
  const birthDate = new Date(date);
  const day = birthDate.getDate();
  
  // Mercury is often in the same sign as the Sun, or in an adjacent sign
  const signs = [
    "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak",
    "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"
  ];
  
  const sunIndex = signs.indexOf(sunSign);
  
  // Small chance of Mercury being in the previous or next sign
  if (day < 10) {
    return signs[(sunIndex - 1 + 12) % 12]; // Previous sign
  } else if (day > 20) {
    return signs[(sunIndex + 1) % 12]; // Next sign
  } else {
    return sunSign; // Same sign as Sun
  }
}

// Get Venus sign (simplified)
export function calculateVenusSign(date: string): string {
  const sunSign = calculateZodiacSign(date);
  const birthDate = new Date(date);
  const month = birthDate.getMonth();
  
  // Venus is typically within 2 signs of the Sun
  const signs = [
    "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak",
    "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"
  ];
  
  const sunIndex = signs.indexOf(sunSign);
  
  // Small variation based on month
  if (month % 3 === 0) {
    return signs[(sunIndex + 1) % 12];
  } else if (month % 3 === 1) {
    return signs[(sunIndex - 1 + 12) % 12];
  } else {
    return sunSign;
  }
}

// Get Mars sign (simplified)
export function calculateMarsSign(date: string): string {
  const sunSign = calculateZodiacSign(date);
  const birthDate = new Date(date);
  const year = birthDate.getFullYear();
  
  // Mars can be in various signs
  const signs = [
    "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak",
    "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"
  ];
  
  // Simple algorithm based on birth year
  const marsIndex = (year % 12);
  
  return signs[marsIndex];
}

// Calculate birth chart based on all inputs
export function zodiacCalculate(data: {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  name?: string;
}): any {
  // Calculate the main elements of a birth chart
  const sun = calculateZodiacSign(data.birthDate);
  const moon = calculateMoonSign(data.birthDate);
  const ascendant = calculateAscendant(data.birthDate, data.birthTime);
  const mercury = calculateMercurySign(data.birthDate);
  const venus = calculateVenusSign(data.birthDate);
  const mars = calculateMarsSign(data.birthDate);
  
  // In a real application, this would include more calculations
  // including houses, aspects, and other celestial bodies
  
  return {
    sun,
    moon,
    ascendant,
    mercury,
    venus,
    mars,
    birthPlace: data.birthPlace,
    calculatedAt: new Date().toISOString()
  };
}

// Get zodiac sign element
export function getZodiacElement(sign: string): string {
  const fireElements = ["Koç", "Aslan", "Yay"];
  const earthElements = ["Boğa", "Başak", "Oğlak"];
  const airElements = ["İkizler", "Terazi", "Kova"];
  const waterElements = ["Yengeç", "Akrep", "Balık"];
  
  if (fireElements.includes(sign)) return "Ateş";
  if (earthElements.includes(sign)) return "Toprak";
  if (airElements.includes(sign)) return "Hava";
  if (waterElements.includes(sign)) return "Su";
  
  return "Bilinmeyen";
}

// Get zodiac sign ruling planet
export function getZodiacPlanet(sign: string): string {
  const rulingPlanets: Record<string, string> = {
    "Koç": "Mars",
    "Boğa": "Venüs",
    "İkizler": "Merkür",
    "Yengeç": "Ay",
    "Aslan": "Güneş",
    "Başak": "Merkür",
    "Terazi": "Venüs",
    "Akrep": "Plüton",
    "Yay": "Jüpiter",
    "Oğlak": "Satürn",
    "Kova": "Uranüs",
    "Balık": "Neptün"
  };
  
  return rulingPlanets[sign] || "Bilinmeyen";
}

// Get zodiac sign symbol
export function getZodiacSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    "Koç": "♈",
    "Boğa": "♉",
    "İkizler": "♊",
    "Yengeç": "♋",
    "Aslan": "♌",
    "Başak": "♍",
    "Terazi": "♎",
    "Akrep": "♏",
    "Yay": "♐",
    "Oğlak": "♑",
    "Kova": "♒",
    "Balık": "♓"
  };
  
  return symbols[sign] || "?";
}
