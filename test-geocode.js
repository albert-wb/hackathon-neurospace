async function test() {
  const query = "R. Líbero Badaró, 1464 - Centro, Franca - SP, 14400-570";
  let fallbackQuery = query
        .replace(/\b\d+\b/g, "") // Remove ALL numbers (house numbers)
        .replace(/- \w{2}\b/g, "") // Remove " - SP"
        .replace(/[,-]/g, " ")     // Remove commas and hyphens
        .replace(/\s+/g, " ")      // Normalize spaces
        .trim();
  
  console.log("Fallback query:", fallbackQuery);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackQuery)}&limit=1&countrycodes=br`;
  const res = await fetch(url, { headers: { "Accept-Language": "pt-BR", "User-Agent": "NodeScript" } });
  const data = await res.json();
  console.log(`Nominatim fallback:`, data.length > 0 ? data[0].display_name : "Not found");
}
test();
