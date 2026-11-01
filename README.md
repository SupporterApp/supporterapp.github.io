# Ffans — web pública

Web de producte i documentació de **Ffans** (Supporters App): portada, blog de
novetats, pàgines d'ajuda i textos legals en català, castellà i anglès.

- Producció: <https://supporter-app.com>
- Stack: [Astro](https://astro.build) 6 + Markdown content collections
- Desplegament: GitHub Pages via GitHub Actions a cada push a `main`

## Requisits

- Node.js **>= 22.12.0** (vegeu `engines` a `package.json`)
- npm 10 o superior

## Posar-lo en marxa

```sh
npm install
npm run dev
```

El servidor de desenvolupament queda a <http://localhost:4321>. Com que el
català és l'idioma per defecte i `prefixDefaultLocale` està activat, l'arrel
redirigeix a `/ca/`:

- <http://localhost:4321/ca/>
- <http://localhost:4321/es/>
- <http://localhost:4321/en/>

## Provar-ho abans de pujar res

Aquesta és la seqüència que hauria de passar sempre abans d'un `git push` a
`main` (el push desplega automàticament):

```sh
npm run check        # astro check: tipus, props i sintaxi .astro
npm run build        # compila a dist/ i valida contingut i rutes
npm run check:links  # enllaços del build, SENSIBLE A MAJÚSCULES
npm run preview      # serveix dist/ a http://localhost:4321

# o tot de cop:
npm run verify
```

`npm run check` és el que et dirà si una pàgina passa una prop a `Layout` amb el
tipus equivocat, si un camp del frontmatter no encaixa amb l'esquema o si un
import no existeix. `npm run build` no fa aquestes comprovacions, així que els
dos són necessaris.

### Per què `check:links` és obligatori

Windows i macOS no distingeixen majúscules als noms de fitxer; GitHub Pages
serveix des de Linux i sí. Un enllaç a `/ca/legal/privacyPolicy` funciona en
local encara que la carpeta generada sigui `privacypolicy`, i dona **404 en
producció**. `check:links` recorre el `dist/` i resol cada segment contra el
nom real del directori, amb comparació exacta.

Per això les rutes d'ajuda i legal no surten de l'`id` del contingut (que
Astro passa a minúscules) sinó del camp `route` del frontmatter, que conserva
les majúscules que l'app mòbil té escrites en dur.

### Què convé mirar a mà abans de publicar

Amb `npm run preview` obert:

1. **Portada** (`/ca/`, `/es/`, `/en/`): CTA de botigues, seccions i últimes novetats.
2. **Idioma**: que el selector porti a la mateixa pàgina en l'altre idioma, i que
   `<html lang>` sigui el correcte (inspecciona l'element).
3. **Legal**: privacitat, avís legal, termes i eliminació de compte, als tres idiomes.
4. **Ajuda**: les quatre pàgines del desplegable.
5. **Blog**: índex, un post i la navegació anterior/següent.
6. **Mode fosc**: el botó de la lluna al header.
7. **Mòbil**: redueix la finestra a ~390 px o fes servir les eines del navegador.
8. **Compartir**: mira el codi font i comprova que `og:image` apunta a
   `https://supporter-app.com/og-default.png`.

### Provar la vista integrada dins l'app

L'app obre aquestes pàgines dins d'un webview amb el paràmetre `?webview=1`
(amaga el header i el peu i ajusta els marges). Per veure-ho:

```
http://localhost:4321/ca/legal/privacyPolicy?webview=1
```

## Publicar l'app a les botigues

Els botons de descàrrega de la portada es generen a partir de dues constants
buides a `src/consts.ts`:

```ts
export const PLAY_STORE_URL = '';
export const APP_STORE_URL = '';
```

Mentre estiguin buides, la portada mostra l'avís «Properament a Google Play i
App Store». Quan tinguis la fitxa publicada, enganxa-hi la URL i el botó
corresponent apareixerà sol als tres idiomes, sense tocar cap pàgina. El nom que
es mostra és `APP_NAME`.

## Domini

El domini de producció és **`https://supporter-app.com`** i viu en una sola
constant, `SITE_URL` a `src/consts.ts`, que alimenta `astro.config.mjs`
(canòniques, sitemap, RSS i `og:url`). El fitxer `public/CNAME` fixa el domini
a GitHub Pages. Si mai canvia el domini:

1. Actualitza `SITE_URL` i `public/CNAME`.
2. Regenera `public/og-default.png` si hi surt el domini.

## Desplegament

- `.github/workflows/deploy.yml`: a cada push a `main` passa primer
  `npm ci && npm run check`; si va bé, compila i publica a GitHub Pages.
- `.github/workflows/check.yml`: el mateix `check` + `build` en cada pull request.

Si el job `check` falla, el desplegament no arriba a executar-se: és el
mecanisme que impedeix publicar una pàgina trencada.

## Afegir un post al blog

Els posts són Markdown a `src/content/blog/<idioma>/`. Cal crear el fitxer als
tres idiomes amb el mateix nom:

```
src/content/blog/ca/el-meu-post.md
src/content/blog/es/el-meu-post.md
src/content/blog/en/el-meu-post.md
```

Frontmatter (l'esquema és a `src/content.config.ts`):

```yaml
---
title: 'Títol del post'
pubDate: 2026-10-28
description: 'Una línia que surt a l'índex i a les metadades.'
heroImage: '../../../assets/blog/el-meu-post.png'
author: 'Equip Ffans'
tags: ['futbol', 'fans']
---
```

**No comencis el cos amb `# Títol`**: el títol ja es pinta des del frontmatter, i
si l'hi afegeixes sortiran dos `h1`. Comença directament amb el paràgraf
d'entrada, i fes servir `##` per a les seccions.

### Imatge de capçalera (`heroImage`)

`heroImage` és opcional. Si hi és, la imatge surt a la targeta de l'índex del
blog, a dalt de l'article i com a `og:image` quan es comparteix l'enllaç al
WhatsApp o a les xarxes.

- Les imatges viuen a `src/assets/blog/` i s'enllacen amb ruta **relativa** des
del markdown (`../../../assets/blog/<nom>.png`).
- Mida recomanada: **1200×600** (2:1). Astro genera sol les versions WebP i el
  `srcset` per a mòbil i escriptori.
- `alt` és buit a propòsit: són il·lustracions decoratives i el títol ja és just a
  sota.
- Com que les imatges no porten text, la mateixa serveix per als tres idiomes.

Les imatges del cos es posen a `public/images/blog/` i s'enllacen amb rutes
absolutes (`/images/blog/fitxer.svg`).

## Mapa del projecte

```
src/
├── consts.ts              # títol, descripció, domini, URLs de les botigues, og:image
├── content.config.ts      # esquema del frontmatter dels posts
├── content/blog/{ca,es,en}/
├── content/docs/{ca,es,en}/  # ajuda i legal en MDX (una entrada per pàgina)
├── data/empresa.ts        # dades legals (nom, NIF, adreça, correu, terminis)
├── i18n/ui.ts             # totes les cadenes de la interfície als 3 idiomes
├── assets/blog/           # imatges de capçalera dels posts (1200×600)
├── assets/screenshots/    # captures de l'app per a la portada (9:16)
├── components/
│   ├── HomePage.astro         # portada sencera (rep lang)
│   ├── BlogPostPage.astro     # layout de post amb sidebar i navegació (rep lang)
│   ├── DeleteAccountPage.astro# pàgina d'eliminació de compte (rep lang)
│   ├── BaseHead.astro         # metadades, canonical, Open Graph
│   ├── Header.astro / Footer.astro
│   └── FormattedDate.astro
├── layouts/
│   ├── Layout.astro       # <html>, tema clar/fosc, contenidor
│   └── DocLayout.astro    # targeta única per a ajuda i legal
└── pages/
    ├── {ca,es,en}/        # portada, blog, deleteAccount
    ├── [lang]/help/[slug].astro   # rutes dinàmiques dels documents
    ├── [lang]/legal/[slug].astro
    └── 404.astro
```

## Captures de la portada

El hero de la portada mostra **dos mòbils encavalcats** amb captures reals de
l'app. Els fitxers viuen a `src/assets/screenshots/` i són **els mateixos per als
tres idiomes**: les imatges no es tradueixen, només l'`alt` (claus
`home.shot.match` i `home.shot.badges` a `src/i18n/ui.ts`).

- Format: **1080×1848** (9:16), amb la barra d'estat del sistema ja retallada.
- El marc del mòbil el dibuixa el CSS (`.phone` a `HomePage.astro`), no la
  imatge: així la vora canvia amb el tema clar/fosc i la captura queda nítida.
- Astro genera sol les versions WebP i el `srcset`: al voltant de 9–40 KB segons
  la mida de pantalla.

Per canviar-les, sobreescriu els dos fitxers amb el mateix nom. Si les captures
noves porten barra d'estat, retalla-la abans (uns 70 px per dalt en una imatge
de 1080 d'ample) perquè quedi igual d'atemporal.

## Ajuda i legal

Cada pàgina és un fitxer MDX a `src/content/docs/<idioma>/`. Les rutes les
generen `src/pages/[lang]/help/[slug].astro` i `[lang]/legal/[slug].astro` a
partir del camp `section` del frontmatter:

```yaml
---
title: 'Política de Privacitat'
description: 'Quines dades recull Ffans...'
section: legal      # help | legal
order: 1
route: privacyPolicy  # segment de la URL; conserva les majúscules
---
```

El cos és HTML dins MDX, amb les classes `.highlight` i `.footer` per a les
caixes destacades. Els estils són tots a `src/layouts/DocLayout.astro` i fan
servir els tokens del tema, així que el mode fosc funciona sol.

Per a les dades de l'empresa, importa-les al mateix MDX:

```mdx
import { nom, nif, email, dataRevisio } from '../../../data/empresa';
```

Per afegir una pàgina nova: crea el `.mdx` als tres idiomes amb el mateix nom i
ja apareixerà a la ruta que toqui. Si és una pàgina d'ajuda nova, afegeix
també l'enllaç al desplegable d'`Header.astro` i al peu.

## Pendent (fases següents)

- `hreflang` al sitemap per enllaçar les versions dels tres idiomes.
- Valorar posar les imatges de capçalera també a les targetes d’«Últimes
  novetats» de la portada.
- Auditar la integració webview de `supportersapp_mobile` i contrastar la
  política de privacitat amb el que l’app recull de veritat.
- Confirmar si l’app permet eliminar el compte des de dins (Google Play ho
  exigeix); a `lib/` no hi ha cap flux de baixa.

> El rànquing d'equips (antic `TeamScores`, integració `team-scores` i workflow
> `update-scores.yml`) es va retirar del tot. Si es vol recuperar, cal reafegir
> l'origen de dades i el component.
