f = open('src/config/state.ts', 'w')
f.write("""export const stateConfig = {
  name: "Colorado",
  abbreviation: "CO",
  domain: "ihempcolorado.com",
  tagline: "Your Colorado Hemp Law Guide",
  description: "Stay compliant with Colorado hemp regulations.",
  networkStates: [
    { name: "Arkansas", url: "https://ihemparkansas.com" },
    { name: "California", url: "https://ihempcalifornia.com" },
    { name: "Florida", url: "https://ihempflorida.com" },
    { name: "Georgia", url: "https://ihempgeorgia.com" },
    { name: "Indiana", url: "https://ihempindiana.com" },
    { name: "Iowa", url: "https://ihempiowa.com" },
    { name: "Kansas", url: "https://ihempkansas.com" },
    { name: "Kentucky", url: "https://ihempkentucky.com" },
    { name: "Michigan", url: "https://ihempmi.com" },
    { name: "Mississippi", url: "https://ihempmississippi.com" },
    { name: "Nebraska", url: "https://ihempnebraska.com" },
    { name: "Ohio", url: "https://ihempohio.com" },
    { name: "Oklahoma", url: "https://ihempoklahoma.com" },
    { name: "Tennessee", url: "https://ihemptennessee.com" },
    { name: "Texas", url: "https://ihemptexas.com" },
  ],
};
""")
f.close()
