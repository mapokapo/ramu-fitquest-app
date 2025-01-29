export const challengesTranslationMap = (
  challengeCode: string,
  value: number
): string | null => {
  const map: Record<string, ((value: number) => string) | undefined> = {
    walk_steps: (steps: number) => `Pređite ${steps} koraka`,
    do_pushups: (pushups: number) => `Napravite ${pushups} sklekova`,
    stretch_mins: (mins: number) => `Odradite ${mins} minuta istezanja`,
    drink_water_mls: (mls: number) => `Popijte ${mls} ml vode`,
    plank_mins: (mins: number) => `Odradite plank ${mins} minuta`,
    read_pages: (pages: number) => `Pročitajte ${pages} stranica knjige`,
    do_situps: (situps: number) => `Napravite ${situps} trbušnjaka`,
    do_squats: (squats: number) => `Napravite ${squats} čučnjeva`,
    walk_m: (m: number) => `Pređite ${m} metara`,
    do_yoga_mins: (mins: number) => `Odradite ${mins} minuta joge`,
    take_picture: () => `Uslikajte motivirajuću sliku`,
  };

  const translation = map[challengeCode];

  if (!translation) {
    return null;
  }

  return translation(value);
};
