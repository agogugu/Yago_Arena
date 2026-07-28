# Yago Xiangqi Arena

Sito statico dell'archivio dei tornei tra motori di Xiangqi ospitati su Yago Arena e organizzati dalla Federazione Italiana Xiangqi.

## Contenuto

- `index.html`: homepage, risultati, note e motori partecipanti.
- `swiss_arena_Swiss_20260724_1310.html`: classifica e dettaglio dei turni.
- `crosstable_arena_Swiss_20260724_1310.html`: tabellone incrociato.
- `tournament_arena_Swiss_20260724_1310.json`: dati originali del torneo.
- `assets/`: stile, comportamento e immagini.

## Aggiungere un nuovo torneo

1. Creare una cartella in `tournaments/`, per esempio `tournaments/knockout-2026/`.
2. Copiare al suo interno una pagina `index.html` con risultati e note del nuovo torneo.
3. Caricare nella stessa cartella i file esportati da Yago Arena.
4. Aggiungere una scheda nella sezione `Archivio tornei` della homepage.
5. Sostituire la scheda `Prossimamente` quando il torneo comincia.

I collegamenti del sito sono relativi, quindi funzionano come GitHub Project Pages.

## GitHub Pages

In **Settings → Pages** scegliere:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/ (root)`

Il sito sarà disponibile su `https://agogugu.github.io/Yago_Arena/`.
