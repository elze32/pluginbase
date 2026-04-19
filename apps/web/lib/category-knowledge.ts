export interface CategoryKnowledge {
  label: string;
  labelSingular: string;
  emoji?: string;
  oneLiner: string;
  description: string;
  whenToUse: string[];
  subcategories?: { key: string; label: string; description: string }[];
  typicalCount: { homeStudio: number; pro: number };
  warningThreshold: number;
}

export const CATEGORY_KNOWLEDGE: Record<string, CategoryKnowledge> = {
  COMPRESSOR: {
    label: 'Compresseurs',
    labelSingular: 'compresseur',
    emoji: '🎚️',
    oneLiner: "Ils contrôlent la dynamique — ils rapprochent les passages forts et les passages faibles.",
    description: `Un compresseur réduit l'écart entre les sons forts et faibles pour rendre une piste plus stable et présente. Utilisé sur tout : voix, batterie, basse, et bus de mix. Il existe des familles très différentes (opto, FET, VCA) qui ont chacune leur couleur et leur usage.

Bien choisi et bien réglé, un compresseur sait rendre une partie plus vivante ou plus contrôlée sans la rendre artificielle. Trop de compresseurs, ou mal appliqués, emmêlent le mix plutôt que l'améliorer.`,
    whenToUse: [
      'Coller une batterie sur un bus',
      'Resserrer une voix lead pour la faire ressortir',
      'Donner du corps à une basse',
      "Limiter les crêtes d'un instrument sans perdre l'énergie",
      'Uniformiser des takes enregistrées différemment'
    ],
    subcategories: [
      { key: 'opto', label: 'Opto', description: 'Doux et musical — idéal sur voix et basses.' },
      { key: 'fet', label: 'FET / 1176', description: 'Rapide et claquant — parfait sur batterie.' },
      { key: 'vca', label: 'VCA', description: 'Précis et polyvalent — utile en mix bus.' },
      { key: 'vari-mu', label: 'Vari-mu', description: 'Chaud, vintage — souvent en mastering.' },
    ],
    typicalCount: { homeStudio: 5, pro: 10 },
    warningThreshold: 20,
  },

  EQ: {
    label: 'Égaliseurs',
    labelSingular: 'égaliseur',
    emoji: '🎛️',
    oneLiner: "L'outil pour sculpter la couleur et la place d'un son dans le mix.",
    description: `L'EQ permet d'accentuer ou d'atténuer des plages de fréquences pour clarifier, couper le bruit, ou donner une couleur.

Il existe des EQ chirurgicaux pour retirer une résonance, et des EQ 'musicals' qui ajoutent du caractère. Bien utilisé, l'EQ fait respirer chaque élément sans se marcher sur les pieds.`,
    whenToUse: [
      "Nettoyer une résonance gênante",
      'Faire de la place pour une voix dans le bas-médium',
      "Ajouter de l'air à une piste de voix",
      'Lisser une basse ou un kick pour qu’ils cohabitent'
    ],
    subcategories: [
      { key: 'surgical', label: 'Chirurgical', description: 'Bandes étroites pour corriger.' },
      { key: 'musical', label: 'Musical / Shelving', description: "Pour sculpter la couleur d'ensemble." },
    ],
    typicalCount: { homeStudio: 4, pro: 8 },
    warningThreshold: 20,
  },

  REVERB: {
    label: 'Reverbs',
    labelSingular: 'reverb',
    emoji: '🌫️',
    oneLiner: "Espace et profondeur — elles placent les sources dans une pièce fictive.",
    description: `La reverb simule un espace acoustique : petite pièce, salle, ou longue cathédrale. Elles donnent de la profondeur et aident à intégrer un son au mix.

Trop de reverb (ou la mauvaise) embrouille la perception; une réverbère bien choisie place l'instrument sans le noyer. Les algorithmiques sont pratiques, les convolution apportent du réalisme.`,
    whenToUse: [
      'Donner de la profondeur à une voix',
      'Créer un espace pour une guitare acoustique',
      'Ajouter de la queue à un overdub pour l’intégrer',
      "Simuler une salle pour des ambiances"
    ],
    subcategories: [
      { key: 'plate', label: 'Plate', description: 'Queues lisses, très musicales sur voix.' },
      { key: 'hall', label: 'Hall', description: 'Grande sensation d’espace.' },
      { key: 'room', label: 'Room', description: 'Petit espace, utile en bus batterie.' },
    ],
    typicalCount: { homeStudio: 2, pro: 4 },
    warningThreshold: 8,
  },

  DELAY: {
    label: 'Delays',
    labelSingular: 'delay',
    emoji: '⏱️',
    oneLiner: "Répétitions rythmées ou textures atmosphériques — un delay bien placé vaut mille automations.",
    description: `Le delay répète le signal selon un temps et un feedback. Il peut être strictement rythmique (slapback, ping-pong) ou transformer un son en nappes riches.

C'est un outil créatif autant que technique : des petits délais épaississent, des delays longs créent des espaces.`,
    whenToUse: [
      'Créer des échos rythmiques sur une guitare',
      'Épaissir une voix en doublant légèrement',
      'Créer des textures atmosphériques',
      'Conduire l’auditeur sur des phrases clés avec ping-pong'
    ],
    subcategories: [
      { key: 'tape', label: 'Tape', description: 'Chaleureux et flou, souvent musical.' },
      { key: 'digital', label: 'Digital', description: 'Précis et rythmique.' },
      { key: 'pingpong', label: 'Ping-pong', description: 'Balance L/R pour effet stéréo.' },
    ],
    typicalCount: { homeStudio: 2, pro: 4 },
    warningThreshold: 8,
  },

  SYNTH: {
    label: 'Synthés',
    labelSingular: 'synthé',
    emoji: '🔊',
    oneLiner: "La source sonore — oscillateurs, filtres, et modulation pour créer des timbres.",
    description: `Les synthés couvrent une vaste famille : analogique, wavetable, FM, granulaires. Ils génèrent le son lui-même et offrent des palettes sonores uniques.

Une collection de synthés reflète souvent le style du producteur : sound design, leads, basses, pads. Trop de synthés souvent créent de l'indécision plutôt que de la valeur.`,
    whenToUse: [
      'Créer une basse sur mesure',
      'Concevoir un lead unique',
      'Générer des nappes et textures',
      'Prototyper des idées de patch rapidement'
    ],
    subcategories: [
      { key: 'wavetable', label: 'Wavetable', description: 'Richesse harmonique et morphing.' },
      { key: 'analog', label: 'Analog', description: 'Chaleur et caractère.' },
      { key: 'fm', label: 'FM', description: 'Textures métalliques et percussives.' },
    ],
    typicalCount: { homeStudio: 6, pro: 12 },
    warningThreshold: 30,
  },

  SAMPLER: {
    label: 'Sampleurs',
    labelSingular: 'sampleur',
    emoji: '📦',
    oneLiner: "Lecture et manipulation d'échantillons — du simple playback au sound design avancé.",
    description: `Un sampleur joue des fichiers audio (échantillons) et peut les transformer : pitch, reverse, slices, mapping. Indispensable pour beatmakers et sound designers.

Les sampleurs peuvent remplacer des synthés ou les compléter avec du réalisme organique. Bien organisés, ils accélèrent la production.`,
    whenToUse: [
      'Jouer des one-shots percussifs',
      'Construire des kits de batterie',
      'Sampler une boucle pour la retravailler',
      'Créer des instruments à partir d’enregistrements'
    ],
    subcategories: [
      { key: 'drum', label: 'Drum Sampler', description: 'Optimisé pour kits et one-shots.' },
      { key: 'rompler', label: 'Rompler', description: 'Lecteur d’ensembles sonores prêts à jouer.' },
    ],
    typicalCount: { homeStudio: 2, pro: 6 },
    warningThreshold: 15,
  },

  LIMITER: {
    label: 'Limiters',
    labelSingular: 'limiteur',
    emoji: '🔒',
    oneLiner: "Verrouille les crêtes — utile en mastering et sur bus pour éviter le clipping.",
    description: `Le limiteur empêche les crêtes de dépasser un seuil. En mastering il permet d'augmenter le niveau perçu sans distorsion numérique.

Sur des bus individuels, il peut servir pour contrôler une source extrême, mais mal utilisé il écrase la dynamique.`,
    whenToUse: [
      'En mastering pour contrôler le loudness',
      'Sur un bus de batterie pour limiter des crêtes',
      'Prévenir le clipping sur des sorties'
    ],
    typicalCount: { homeStudio: 1, pro: 2 },
    warningThreshold: 5,
  },

  SATURATOR: {
    label: 'Saturation',
    labelSingular: 'saturation',
    emoji: '🔥',
    oneLiner: "Chaleur et caractère — ajoute des harmoniques et de la présence.",
    description: `La saturation ajoute des harmoniques qui rendent un son plus riche et perceptible. De la légère saturation subtile à la distorsion créative, c'est un outil pour colorer.

Sur des bus, elle peut 'coller' le mix; sur des pistes individuelles, elle donne du grain et de la vie.`,
    whenToUse: [
      'Donner de la présence à une voix',
      'Épaissir une basse ou une guitare',
      'Ajouter du punch à un bus mix'
    ],
    subcategories: [
      { key: 'tape', label: 'Tape', description: 'Chaleur douce, compression légère.' },
      { key: 'tube', label: 'Tube', description: 'Harmoniques paires, saturation lampée.' },
    ],
    typicalCount: { homeStudio: 3, pro: 6 },
    warningThreshold: 12,
  },

  DISTORTION: {
    label: 'Distorsions',
    labelSingular: 'distortion',
    emoji: '💥',
    oneLiner: "Effets agressifs et créatifs — du crunch léger à la destruction sonore.",
    description: `La distorsion est un outil créatif : overdrive léger pour de la chaleur, fuzz ou bitcrush pour des textures extrêmes. Elle transforme radicalement le son et doit être choisie selon le rôle musical désiré.`,
    whenToUse: [
      'Faire saturer une guitare électrique',
      'Ajouter du grit à une basse moderne',
      'Créer des textures industrielles ou lo-fi'
    ],
    typicalCount: { homeStudio: 2, pro: 5 },
    warningThreshold: 10,
  },

  MODULATION: {
    label: 'Modulations',
    labelSingular: 'modulation',
    emoji: '🔄',
    oneLiner: "Chorus, flanger, phaser — pour motion et largeur stéréo.",
    description: `Les effets de modulation déplacent le son dans le temps ou la phase pour créer mouvement et width. Ils sont parfaits pour enrichir une partie sans ajouter d'éléments supplémentaires.`,
    whenToUse: [
      'Élargir une guitare clean',
      'Ajouter du mouvement à des nappes',
      'Créer des textures rythmiques subtiles'
    ],
    typicalCount: { homeStudio: 2, pro: 4 },
    warningThreshold: 8,
  },

  FILTER: {
    label: 'Filtres',
    labelSingular: 'filtre',
    emoji: '🔍',
    oneLiner: "Sculpte les fréquences avec une précision créative.",
    description: `Les filtres coupent ou accentuent des zones de fréquences. Utiles pour créer des sweeps, enlever du bas non désiré, ou donner un caractère.`,
    whenToUse: [
      'Couper le bas d’un pad pour alléger le mix',
      'Créer un sweep sur un break',
      'Miser sur une résonance pour une texture particulière'
    ],
    typicalCount: { homeStudio: 2, pro: 4 },
    warningThreshold: 10,
  },

  VOCAL_FX: {
    label: 'Effets vocaux',
    labelSingular: 'effet vocal',
    emoji: '🎤',
    oneLiner: "Tout ce qui sert la voix : de la correction au grain.",
    description: `Regroupe les auto-tune, harmonizers, doubler, de-essers et processeurs spécifiques voix. Les voix ont des besoins uniques — intelligibilité, présence et émotions.`,
    whenToUse: [
      'Corriger la justesse d’une prise',
      'Épaissir une voix par doublage',
      'Réduire les sifflantes sans écraser le timbre'
    ],
    typicalCount: { homeStudio: 2, pro: 5 },
    warningThreshold: 10,
  },

  AMPLIFIER: {
    label: 'Amplis & Cabinets',
    labelSingular: "ampli / cabinet",
    emoji: '🔊',
    oneLiner: "Modèles d'amplis et baffles pour guitare et basse.",
    description: `Les simulateurs d'ampli reproduisent le son d’un ampli et d’un cabinet. Outil incontournable pour les guitaristes et bassistes en DAW.

Ils varient par réalisme et tonalité; certains incluent effets et micro placement.`,
    whenToUse: [
      'Jouer une guitare électrique en direct',
      'Comparer différents speakers pour un son désiré',
      'Expérimenter des saturations d’ampli sans matériel'
    ],
    typicalCount: { homeStudio: 1, pro: 3 },
    warningThreshold: 8,
  },

  // Fallback générique
  GENERIC: {
    label: 'Autres',
    labelSingular: 'effet',
    emoji: '🔧',
    oneLiner: "Effets divers — outils spécialisés ou utilitaires.",
    description: `Catégorie générique pour les plugins qui ne rentrent pas dans les catégories prioritaires. Peut regrouper analyseurs, utilitaires, ou effets très spécifiques.

Si vous avez beaucoup d'items ici, il vaut la peine de les trier pour trouver ce qui est réellement utile.`,
    whenToUse: ['Vérifier si l’outil apporte une vraie valeur', 'Conserver les utilitaires utiles au workflow'],
    typicalCount: { homeStudio: 2, pro: 4 },
    warningThreshold: 15,
  }
};
