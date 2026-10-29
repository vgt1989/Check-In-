import type { Expression, Reduction } from '../types';

export const expressions: Expression[] = [
  { nl: 'Amai (mijn frak)!', es: '¡Madre mía! / ¡Hala!', note: 'Sorpresa o admiración. Muy flamenco.', ex: 'Amai, wat een file vandaag!', vlaams: true },
  { nl: 'Allez!', es: '¡Venga! / ¡Vamos! / Bueno…', note: 'Comodín: para animar, despedirse o mostrar impaciencia.', ex: 'Allez, tot morgen!', vlaams: true },
  { nl: 'Allez gij!', es: '¡No me digas! / ¡Anda ya!', note: 'Incredulidad.', ex: 'Ge hebt de lotto gewonnen? Allez gij!', vlaams: true },
  { nl: 'Ça va? — ’t Gaat.', es: '¿Qué tal? — Va bien.', note: 'Los flamencos usan muchísimo el «ça va» francés.', vlaams: true },
  { nl: 'Hoe is ’t (ermee)?', es: '¿Cómo te va?', ex: 'Hoe is ’t ermee? — Goed, en met u?' },
  { nl: 'Merci (wel)!', es: '¡Gracias!', note: 'Más frecuente que «dank je» en Flandes.', vlaams: true },
  { nl: 'Alstublieft / Alsjeblieft', es: 'Por favor / Aquí tiene', note: 'En Bélgica también se dice al dar algo: «Alstublieft» = aquí tiene.', vlaams: true },
  { nl: 'Graag gedaan', es: 'De nada' },
  { nl: 'Tot seffens! / Tot straks!', es: '¡Hasta luego! (hoy)', vlaams: true },
  { nl: 'Smakelijk!', es: '¡Que aproveche!' },
  { nl: 'Santé! / Schol!', es: '¡Salud!', note: 'Brindis. «Santé» es muy común en Flandes.', vlaams: true },
  { nl: 'Dat is in orde.', es: 'Está bien / de acuerdo.', note: 'Muy belga: «Is dat in orde voor u?»', vlaams: true },
  { nl: 'Ik heb (gene) goesting.', es: '(No) me apetece.', ex: 'Ik heb goesting in een pak friet.', vlaams: true },
  { nl: 'Het is mij om het even.', es: 'Me da igual.' },
  { nl: 'Dat zal wel.', es: 'Sí, claro… (a menudo irónico)' },
  { nl: 'Zever (in pakskes)!', es: '¡Tonterías!', note: '«zeveren» = decir tonterías o quejarse.', vlaams: true },
  { nl: 'Ge zijt zot!', es: '¡Estás loco/a!', note: 'Puede ser cariñoso.', vlaams: true },
  { nl: 'Op uw gemak.', es: 'Con calma, tranquilo/a.', ex: 'Doe maar op uw gemak, er is geen haast.', vlaams: true },
  { nl: 'Doe maar.', es: 'Adelante, hazlo.' },
  { nl: '’t Is te zeggen…', es: 'O sea… / Bueno, es que…', note: 'Muletilla para matizar.', vlaams: true },
  { nl: 'Ewa!', es: '¡Ey! / Bueno…', note: 'Jerga urbana juvenil (Amberes, Bruselas), del árabe marroquí «iwa».', vlaams: true },
  { nl: 'Wreed (goed)', es: 'Muy (bueno), tremendo', note: '«wreed» literalmente es «cruel», pero en jerga intensifica.', ex: 'Da’s wreed goed!', vlaams: true },
  { nl: 'Kei- (keigoed, keiplezant)', es: 'Súper- (superbién, superdivertido)', vlaams: true },
  { nl: 'Ik ben het beu.', es: 'Estoy harto/a.' },
  { nl: 'Het valt mee. / Het valt tegen.', es: 'No es tan malo como pensaba. / Es peor de lo esperado.', ex: 'Het examen viel mee!' },
  { nl: 'Dat maakt niet uit.', es: 'No importa.' },
  { nl: 'Dat klopt.', es: 'Es correcto / así es.' },
  { nl: 'Wablieft?', es: '¿Perdón? ¿Cómo dice?', note: 'Típicamente flamenco cuando no has oído bien.', vlaams: true },
  { nl: 'Kunt u wat trager spreken, alstublieft?', es: '¿Puede hablar un poco más despacio?', note: '«trager» es muy belga (NL: langzamer). ¡Tu frase de supervivencia!', vlaams: true },
  { nl: 'Hoe zeg je … in het Nederlands?', es: '¿Cómo se dice… en neerlandés?' },
  { nl: 'Dat is niet evident.', es: 'No es fácil / no es obvio.', note: 'Galicismo belga.', ex: 'Het is niet evident om hier te parkeren.', vlaams: true },
  { nl: 'Zijn plan trekken', es: 'Arreglárselas (solo)', ex: 'Ge moet uw plan trekken.', vlaams: true },
  { nl: 'Kom ne keer langs!', es: '¡Pásate algún día!', vlaams: true },
  { nl: 'Goed bezig!', es: '¡Así se hace! / ¡Bien hecho!', vlaams: true },
  { nl: 'Veel succes! / Veel beterschap!', es: '¡Mucha suerte! / ¡Que te mejores!' },
  { nl: 'Nog een schone dag!', es: '¡Que tenga un buen día!', note: 'Despedida típica en tiendas.', vlaams: true },
  { nl: 'Het regent pijpenstelen.', es: 'Llueve a cántaros.' },
  { nl: 'Met de deur in huis vallen', es: 'Ir directamente al grano' },
  { nl: 'Iemand een hart onder de riem steken', es: 'Dar ánimos a alguien' },
  { nl: 'De kat uit de boom kijken', es: 'Esperar a ver qué pasa' },
  { nl: 'Twee vliegen in één klap slaan', es: 'Matar dos pájaros de un tiro' },
  { nl: 'Nu komt de aap uit de mouw.', es: 'Ahora sale la verdad a la luz.' },
  { nl: 'Iets onder de knie hebben', es: 'Dominar algo', ex: 'Ik heb de inversie nu onder de knie!' },
  { nl: 'De handdoek in de ring gooien', es: 'Tirar la toalla' },
  { nl: 'Zijn beste beentje voorzetten', es: 'Dar lo mejor de sí' },
  { nl: 'Ik zie het (niet) zitten.', es: '(No) lo veo / (no) me convence.' },
  { nl: 'Dat is boter aan de galg.', es: 'Es inútil / no sirve de nada.' },
  { nl: 'Op tijd en stond', es: 'De vez en cuando (en su momento)', vlaams: true },
  { nl: 'Ik ben er kapot van.', es: 'Estoy destrozado/a (agotado o muy afectado).' },
  { nl: 'Het is weer van dat!', es: '¡Otra vez lo mismo!', note: 'Queja típica flamenca.', vlaams: true },
];

