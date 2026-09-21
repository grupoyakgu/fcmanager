import { Fixture } from "@/types";
import { makeId } from "@/lib/utils";

// Standard circle-method double round-robin scheduler — every club plays every
// other club home and away across the season.
export function generateFixtures(clubIds: string[]): Fixture[] {
  const ids = [...clubIds];
  if (ids.length % 2 !== 0) ids.push("BYE");
  const n = ids.length;
  const rounds = n - 1;
  const half = n / 2;
  const fixtures: Fixture[] = [];

  let arr = [...ids];
  const firstLeg: { home: string; away: string; round: number }[] = [];

  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < half; i++) {
      const home = arr[i];
      const away = arr[n - 1 - i];
      if (home !== "BYE" && away !== "BYE") {
        const flip = round % 2 === 1;
        firstLeg.push({
          home: flip ? away : home,
          away: flip ? home : away,
          round: round + 1,
        });
      }
    }
    const fixed = arr[0];
    const rest = arr.slice(1);
    rest.unshift(rest.pop() as string);
    arr = [fixed, ...rest];
  }

  firstLeg.forEach(({ home, away, round }) => {
    fixtures.push({ id: makeId("fx"), matchday: round, homeClubId: home, awayClubId: away, played: false });
  });
  firstLeg.forEach(({ home, away, round }) => {
    fixtures.push({
      id: makeId("fx"),
      matchday: rounds + round,
      homeClubId: away,
      awayClubId: home,
      played: false,
    });
  });

  return fixtures.sort((a, b) => a.matchday - b.matchday);
}
