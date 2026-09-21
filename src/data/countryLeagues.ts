// Fictional, country-flavored league content: city names and club-name
// patterns per nationality, used to build an AI league that matches the
// country the user picks when creating their club. Everything here is
// invented — no real club names, crests or leagues are reproduced.

export interface CountryLeagueStyle {
  leagueAdjective: string;
  cities: string[];
  namePatterns: string[]; // "{c}" is replaced with a city name
  nicknamePatterns: string[]; // "{c}" is replaced with a city name
}

const P = (c: string) => c; // no-op, keeps patterns readable below

export const COUNTRY_LEAGUE_STYLES: Record<string, CountryLeagueStyle> = {
  Portugal: {
    leagueAdjective: "Portuguese",
    cities: ["Vidalgo", "Montefaro", "Carvalha", "Ferrabranca", "Aldeira", "Ribeiro Novo", "Pinhalvo", "Quintanova", "Selouro", "Barravento"],
    namePatterns: [P("{c} SC"), P("Sporting {c}"), P("{c} FC"), P("Vitória {c}"), P("União {c}"), P("{c} Atlético")],
    nicknamePatterns: ["Os Leões de {c}", "A Águia de {c}", "Os Verdes de {c}", "O Clube de {c}"],
  },
  Spain: {
    leagueAdjective: "Spanish",
    cities: ["Valdeja", "Montoro", "Serrablanca", "Riofrío", "Casaverde", "Aldemar", "Villanera", "Cortesol", "Ronderas", "Alcorena"],
    namePatterns: [P("Real {c}"), P("Atlético {c}"), P("{c} CF"), P("Deportivo {c}"), P("{c} UD"), P("Racing {c}")],
    nicknamePatterns: ["Los Rojos de {c}", "Los Blancos de {c}", "La Furia de {c}", "El Orgullo de {c}"],
  },
  Brazil: {
    leagueAdjective: "Brazilian",
    cities: ["Vermelhosa", "Douradinho", "Serramar", "Campoverde", "Riograna", "Baiaflor", "Correntino", "Palmarosa", "Guaravale", "Pantaneira"],
    namePatterns: [P("{c} EC"), P("Grêmio {c}"), P("{c} FC"), P("Atlético {c}"), P("{c} AC"), P("Esporte {c}")],
    nicknamePatterns: ["O Rubro de {c}", "O Tricolor de {c}", "A Torcida de {c}", "O Gigante de {c}"],
  },
  Argentina: {
    leagueAdjective: "Argentine",
    cities: ["Vallesur", "Riobravo", "Costanera", "Altamira", "Puertosol", "Villamora", "Sierragrande", "Laplacia", "Rionuevo", "Cerroalto"],
    namePatterns: [P("Club {c}"), P("{c} Atlético"), P("{c} de Fútbol"), P("Deportivo {c}"), P("{c} FC"), P("Estudiantes de {c}")],
    nicknamePatterns: ["Los Xeneizes de {c}", "El Millonario de {c}", "La Banda de {c}", "El Fortín de {c}"],
  },
  England: {
    leagueAdjective: "English",
    cities: ["Northbridge", "Grandport", "Eastford", "Kingsport", "Borough Hill", "Westmere", "Ashcombe", "Sheldwick", "Redcliffe", "Fenshire"],
    namePatterns: [P("{c} United"), P("{c} City"), P("{c} Rovers"), P("{c} Athletic"), P("{c} Town"), P("{c} Wanderers")],
    nicknamePatterns: ["The {c} Reds", "The {c} Blues", "The Lions of {c}", "The {c} Boys"],
  },
  France: {
    leagueAdjective: "French",
    cities: ["Grandport", "Beaulieu", "Montrouge", "Villefranche", "Clairmont", "Sarreval", "Loirette", "Bellecour", "Avranval", "Rocheteau"],
    namePatterns: [P("{c} FC"), P("Olympique {c}"), P("AS {c}"), P("Stade {c}"), P("Racing {c}"), P("{c} SC")],
    nicknamePatterns: ["Les Bleus de {c}", "Les Rouges de {c}", "Le Club de {c}", "Les Lions de {c}"],
  },
  Germany: {
    leagueAdjective: "German",
    cities: ["Eastford", "Weidenbach", "Sternhausen", "Rothenfeld", "Marburgen", "Kaltenau", "Lindenhort", "Brunnfeld", "Steinwald", "Falkenau"],
    namePatterns: [P("{c} 04"), P("Borussia {c}"), P("{c} SV"), P("FC {c}"), P("{c} 05"), P("Eintracht {c}")],
    nicknamePatterns: ["Die Adler von {c}", "Die Löwen von {c}", "Der Stolz von {c}", "Die Elf von {c}"],
  },
  Nigeria: {
    leagueAdjective: "Nigerian",
    cities: ["Okulale", "Ibarapa", "Enuwa", "Kadura", "Osogun", "Warriville", "Benikoro", "Jostown", "Abakiliki", "Calafort"],
    namePatterns: [P("{c} United"), P("{c} FC"), P("{c} Warriors"), P("Rangers of {c}"), P("{c} City"), P("{c} Rovers")],
    nicknamePatterns: ["The Eagles of {c}", "The Pride of {c}", "The Green Force of {c}", "The {c} Stars"],
  },
  Ghana: {
    leagueAdjective: "Ghanaian",
    cities: ["Kumapa", "Takorafi", "Adenta", "Sunyanko", "Cape Bosa", "Tamaleh", "Winnebeh", "Obuasa", "Koforidu", "Ashantiwe"],
    namePatterns: [P("{c} Kotoko"), P("{c} Stars"), P("{c} United"), P("Hearts of {c}"), P("{c} FC"), P("{c} City")],
    nicknamePatterns: ["The Porcupines of {c}", "The Phobians of {c}", "The Warriors of {c}", "The {c} Pride"],
  },
  Morocco: {
    leagueAdjective: "Moroccan",
    cities: ["Casafira", "Rabatel", "Fessana", "Marrakif", "Tangoro", "Agadiro", "Ouazira", "Meknoun", "Tetouani", "Safioui"],
    namePatterns: [P("Wydad {c}"), P("Raja {c}"), P("{c} AC"), P("Ittihad {c}"), P("{c} FC"), P("Union {c}")],
    nicknamePatterns: ["Les Rouges de {c}", "L'Armée de {c}", "Les Lions de {c}", "L'Étoile de {c}"],
  },
  Israel: {
    leagueAdjective: "Israeli",
    cities: ["Ramoth", "Herzliya Yam", "Kfar Ono", "Beersheva", "Nahariya", "Ashkelet", "Modiin Or", "Rishonya", "Givaton", "Netanor"],
    namePatterns: [P("Hapoel {c}"), P("Maccabi {c}"), P("Beitar {c}"), P("{c} FC"), P("Ironi {c}"), P("{c} Sport Club")],
    nicknamePatterns: ["The Reds of {c}", "The Yellows of {c}", "The Pride of {c}", "The {c} Lions"],
  },
  Netherlands: {
    leagueAdjective: "Dutch",
    cities: ["Harborview", "Molendam", "Veldhaven", "Bloemstad", "Oostervik", "Zuidpoort", "Willemsburg", "Kerkrade Novo", "Delftvaart", "Maasoord"],
    namePatterns: [P("{c} FC"), P("SC {c}"), P("{c} Boys"), P("VV {c}"), P("Sparta {c}"), P("{c} United")],
    nicknamePatterns: ["De Leeuwen van {c}", "De Trots van {c}", "De Ploeg van {c}", "De Helden van {c}"],
  },
  Italy: {
    leagueAdjective: "Italian",
    cities: ["Montefiore", "Portorosso", "Castelverde", "Valdisole", "Sanfiorino", "Riovecchio", "Trevanti", "Laguzzo", "Belmontino", "Campagnaro"],
    namePatterns: [P("{c} Calcio"), P("AC {c}"), P("Inter {c}"), P("{c} 1920"), P("US {c}"), P("Unione {c}")],
    nicknamePatterns: ["I Rossoblu di {c}", "Gli Azzurri di {c}", "Il Orgoglio di {c}", "I Leoni di {c}"],
  },
  Croatia: {
    leagueAdjective: "Croatian",
    cities: ["Kingsport", "Zagorsko", "Rijetka", "Osjenik", "Slavonac", "Dubroniv", "Varazdelo", "Puljina", "Sisakovo", "Karlovsko"],
    namePatterns: [P("NK {c}"), P("HNK {c}"), P("{c} Dinamo"), P("{c} FC"), P("Hajduk {c}"), P("Sloboda {c}")],
    nicknamePatterns: ["Plavi iz {c}", "Bijeli iz {c}", "Ponos {c}", "Vatra {c}"],
  },
  Serbia: {
    leagueAdjective: "Serbian",
    cities: ["Borough Hill", "Novigrad", "Kragoso", "Nisava", "Subotinac", "Cacanski", "Krusevlje", "Zajecarik", "Pancevac", "Leskovar"],
    namePatterns: [P("FK {c}"), P("Partizan {c}"), P("Crvena {c}"), P("{c} FC"), P("Radnicki {c}"), P("Sloga {c}")],
    nicknamePatterns: ["Orlovi iz {c}", "Crveno-beli iz {c}", "Ponos {c}", "Vatreni {c}"],
  },
  Turkey: {
    leagueAdjective: "Turkish",
    cities: ["Lakeside", "Karadeniz Ova", "Akdenizli", "Bursanak", "Izmiroy", "Konyaser", "Antalyaka", "Trabzonel", "Gaziantu", "Kayseriz"],
    namePatterns: [P("{c}spor"), P("{c} FK"), P("Genclik {c}"), P("{c} Belediyespor"), P("Yildiz {c}"), P("{c} United")],
    nicknamePatterns: ["{c} Kartallari", "{c} Aslanlari", "{c} Gururu", "{c} Ates"],
  },
};

export function countryStyle(country: string): CountryLeagueStyle {
  return COUNTRY_LEAGUE_STYLES[country] ?? COUNTRY_LEAGUE_STYLES.England;
}

export function leagueNameFor(country: string): string {
  return `${countryStyle(country).leagueAdjective} Premier League`;
}
