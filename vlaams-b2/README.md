# Vlaams B2 🦁

App web para pasar del nivel **A2 al B2 en neerlandés de Flandes** en 26 semanas, con sesiones diarias de unos 40 minutos.
Las explicaciones están en español.

## Qué incluye

- **Plan de 26 semanas** en 3 fases (A2+ → B1 → B1+ → B2), con una prueba al final de cada fase (semanas 9, 18 y 26).
- **Sesión diaria** con: vocabulario (repetición espaciada), gramática, audición, dictado, flamenco de la calle, una misión con medios reales (VRT, Radio 2 Antwerpen, «Thuis»…) y expresión escrita u oral (alternan cada día).
- **21 lecciones de gramática** (180 ejercicios). Prioridad para el orden de palabras y los verbos, con repaso automático de los ejercicios que más fallas.
- **245 palabras base** en 6 temas (trabajo, trámites, vida social, noticias, día a día en Flandes y conectores), y puedes **añadir tus propias palabras**.
- **14 textos de audición** (anuncios, diálogos, tussentaal, noticias, entrevistas), 38 dictados y un quiz de habla rápida. Todo con velocidad ajustable de 0,7× a 1,3×.
- **Guía de acentos** (prioridad para Amberes), 50 expresiones y 24 formas reducidas del habla rápida.
- **Shadowing** con reconocimiento de voz (Chrome, Edge o Safari).

El progreso se guarda en el navegador (`localStorage`). Desde *Progreso → Ajustes* puedes exportar e importar una copia de seguridad.

## Uso

```bash
cd vlaams-b2
npm install
npm run dev      # http://localhost:3001
npm run build    # genera dist/ (estático, se puede alojar en GitHub Pages, Netlify…)
```

Para el audio hace falta una voz neerlandesa en el sistema; lo ideal es **Nederlands (België)**.
