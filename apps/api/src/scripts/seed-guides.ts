import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const guides = [

  // ─────────────────────────────────────────
  // 1. VALHALLA SUPERMASSIVE
  // ─────────────────────────────────────────
  {
    slug: 'valhalla-supermassive',
    pluginName: 'Valhalla Supermassive',
    brand: 'Valhalla DSP',
    category: 'Reverb / Delay',
    level: 'Tous niveaux',
    tagline: 'La reverb spatiale gratuite qui sonne comme du matériel haut de gamme',
    whatIsIt: `Reverb et delay spatial gratuit de Valhalla.
Il crée des textures qui évoluent dans le temps — impossible à reproduire avec une reverb classique.
Le plugin gratuit le plus téléchargé dans le monde de la prod électronique.`,
    forWho: `Tout le monde. Débutant ou pro.
Ambiant, lo-fi, cinéma, électro — tout passe par Supermassive.
Gratuit. Aucune excuse pour ne pas l'avoir.`,
    keyParamsJson: JSON.stringify([
      { name: 'MIX', role: 'Équilibre son sec / son traité', tip: 'En insert : commence à 20-30%. En send : mets à 100% et règle le niveau sur ta piste de départ.' },
      { name: 'DECAY', role: 'Durée de la réverbération', tip: 'Court (0-20%) pour des espaces naturels. Long (60-100%) pour des effets atmosphériques et des drones.' },
      { name: 'MODE', role: "Type d'algorithme de reverb", tip: 'Galactic et Narcissus pour les textures massives. Gemini et Aquarius pour des reverbs plus musicales.' },
      { name: 'MOD RATE', role: 'Vitesse de la modulation interne', tip: 'Valeurs basses (0-20%) pour un effet organique et vivant. Valeurs élevées pour des effets psychédéliques.' },
      { name: 'MOD DEPTH', role: 'Intensité de la modulation', tip: 'Associe avec Mod Rate. Plus haut = effet plus prononcé et en mouvement. Commence à 30% et ajuste.' },
    ]),
    starterPreset: JSON.stringify({ description: 'Point de départ universel pour des pads et synthés', values: [{ param: 'MODE', value: 'Gemini' }, { param: 'MIX', value: '35%' }, { param: 'DECAY', value: '55%' }, { param: 'MOD RATE', value: '15%' }, { param: 'MOD DEPTH', value: '25%' }] }),
    proTechnique: `Utilise Supermassive en send (bus de reverb) plutôt qu'en insert direct. Mets MIX à 100%, règle le DECAY très haut (80%+), et envoie seulement très peu de signal dessus. Tu obtiens une queue de reverb massive qui disparaît lentement — sans noyer le son source.`,
    commonMistakes: `Ne pas utiliser de filtre avant Supermassive. Si tu envoies les basses fréquences dans une reverb massive, ça crée une bouillie de son dans le bas du spectre. Place un EQ avant et coupe tout en dessous de 200-300 Hz.`,
    pairsWith: JSON.stringify(['FabFilter Pro-Q 3', 'Serum', 'OTT']),
    freeAlternative: null,
    officialImageUrl: '/plugins/valhalla-supermassive.png',
    imageAlt: 'Interface de Valhalla Supermassive — reverb et delay spatial',
    authorNote: "Gratuit et indispensable. Si tu n'as qu'un seul plugin de reverb, c'est celui-là.",
  },

  // ─────────────────────────────────────────
  // 2. FABFILTER PRO-Q 3
  // ─────────────────────────────────────────
  {
    slug: 'fabfilter-pro-q-3',
    pluginName: 'FabFilter Pro-Q 3',
    brand: 'FabFilter',
    category: 'EQ',
    level: 'Tous niveaux',
    tagline: "L'EQ de référence absolue — précis, visuel, musical",
    whatIsIt: `L'EQ de référence absolue.
Transparent, précis, visuel.
Tu cliques sur le spectre, tu tires les fréquences — c'est aussi simple que ça.
Utilisé sur pratiquement tous les albums professionnels des 10 dernières années.`,
    forWho: `Tout le monde. Du débutant au mastering engineer.
L'interface visuelle le rend immédiatement accessible.
Si tu n'as qu'un seul EQ payant dans ta vie, c'est lui.`,
    keyParamsJson: JSON.stringify([
      { name: 'GAIN', role: 'Monte ou coupe une fréquence', tip: "Préfère toujours couper plutôt que monter. Couper ce qui gêne sonne plus naturel qu'amplifier ce qui manque." },
      { name: 'FREQUENCY', role: 'La fréquence ciblée par chaque bande', tip: "Joue live : monte le gain à +12 dB, sweep lentement la fréquence jusqu'à entendre ce qui sonne mal, puis coupe." },
      { name: 'Q', role: 'Largeur de la bande affectée', tip: 'Q bas (0.5-1) = coupe large et musicale. Q élevé (5-10) = coupe chirurgicale précise.' },
      { name: 'DYNAMIC', role: 'Rend la bande EQ réactive au volume', tip: 'Parfait pour contrôler les sibilances sur les voix sans compresser toute la piste.' },
      { name: 'OUTPUT GAIN', role: 'Volume de sortie global', tip: "Si tu as beaucoup coupé, le volume final peut avoir baissé. Monte l'Output Gain pour compenser." },
    ]),
    starterPreset: JSON.stringify({ description: "Nettoyage de base pour n'importe quelle piste", values: [{ param: 'Bande 1 — High Pass', value: '80 Hz, pente 24 dB/oct' }, { param: 'Bande 2 — Cut', value: 'Sweep pour trouver les fréquences indésirables, couper -3 à -6 dB' }, { param: 'Bande 3 — Shelving haut', value: '+1.5 dB à 10 kHz pour de l\'air' }] }),
    proTechnique: `Active le mode Spectrum Grab : double-clique directement sur le spectre animé à l'endroit qui te gêne. Pro-Q 3 crée automatiquement une bande à la bonne fréquence. Tu n'as plus qu'à ajuster le gain.`,
    commonMistakes: `Sur-égaliser. Si tu as plus de 5-6 bandes actives sur une piste, tu fais probablement quelque chose de faux. L'EQ sert à corriger, pas à remodeler entièrement un son.`,
    pairsWith: JSON.stringify(['FabFilter Pro-C 2', 'Valhalla Room', 'Soothe 2']),
    freeAlternative: 'TDR Nova (gratuit, très bon)',
    officialImageUrl: '/plugins/fabfilter-pro-q-3.png',
    imageAlt: 'Interface de FabFilter Pro-Q 3 — égaliseur paramétrique',
    authorNote: "Cher mais ça vaut chaque centime. Si tu ne devais avoir qu'un seul EQ payant, c'est celui-là.",
  },

  // ─────────────────────────────────────────
  // 3. SERUM
  // ─────────────────────────────────────────
  {
    slug: 'serum',
    pluginName: 'Serum',
    brand: 'Xfer Records',
    category: 'Synthesizer',
    level: 'Intermédiaire',
    tagline: 'Le synthé wavetable qui a redéfini la production électronique moderne',
    whatIsIt: `Le synthé wavetable qui a défini le son de la prod électronique moderne.
Leads de dubstep, pads de future bass, basses de trap — tout passe par Serum.
Dessine ou importe tes propres formes d'ondes et anime-les dans le temps.`,
    forWho: `Intermédiaires et au-delà.
Pas idéal pour commencer la synthèse — apprends les bases d'abord.
Une fois ça acquis, Serum devient quasi illimité.`,
    keyParamsJson: JSON.stringify([
      { name: 'OSC A / OSC B', role: 'Les deux oscillateurs principaux — source du son', tip: "Commence toujours par OSC A. Sélectionne une wavetable, joue avec le curseur WT POS pour entendre l'évolution sonore." },
      { name: 'WT POS', role: "Position dans la wavetable — change la forme d'onde", tip: "Assigne un LFO ou une enveloppe à WT POS pour animer le son dans le temps. C'est là que Serum devient magique." },
      { name: 'UNISON', role: 'Empile plusieurs copies du son légèrement désaccordées', tip: 'Active 4-8 voix et monte le DETUNE à 15-25 cents pour un son immédiatement plus large et professionnel.' },
      { name: 'FILTER', role: 'Façonne le spectre fréquentiel du son', tip: 'LG 12 pour des sons chauds et musicaux. MG Low 18 pour des basses profondes et précises.' },
      { name: 'LFO / ENV', role: 'Automatise les paramètres dans le temps', tip: "Drag-and-drop depuis LFO 1 vers n'importe quel paramètre pour l'animer." },
    ]),
    starterPreset: JSON.stringify({ description: 'Pad atmosphérique de base', values: [{ param: 'OSC A', value: 'Wavetable "Saw" ou "Analog BD"' }, { param: 'UNISON', value: '4 voix, DETUNE 20 cents, BLEND 50%' }, { param: 'ENV 1 Attack', value: '800ms pour un démarrage doux' }, { param: 'FILTER', value: 'LG 12, Cutoff 60%, Res 20%' }, { param: 'REVERB (FX)', value: 'Size 80%, Mix 40%' }] }),
    proTechnique: `Le Wavetable Stacking : charge deux wavetables différentes dans OSC A et OSC B, désaccorde OSC B de +7 semitones (une quinte), baisse son volume à -8 dB. Tu obtiens un son harmoniquement riche qui "remplit" le mix naturellement.`,
    commonMistakes: `Abuser de l'Unison avec trop de voix et trop de detune. 8 voix à 50 cents de détune sonne large mais "flou" et incompatible avec d'autres éléments dans le mix.`,
    pairsWith: JSON.stringify(['OTT', 'FabFilter Pro-Q 3', 'Valhalla Supermassive']),
    freeAlternative: 'Vital (gratuit, très proche de Serum)',
    officialImageUrl: '/plugins/serum.png',
    imageAlt: 'Interface de Serum — synthétiseur wavetable',
    authorNote: "Le standard de l'industrie pour une raison. Les presets inclus sont excellents pour comprendre ce que le synthé peut faire.",
  },

  // ─────────────────────────────────────────
  // 4. OTT
  // ─────────────────────────────────────────
  {
    slug: 'ott',
    pluginName: 'OTT',
    brand: 'Xfer Records',
    category: 'Compressor',
    level: 'Tous niveaux',
    tagline: 'Le compresseur multibande gratuit qui définit le son de la musique électronique moderne',
    whatIsIt: `Compresseur multibande gratuit. Basé sur un preset légendaire d'Ableton.
Il compresse tout en même temps — basses, mids, aigus.
Résultat : un son dense, punchy, qui occupe tout le mix.`,
    forWho: `Producteurs électroniques, trap, future bass, dubstep.
Moins utile sur du jazz ou de l'acoustique — ça écrase la dynamique naturelle.
Gratuit. Pas d'excuse.`,
    keyParamsJson: JSON.stringify([
      { name: 'DEPTH', role: "Intensité globale de l'effet", tip: "100% c'est souvent trop. Commence à 30-50% et monte progressivement." },
      { name: 'LOW / MID / HIGH', role: 'Gain de chaque bande de fréquences', tip: 'Baisse le LOW à -3/-6 dB pour éviter que les basses ne deviennent trop boueuses.' },
      { name: 'IN / OUT', role: "Volume d'entrée et de sortie", tip: "Si l'effet semble trop fort, baisse l'IN plutôt que de baisser le DEPTH." },
    ]),
    starterPreset: JSON.stringify({ description: 'Utilisation typique sur un synth lead', values: [{ param: 'DEPTH', value: '40%' }, { param: 'LOW', value: '-3 dB' }, { param: 'MID', value: '0 dB' }, { param: 'HIGH', value: '+1 dB' }] }),
    proTechnique: `Empile deux OTT en série à 30% chacun plutôt qu'un seul à 60%. Le résultat est plus musical, moins agressif, mais tout aussi dense.`,
    commonMistakes: `Mettre OTT sur tous les éléments du mix y compris les basses et la batterie. Ça crée un mix étouffant sans dynamique. OTT fonctionne mieux sur des éléments mélodiques.`,
    pairsWith: JSON.stringify(['Serum', 'Vital', 'FabFilter Pro-Q 3']),
    freeAlternative: null,
    officialImageUrl: '/plugins/ott.png',
    imageAlt: 'Interface de OTT — compresseur multibande',
    authorNote: "Gratuit. Essentiel. Télécharge-le maintenant si tu ne l'as pas encore.",
  },

  // ─────────────────────────────────────────
  // 5. VALHALLA ROOM
  // ─────────────────────────────────────────
  {
    slug: 'valhalla-room',
    pluginName: 'Valhalla Room',
    brand: 'Valhalla DSP',
    category: 'Reverb',
    level: 'Tous niveaux',
    tagline: 'La reverb de salle de concert la plus utilisée en production professionnelle',
    whatIsIt: `Valhalla Room simule acoustiquement différents types d'espaces — petites pièces, grandes salles, halls de cathédrales. Contrairement à Supermassive qui crée des sons "impossibles", Room sonne naturel et réaliste. C'est la reverb qu'on utilise quand on veut que le son "vive" dans un espace crédible.`,
    forWho: `Tout le monde. Voix, batterie, guitares, instruments acoustiques, synthés. Si Supermassive est la reverb de l'espace infini, Room est la reverb du monde réel. Complémentaires plutôt que concurrentes.`,
    keyParamsJson: JSON.stringify([
      { name: 'DECAY', role: 'Durée de la réverbération', tip: 'Snare et voix : 0.8-1.5 secondes. Guitares acoustiques : 1.5-2.5 secondes. Pads et cordes : 3-5 secondes.' },
      { name: 'PRE-DELAY', role: 'Délai avant que la reverb commence', tip: 'Réglé au tempo, le pre-delay crée de l\'espace entre le son source et sa reverb. Le son garde de la clarté.' },
      { name: 'ROOM SIZE', role: "Taille de l'espace simulé", tip: 'Petit pour des sons proches et intimes. Grand pour des arrangements orchestraux ou du post-rock.' },
      { name: 'HIGH MULT', role: 'Durée de decay des hautes fréquences', tip: 'Valeur inférieure à 1.0 = les aigus disparaissent plus vite. Sonne plus naturel.' },
      { name: 'MIX', role: 'Dos/face son sec et reverb', tip: 'En send : 100%. En insert sur voix : 15-25%. Sur une caisse claire : 20-35%.' },
    ]),
    starterPreset: JSON.stringify({ description: 'Reverb de salle pour voix ou instrument solo', values: [{ param: 'MODE', value: 'Large Room' }, { param: 'DECAY', value: '1.8s' }, { param: 'PRE-DELAY', value: '25ms' }, { param: 'HIGH MULT', value: '0.6' }, { param: 'MIX', value: '100% (en send)' }] }),
    proTechnique: `Le Pre-delay au tempo : calcule 60000 / BPM pour avoir la durée d'un temps en ms. Divise par 4 pour une valeur de 1/16 note. Ex : à 120 BPM → 500ms / 4 = 125ms. La reverb "rebondit" dans le groove.`,
    commonMistakes: `Utiliser la même reverb pour tous les éléments du mix. Chaque élément devrait avoir une "distance" différente dans l'espace sonore. Basse et kick = pas de reverb. Snare = reverb courte. Pads = reverb longue.`,
    pairsWith: JSON.stringify(['FabFilter Pro-Q 3', 'Soundtoys EchoBoy', 'FabFilter Pro-C 2']),
    freeAlternative: 'OrilRiver (gratuit)',
    officialImageUrl: '/plugins/valhalla-room.png',
    imageAlt: 'Interface de Valhalla Room — reverb naturelle',
    authorNote: null,
  },

  // ─────────────────────────────────────────
  // 6. FABFILTER PRO-C 2
  // ─────────────────────────────────────────
  {
    slug: 'fabfilter-pro-c-2',
    pluginName: 'FabFilter Pro-C 2',
    brand: 'FabFilter',
    category: 'Compressor',
    level: 'Intermédiaire',
    tagline: 'Le compresseur de référence — 8 modes, un son parfait',
    whatIsIt: `Le Pro-C 2 est un compresseur qui propose 8 styles de compression différents, du plus transparent (Clean) au plus coloré et vintage (Opto, Vintage). Il offre un contrôle précis sur la dynamique tout en restant très visuel — tu vois exactement combien de dB tu comprimes.`,
    forWho: `Intermédiaires et pros. Pas le premier compresseur à apprendre — commence par comprendre les bases (Attack, Release, Ratio) avant. Mais une fois ces bases acquises, c'est l'outil le plus polyvalent et le plus musical du marché.`,
    keyParamsJson: JSON.stringify([
      { name: 'MODE', role: 'Style de compression — personnalité du compresseur', tip: 'Clean pour master et bus. Classic pour voix et guitares. Opto pour basses. Pumping pour effets créatifs sur drums.' },
      { name: 'THRESHOLD', role: 'Niveau à partir duquel la compression démarre', tip: "Baisse jusqu'à voir 3-6 dB de réduction sur des éléments musicaux." },
      { name: 'RATIO', role: 'Intensité de la compression', tip: '2:1 pour une compression subtile. 4:1 pour du contrôle sérieux. 8:1+ pour du limiting agressif.' },
      { name: 'ATTACK', role: 'Rapidité de réaction de la compression', tip: 'Attack rapide (1ms) = contrôle des transitoires. Attack lente (30ms+) = laisse passer le punch.' },
      { name: 'RELEASE', role: "Rapidité avec laquelle la compression s'arrête", tip: 'Auto fonctionne bien pour commencer. Manuel : lie au tempo pour une compression qui "respire".' },
    ]),
    starterPreset: JSON.stringify({ description: 'Compression voix lead', values: [{ param: 'MODE', value: 'Classic' }, { param: 'THRESHOLD', value: '-18 dB' }, { param: 'RATIO', value: '3:1' }, { param: 'ATTACK', value: '10ms' }, { param: 'RELEASE', value: 'Auto' }, { param: 'MAKEUP GAIN', value: '+3 dB' }] }),
    proTechnique: `Le Parallel Compression (New York Style) : en mode Mix du Pro-C 2, monte le Ratio à 8:1 ou plus, Threshold bas. Puis monte le Mix à 30-40% seulement. Tu gardes le punch naturel tout en ajoutant de la densité.`,
    commonMistakes: `Une compression trop rapide sur tout. Attack à 1ms sur une guitare acoustique tue le picking naturel. Laisse les transitoires passer avec une attack de 20-30ms.`,
    pairsWith: JSON.stringify(['FabFilter Pro-Q 3', 'FabFilter Pro-L 2', 'Valhalla Room']),
    freeAlternative: 'Molot (gratuit), TDR Kotelnikov (gratuit)',
    officialImageUrl: '/plugins/fabfilter-pro-c-2.png',
    imageAlt: 'Interface de FabFilter Pro-C 2 — compresseur',
    authorNote: null,
  },

  // ─────────────────────────────────────────
  // 7. SOUNDTOYS DECAPITATOR
  // ─────────────────────────────────────────
  {
    slug: 'soundtoys-decapitator',
    pluginName: 'Decapitator',
    brand: 'Soundtoys',
    category: 'Saturation',
    level: 'Tous niveaux',
    tagline: 'La saturation analogique qui rend tout plus chaud, plus vivant, plus "réel"',
    whatIsIt: `5 types de saturation vintage dans un seul plugin.
Du léger coloring presque imperceptible à la distorsion totale assumée.
Il ajoute de la chaleur, du caractère, de la "vie" à tout ce qu'il touche.`,
    forWho: `Tout le monde. C'est le plugin le plus polyvalent qui existe.
Subtil sur des voix. Agressif sur des drums. Créatif sur des synthés.
C'est souvent le premier Soundtoys que les gens achètent — et ils ont raison.`,
    keyParamsJson: JSON.stringify([
      { name: 'STYLE (A/E/N/T/G)', role: 'Type de saturation / caractère analogique', tip: 'A = doux et chaud. E = plus agressif, mids présents. N = neutre. T = saturation à bande. G = le plus agressif.' },
      { name: 'DRIVE', role: 'Intensité de la saturation', tip: 'Pour de la chaleur subtile : 25-40%. Pour de la couleur audible : 50-70%. Pour de la distorsion créative : 80%+.' },
      { name: 'TONE', role: 'Balance fréquentielle de la saturation', tip: 'Tourne vers la droite pour de la brillance. Vers la gauche pour de la chaleur et du corps.' },
      { name: 'MIX', role: 'Parallel saturation — mélange son traité et non-traité', tip: 'Mix à 50-70% donne souvent le meilleur résultat — tu gardes le son original tout en ajoutant la couleur.' },
      { name: 'PUNISH', role: 'Mode saturation extrême', tip: 'Combine DRIVE à fond + PUNISH pour des effets de distorsion totale. Créatif sur des synthés.' },
    ]),
    starterPreset: JSON.stringify({ description: "Chaleur subtile sur n'importe quelle piste", values: [{ param: 'STYLE', value: 'A (Ampex)' }, { param: 'DRIVE', value: '35%' }, { param: 'TONE', value: 'Centre' }, { param: 'MIX', value: '60%' }, { param: 'OUTPUT', value: '-2 dB' }] }),
    proTechnique: `Saturation sur le bus drums : mets Decapitator sur ta piste de groupe batterie. Style T ou A, Drive à 20-30%, Mix à 40%. Ça "colle" les éléments de la batterie ensemble et leur donne une cohérence analogique immédiate.`,
    commonMistakes: `Monter le Drive trop fort sans ajuster l'Output. La saturation ajoute du volume — si tu ne compenses pas le gain de sortie, tu perçois le résultat comme "meilleur" uniquement parce qu'il est plus fort.`,
    pairsWith: JSON.stringify(['FabFilter Pro-Q 3', 'Valhalla Room', 'RC-20 Retro Color']),
    freeAlternative: 'Klanghelm IVGI (gratuit)',
    officialImageUrl: '/plugins/decapitator.png',
    imageAlt: 'Interface de Soundtoys Decapitator — saturation analogique',
    authorNote: "Le ratio qualité/polyvalence est imbattable. C'est souvent le premier Soundtoys que les gens achètent.",
  },

  // ─────────────────────────────────────────
  // 8. KONTAKT 7
  // ─────────────────────────────────────────
  {
    slug: 'kontakt-7',
    pluginName: 'Kontakt 7',
    brand: 'Native Instruments',
    category: 'Sampler',
    level: 'Intermédiaire',
    tagline: "L'outil de référence pour les instruments samplés — orchestres, pianos, drums réels",
    whatIsIt: `Kontakt est le sampler le plus utilisé au monde dans le monde professionnel. Il ne crée pas de sons lui-même — il les joue depuis des bibliothèques d'instruments samplés. Orchestres, pianos de concert, batteries acoustiques, instruments du monde entier : si quelqu'un l'a samplé, ça tourne probablement dans Kontakt.`,
    forWho: `Compositeurs, producteurs de musique de film et de jeu vidéo, tous ceux qui veulent des instruments acoustiques réalistes. Kontakt Player (gratuit) joue les libraries compatibles. La version complète permet de créer les siennes.`,
    keyParamsJson: JSON.stringify([
      { name: 'PURGE', role: 'Libère la RAM en supprimant les samples non utilisés', tip: "Si Kontakt consomme trop de RAM, utilise Purge > Purge All Unused Samples. Essentiel sur les grandes orchestrations." },
      { name: 'MIDI LEARN', role: 'Assigne des paramètres à ton contrôleur MIDI', tip: "Clic droit sur n'importe quel knob > Learn MIDI CC. Puis bouge ton contrôleur. Immédiat et intuitif." },
      { name: 'AMPLIFIER (AMP)', role: 'Envelope de volume de chaque instrument', tip: "L'enveloppe AMP dans chaque instrument contrôle comment le son démarre et s'arrête. Modifie l'ATTACK pour des attaques plus douces." },
      { name: 'OUTPUT (MIX)', role: 'Volume et routing de sortie', tip: 'Assigne différents instruments à des sorties séparées (ST1, ST2...) pour les mixer individuellement dans ton DAW.' },
    ]),
    starterPreset: JSON.stringify({ description: 'Setup de base pour une bibliothèque orchestrale', values: [{ param: 'Memory', value: 'Active DFD (Direct From Disk) pour les grandes libraries' }, { param: 'Output', value: 'Assigne chaque section à des sorties séparées' }, { param: 'MIDI', value: 'Utilise des canaux MIDI différents par section' }] }),
    proTechnique: `Le Multi-Output Routing : assigne chaque instrument à une sortie stéréo différente dans ton DAW. Tu peux ainsi EQ, comprimer et reverber chaque instrument séparément — comme si c'était de vraies pistes enregistrées.`,
    commonMistakes: `Charger trop d'instruments simultanément sans gérer la RAM. Kontakt peut consommer des gigaoctets de RAM. Utilise le mode DFD pour les grandes libraries et purge les samples inutilisés régulièrement.`,
    pairsWith: JSON.stringify(['Valhalla Room', 'FabFilter Pro-Q 3', 'Spitfire LABS']),
    freeAlternative: 'Kontakt Player (version gratuite qui joue les libraries compatibles)',
    officialImageUrl: '/plugins/kontakt-7.png',
    imageAlt: 'Interface de Kontakt 7 — sampler',
    authorNote: "Indispensable pour la musique de film et les instruments acoustiques réalistes.",
  },

  // ─────────────────────────────────────────
  // 9. IZOTOPE OZONE 11
  // ─────────────────────────────────────────
  {
    slug: 'izotope-ozone-11',
    pluginName: 'Ozone 11',
    brand: 'iZotope',
    category: 'Mastering',
    level: 'Intermédiaire',
    tagline: 'La suite de mastering tout-en-un qui guide même les débutants',
    whatIsIt: `Ozone est une suite complète de mastering qui regroupe EQ, compresseur multibande, maximizer, stereo imager et plus encore dans un seul plugin. Sa particularité : l'IA "Master Assistant" analyse ton mix et propose automatiquement des réglages de départ.`,
    forWho: `Producteurs qui font leur propre mastering. La version Elements (moins chère) est parfaite pour débuter. La version Advanced s'adresse aux mastering engineers sérieux.`,
    keyParamsJson: JSON.stringify([
      { name: 'MASTER ASSISTANT', role: "IA qui analyse ton mix et propose des réglages", tip: "Clique, laisse analyser 10-15 secondes de ton mix, et utilise les suggestions comme point de départ — pas comme résultat final." },
      { name: 'MAXIMIZER', role: 'Augmente le volume perçu sans distorsion', tip: "Threshold entre -2 et -4 dBFS pour un résultat propre. Ne cherche pas à matcher le volume des références à tout prix." },
      { name: 'EQ (LINEAR PHASE)', role: 'EQ haute qualité sans artefacts de phase', tip: "Utilise l'EQ en mode Linear Phase uniquement pour le mastering. Il préserve l'image stéréo." },
      { name: 'STEREO IMAGER', role: 'Contrôle la largeur stéréo par bande de fréquences', tip: 'Les basses fréquences (sous 250 Hz) doivent toujours être mono. Les médiums et aigus peuvent être larges.' },
      { name: 'CODEC PREVIEW', role: 'Simule le son après compression MP3/Spotify', tip: "Active-le pour entendre comment ton master va sonner sur les plateformes de streaming." },
    ]),
    starterPreset: JSON.stringify({ description: 'Chaîne de mastering typique dans Ozone', values: [{ param: 'Ordre', value: 'EQ → Dynamic EQ → Vintage Compressor → Stereo Imager → Maximizer' }, { param: 'Target Loudness', value: '-14 LUFS pour le streaming' }, { param: 'True Peak', value: '-1 dBTP maximum' }] }),
    proTechnique: `Le Reference Track : importe une référence commerciale dans le module "Reference" d'Ozone. Compare ton master à la référence en A/B normalisé en volume. C'est plus utile que n'importe quel réglage technique.`,
    commonMistakes: `Faire confiance aveuglément au Master Assistant sans écouter. L'IA donne un point de départ, jamais un résultat final. Tes oreilles ont toujours le dernier mot.`,
    pairsWith: JSON.stringify(['iZotope Neutron 4', 'FabFilter Pro-L 2', 'Reference tracks']),
    freeAlternative: 'Youlean Loudness Meter (pour l\'analyse LUFS, gratuit)',
    officialImageUrl: '/plugins/ozone-11.png',
    imageAlt: 'Interface de iZotope Ozone 11 — mastering',
    authorNote: null,
  },

  // ─────────────────────────────────────────
  // 10. ADDICTIVE DRUMS 2
  // ─────────────────────────────────────────
  {
    slug: 'addictive-drums-2',
    pluginName: 'Addictive Drums 2',
    brand: 'XLN Audio',
    category: 'Drum Machine',
    level: 'Tous niveaux',
    tagline: "La batterie virtuelle qui sonne comme une vraie séance d'enregistrement",
    whatIsIt: `Addictive Drums 2 est un plugin de batterie virtuelle basé sur de vrais enregistrements de batteries acoustiques dans des studios professionnels. Tu choisis tes fûts, tes cymbales, ta pièce d'enregistrement, et tu joues ou programmes des grooves MIDI.`,
    forWho: `Tous les producteurs qui ont besoin d'une batterie réaliste — rock, pop, funk, hip-hop, country. Très accessible pour les débutants grâce à son interface visuelle. La bibliothèque de grooves MIDI incluse permet de créer des arrangements complets sans jouer une seule note.`,
    keyParamsJson: JSON.stringify([
      { name: 'KIT', role: 'Sélection des éléments de la batterie', tip: "Mix et match des fûts de kits différents. Une caisse claire d'un kit, une grosse caisse d'un autre — c'est complètement libre." },
      { name: 'ROOM / OVERHEAD', role: "Ambiance de la pièce d'enregistrement", tip: 'Monte le ROOM pour une batterie qui sonne live et naturelle. Baisse-le pour une batterie plus sèche.' },
      { name: 'BEATS', role: 'Bibliothèque de grooves MIDI préprogrammés', tip: 'Cherche par genre et par BPM. Fais glisser directement le pattern dans ton DAW — ça crée une piste MIDI prête.' },
      { name: 'EQ / COMPRESSOR PAR FÛT', role: 'Traitement individuel de chaque élément de la batterie', tip: 'Commence par couper les fréquences boueuses (300-400 Hz sur la grosse caisse) avant d\'ajouter de la saturation.' },
    ]),
    starterPreset: JSON.stringify({ description: 'Son de batterie naturel et équilibré', values: [{ param: 'ROOM', value: '40-60% pour un son live' }, { param: 'OVERHEAD', value: '50%' }, { param: 'BLEED', value: '30-40%' }, { param: 'Grosse caisse', value: 'Coupe autour de 350 Hz pour de la clarté' }] }),
    proTechnique: `Export multi-output : assigne chaque fût à une sortie séparée dans ton DAW. Tu peux compresser et EQ chaque élément comme un vrai ingénieur du son.`,
    commonMistakes: `Utiliser les presets sans adapter au tempo et à la dynamique du morceau. Ajuste la vélocité des notes MIDI pour une batterie plus humaine.`,
    pairsWith: JSON.stringify(['FabFilter Pro-Q 3', 'Soundtoys Decapitator', 'Valhalla Room']),
    freeAlternative: 'MT Power Drum Kit (gratuit)',
    officialImageUrl: '/plugins/addictive-drums-2.webp',
    imageAlt: 'Interface de Addictive Drums 2 — batterie virtuelle',
    authorNote: null,
  },

  // ─────────────────────────────────────────
  // 11. ANTARES AUTO-TUNE PRO
  // ─────────────────────────────────────────
  {
    slug: 'auto-tune-pro',
    pluginName: 'Antares Auto-Tune Pro',
    brand: 'Antares',
    category: 'Pitch Correction',
    level: 'Tous niveaux',
    tagline: "Le standard mondial pour la correction de voix — naturel ou robotique",
    whatIsIt: `Auto-Tune est le plugin de correction de hauteur le plus célèbre au monde. Il permet de corriger les faussetés d'une voix en temps réel. Il peut être utilisé de manière transparente pour une correction naturelle, ou de manière extrême pour créer l'effet "T-Pain" ou "Cloud Rap" caractéristique.`,
    forWho: `Indispensable for any producer working with vocals. From pop to trap, everyone uses it. The Pro version offers the best balance between ease of use and professional control.`,
    keyParamsJson: JSON.stringify([
      { name: 'RETUNE SPEED', role: 'Vitesse de correction', tip: '0 = effet robotique instantané. 20-50 = correction naturelle. Plus c\'est lent, plus l\'humanité de la voix est préservée.' },
      { name: 'FLEX-TUNE', role: 'Laisse de la liberté autour de la note', tip: 'Permet de garder les micro-variations naturelles du chanteur tout en tirant les notes vers la juste valeur.' },
      { name: 'HUMANIZE', role: 'Préserve les fins de notes', tip: 'Évite que les notes longues ne sonnent trop statiques ou artificielles.' },
      { name: 'KEY / SCALE', role: 'Gamme du morceau', tip: 'Le réglage le plus important ! Si tu ne connais pas la gamme, Auto-Tune va corriger vers les mauvaises notes.' },
    ]),
    starterPreset: JSON.stringify({ description: 'Correction moderne transparente', values: [{ param: 'RETUNE SPEED', value: '25' }, { param: 'FLEX-TUNE', value: '40' }, { param: 'HUMANIZE', value: '30' }] }),
    proTechnique: `Utilise Auto-Key (inclus) sur ta piste d'instrumental pour détecter automatiquement la gamme et l'envoyer à Auto-Tune. Ça évite 90% des erreurs de réglage.`,
    commonMistakes: `Utiliser une Retune Speed trop rapide sur un chanteur qui a beaucoup de vibrato naturel. Ça crée des artefacts désagréables.`,
    pairsWith: JSON.stringify(['FabFilter Pro-Q 3', 'iZotope Nectar 3', 'Soundtoys Little AlterBoy']),
    freeAlternative: 'Graillon 2 (version gratuite)',
    officialImageUrl: '/plugins/auto-tune-pro.jpg',
    imageAlt: 'Interface de Auto-Tune Pro — correction vocale',
    authorNote: "Le réglage de la gamme (Key) est 100% obligatoire pour que ça sonne juste.",
  },

  // ─────────────────────────────────────────
  // 12. U-HE DIVA
  // ─────────────────────────────────────────
  {
    slug: 'diva',
    pluginName: 'u-he Diva',
    brand: 'u-he',
    category: 'Synthesizer',
    level: 'Intermédiaire',
    tagline: 'Le synthé virtuel qui sonne le plus "analogique" au monde',
    whatIsIt: `Diva (Dinosaur Impersonating Virtual Analogue) est un synthétiseur qui émule avec une précision incroyable les circuits des synthés légendaires (Minimoog, Jupiter-8, Juno-60). Sa force est son son riche, organique et "vivant" qui est presque indiscernable du vrai matériel.`,
    forWho: `Producteurs de techno, house, ambient, et tous ceux qui cherchent de la chaleur analogique sans avoir à acheter de vraies machines encombrantes et chères.`,
    keyParamsJson: JSON.stringify([
      { name: 'TRIPLE VCO', role: 'Les oscillateurs (moteur du son)', tip: 'Le mode "Triple VCO" émule le son massif du Minimoog. Parfait pour les basses et leads.' },
      { name: 'LADDER FILTER', role: 'Filtre de caractère', tip: 'Utilise le Ladder pour des résonances crémeuses typiques de Moog.' },
      { name: 'ACCURACY', role: 'Qualité du rendu CPU', tip: 'Mets sur "Divine" pour le meilleur son possible, mais attention : Diva consomme énormément de processeur !' },
    ]),
    starterPreset: JSON.stringify({ description: 'Basse analogique chaude', values: [{ param: 'OSC', value: 'Triple VCO, Sawtooth' }, { param: 'FILTER', value: 'Ladder, Cutoff 40%' }, { param: 'ENV', value: 'Sustain 0, Decay 500ms pour du punch' }] }),
    proTechnique: `Active le bouton "Stack" dans la section Tuning pour doubler les voix et créer un son d'une épaisseur phénoménale.`,
    commonMistakes: `Laisser Diva en mode "Divine" sur 20 pistes simultanément. Ton ordinateur va exploser. Utilise le mode "Draft" pendant la composition et repasse en "Divine" pour l'export.`,
    pairsWith: JSON.stringify(['Soundtoys EchoBoy', 'Valhalla Vintage Verb', 'Decapitator']),
    freeAlternative: 'Tyrell N6 (aussi par u-he, gratuit)',
    officialImageUrl: '/plugins/diva.jpg',
    imageAlt: 'Interface de u-he Diva — synthétiseur analogique virtuel',
    authorNote: "Un gouffre à CPU, mais quel son !",
  },

  // ─────────────────────────────────────────
  // 13. SOUNDTOYS ECHOBOY
  // ─────────────────────────────────────────
  {
    slug: 'echoboy',
    pluginName: 'Soundtoys EchoBoy',
    brand: 'Soundtoys',
    category: 'Delay',
    level: 'Tous niveaux',
    tagline: 'Le delay ultime — 30 ans d\'histoire de l\'écho dans un seul plugin',
    whatIsIt: `EchoBoy est considéré par beaucoup comme le meilleur plugin de delay jamais créé. Il émule des dizaines de machines classiques : Space Echo, Memory Man, Echoplex, et même des delays numériques vintages. Il ne se contente pas de répéter le son, il lui donne une texture unique.`,
    forWho: `Tout le monde. C'est le delay "à tout faire". Subtil sur une voix, psychédélique sur une guitare, rythmique sur une batterie.`,
    keyParamsJson: JSON.stringify([
      { name: 'ECHO STYLE', role: 'Caractère du delay', tip: '"Space Echo" pour de la chaleur, "Studio Tape" pour de la clarté, "Digital Delay" pour du moderne.' },
      { name: 'SATURATION', role: 'Ajoute de la chaleur aux répétitions', tip: 'C\'est le secret d\'EchoBoy : plus tu montes la saturation, plus les répétitions se fondent dans le mix.' },
      { name: 'GROOVE / FEEL', role: 'Placement rythmique', tip: 'Pousse vers "Rush" pour de l\'énergie ou "Drag" pour un feeling plus relax et laid-back.' },
    ]),
    starterPreset: JSON.stringify({ description: 'Delay de voix standard', values: [{ param: 'STYLE', value: 'Studio Tape' }, { param: 'TIME', value: '1/4 note' }, { param: 'FEEDBACK', value: '25%' }, { param: 'MIX', value: '20%' }] }),
    proTechnique: `Utilise le mode "Rhythmic" pour créer des patterns de delay complexes qui transforment une simple note en une boucle percutante.`,
    commonMistakes: `Oublier de filtrer les répétitions. Utilise les réglages High Cut et Low Cut intégrés pour éviter que le delay ne sature ton mix.`,
    pairsWith: JSON.stringify(['Decapitator', 'Valhalla Room', 'Diva']),
    freeAlternative: 'Valhalla FreqEcho (gratuit, plus simple)',
    officialImageUrl: '/plugins/echoboy.png',
    imageAlt: 'Interface de Soundtoys EchoBoy — delay analogique',
    authorNote: "Si tu ne devais avoir qu'un seul delay, c'est celui-ci.",
  },

  // ─────────────────────────────────────────
  // 14. XLN AUDIO RC-20 RETRO COLOR
  // ─────────────────────────────────────────
  {
    slug: 'rc-20-retro-color',
    pluginName: 'RC-20 Retro Color',
    brand: 'XLN Audio',
    category: 'Saturation',
    level: 'Tous niveaux',
    tagline: 'Le plugin lo-fi par excellence — vinyle, bande, bitcrusher en un seul outil',
    whatIsIt: `RC-20 ajoute des textures lo-fi vintage : bruit de vinyle, dégradation de bande magnétique, craquements, wobble et fluctuations de pitch. C'est le plugin qui transforme instantanément un son numérique propre en quelque chose qui semble avoir vécu.`,
    forWho: `Producteurs de lo-fi hip-hop, R&B, indie, bedroom pop. Mais aussi utile sur n'importe quel son pour ajouter de la chaleur et de l'imperfection humaine.`,
    genresJson: JSON.stringify(['Lo-fi', 'Hip-hop', 'R&B', 'Indie', 'Bedroom Pop']),
    referencesJson: JSON.stringify(['Lofi Girl', 'Joji', 'Rex Orange County']),
    keyParamsJson: JSON.stringify([
      {
        name: 'NOISE',
        role: 'Bruit de fond analogique — vinyle ou bande',
        tipBeginner: 'Monte légèrement pour ajouter un souffle de bande vintage. 10-20% suffit pour de la chaleur subtile.',
        tipIntermediate: 'Noise en mode "Vinyl" avec du bruit aléatoire de craquements = disque vinyle authentique. Dosé subtilement sur un piano ou une guitare, ça sonne immédiatement vintage.',
        tipPro: 'Automatise le NOISE : monte pendant les silences, baisse pendant les parties denses. Le bruit est plus audible dans le silence — c\'est là qu\'il crée le plus d\'atmosphère.'
      },
      {
        name: 'WOBBLE',
        role: 'Fluctuations de pitch — effet magnétophone',
        tipBeginner: 'Très peu de Wobble (5-10%) sur un piano ou une voix = humanisation immédiate. Le son semble moins "digital" et plus vivant.',
        tipIntermediate: 'Wobble plus fort sur un synthé pad = texture de disque vinyle qui tourne légèrement de travers. Instantanément lo-fi et chaleureux.',
        tipPro: 'Wobble en mode "Warp" avec des paramètres extrêmes = effet de cassette qui tourne trop vite ou trop lentement. Texture de rêve bizarre, très utilisée dans l\'hyperpop et le bedroom pop expérimental.'
      },
      {
        name: 'BIAS',
        role: 'Saturation de bande magnétique',
        tipBeginner: 'Monte légèrement pour une saturation douce et chaude. Plus musical qu\'une distorsion — le son s\'épaissit sans agressivité.',
        tipIntermediate: 'BIAS fort + NOISE modéré = simulation de cassette usée. Sonne authentiquement lo-fi sans être caricatural.',
        tipPro: 'BIAS très fort sur une grosse caisse ou une basse = saturation harmonique qui fait "parler" les basses fréquences. Plus de punch et de présence dans le bas du spectre.'
      },
      {
        name: 'SPACE',
        role: 'Réverbération vintage intégrée',
        tipBeginner: 'Ajoute une touche de Space pour placer le son dans un espace. Sons de pièce vintage, différents des reverbs modernes.',
        tipIntermediate: 'Space en mode "Room" avec un peu de Pre-Delay = son de studio des années 70. Très efficace sur des batteries ou des guitares acoustiques.',
        tipPro: 'Space + Wobble ensemble = son de field recording. Comme si le son avait été enregistré sur un vieux Walkman dans un espace physique. Texture narrative très efficace dans les productions lo-fi cinématiques.'
      },
      {
        name: 'DIGITAL',
        role: 'Dégradation numérique — bitcrushing et sample rate',
        tipBeginner: 'Monte légèrement pour un effet lo-fi numérique. Complètement différent de la saturation analogique.',
        tipIntermediate: 'DIGITAL fort = son de console de jeux vidéo 8-bit ou 16-bit. Très utilisé dans le chiptune et certains sous-genres de l\'EDM.',
        tipPro: 'DIGITAL très léger (5%) en parallèle avec un signal propre = ajoute une texture granuleuse presque imperceptible qui rend le son plus "réel". Paradoxalement, un peu de dégradation numérique peut rendre un son synthétique plus humain.'
      }
    ]),
    starterPreset: JSON.stringify({
      description: 'Lo-fi piano instantané',
      values: [
        { param: 'NOISE', value: '15% mode Vinyl' },
        { param: 'WOBBLE', value: '20%' },
        { param: 'BIAS', value: '30%' },
        { param: 'SPACE', value: '25% mode Room' },
        { param: 'DIGITAL', value: '5%' }
      ]
    }),
    proTechnique: `RC-20 sur le bus master d'une production entière à très faible intensité (10-15% sur chaque module). Tu "glues" tous les éléments dans la même texture vintage. Le résultat sonne comme si tout avait été enregistré en même temps dans la même pièce — cohérence instantanée sur des éléments provenant de sources très différentes.`,
    commonMistakes: `Monter tous les modules à fond. RC-20 est un outil de subtilité, pas de destruction. La magie vient de dosages légers sur plusieurs paramètres simultanément. À fond, ça sonne artificiel — léger, ça sonne authentiquement vintage.`,
    pairsWith: JSON.stringify(['Valhalla Room', 'Soundtoys Decapitator', 'iZotope Ozone 11']),
    freeAlternative: 'Chow Tape Model (simulation de bande gratuite)',
    officialImageUrl: '/plugins/rc-20-retro-color.png',
    imageAlt: 'Interface de RC-20 Retro Color — effet lo-fi',
    authorNote: 'Le plugin lo-fi de référence. Indispensable pour le bedroom pop et le lo-fi hip-hop.',
  },

  // ─────────────────────────────────────────
  // 15. KILOHEARTS PHASE PLANT
  // ─────────────────────────────────────────
  {
    slug: 'phase-plant',
    pluginName: 'Kilohearts Phase Plant',
    brand: 'Kilohearts',
    category: 'Synthesizer',
    level: 'Avancé',
    tagline: 'Le synthétiseur modulaire ultime — puissance infinie',
    whatIsIt: `Phase Plant est un synthétiseur hybride qui combine synthèse wavetable, soustractive, FM et sampling dans une interface semi-modulaire. Tu commences avec une page blanche et tu ajoutes les oscillateurs et les effets dont tu as besoin. C'est l'un des synthés les plus puissants du marché.`,
    forWho: `Sound designers et producteurs avancés qui se sentent limités par des synthés comme Serum. Si tu aimes "construire" tes sons de zéro, c'est l'outil parfait.`,
    keyParamsJson: JSON.stringify([
      { name: 'GENERATORS', role: 'Source du son', tip: 'Tu peux empiler autant d\'oscillateurs que tu veux. Mélange une wavetable avec un sample de bruit réel.' },
      { name: 'MODULATORS', role: 'Animation du son', tip: 'Les LFO, enveloppes et générateurs de courbes sont incroyablement flexibles. Tout peut moduler tout.' },
      { name: 'LANE 1/2/3', role: 'Chaînes d\'effets', tip: 'Phase Plant utilise les "Snapins" de Kilohearts. Tu peux créer des chaînes d\'effets complexes directement à l\'intérieur du synthé.' },
    ]),
    starterPreset: JSON.stringify({ description: 'Wavetable animée simple', values: [{ param: 'Generator', value: 'Wavetable "Basic Shapes"' }, { param: 'LFO 1', value: 'Assigné à WT Position' }, { param: 'Lane 1', value: 'Ajoute Delay et Reverb' }] }),
    proTechnique: `Utilise les "Audio Rate Modulations" (FM) entre deux oscillateurs pour créer des timbres agressifs et métalliques impossibles à obtenir autrement.`,
    commonMistakes: `Vouloir tout faire tout de suite. La page blanche de Phase Plant peut être intimidante. Commence par un seul oscillateur et un seul effet.`,
    pairsWith: JSON.stringify(['Multipass', 'Snap Heap', 'OTT']),
    freeAlternative: 'Vital (gratuit)',
    officialImageUrl: '/plugins/phase-plant.png',
    imageAlt: 'Interface de Phase Plant — synthétiseur modulaire',
    authorNote: "Le futur de la synthèse.",
  },

  // ─────────────────────────────────────────
  // 16. VITAL (gratuit)
  // ─────────────────────────────────────────
  {
    slug: 'vital',
    pluginName: 'Vital',
    brand: 'Matt Tytel',
    category: 'Synthesizer',
    level: 'Tous niveaux',
    tagline: 'Le Serum gratuit — puissant, beau, accessible',
    whatIsIt: `Synthé wavetable gratuit qui rivalise avec Serum. Interface visuelle magnifique. Idéal pour commencer la synthèse wavetable sans dépenser un centime.`,
    forWho: `Débutants qui veulent apprendre la synthèse. Producteurs qui cherchent une alternative gratuite à Serum. Tout le monde — la version gratuite est déjà très complète.`,
    genresJson: JSON.stringify(['Électronique', 'Pop', 'Ambient', 'Future Bass']),
    referencesJson: JSON.stringify(['Flume', 'Said the Sky']),
    keyParamsJson: JSON.stringify([
      {
        name: 'OSC 1',
        role: 'Oscillateur principal — source du son',
        tipBeginner: 'Commence par une wavetable simple comme "Basic Shapes". Écoute comment le son change quand tu bouges le curseur WT POS.',
        tipIntermediate: 'Empile OSC 1 et OSC 2 avec des wavetables différentes. Désaccorde légèrement OSC 2 (+7 semitones) pour enrichir le son.',
        tipPro: 'Importe tes propres wavetables depuis des fichiers audio. Un sample de voix transformé en wavetable crée des textures uniques impossibles à reproduire autrement.'
      },
      {
        name: 'FILTER',
        role: 'Sculpte les fréquences du son',
        tipBeginner: 'Baisse le CUTOFF pour rendre le son plus sombre et chaud. Monte la RESONANCE pour un son plus caractéristique.',
        tipIntermediate: 'Assigne une enveloppe au CUTOFF pour un filtre qui s\'ouvre progressivement. C\'est la base de la majorité des leads électroniques.',
        tipPro: 'Utilise le mode COMB pour des effets de résonance métalliques. Associé à un LFO rapide, tu crées des sons robotiques impossibles avec d\'autres types de filtre.'
      },
      {
        name: 'ENV 1',
        role: 'Enveloppe de volume — comment le son démarre et s\'arrête',
        tipBeginner: 'ATTACK = temps avant que le son arrive à plein volume. RELEASE = temps avant que le son disparaît. Commence par jouer avec ces deux paramètres uniquement.',
        tipIntermediate: 'DECAY + SUSTAIN définissent la "tenue" du son. Decay court + Sustain à zéro = son percussif. Sustain à 100% = son qui tient tant que tu appuies.',
        tipPro: 'Utilise des courbes d\'enveloppe non-linéaires (clic droit sur les points). Une courbe exponentielle sur le Release sonne plus naturel qu\'une courbe linéaire.'
      },
      {
        name: 'LFO 1',
        role: 'Modulation automatique — anime n\'importe quel paramètre',
        tipBeginner: 'Drag-and-drop le LFO vers le CUTOFF du filtre. Tu entends le son se modifier automatiquement. C\'est ce qu\'on appelle un filtre LFO — la base de la musique électronique.',
        tipIntermediate: 'Synchronise le LFO au tempo (bouton SYNC). Un LFO en 1/4 note sur le volume crée un effet de tremolo rythmique parfaitement en temps.',
        tipPro: 'Dessine des formes de LFO personnalisées pour des modulations complexes. Un LFO en forme de marches d\'escalier sur le pitch crée un arpège automatique.'
      },
      {
        name: 'UNISON',
        role: 'Empile plusieurs voix pour un son plus large',
        tipBeginner: 'Active 2-4 voix et monte légèrement le DETUNE. Le son devient immédiatement plus "plein" et professionnel.',
        tipIntermediate: 'Stacking : active l\'Unison sur 2-3 oscillateurs avec des quantités de detune différentes. Sonne plus riche qu\'un unison sur un seul oscillateur.',
        tipPro: 'Unison avec STEREO pan maximal mais DETUNE minimal (2-3 cents). Tu crées une largeur stéréo massive sans l\'effet "flou" d\'un detune trop fort.'
      }
    ]),
    starterPreset: JSON.stringify({
      description: 'Lead simple et efficace',
      values: [
        { param: 'OSC 1', value: 'Wavetable "Saw Wave"' },
        { param: 'UNISON', value: '3 voix, DETUNE 12 cents' },
        { param: 'FILTER', value: 'Low Pass, CUTOFF 65%, RES 15%' },
        { param: 'ENV 1 Attack', value: '5ms' },
        { param: 'ENV 1 Release', value: '200ms' }
      ]
    }),
    proTechnique: `Le "Ghost Oscillator" : baisse OSC 2 à -20 dB, monte l'octave à +1 ou +2, et ajoute beaucoup de DETUNE. Tu n'entends presque pas OSC 2 séparément, mais il ajoute une brillance et une épaisseur qui manquent quand tu le coupes.`,
    commonMistakes: `Trop de voix Unison avec trop de Detune. Le son semble "large" mais il est incontrôlable dans un mix. Pour un lead qui coupe dans le mix, 2 voix avec 8-10 cents de detune est souvent plus efficace que 8 voix à 50 cents.`,
    pairsWith: JSON.stringify(['OTT', 'FabFilter Pro-Q 3', 'Valhalla Supermassive']),
    freeAlternative: null,
    officialImageUrl: '/plugins/vital.png',
    authorNote: 'Gratuit et excellent. Commence ici si tu veux apprendre la synthèse wavetable.',
  },

  // ─────────────────────────────────────────
  // 17. WAVES CLA-76
  // ─────────────────────────────────────────
  {
    slug: 'waves-cla-76',
    pluginName: 'CLA-76',
    brand: 'Waves',
    category: 'Compressor',
    level: 'Tous niveaux',
    tagline: 'L\'émulation du compresseur FET légendaire — punch instantané sur tout',
    whatIsIt: `Émulation du Urei 1176 — le compresseur à transistors le plus utilisé de l'histoire du studio. Réaction ultra-rapide. Caractère sonore immédiat. Sur une voix, une basse ou une caisse claire, l'effet est instantanément reconnaissable.`,
    forWho: `Tout producteur qui veut du punch et du caractère analogique. Particulièrement puissant sur les voix, les guitares et les percussions.`,
    genresJson: JSON.stringify(['Rock', 'Pop', 'Hip-hop', 'R&B']),
    referencesJson: JSON.stringify(['Daft Punk', 'Michael Jackson - Thriller']),
    keyParamsJson: JSON.stringify([
      {
        name: 'INPUT',
        role: 'Drive d\'entrée — contrôle indirectement la compression',
        tipBeginner: 'Monte l\'INPUT jusqu\'à voir l\'aiguille de réduction bouger. Plus tu montes, plus tu comprimes. Simple.',
        tipIntermediate: 'L\'INPUT et le RATIO interagissent. Ratio élevé + INPUT modéré sonne différemment que Ratio faible + INPUT fort. Expérimente les deux.',
        tipPro: 'Sur une voix, monte l\'INPUT jusqu\'à 6-8 dB de réduction sur les peaks. Le 1176 sonne mieux quand il travaille fort que quand il effleure le signal.'
      },
      {
        name: 'ATTACK',
        role: 'Rapidité de réaction de la compression',
        tipBeginner: 'Tourne complètement à droite (position 7) pour l\'attack la plus rapide. Tourne à gauche pour l\'attack la plus lente.',
        tipIntermediate: 'Attention : sur le 1176, tourner vers la droite = attack PLUS RAPIDE (contrairement à la logique habituelle). Position 3-5 est un bon point de départ.',
        tipPro: 'Attack en position 1-2 (lente) sur une guitare acoustique = le picking passe sans être comprimé. Tu gardes le transient naturel tout en contrôlant le sustain.'
      },
      {
        name: 'RELEASE',
        role: 'Rapidité de récupération après compression',
        tipBeginner: 'Position 7 = release très rapide. Position 1 = release lente. Commence au milieu.',
        tipIntermediate: 'Release rapide sur la batterie = compression qui "pompe" et respire. Donne du groove. Release lente sur voix = compression plus transparente.',
        tipPro: 'Mode "All Buttons In" : appuie sur les 4 boutons de ratio simultanément. Mode non-documenté qui crée un son de compression particulièrement saturé et agressif — légendaire sur la grosse caisse.'
      },
      {
        name: 'RATIO',
        role: 'Intensité de la compression',
        tipBeginner: '4:1 pour commencer. C\'est le réglage le plus polyvalent et musical du CLA-76.',
        tipIntermediate: '20:1 = presque du limiting. Utilisé sur des voix très dynamiques ou des basses qui débordent.',
        tipPro: 'Mode "All Buttons In" (4+8+12+20 simultanément) = son de distorsion analogique unique. Essaie sur une caisse claire à bas volume pour de la couleur subtile.'
      },
      {
        name: 'OUTPUT',
        role: 'Volume de sortie — compense le gain',
        tipBeginner: 'Si le son semble plus bas après compression, monte l\'OUTPUT pour compenser. Compare toujours à volume égal.',
        tipIntermediate: 'Monte l\'OUTPUT légèrement au-dessus du niveau original. La compression perçue semble plus efficace — c\'est l\'illusion du volume.',
        tipPro: 'Utilise l\'OUTPUT pour "driver" l\'étage suivant de ta chaîne. Un peu de saturation en sortie du 1176 vers un compresseur optique (type LA-2A) = chaîne classique New York.'
      }
    ]),
    starterPreset: JSON.stringify({
      description: 'Voix lead — punch et présence',
      values: [
        { param: 'INPUT', value: 'Jusqu\'à 6 dB de réduction' },
        { param: 'OUTPUT', value: 'Compensé à niveau égal' },
        { param: 'ATTACK', value: 'Position 3' },
        { param: 'RELEASE', value: 'Position 5' },
        { param: 'RATIO', value: '4:1' }
      ]
    }),
    proTechnique: `La chaîne classique : CLA-76 (Ratio 4:1, attack rapide) suivi d'un CLA-2A. Le 76 contrôle les peaks transients, le 2A gère le niveau général avec sa réaction lente et organique. C'est la chaîne voix d'innombrables albums des années 70-90.`,
    commonMistakes: `Confondre la direction des potentiomètres Attack et Release. Sur le vrai 1176 (et son émulation), tourner à DROITE = plus RAPIDE. C'est l'inverse de la logique habituelle. Beaucoup de débutants règlent l'attack à l'envers.`,
    pairsWith: JSON.stringify(['Waves CLA-2A', 'FabFilter Pro-Q 3', 'Soundtoys Decapitator']),
    freeAlternative: 'Auburn Sounds Graillon 2 (compression colorée gratuite)',
    officialImageUrl: '/plugins/cla-76.png',
    authorNote: null,
  },

  // ─────────────────────────────────────────
  // 18. SOUNDTOYS ECHOBOY
  // ─────────────────────────────────────────
  {
    slug: 'soundtoys-echboy',
    pluginName: 'EchoBoy',
    brand: 'Soundtoys',
    category: 'Delay',
    level: 'Tous niveaux',
    tagline: 'Le delay le plus musical et le plus coloré du marché',
    whatIsIt: `EchoBoy émule des dizaines de machines à delay vintage — des bandes magnétiques aux delay numériques des années 80. Chaque style sonne différemment. C'est le delay qu'on choisit quand on veut du caractère, pas juste de l'écho.`,
    forWho: `Tout le monde. Sur une voix pour de la profondeur. Sur une guitare pour du vibe. Sur des synthés pour de la texture. EchoBoy est le delay de référence pour les producteurs qui veulent que leurs delays aient une personnalité.`,
    genresJson: JSON.stringify(['Pop', 'Rock', 'Électronique', 'R&B', 'Indie']),
    referencesJson: JSON.stringify(['Tame Impala', 'The Weeknd', 'Frank Ocean']),
    keyParamsJson: JSON.stringify([
      {
        name: 'STYLE',
        role: 'Type de machine à delay émulée',
        tipBeginner: 'Commence par "Studio Tape" pour un delay chaud et naturel. Essaie "Rhythm Echo" pour un delay plus rétro avec du caractère.',
        tipIntermediate: 'Chaque style colore le signal différemment. "Space Echo" = son Roland RE-201 vintage. "Magnetic" = bande magnétique avec wow et flutter. Le style change tout.',
        tipPro: 'Utilise les styles numériques ("Digital") pour un delay transparent et précis sur des productions modernes. Garde les styles tape et analog pour des sons "lived-in" et vintage.'
      },
      {
        name: 'ECHO TIME',
        role: 'Durée entre l\'original et l\'écho',
        tipBeginner: 'Clique sur "SYNC" et choisis 1/4 note. Le delay rebondit parfaitement en temps avec ton morceau.',
        tipIntermediate: 'Essaie des valeurs en dotted (pointées) : 3/8 ou 3/16. Le delay joue dans les "trous" du groove et crée de l\'espace sans encombrer le mix.',
        tipPro: 'Delay en "Ping-Pong" avec deux temps différents gauche et droite (ex: 1/4 gauche, 3/8 droite). Crée une image stéréo complexe et mouvante.'
      },
      {
        name: 'FEEDBACK',
        role: 'Nombre de répétitions de l\'écho',
        tipBeginner: 'Moins de 30% = 2-3 répétitions discrètes. Plus de 70% = l\'écho se répète longtemps. Trop haut = saturation et larsen.',
        tipIntermediate: 'Feedback modéré (40-60%) avec une saturation légère = vibe tape vintage. Les répétitions se dégradent naturellement comme une vraie bande.',
        tipPro: 'Feedback très haut (80%+) sur un signal court = texture quasi-infinie. Met un filtre passe-haut sur le feedback pour éviter que les basses fréquences s\'accumulent.'
      },
      {
        name: 'MIX',
        role: 'Balance original / écho',
        tipBeginner: 'En insert sur une voix : 15-25% max. Tu veux entendre l\'écho, pas noyer la voix dedans.',
        tipIntermediate: 'En send (bus delay) : 100% wet. Tu contrôles la quantité depuis le niveau du send sur ta piste. Plus de flexibilité.',
        tipPro: 'Automatise le MIX : 0% pendant les couplets, 30% sur les fins de phrases, 100% sur les dernières syllabes avant le chorus. Technique classique de mixage voix.'
      },
      {
        name: 'TWEAK (SATURATION)',
        role: 'Saturation et couleur analogique de l\'écho',
        tipBeginner: 'Laisse à la valeur par défaut pour commencer. Ce paramètre change selon le style choisi.',
        tipIntermediate: 'Monte le TWEAK pour ajouter de la saturation aux répétitions. Elles "vieillissent" progressivement comme une vraie bande.',
        tipPro: 'TWEAK à fond + Feedback à 60% = les répétitions se saturent et distordent progressivement. Son psychédélique de guitare des années 60-70.'
      }
    ]),
    starterPreset: JSON.stringify({
      description: 'Delay voix classique',
      values: [
        { param: 'STYLE', value: 'Studio Tape' },
        { param: 'ECHO TIME', value: '1/4 note (synced)' },
        { param: 'FEEDBACK', value: '35%' },
        { param: 'MIX', value: '20% (insert) ou 100% (send)' },
        { param: 'FILTER', value: 'HP à 200Hz, LP à 8kHz' }
      ]
    }),
    proTechnique: `Le "Slapback" d'Elvis : Style "Magnetic", ECHO TIME à 80-120ms, FEEDBACK à 0%, MIX à 30%. Une seule répétition très rapide qui donne du corps et de la présence à une voix ou une guitare sans sonner comme un echo classique. Technique omniprésente dans le rockabilly et le rock des années 50-60, toujours aussi efficace aujourd'hui.`,
    commonMistakes: `Laisser les basses fréquences dans le signal de delay. Ajoute toujours un filtre passe-haut (100-200 Hz) sur la sortie de l'EchoBoy. Les répétitions n'ont pas besoin de basses — ça encombre le mix et crée de la boue dans les fréquences basses.`,
    pairsWith: JSON.stringify(['Valhalla Room', 'FabFilter Pro-Q 3', 'Soundtoys Decapitator']),
    freeAlternative: 'Valhalla SpaceModulator (delay+modulation, gratuit)',
    officialImageUrl: '/plugins/echboy.png',
    authorNote: 'Le premier Soundtoys à acheter. Polyvalent, musical, irremplaçable.',
  },

  // ─────────────────────────────────────────
  // 19. FABFILTER PRO-L 2
  // ─────────────────────────────────────────
  {
    slug: 'fabfilter-pro-l-2',
    pluginName: 'FabFilter Pro-L 2',
    brand: 'FabFilter',
    category: 'Limiter',
    level: 'Intermédiaire',
    tagline: 'Le limiter transparent de référence — le dernier maillon de ta chaîne',
    whatIsIt: `Le dernier plugin sur ta chaîne de mastering. Il plafonne le signal pour éviter la distorsion et maximise le volume perçu. Transparent ou coloré selon le mode choisi. Standard de l'industrie pour le mastering indépendant.`,
    forWho: `Producteurs qui font leur propre mastering. Pas besoin de comprendre tous les paramètres au début — les presets de style font 80% du travail.`,
    genresJson: JSON.stringify(['Tous genres']),
    referencesJson: JSON.stringify([]),
    keyParamsJson: JSON.stringify([
      {
        name: 'GAIN',
        role: 'Quantité de limiting appliqué',
        tipBeginner: 'Monte jusqu\'à ce que tu voies 2-4 dB de réduction. C\'est un bon point de départ pour la plupart des genres.',
        tipIntermediate: 'Pour la musique électronique : 4-8 dB de réduction est courant. Pour de la musique acoustique : préfère 1-3 dB maximum pour garder la dynamique naturelle.',
        tipPro: 'Utilise le Gain Reduction History (le graphique) pour voir les moments où tu limits trop fort. Si la réduction est constante et uniforme = tu limits trop. Le limiting doit attraper des pics, pas compresser en permanence.'
      },
      {
        name: 'TRUE PEAK',
        role: 'Niveau maximum absolu en sortie',
        tipBeginner: 'Mets à -1.0 dBTP pour le streaming. C\'est le standard actuel pour Spotify, Apple Music, YouTube.',
        tipIntermediate: '-0.5 dBTP pour plus de marge de sécurité. La conversion MP3 peut créer des peaks qui dépassent le niveau original — le True Peak évite ça.',
        tipPro: 'Pour les livraisons en studio (fichiers WAV pour label ou sync) : -0.3 dBTP. Pour mastering vinyle : pas de limiting agressif, cible -6 dBFS ou moins.'
      },
      {
        name: 'STYLE',
        role: 'Algorithme de limiting — caractère sonore',
        tipBeginner: 'Commence par "Transparent" ou "Modern". Écoute les différences entre les styles sur ta musique.',
        tipIntermediate: '"Aggressive" pour de la musique électronique qui doit être fort et punchy. "Transparent" pour de la musique acoustique où la dynamique naturelle est importante.',
        tipPro: '"Allround" est souvent le meilleur compromis pour la majorité des genres. "Bus" est conçu spécifiquement pour les bus de groupes (drums, voix) plutôt que pour le master final.'
      },
      {
        name: 'LOOKAHEAD',
        role: 'Anticipation du signal avant limiting',
        tipBeginner: 'Laisse à la valeur par défaut. Tu n\'as pas besoin de toucher ça au début.',
        tipIntermediate: 'Lookahead plus long = limiting plus transparent mais plus de latence. En mixage temps réel, réduis-le. En mastering hors ligne, laisse au maximum.',
        tipPro: 'Lookahead à 0ms = caractère le plus "vintage" avec plus de distorsion harmonique subtile. Certains le préfèrent pour la musique électronique agressive.'
      },
      {
        name: 'UNITY GAIN',
        role: 'Compare le signal limité au signal original',
        tipBeginner: 'Active Unity Gain pour désactiver le makeup gain et comparer à volume égal. C\'est le seul moyen objectif de savoir si ton limiting améliore vraiment le son.',
        tipIntermediate: 'Compare toujours à volume égal avant de valider tes réglages. Le cerveau perçoit toujours le son plus fort comme "meilleur". Unity Gain contrecarre ce biais.',
        tipPro: 'Combine Unity Gain avec le Spectrum Analyzer. Si le spectre change significativement entre bypasse et actif = ton limiting est trop agressif pour le programme musical.'
      }
    ]),
    starterPreset: JSON.stringify({
      description: 'Mastering standard streaming',
      values: [
        { param: 'STYLE', value: 'Transparent' },
        { param: 'GAIN', value: 'Jusqu\'à -3 à -4 dB de réduction' },
        { param: 'TRUE PEAK', value: '-1.0 dBTP' },
        { param: 'TARGET', value: '-14 LUFS (Spotify/Apple Music)' }
      ]
    }),
    proTechnique: `Le double limiter : Pro-L 2 en mode "Allround" à -3 dB de réduction, suivi d'un second Pro-L 2 en mode "Transparent" à -1 dB. Le premier gère les peaks dynamiques, le second finalise le niveau de façon imperceptible. Résultat : plus fort et plus transparent qu'un seul limiting agressif.`,
    commonMistakes: `Cibler le volume des références sans tenir compte du genre. Une track de metal peut atteindre -6 LUFS, un track lo-fi vise -16 LUFS. Copier le niveau d'une référence de genre différent détruit la dynamique naturelle de ta musique.`,
    pairsWith: JSON.stringify(['FabFilter Pro-Q 3', 'iZotope Ozone 11', 'Youlean Loudness Meter']),
    freeAlternative: 'Limiter No6 (gratuit, très bon)',
    officialImageUrl: '/plugins/fabfilter-pro-l-2.png',
    authorNote: 'Indispensable pour le mastering. Investissement qui vaut chaque centime.',
  },

  // ─────────────────────────────────────────
  // 20. NATIVE INSTRUMENTS MASSIVE X
  // ─────────────────────────────────────────
  {
    slug: 'massive-x',
    pluginName: 'Massive X',
    brand: 'Native Instruments',
    category: 'Synthesizer',
    level: 'Intermédiaire',
    tagline: 'Le successeur du synthé qui a défini le dubstep et la bass music',
    whatIsIt: `Successeur de Massive, le synthé qui a défini le son du dubstep. Architecture de synthèse plus complexe, sons plus organiques et plus modernes. Wobble basses, leads agressifs, pads cinématiques — Massive X peut tout faire.`,
    forWho: `Producteurs de musique électronique qui veulent aller au-delà des sons basiques. Connaître les fondamentaux de la synthèse aide, mais les presets inclus sont excellents pour commencer.`,
    genresJson: JSON.stringify(['Dubstep', 'Bass Music', 'Techno', 'Électronique']),
    referencesJson: JSON.stringify(['Skrillex', 'Rezz', 'Virtual Riot']),
    keyParamsJson: JSON.stringify([
      {
        name: 'OSC A / OSC B',
        role: 'Oscillateurs principaux — deux moteurs sonores',
        tipBeginner: 'Commence par sélectionner un wavetable dans OSC A. Écoute comment le WT POS change le son en temps réel.',
        tipIntermediate: 'OSC B désaccordé à +7 semitones (quinte) par rapport à OSC A = son harmoniquement riche instantané. C\'est la base de nombreux leads puissants.',
        tipPro: 'Utilise les oscillateurs en mode "Phase Modulation" pour une synthèse FM hybride. Sons métalliques et organiques impossibles à obtenir avec la synthèse wavetable classique.'
      },
      {
        name: 'ROUTING',
        role: 'Comment les oscillateurs se connectent aux filtres',
        tipBeginner: 'Laisse le routing par défaut (série). Les deux oscillateurs passent par les deux filtres.',
        tipIntermediate: 'Routing parallèle : OSC A dans Filtre 1, OSC B dans Filtre 2. Tu peux EQ les deux sources séparément et les mixer. Sons très puissants.',
        tipPro: 'OSC A en FM vers OSC B avant le filtre. Tu utilises OSC A comme modulateur de fréquence de OSC B — synthèse FM dans un synthé wavetable. Sons brutaux et organiques en même temps.'
      },
      {
        name: 'FILTER 1',
        role: 'Filtre principal — sculpture fréquentielle',
        tipBeginner: 'Decker Filter en Low Pass = son classique de synthé. Baisse le Cutoff pour du warmth, monte la Resonance pour du caractère.',
        tipIntermediate: 'Essaie le filtre "Comb" pour des sons métalliques. Le Cutoff contrôle la fréquence de la peigne — sonne comme une corde ou un tube résonant.',
        tipPro: 'Double Notch Filter en parallel = égalisation dynamique brutale sur des basses. Crée des "trous" dans le spectre qui font ressortir les harmoniques et donnent du punch.'
      },
      {
        name: 'PERFORMER',
        role: 'Séquenceur de modulation avancé',
        tipBeginner: 'Tu n\'as pas besoin de toucher au Performer pour commencer. Concentre-toi sur les oscillateurs et les filtres.',
        tipIntermediate: 'Le Performer = LFO avancé avec des étapes programmables. Chaque étape peut avoir une valeur différente. Tu crées des patterns de modulation complexes et rythmiques.',
        tipPro: 'Performer avec 16 étapes, synced au tempo, assigné au Cutoff + Pitch simultanément. Tu crées un arpège + filtre automatique qui génère des séquences mélodiques sans jouer une seule note.'
      },
      {
        name: 'INSERT FX',
        role: 'Effets intégrés dans le chemin du signal',
        tipBeginner: 'Les Insert FX s\'appliquent avant la sortie. Commence par un "Reverb" ou un "Dimension Expander" pour élargir le son.',
        tipIntermediate: 'Distortion en Insert avant le Reverb = saturation qui se mélange dans la reverb. Sonne beaucoup plus intégré qu\'une distorsion après reverb.',
        tipPro: 'Feedback Ensemble en Insert à faible intensité = épaississement du son subtil et vintage. Combiné à un filtre résonnant = son de synthé analogique vintage presque indiscernable du hardware.'
      }
    ]),
    starterPreset: JSON.stringify({
      description: 'Basse mid-range polyvalente',
      values: [
        { param: 'OSC A', value: 'Wavetable "Digital Saw"' },
        { param: 'OSC B', value: 'Même wavetable, +12 semitones, -8 dB' },
        { param: 'FILTER 1', value: 'Decker Filter, Cutoff 55%, Res 25%' },
        { param: 'ENV Attack', value: '2ms' },
        { param: 'ENV Release', value: '300ms' }
      ]
    }),
    proTechnique: `Le Wobble bass classique : assigne un LFO en sync 1/8 note au Cutoff du filtre, profondeur à 60%. Ajoute de la Resonance à 40%. Règle le LFO en forme de sinus. C'est le son de base du dubstep — mais tu peux faire varier la forme du LFO, la vitesse et la profondeur pour des résultats infiniment différents.`,
    commonMistakes: `Ignorer le ROUTING et laisser tout en configuration par défaut. La vraie puissance de Massive X vient de la façon dont tu connectes les oscillateurs aux filtres. Un routing série vs parallèle change complètement le son — c'est là que Massive X devient unique.`,
    pairsWith: JSON.stringify(['OTT', 'FabFilter Pro-Q 3', 'Soundtoys Decapitator']),
    freeAlternative: 'Vital (gratuit)',
    officialImageUrl: '/plugins/massive-x.png',
    authorNote: null,
  },

  // ─────────────────────────────────────────
  // 21. IZOTOPE NEUTRON 4 (updated)
  // ─────────────────────────────────────────
  {
    slug: 'izotope-neutron-4',
    pluginName: 'Neutron 4',
    brand: 'iZotope',
    category: 'Multi-FX',
    level: 'Intermédiaire',
    tagline: 'La suite de mixage intelligente — EQ, compresseur et saturation dans un seul plugin',
    whatIsIt: `Suite de traitement complète pour le mixage : EQ, compresseur multibande, transient shaper, exciter et imager stéréo dans un seul plugin. L'IA "Track Assistant" analyse ton signal et propose des réglages de départ adaptés au type de contenu.`,
    forWho: `Producteurs qui font leur propre mixage. Très efficace pour des résultats rapides et professionnels sans passer des heures sur chaque paramètre.`,
    genresJson: JSON.stringify(['Tous genres']),
    referencesJson: JSON.stringify([]),
    keyParamsJson: JSON.stringify([
      {
        name: 'TRACK ASSISTANT',
        role: 'IA qui analyse et propose des réglages',
        tipBeginner: 'Clique sur Track Assistant, laisse jouer 10 secondes de musique, choisis ton style (Warm, Balanced, Open, Low End Focus). C\'est ton point de départ.',
        tipIntermediate: 'Utilise Track Assistant comme base puis affine manuellement. L\'IA donne un point de départ solide — tes oreilles font le reste.',
        tipPro: 'Utilise le Masking Meter pour voir quand deux instruments se chevauchent dans le spectre. Neutron 4 peut communiquer entre instances sur différentes pistes pour suggérer des corrections automatiques.'
      },
      {
        name: 'EQ',
        role: 'Égalisation du signal',
        tipBeginner: 'Commence par les suggestions du Track Assistant. Identifie les fréquences qui sonnent trop ou trop peu, puis ajuste.',
        tipIntermediate: 'Utilise l\'EQ en mode Dynamic pour les sibilances et les fréquences qui deviennent problématiques seulement à fort volume.',
        tipPro: 'EQ en mode Mid/Side : coupe les graves en Side (sous 200 Hz) pour un mix plus propre. Booste légèrement les hautes fréquences en Side pour plus de largeur perçue.'
      },
      {
        name: 'COMPRESSOR',
        role: 'Compression multibande intégrée',
        tipBeginner: 'Commence par le compresseur en mode "Classic" avec le preset du Track Assistant. Vois comment le signal réagit.',
        tipIntermediate: 'Compresseur multibande : comprime les basses séparément des médiums. Évite qu\'un pic de basse déclenche la compression sur tout le signal.',
        tipPro: 'Transient Shaper + Compressor en série : le TS attaque les transitoires, le compresseur gère le sustain. Tu contrôles séparément le punch et la densité.'
      },
      {
        name: 'EXCITER',
        role: 'Ajoute des harmoniques et de la présence',
        tipBeginner: 'Monte légèrement l\'Exciter sur les hautes fréquences pour ajouter de l\'air et de la brillance à une voix ou un instrument qui manque de présence.',
        tipIntermediate: 'Saturation subtile sur les mids avec l\'Exciter = présence et chaleur sans ajouter de volume. Plus musical qu\'un simple EQ boost.',
        tipPro: 'Exciter en mode "Retro" sur un bus de voix backing = toutes les voix semblent enregistrées dans la même pièce. Cohérence immédiate sur des enregistrements faits à des moments différents.'
      },
      {
        name: 'IMAGER',
        role: 'Contrôle de la largeur stéréo',
        tipBeginner: 'Élargis légèrement les hautes fréquences pour plus de présence. Garde les basses fréquences centrées (mono).',
        tipIntermediate: 'Rétrécis l\'image stéréo des médiums pour une voix ou un instrument solo qui doit être centré dans le mix. Élargis les hautes pour de l\'air.',
        tipPro: 'Sur un bus de synthés : élargis les hautes et mids, rétrécis les basses. La basse reste mono et solide, les harmoniques s\'étendent en stéréo. Mix plus propre et plus large simultanément.'
      }
    ]),
    starterPreset: JSON.stringify({
      description: 'Voix lead — commencer avec Track Assistant',
      values: [
        { param: 'Track Assistant', value: 'Mode "Balanced" — laisse analyser 10 secondes' },
        { param: 'EQ HP', value: '80 Hz pour couper les rumbles' },
        { param: 'Compressor', value: 'Ratio 3:1, Threshold selon niveau' },
        { param: 'Exciter', value: 'Hautes fréquences, intensité 20-30%' }
      ]
    }),
    proTechnique: `Le Masking Meter inter-pistes : mets Neutron 4 sur ta voix ET sur ta guitare lead. Dans le Masking Meter, tu vois exactement où les deux instruments se chevauchent. Neutron peut automatiquement couper les fréquences de la guitare qui masquent la voix quand la voix joue. Résultat : les deux instruments coexistent parfaitement sans EQ manuel.`,
    commonMistakes: `Faire confiance à 100% au Track Assistant sans écouter. L'IA optimise selon des critères objectifs, pas selon ta vision artistique. Utilise-la comme point de départ, jamais comme résultat final.`,
    pairsWith: JSON.stringify(['iZotope Ozone 11', 'FabFilter Pro-Q 3', 'Valhalla Room']),
    freeAlternative: 'TDR Nova (EQ dynamique gratuit)',
    officialImageUrl: '/plugins/neutron-4.png',
    authorNote: null,
  },

  // ─────────────────────────────────────────
  // 22. ARTURIA PIGMENTS 4
  // ─────────────────────────────────────────
  {
    slug: 'arturia-pigments-4',
    pluginName: 'Pigments 4',
    brand: 'Arturia',
    category: 'Synthesizer',
    level: 'Intermédiaire',
    tagline: 'Le synthé wavetable + granulaire le plus beau et le plus expressif du marché',
    whatIsIt: `Pigments combine synthèse wavetable, granulaire, additionnelle et analogique dans une interface magnifique. C'est le synthé qui fait le plus de types de sons différents tout en restant accessible. Textures, leads, pads, basses — aucun autre synthé ne couvre autant de terrain.`,
    forWho: `Producteurs qui veulent explorer différents types de synthèse dans un seul instrument. L'interface visuelle le rend accessible, mais la profondeur satisfait les experts.`,
    genresJson: JSON.stringify(['Ambient', 'Électronique', 'Cinématique', 'Pop', 'Expérimental']),
    referencesJson: JSON.stringify(['Rival Consoles', 'Jon Hopkins']),
    keyParamsJson: JSON.stringify([
      {
        name: 'ENGINE 1 / ENGINE 2',
        role: 'Deux moteurs de synthèse indépendants',
        tipBeginner: 'Commence par ENGINE 1 uniquement. Choisis un type de synthèse (Wavetable, Analog) et explore ses paramètres.',
        tipIntermediate: 'Combine ENGINE 1 en Wavetable avec ENGINE 2 en Granular. Le wavetable donne la structure harmonique, le granulaire crée la texture et le mouvement.',
        tipPro: 'ENGINE 2 en mode Sample avec un champ sonore enregistré (vent, foule, etc) comme source granulaire. ENGINE 1 en Wavetable pour la mélodie. Tu crées des textures cinématiques uniques impossibles avec n\'importe quel autre synthé.'
      },
      {
        name: 'GRANULAR',
        role: 'Découpe un sample en micro-grains et les réorganise',
        tipBeginner: 'Sélectionne un sample simple (note de piano, voix). Joue avec le paramètre GRAIN SIZE. Le son se transforme en texture continue.',
        tipIntermediate: 'POSITION détermine où dans le sample tu "lis" les grains. Automatise POSITION avec un LFO pour un son qui évolue et change en temps réel.',
        tipPro: 'Grains très courts (5-10ms) + randomisation haute = bruit texturé harmonique. Grains longs (200-500ms) + peu de randomisation = time-stretching de qualité studio.'
      },
      {
        name: 'SEQUENCE / ARP',
        role: 'Séquenceur et arpégiateur avancés',
        tipBeginner: 'Active l\'Arpégiator, sélectionne un pattern "Up" et joue un accord. Le synthé joue automatiquement les notes de l\'accord en séquence.',
        tipIntermediate: 'Le séquenceur de modulation assigne des valeurs différentes à n\'importe quel paramètre à chaque étape. Le son change à chaque note jouée.',
        tipPro: 'Séquenceur de modulation avec 16 étapes différentes sur le Grain Position et le Pitch simultanément. Tu crées des mélodies complexes qui évoluent harmoniquement step by step.'
      },
      {
        name: 'FILTER',
        role: 'Filtrage avec émulations de filtres vintage',
        tipBeginner: 'Pigments propose des filtres Steiner-Parker, MS-20 et Buchla. Commence par le SEM LP — doux et musical.',
        tipIntermediate: 'Le MS-20 Filter en mode Band Pass avec haute Resonance = son acide et percussif. Classique de la musique électronique.',
        tipPro: 'LADDER Filter en auto-oscillation (Resonance à fond) = le filtre génère sa propre fréquence comme un oscillateur supplémentaire. Joue avec le Cutoff pour des basses et des leads additionnels.'
      },
      {
        name: 'FX SLOTS',
        role: 'Chaîne d\'effets intégrée en 4 slots',
        tipBeginner: 'Les slots d\'effets s\'appliquent après la synthèse. Ajoute une reverb dans le slot 4 pour placer ton son dans un espace.',
        tipIntermediate: 'Ordre : Distortion → Chorus → Delay → Reverb. L\'ordre dans la chaîne change radicalement le résultat.',
        tipPro: 'Chorus dans le slot 2 avec un paramètre modulé par un séquenceur = chorus rhythmique qui change de caractère selon le groove. Texture vivante et évolutive.'
      }
    ]),
    starterPreset: JSON.stringify({
      description: 'Pad atmosphérique granulaire',
      values: [
        { param: 'ENGINE 1', value: 'Wavetable, WT POS à 40%, Unison 3 voix' },
        { param: 'ENGINE 2', value: 'Granular, sample de voix ou cordes' },
        { param: 'GRAIN SIZE', value: '150ms, SPRAY 30%' },
        { param: 'ENV Attack', value: '1.5 secondes' },
        { param: 'FILTER', value: 'SEM LP, Cutoff 60%, Res 15%' }
      ]
    }),
    proTechnique: `Granular Time-Stretching en temps réel : charge un sample de voix humaine dans le moteur Granular. Lie le paramètre POSITION à un LFO très lent (16-32 mesures). Le sample "navigue" à travers ses propres grains en temps réel, créant une texture vocale qui évolue sur plusieurs minutes. Technique cinématique utilisée dans les BO de films.`,
    commonMistakes: `Ignorer le moteur Granular parce qu'il semble complexe. C'est justement là que Pigments est le plus unique. Passe 30 minutes à explorer le moteur Granular avec des samples simples — c'est la fonctionnalité qui distingue Pigments de tous les autres synthés wavetable.`,
    pairsWith: JSON.stringify(['Valhalla Supermassive', 'FabFilter Pro-Q 3', 'OTT']),
    freeAlternative: 'Vital (pour la partie wavetable)',
    officialImageUrl: '/plugins/pigments-4.png',
    authorNote: 'Le synthé le plus visuellement beau et le plus polyvalent du marché. Vaut chaque centime.',
  },

  // ─────────────────────────────────────────
  // 23. KILOHEARTS PHASE PLANT (updated)
  // ─────────────────────────────────────────
  {
    slug: 'kilohearts-phase-plant',
    pluginName: 'Phase Plant',
    brand: 'Kilohearts',
    category: 'Synthesizer',
    level: 'Intermédiaire',
    tagline: 'Le synthé modulaire moderne — construis n\'importe quel son avec des blocs',
    whatIsIt: `Phase Plant est un synthétiseur modulaire semi-ouvert. Tu assembles des générateurs (oscillateurs, samples, noise) et des modulateurs (enveloppes, LFO, séquenceurs) comme des briques Lego. Résultat : architecture de son limitée uniquement par ton imagination.`,
    forWho: `Producteurs curieux qui veulent comprendre la synthèse en profondeur. L'approche modulaire rend chaque paramètre visible et compréhensible. Idéal aussi pour les pros qui veulent des architectures sonores uniques.`,
    genresJson: JSON.stringify(['Électronique', 'Techno', 'Ambient', 'Sound Design']),
    referencesJson: JSON.stringify(['deadmau5', 'Eric Prydz']),
    keyParamsJson: JSON.stringify([
      {
        name: 'GENERATORS',
        role: 'Sources sonores — oscillateurs, samples, noise',
        tipBeginner: 'Commence par un seul générateur "Analog Oscillator" en dent de scie. C\'est la forme d\'onde la plus polyvalente pour apprendre.',
        tipIntermediate: 'Empile 3 générateurs différents : Analog (base), Wavetable (texture), Noise (granularité). Règle les volumes relatifs pour équilibrer les couches.',
        tipPro: 'Utilise un Sample Generator avec tes propres enregistrements comme source. Combine avec un Wavetable Oscillator en FM sur le sample. Sons hybrides acoustiques/synthétiques uniques.'
      },
      {
        name: 'SNAPINS',
        role: 'Modules d\'effet et de traitement chaînables',
        tipBeginner: 'Ajoute un Snapin "Reverb" après tes générateurs. Simple et efficace pour commencer.',
        tipIntermediate: 'Les Snapins peuvent être placés n\'importe où dans la chaîne. Distortion avant le filtre = son différent de distortion après le filtre.',
        tipPro: 'Snapins en configuration "send" vers des bus internes. Tu peux créer des architectures de traitement parallèle complexes — comme dans un vrai rack hardware.'
      },
      {
        name: 'MODULATORS',
        role: 'Sources de modulation — ce qui anime les paramètres',
        tipBeginner: 'Drag-and-drop un modulateur LFO vers n\'importe quel knob. Celui-ci commence à osciller automatiquement.',
        tipIntermediate: 'L\'Envelope Follower comme modulateur : le volume du signal d\'entrée contrôle un paramètre. La dynamique de ta mélodie contrôle l\'ouverture du filtre.',
        tipPro: 'Curve Modulator avec des formes personnalisées = modulation non-linéaire sur n\'importe quelle valeur. Une courbe exponentielle sur le Decay de ton enveloppe sonne plus naturel qu\'une courbe linéaire.'
      },
      {
        name: 'MACRO',
        role: 'Contrôles assignables qui gèrent plusieurs paramètres',
        tipBeginner: 'Assigne plusieurs paramètres à un seul Macro. Tourne le Macro = tout change en même temps. Parfait pour les performances live.',
        tipIntermediate: '4 Macros configurés pour Cutoff, Drive, Space, Detune. Tu peux sculpter ton son en temps réel avec 4 potentiomètres physiques.',
        tipPro: 'Macro avec des quantités de modulation différentes sur chaque paramètre cible. Le même mouvement de knob déclenche des changements proportionnels et calibrés sur 10+ paramètres simultanément.'
      },
      {
        name: 'FM SYNTHESIS',
        role: 'Modulation de fréquence entre oscillateurs',
        tipBeginner: 'La FM dans Phase Plant : connecte un oscillateur comme modulateur d\'un autre avec une flèche FM. Sons métalliques et brillants instantanément.',
        tipIntermediate: 'Ratio FM de 1:1 = son harmonique musical. Ratio FM de 1:1.5 = son légèrement inharmonique, texture cloche. Ratio FM de 1:2.73 = son complètement inharmonique, métal et percussion.',
        tipPro: 'FM multi-opérateurs : 3-4 oscillateurs se modulent mutuellement en chaîne. Tu approaches la synthèse FM 6-opérateurs d\'un Yamaha DX7 mais avec le contrôle visuel et moderne de Phase Plant.'
      }
    ]),
    starterPreset: JSON.stringify({
      description: 'Architecture de base polyvalente',
      values: [
        { param: 'GENERATOR 1', value: 'Analog Oscillator, Saw, Unison 3' },
        { param: 'GENERATOR 2', value: 'Noise, White, très bas volume (-20 dB)' },
        { param: 'SNAPIN 1', value: 'Filter, Low Pass, Cutoff 60%' },
        { param: 'SNAPIN 2', value: 'Reverb, taille moyenne' },
        { param: 'MODULATOR 1', value: 'Envelope, Attack 10ms, Decay 500ms, Sustain 80%' }
      ]
    }),
    proTechnique: `Architecture Layered FM : Generator 1 (Sine, bas) → modifie Generator 2 en FM (Ratio 2:1) → Generator 2 modifie Generator 3 en FM (Ratio 1.5:1). Tu crées une chaîne FM à 3 niveaux qui génère des harmoniques complexes et évolutifs. Monte et descend les niveaux FM avec une enveloppe pour un son qui évolue de doux à brillant et métallique.`,
    commonMistakes: `Vouloir tout comprendre dès le début. Phase Plant est complexe. Commence par 1 générateur + 1 modulateur + 1 snapin. Maîtrise cette combinaison simple avant d'ajouter de la complexité. Les sons les plus efficaces sont souvent les architectures les plus simples.`,
    pairsWith: JSON.stringify(['OTT', 'Kilohearts Snap Heap', 'FabFilter Pro-Q 3']),
    freeAlternative: 'Vital (pour une synthèse wavetable accessible)',
    officialImageUrl: '/plugins/phase-plant.png',
    authorNote: 'Le synthé qui m\'a le plus appris sur la synthèse. Chaque session révèle quelque chose de nouveau.',
  },

  // ─────────────────────────────────────────
  // 24. EVENTIDE BLACKHOLE
  // ─────────────────────────────────────────
  {
    slug: 'eventide-blackhole',
    pluginName: 'Blackhole',
    brand: 'Eventide',
    category: 'Reverb',
    level: 'Tous niveaux',
    tagline: 'La reverb de l\'impossible — des espaces qui n\'existent pas dans la réalité',
    whatIsIt: `Blackhole crée des reverbs "impossibles" — des espaces qui ne peuvent pas exister physiquement. Tailles négatives, dimensions infinies, modulation extrême. C'est la reverb créative par excellence, pas une simulation d'espace réel.`,
    forWho: `Compositeurs cinématiques, producteurs d'ambient et d'électronique expérimentale. Toute personne qui veut créer des paysages sonores uniques et non conventionnels.`,
    genresJson: JSON.stringify(['Ambient', 'Cinématique', 'Expérimental', 'Post-rock']),
    referencesJson: JSON.stringify(['Brian Eno', 'Sigur Rós', 'Nils Frahm']),
    keyParamsJson: JSON.stringify([
      {
        name: 'SIZE',
        role: 'Taille de l\'espace — peut être négatif',
        tipBeginner: 'Valeurs positives = espace qui grandit. Valeurs négatives = quelque chose d\'étrange et de non-naturel. Essaie les deux — les effets sont radicalement différents.',
        tipIntermediate: 'SIZE négatif crée une reverb qui "rentre" dans le son plutôt que de s\'étendre autour. Particulièrement efficace sur des percussions pour des effets reverse.',
        tipPro: 'Automatise SIZE sur une automation qui passe de négatif à positif en temps réel. Le son "explose" de l\'intérieur vers l\'extérieur — effet dramatique pour des transitions ou des builds.'
      },
      {
        name: 'DECAY',
        role: 'Durée de vie de la reverb',
        tipBeginner: 'Monte très haut (80%+) pour des queues de reverb qui durent quasi indéfiniment. Parfait pour des drones et des textures ambient.',
        tipIntermediate: 'DECAY infini (100%) + MIX à 30% = le son dure éternellement en arrière-plan. Couche par-dessus d\'autres éléments pour une richesse harmonique continue.',
        tipPro: 'DECAY à 95% + feedback de modulation activé = les répétitions s\'accumulent et évoluent harmoniquement. Compositions entières générées par un seul accord tenu.'
      },
      {
        name: 'GRAVITY',
        role: 'Direction du decay — normal ou inversé',
        tipBeginner: 'Gravity positif = reverb normale qui décroît. Gravity négatif = reverb qui monte en volume. Effet dramatique et inhabituel.',
        tipIntermediate: 'Gravity négatif modéré sur un pad = le son semble "aspirer" l\'espace autour de lui. Effet cinématique intense sans aucune automation.',
        tipPro: 'Gravity oscille entre positif et négatif avec un LFO très lent. La reverb "respire" — elle grandit et décroît de façon organique et continue.'
      },
      {
        name: 'MOD',
        role: 'Modulation interne de la reverb',
        tipBeginner: 'Monte légèrement pour éviter les "metal artifacts" (sons métalliques parasites) dans les longues reverbs.',
        tipIntermediate: 'Modulation forte = chorus et shimmer intégrés dans la reverb. Sons qui évoluent et changent pendant leur sustain.',
        tipPro: 'Modulation à fond avec DECAY infini = la reverb devient une source sonore autonome qui évolue harmoniquement. Plus besoin de jouer de nouvelles notes — l\'espace génère la musique.'
      },
      {
        name: 'MIX',
        role: 'Balance original et reverb',
        tipBeginner: 'En insert : 20-35%. En send : 100% et contrôle depuis le niveau de départ.',
        tipIntermediate: 'Mix à 100% pour un effet "reverb seule" sans son direct. Parfait pour créer des ambiances et des textures sans mélodie définie.',
        tipPro: 'Automatise MIX : 0% pour les sections rythmiques, 60-80% pour les interludes. Le contraste entre les deux états crée une dynamique narrative puissante.'
      }
    ]),
    starterPreset: JSON.stringify({
      description: 'Texture ambient infinie',
      values: [
        { param: 'SIZE', value: '75%' },
        { param: 'DECAY', value: '90%' },
        { param: 'GRAVITY', value: '+20%' },
        { param: 'MOD', value: '35%' },
        { param: 'MIX', value: '40% en insert, 100% en send' }
      ]
    }),
    proTechnique: `Le "Blackhole Drone Generator" : joue une seule note longue. MIX à 60%, DECAY à 100%, SIZE à 80%. Coupe la note source après 2 secondes. La reverb continue à résonner quasi indéfiniment, évoluant harmoniquement grâce à la modulation. Tu viens de créer un drone ambiant à partir d'une seule note.`,
    commonMistakes: `L'utiliser comme une reverb normale. Blackhole n'est pas fait pour simuler des salles réelles. Pour une salle de concert, prends Valhalla Room. Blackhole excelle dans les espaces "impossibles" — si ta reverb peut exister dans la réalité, tu n'exploites pas Blackhole à son potentiel.`,
    pairsWith: JSON.stringify(['Valhalla Supermassive', 'FabFilter Pro-Q 3', 'Arturia Pigments 4']),
    freeAlternative: 'Valhalla Supermassive (effets spatiaux extrêmes, gratuit)',
    officialImageUrl: '/plugins/blackhole.png',
    authorNote: 'Indispensable pour la composition cinématique et l\'ambient. Rien ne sonne comme Blackhole.',
  },
]

async function main() {
  console.log('Insertion des guides...')

  for (const guide of guides) {
    await prisma.pluginGuide.upsert({
      where: { slug: guide.slug },
      update: guide,
      create: guide,
    })
    console.log(`✓ ${guide.pluginName}`)
  }

  console.log(`\n${guides.length} guides insérés avec succès.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