export const reductions: Reduction[] = [
  { spoken: "'k Weet het nie.", standard: 'Ik weet het niet.', note: "Se oye casi como «kweetnie»." },
  { spoken: "Hoe is 't?", standard: 'Hoe is het?' },
  { spoken: "Da's goed.", standard: 'Dat is goed.' },
  { spoken: "'t Is al goed.", standard: 'Het is al goed.', note: '= Vale, ya está, no pasa nada.' },
  { spoken: 'Wa zegde gij?', standard: 'Wat zeg jij?' },
  { spoken: 'Hebde gij tijd?', standard: 'Heb jij tijd?' },
  { spoken: 'Zijde gij moe?', standard: 'Ben jij moe?' },
  { spoken: 'Kunde gij da?', standard: 'Kun jij dat?' },
  { spoken: 'Wilde gij iets drinken?', standard: 'Wil jij iets drinken?' },
  { spoken: 'Gade mee?', standard: 'Ga je mee?' },
  { spoken: "Wa's da?", standard: 'Wat is dat?' },
  { spoken: 'Is da van u?', standard: 'Is dat van jou?' },
  { spoken: 'Ik heb da nie gezien.', standard: 'Ik heb dat niet gezien.' },
  { spoken: 'Ne keer', standard: 'Een keer', note: 'También «una vez / a ver»: «Zeg ne keer…»' },
  { spoken: 'Nen auto', standard: 'Een auto', note: '«nen» ante vocal y b, d, h, t.' },
  { spoken: 'Efkes wachten.', standard: 'Even wachten.' },
  { spoken: 'Ik zen moe.', standard: 'Ik ben moe.', note: 'Típico de Amberes.' },
  { spoken: 'Ge moet da nie doen.', standard: 'Je hoeft dat niet te doen.' },
  { spoken: 'Ik peis het.', standard: 'Ik denk het.', note: 'peinzen = pensar.' },
  { spoken: 'Ik denk dade gelijk hebt.', standard: 'Ik denk dat je gelijk hebt.' },
  { spoken: "'k Heb gene tijd.", standard: 'Ik heb geen tijd.' },
  { spoken: 'Hij hee gebeld.', standard: 'Hij heeft gebeld.' },
  { spoken: "Ge zijt toch nie boos, hè?", standard: 'Je bent toch niet boos, hè?' },
  { spoken: 'Seffens', standard: 'Straks / zo meteen' },
];

