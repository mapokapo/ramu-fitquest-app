# FitQuest

## Opis

FitQuest je projekt za kolegij Razvoj Aplikacija za Mobilne Uređaje, na 3. godini studija računarstva na FSRE, SUM.

FitQuest je interaktivan i zabavan način motiviranja korisnika da održava zdrav životni stil.

## Tehnologije

Aplikacija je rađena u React Native-u, koristeći Expo platformu za razvoj.

Za backend platformu se koristi Supabase.

## Pokretanje projekta

> [!WARNING]
> Morate imati `.env` datoteku unutar projekta koji sadrži "EXPO_PUBLIC_SUPABASE_URL" i "EXPO_PUBLIC_SUPABASE_ANON_KEY" varijable. Ova datoteka se ne nalazi na GitHub-u radi sigurnosnih razloga, pa morate prekopirati `.env.example` datoteku i preimenovati ju u `.env` kako bi se projekt pravilno spojio na Supabase. Ta datoteka u sebi ima već postavljenje vrijednosti.

Projekt je moguće pokrenuti na lokalnom računalu koristeći Expo CLI.

1. Instalirati pakete:

```bash
npm install
```

2. Pokrenuti Expo CLI:

```bash
npm start
```

Aplikacija će se pokrenuti u web pregledniku nakon što kliknete dugme `w` u terminalu.

Aplikaciju je također moguće pokrenuti i na Android uređaju putem komande:

```bash
npm run android
```

Morate imati instaliran JDK i Android Studio na računalu.

## Članovi tima

- Dragan Arapović
- Mate Marić
- Leo Petrović
