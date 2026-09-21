// Name and nationality pools used to generate a believable fictional player database.

export interface NationalityPool {
  country: string;
  flag: string;
  firstNames: string[];
  lastNames: string[];
}

export const NATIONALITIES: NationalityPool[] = [
  {
    country: "Portugal",
    flag: "🇵🇹",
    firstNames: ["Daniel", "Tiago", "Rui", "Bruno", "Nuno", "Diogo", "Goncalo", "Pedro"],
    lastNames: ["Costa", "Mendes", "Silva", "Fonseca", "Ramos", "Carvalho", "Pinto", "Lopes"],
  },
  {
    country: "Spain",
    flag: "🇪🇸",
    firstNames: ["Marco", "Alvaro", "Sergio", "Pablo", "Diego", "Hugo", "Ivan", "Mateo"],
    lastNames: ["Silva", "Alvarez", "Ruiz", "Navarro", "Molina", "Serrano", "Vidal", "Ortega"],
  },
  {
    country: "Brazil",
    flag: "🇧🇷",
    firstNames: ["Lucas", "Gabriel", "Rafael", "Thiago", "Bruno", "Matheus", "Caio", "Igor"],
    lastNames: ["Moretti", "Pereira", "Souza", "Almeida", "Barros", "Nascimento", "Teixeira", "Rocha"],
  },
  {
    country: "Argentina",
    flag: "🇦🇷",
    firstNames: ["Nico", "Mateo", "Santiago", "Franco", "Agustin", "Ezequiel", "Lautaro", "Ivan"],
    lastNames: ["Alvarez", "Pereira", "Diaz", "Romero", "Acosta", "Ibanez", "Aguirre", "Medina"],
  },
  {
    country: "England",
    flag: "🏴",
    firstNames: ["Ethan", "Jack", "Harry", "Oliver", "Charlie", "George", "Callum", "Liam"],
    lastNames: ["Clarke", "Wright", "Turner", "Hayes", "Foster", "Mason", "Bennett", "Walsh"],
  },
  {
    country: "France",
    flag: "🇫🇷",
    firstNames: ["Adam", "Leo", "Hugo", "Mathis", "Enzo", "Nathan", "Theo", "Rayan"],
    lastNames: ["Benali", "Girard", "Moreau", "Lefevre", "Bernard", "Dubois", "Martin", "Fontaine"],
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    firstNames: ["Finn", "Luca", "Jonas", "Paul", "Elias", "Max", "Leon", "Felix"],
    lastNames: ["Weber", "Schulz", "Hoffmann", "Becker", "Wagner", "Krause", "Richter", "Voigt"],
  },
  {
    country: "Nigeria",
    flag: "🇳🇬",
    firstNames: ["Samuel", "Emeka", "Chidi", "Kelechi", "Tobi", "Segun", "Ikenna", "David"],
    lastNames: ["Okoro", "Adeyemi", "Eze", "Nwosu", "Balogun", "Okafor", "Ibrahim", "Chukwu"],
  },
  {
    country: "Ghana",
    flag: "🇬🇭",
    firstNames: ["Kwame", "Kofi", "Yaw", "Emmanuel", "Isaac", "Michael", "Daniel", "Joseph"],
    lastNames: ["Owusu", "Mensah", "Boateng", "Asante", "Appiah", "Amoah", "Osei", "Adjei"],
  },
  {
    country: "Morocco",
    flag: "🇲🇦",
    firstNames: ["Youssef", "Amine", "Karim", "Yassine", "Omar", "Adam", "Hamza", "Anas"],
    lastNames: ["Haddad", "Benjelloun", "El Amrani", "Tazi", "Idrissi", "Chakir", "Naciri", "Baha"],
  },
  {
    country: "Israel",
    flag: "🇮🇱",
    firstNames: ["Itai", "Noam", "Omer", "Yonatan", "Ariel", "Eden", "Or", "Tomer"],
    lastNames: ["Cohen", "Levi", "Mizrahi", "Peretz", "Azulay", "Biton", "Dahan", "Shapira"],
  },
  {
    country: "Netherlands",
    flag: "🇳🇱",
    firstNames: ["Daan", "Sem", "Luuk", "Bram", "Milan", "Jesse", "Thijs", "Ruben"],
    lastNames: ["de Vries", "Bakker", "Visser", "Jansen", "Smit", "Mulder", "de Boer", "Dekker"],
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    firstNames: ["Matteo", "Lorenzo", "Andrea", "Gabriele", "Riccardo", "Alessio", "Marco", "Davide"],
    lastNames: ["Moretti", "Ricci", "Greco", "Conti", "De Luca", "Bruno", "Barbieri", "Fontana"],
  },
  {
    country: "Croatia",
    flag: "🇭🇷",
    firstNames: ["Ivan", "Luka", "Marko", "Ante", "Josip", "Filip", "Dino", "Toni"],
    lastNames: ["Horvat", "Kovacic", "Babic", "Maric", "Juric", "Vidak", "Sablic", "Perkovic"],
  },
  {
    country: "Serbia",
    flag: "🇷🇸",
    firstNames: ["Nikola", "Stefan", "Milos", "Aleksandar", "Marko", "Filip", "Luka", "Dusan"],
    lastNames: ["Jovanovic", "Petrovic", "Nikolic", "Ilic", "Stankovic", "Pavlovic", "Kovacevic", "Milic"],
  },
  {
    country: "Turkey",
    flag: "🇹🇷",
    firstNames: ["Emre", "Baris", "Cem", "Kaan", "Deniz", "Arda", "Mert", "Berk"],
    lastNames: ["Yildiz", "Demir", "Kaya", "Sahin", "Celik", "Aydin", "Ozturk", "Arslan"],
  },
];

export function flagFor(country: string): string {
  return NATIONALITIES.find((n) => n.country === country)?.flag ?? "⚽";
}