export interface AccentRegion {
  id: string;
  name: string;
  priority?: boolean;
  intro: string;
  features: { title: string; text: string; examples?: string[] }[];
  listen: string[];
}

export const accents: AccentRegion[] = [
  {
    id: 'antwerpen',
    name: 'Amberes (Antwerps)',
    priority: true,
    intro: 'El acento que más vas a oír. Los antwerpenaren («Sinjoren») tienen fama de hablar con mucha seguridad y bastante rápido. El dialecto de la ciudad es distinto del de los pueblos de la provincia (Kempen, Mechelen…).',
    features: [
      { title: 'Vocales abiertas y alargadas', text: 'Las vocales suenan más abiertas y largas que en el estándar. La «ij/ei» suele sonar casi como una «aa» larga: «mijn» suena parecido a «maan», «tijd» a «taad».', examples: ['Bij mij → «baa maa»', 'Antwerpen → «Antwaarpe»'] },
      { title: 'Caída de finales', text: 'Desaparecen la -n de los infinitivos y plurales y la -t final: «lope» (lopen), «nie» (niet), «da» (dat), «wa» (wat).' },
      { title: '«Ik zen» y otras formas', text: '«ik zen» (ik ben) es muy típico de Amberes. También verás «ge/gij», «ne/nen» y diminutivos en -ke.' },
      { title: 'Vocabulario de la ciudad', text: 'sinjoor (antwerpenaar de toda la vida), bolleke (copa de De Koninck), pagadder (crío), dikke nek (fanfarrón: el apodo que el resto de Flandes da a los de Amberes), ’t Stad (el centro / la ciudad), schoon (bonito).' },
      { title: 'Jerga urbana', text: 'Entre los jóvenes se oye mucha jerga multicultural: «ewa», «wollah», «sahbi»… Véase la película «Patser» (es muy coloquial).' },
    ],
    listen: ['Radio 2 Antwerpen (la emisora regional de VRT)', 'ATV, la televisión regional de Amberes: noticias locales', 'La serie «Rough Diamonds» (Netflix), ambientada en el barrio de los diamantes', 'La película «Patser», con jerga urbana de Amberes'],
  },
  {
    id: 'oost',
    name: 'Gante / Flandes Oriental',
    intro: 'El acento de Gante es muy reconocible y sus habitantes están orgullosos de él.',
    features: [
      { title: 'La «r» uvular', text: 'Mucha gente de Gante pronuncia la «r» en la garganta (parecida a la francesa).' },
      { title: 'Palabras típicas', text: '«sebiet» (enseguida, = seffens), «awel» (bueno, pues), «ne keer» (a ver, una vez).' },
    ],
    listen: ['Radio 2 Oost-Vlaanderen', 'Programas y presentadores de Gante en VRT'],
  },
  {
    id: 'west',
    name: 'Flandes Occidental (West-Vlaams)',
    intro: 'El dialecto más difícil para los extranjeros, e incluso para muchos flamencos. Con que reconozcas sus rasgos es suficiente.',
    features: [
      { title: 'g → h, y la h desaparece', text: '«goed» suena como «hoed»; y «huis» como «uus».' },
      { title: 'Formas propias', text: '«’k è» (ik heb), «joa» (ja), «wuk» (wat), «ol» (al).' },
    ],
    listen: ['La serie «Chantal» (VRT), ambientada en un pueblo de Flandes Occidental', 'Radio 2 West-Vlaanderen'],
  },
  {
    id: 'limburg',
    name: 'Limburgo',
    intro: 'Tiene un acento melódico, «cantado», porque el dialecto tiene tonos.',
    features: [
      { title: 'Melodía', text: 'Las palabras suben y bajan de tono. La «g» es suave.' },
      { title: 'Formas propias', text: 'En parte de Limburgo se oye «ich» por «ik» y «doe» por «jij».' },
    ],
    listen: ['Radio 2 Limburg', 'La serie «Undercover» (Netflix) tiene personajes limburgueses'],
  },
  {
    id: 'brabant',
    name: 'Bruselas / Brabante',
    intro: 'El brabante flamenco (Lovaina, Malinas) se parece al de Amberes. En Bruselas el neerlandés se mezcla mucho con el francés.',
    features: [
      { title: 'Galicismos', text: 'merci, ça va, allez, trottoir (acera), chique (chicle), «evident» (fácil), «content» (contento).' },
      { title: 'El «Brussels Vlaams»', text: 'El dialecto tradicional de Bruselas («Brusseleir») mezcla flamenco y francés en la misma frase.' },
    ],
    listen: ['BRUZZ (medio bilingüe de Bruselas)', 'Radio 2 Vlaams-Brabant'],
  },
];

