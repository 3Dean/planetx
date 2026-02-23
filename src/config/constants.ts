export const NARRATIVE_SCHEDULE_MS = [27000, 53000, 79000, 104000, 130000, 155000, 181000, 207000];
export const NARRATIVE_HOLD_MS = 14000;
export const NARRATIVE_FADE_MS = 3000;

export const NARRATIVE_LINES = [
  'For the survivors, the Palipatonia became their new home - a vast ringed space station that self-replicates by harvesting metals from asteroids and small moons, expanding outward with each new cycle to form habitats, schools, and entire cities in orbit.',
  'Long ago, in a distant corner of the universe, life on planet Arthane collapsed beneath its own dying atmosphere. Dust storms scoured the surface, and the star\'s light dimmed behind clouds of debris. The once-thriving civilizations faced extinction.',
  'Divided by faith and reason, the people disagreed on how to endure. Some believed the catastrophe was divine judgment - a trial of faith that promised salvation through devotion.',
  'Others turned to forbidden knowledge, ancient magic outlawed millennia before. In secret they preserved fragments of lost rituals and maps to hidden relics.',
  'When those relics were last used, they tore a rift between dimensions, unleashing a consuming force that drained the planet\'s life energy before the portal was sealed.',
  'Generations later, desperate separatists tried again to restore life, but greed corrupted them. They plundered worlds for profit, were captured, and their relics destroyed.',
  'At last, Arthane died - no air, no food, no creatures. The survivors built a colossal station to flee their world and seek a new one among the stars.',
  'And so, the Palipatonia drifts through space - the final echo of a civilization that once reached too far into the dark.'
];

export const AUDIO_STATIONS = [
  { name: 'Deep Space One', url: 'https://ice6.somafm.com/deepspaceone-128-mp3' },
  { name: 'Space Station Soma', url: 'https://ice6.somafm.com/spacestation-128-mp3' }
];

export const MODEL_PATHS = {
  trench: '/assets/trench.glb',
  starfield: '/assets/starfield.gltf',
  planet: '/assets/planetx2.glb',
  title: '/assets/titlex.gltf'
} as const;
