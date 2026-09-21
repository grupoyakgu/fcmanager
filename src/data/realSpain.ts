// Real La Liga club identities and real player names, used only when the
// user's club is founded in Spain. Requested explicitly by the project owner
// after being informed this carries trademark / right-of-publicity exposure
// on a public deployment — scoped to Spain only, everything else in the game
// stays fully fictional. Club crests/kits are still generated abstractly
// (no real artwork is reproduced), and in-game stats/ratings are procedurally
// generated, not sourced from real performance data.
import { ClubIdentity, Position } from "@/types";

export interface RealPlayerSeed {
  position: Position;
  first: string;
  last: string;
  nationality: string;
}

export interface RealClubSeed {
  name: string;
  shortName: string;
  nickname: string;
  city: string;
  stadium: string;
  primaryColor: string;
  secondaryColor: string;
  reputation: number;
  budget: number;
  identity: ClubIdentity;
  // Ordered to match AI_SQUAD_TEMPLATE exactly: GK, CB, CB, LB, RB, CDM, CM, CM, CAM, LW, RW, ST.
  roster: RealPlayerSeed[];
}

export const SPAIN_REAL_CLUBS: RealClubSeed[] = [
  {
    name: "Real Madrid",
    shortName: "RMA",
    nickname: "Los Blancos",
    city: "Madrid",
    stadium: "Santiago Bernabéu",
    primaryColor: "#ffffff",
    secondaryColor: "#1e2761",
    reputation: 93,
    budget: 32_000_000,
    identity: "STAR_COLLECTOR",
    roster: [
      { position: "GK", first: "Kepa", last: "Arrizabalaga", nationality: "Spain" },
      { position: "CB", first: "Éder", last: "Militão", nationality: "Brazil" },
      { position: "CB", first: "Antonio", last: "Rüdiger", nationality: "Germany" },
      { position: "LB", first: "Ferland", last: "Mendy", nationality: "France" },
      { position: "RB", first: "Dani", last: "Carvajal", nationality: "Spain" },
      { position: "CDM", first: "Aurélien", last: "Tchouaméni", nationality: "France" },
      { position: "CM", first: "Franco", last: "Mastantuono", nationality: "Argentina" },
      { position: "CM", first: "Jude", last: "Bellingham", nationality: "England" },
      { position: "CAM", first: "Arda", last: "Güler", nationality: "Turkey" },
      { position: "LW", first: "Vinícius", last: "Júnior", nationality: "Brazil" },
      { position: "RW", first: "Rodrygo", last: "Goes", nationality: "Brazil" },
      { position: "ST", first: "Kylian", last: "Mbappé", nationality: "France" },
    ],
  },
  {
    name: "FC Barcelona",
    shortName: "FCB",
    nickname: "Blaugrana",
    city: "Barcelona",
    stadium: "Camp Nou",
    primaryColor: "#a50044",
    secondaryColor: "#004d98",
    reputation: 91,
    budget: 30_000_000,
    identity: "BIG_SPENDER",
    roster: [
      { position: "GK", first: "Marc-André", last: "ter Stegen", nationality: "Germany" },
      { position: "CB", first: "Pau", last: "Cubarsí", nationality: "Spain" },
      { position: "CB", first: "Iñigo", last: "Martínez", nationality: "Spain" },
      { position: "LB", first: "Alejandro", last: "Balde", nationality: "Spain" },
      { position: "RB", first: "Jules", last: "Koundé", nationality: "France" },
      { position: "CDM", first: "Marc", last: "Casadó", nationality: "Spain" },
      { position: "CM", first: "Frenkie", last: "de Jong", nationality: "Netherlands" },
      { position: "CM", first: "Pedro", last: "González", nationality: "Spain" },
      { position: "CAM", first: "Pablo", last: "Gavira", nationality: "Spain" },
      { position: "LW", first: "Raphael", last: "Belloli", nationality: "Brazil" },
      { position: "RW", first: "Lamine", last: "Yamal", nationality: "Spain" },
      { position: "ST", first: "Ferran", last: "Torres", nationality: "Spain" },
    ],
  },
  {
    name: "Atlético Madrid",
    shortName: "ATM",
    nickname: "Los Colchoneros",
    city: "Madrid",
    stadium: "Metropolitano",
    primaryColor: "#ce2029",
    secondaryColor: "#1b2a4a",
    reputation: 85,
    budget: 24_000_000,
    identity: "TACTICAL",
    roster: [
      { position: "GK", first: "Juan", last: "Musso", nationality: "Argentina" },
      { position: "CB", first: "Robin", last: "Le Normand", nationality: "Spain" },
      { position: "CB", first: "Clément", last: "Lenglet", nationality: "France" },
      { position: "LB", first: "Javier", last: "Galán", nationality: "Spain" },
      { position: "RB", first: "Nahuel", last: "Molina", nationality: "Argentina" },
      { position: "CDM", first: "Rodrigo", last: "De Paul", nationality: "Argentina" },
      { position: "CM", first: "Jorge", last: "Resurrección", nationality: "Spain" },
      { position: "CM", first: "Pablo", last: "Barrios", nationality: "Spain" },
      { position: "CAM", first: "Antoine", last: "Griezmann", nationality: "France" },
      { position: "LW", first: "Ángel", last: "Correa", nationality: "Argentina" },
      { position: "RW", first: "Giuliano", last: "Simeone", nationality: "Argentina" },
      { position: "ST", first: "Julián", last: "Álvarez", nationality: "Argentina" },
    ],
  },
  {
    name: "Sevilla FC",
    shortName: "SEV",
    nickname: "Nervionenses",
    city: "Sevilla",
    stadium: "Ramón Sánchez-Pizjuán",
    primaryColor: "#ffffff",
    secondaryColor: "#d00027",
    reputation: 74,
    budget: 14_000_000,
    identity: "BALANCED",
    roster: [
      { position: "GK", first: "Cristian", last: "Rivero", nationality: "Spain" },
      { position: "CB", first: "Loïc", last: "Badé", nationality: "France" },
      { position: "CB", first: "Enrique", last: "Salas", nationality: "Spain" },
      { position: "LB", first: "Adrià", last: "Pedrosa", nationality: "Spain" },
      { position: "RB", first: "Jesús", last: "Navas", nationality: "Spain" },
      { position: "CDM", first: "Nemanja", last: "Gudelj", nationality: "Serbia" },
      { position: "CM", first: "Saúl", last: "Ñíguez", nationality: "Spain" },
      { position: "CM", first: "Lucien", last: "Agoumé", nationality: "France" },
      { position: "CAM", first: "Isaac", last: "Romero", nationality: "Spain" },
      { position: "LW", first: "Jesús", last: "Fernández", nationality: "Spain" },
      { position: "RW", first: "Erik", last: "Lamela", nationality: "Argentina" },
      { position: "ST", first: "Rafael", last: "Mir", nationality: "Spain" },
    ],
  },
  {
    name: "Real Sociedad",
    shortName: "RSO",
    nickname: "La Real",
    city: "San Sebastián",
    stadium: "Anoeta",
    primaryColor: "#0067b1",
    secondaryColor: "#ffffff",
    reputation: 76,
    budget: 15_000_000,
    identity: "DEVELOPMENT_CLUB",
    roster: [
      { position: "GK", first: "Álex", last: "Remiro", nationality: "Spain" },
      { position: "CB", first: "Igor", last: "Zubeldia", nationality: "Spain" },
      { position: "CB", first: "Aritz", last: "Elustondo", nationality: "Spain" },
      { position: "LB", first: "Aihen", last: "Muñoz", nationality: "Spain" },
      { position: "RB", first: "Jon", last: "Aramburu", nationality: "Spain" },
      { position: "CDM", first: "Martín", last: "Zubimendi", nationality: "Spain" },
      { position: "CM", first: "Mikel", last: "Merino", nationality: "Spain" },
      { position: "CM", first: "Brais", last: "Méndez", nationality: "Spain" },
      { position: "CAM", first: "David", last: "Silva", nationality: "Spain" },
      { position: "LW", first: "Ander", last: "Barrenetxea", nationality: "Spain" },
      { position: "RW", first: "Umar", last: "Sadiq", nationality: "Nigeria" },
      { position: "ST", first: "Mikel", last: "Oyarzabal", nationality: "Spain" },
    ],
  },
  {
    name: "Real Betis",
    shortName: "BET",
    nickname: "Los Verdiblancos",
    city: "Sevilla",
    stadium: "Benito Villamarín",
    primaryColor: "#0bb363",
    secondaryColor: "#ffffff",
    reputation: 71,
    budget: 12_000_000,
    identity: "BARGAIN_HUNTER",
    roster: [
      { position: "GK", first: "Rui", last: "Silva", nationality: "Portugal" },
      { position: "CB", first: "Marc", last: "Bartra", nationality: "Spain" },
      { position: "CB", first: "Natan", last: "Bernardo", nationality: "Brazil" },
      { position: "LB", first: "Alejandro", last: "Moreno", nationality: "Spain" },
      { position: "RB", first: "Héctor", last: "Bellerín", nationality: "Spain" },
      { position: "CDM", first: "Guido", last: "Rodríguez", nationality: "Argentina" },
      { position: "CM", first: "William", last: "Carvalho", nationality: "Portugal" },
      { position: "CM", first: "Nabil", last: "Fekir", nationality: "France" },
      { position: "CAM", first: "Francisco", last: "Alarcón", nationality: "Spain" },
      { position: "LW", first: "Ayoze", last: "Pérez", nationality: "Spain" },
      { position: "RW", first: "Aitor", last: "Ruibal", nationality: "Spain" },
      { position: "ST", first: "Walter", last: "Ávila", nationality: "Argentina" },
    ],
  },
  {
    name: "Athletic Club",
    shortName: "ATH",
    nickname: "Los Leones",
    city: "Bilbao",
    stadium: "San Mamés",
    primaryColor: "#ee2523",
    secondaryColor: "#ffffff",
    reputation: 78,
    budget: 16_000_000,
    identity: "YOUTH_FACTORY",
    roster: [
      { position: "GK", first: "Unai", last: "Simón", nationality: "Spain" },
      { position: "CB", first: "Aitor", last: "Paredes", nationality: "Spain" },
      { position: "CB", first: "Dani", last: "Vivian", nationality: "Spain" },
      { position: "LB", first: "Yuri", last: "Berchiche", nationality: "Spain" },
      { position: "RB", first: "Óscar", last: "de Marcos", nationality: "Spain" },
      { position: "CDM", first: "Mikel", last: "Vesga", nationality: "Spain" },
      { position: "CM", first: "Iñigo", last: "Galarreta", nationality: "Spain" },
      { position: "CM", first: "Unai", last: "Gómez", nationality: "Spain" },
      { position: "CAM", first: "Oihan", last: "Sancet", nationality: "Spain" },
      { position: "LW", first: "Nico", last: "Williams", nationality: "Spain" },
      { position: "RW", first: "Iñaki", last: "Williams", nationality: "Ghana" },
      { position: "ST", first: "Gorka", last: "Guruzeta", nationality: "Spain" },
    ],
  },
  {
    name: "Valencia CF",
    shortName: "VAL",
    nickname: "Los Che",
    city: "Valencia",
    stadium: "Mestalla",
    primaryColor: "#ee7f00",
    secondaryColor: "#ffffff",
    reputation: 68,
    budget: 10_000_000,
    identity: "DEFENSIVE_CLUB",
    roster: [
      { position: "GK", first: "Jaume", last: "Doménech", nationality: "Spain" },
      { position: "CB", first: "César", last: "Tárrega", nationality: "Spain" },
      { position: "CB", first: "Cristhian", last: "Mosquera", nationality: "Spain" },
      { position: "LB", first: "José", last: "Gayà", nationality: "Spain" },
      { position: "RB", first: "Thierry", last: "Correia", nationality: "Portugal" },
      { position: "CDM", first: "Javi", last: "Guerra", nationality: "Spain" },
      { position: "CM", first: "Pepelu", last: "Rodríguez", nationality: "Spain" },
      { position: "CM", first: "Fran", last: "Pérez", nationality: "Spain" },
      { position: "CAM", first: "Diego", last: "López", nationality: "Spain" },
      { position: "LW", first: "Sergi", last: "Canós", nationality: "Spain" },
      { position: "RW", first: "Luis", last: "Rioja", nationality: "Spain" },
      { position: "ST", first: "Hugo", last: "Duro", nationality: "Spain" },
    ],
  },
];

export function findSpainClub(name: string): RealClubSeed | undefined {
  return SPAIN_REAL_CLUBS.find((c) => c.name === name);
}