export interface MediaSource {
  name: string;
  level: string;
  what: string;
  how: string;
}

export const mediaSources: MediaSource[] = [
  { name: 'Karrewiet (Ketnet / VRT)', level: 'A2–B1', what: 'Telediario infantil diario de unos 10 minutos. Lenguaje claro y lento, temas reales.', how: 'Míralo primero sin subtítulos, después con subtítulos y anota 5 palabras.' },
  { name: 'Wablieft', level: 'A2–B1', what: 'Periódico flamenco en lenguaje fácil (wablieft.be).', how: 'Lee un artículo al día en voz alta.' },
  { name: 'VRT NWS (web y Het Journaal)', level: 'B1–B2', what: 'Noticias en neerlandés estándar belga. Vídeos cortos con transcripción en la web.', how: 'Un vídeo corto al día. Luego lee el artículo del mismo tema.' },
  { name: 'Radio 2 Antwerpen', level: 'B1–B2', what: 'Radio regional con noticias locales, llamadas de oyentes y acento de Amberes.', how: 'Ponla de fondo y luego 5 minutos de escucha activa.' },
  { name: '«Thuis» (VRT MAX)', level: 'B1–B2', what: 'Telenovela diaria desde 1995. Vida cotidiana, tussentaal y situaciones de trabajo, médico, familia…', how: 'Con subtítulos en neerlandés (en VRT MAX). Repite una escena 2-3 veces.' },
  { name: '«Familie» (VTM GO)', level: 'B1–B2', what: 'Otra telenovela diaria; mucho diálogo informal.', how: 'Igual que Thuis: escena a escena.' },
  { name: '«De Afspraak» / «De Zevende Dag» (VRT)', level: 'B2', what: 'Debates y entrevistas sobre actualidad. Ideales para el vocabulario B2 y para argumentar.', how: 'Un fragmento de 10 minutos; anota los conectores que oigas.' },
  { name: 'Series en Netflix / Streamz', level: 'B2', what: '«Undercover», «Rough Diamonds», «Chantal», «De Ridder»…', how: 'Con subtítulos en neerlandés, nunca en español.' },
  { name: 'Atlas Antwerpen', level: 'Práctica real', what: 'Servicio de integración de Amberes: informa sobre cursos y oportunidades para practicar (taalcafés, conversación, voluntariado).', how: 'Busca una actividad semanal para hablar con gente real.' },
];
