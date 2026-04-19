import { describe, it, expect, test } from 'vitest';
import { normalizePluginPattern } from '../plugin-normalizer';

describe('normalizePluginPattern', () => {
  it('should normalize Serum x64', () => {
    expect(normalizePluginPattern("Serum_x64.vst3")).toBe("serum");
  });

  it('should remove various extensions', () => {
    expect(normalizePluginPattern("Plugin.vst3")).toBe("plugin");
    expect(normalizePluginPattern("Plugin.component")).toBe("plugin");
    expect(normalizePluginPattern("Plugin.clap")).toBe("plugin");
    expect(normalizePluginPattern("Plugin.aaxplugin")).toBe("plugin");
    expect(normalizePluginPattern("Plugin.dll")).toBe("plugin");
  });

  it('should handle underscores and dots', () => {
    expect(normalizePluginPattern("My.Great-Plugin_v1.0")).toBe("my_great_plugin");
  });

  it('should remove technical suffixes', () => {
    expect(normalizePluginPattern("PluginX64")).toBe("plugin");
    expect(normalizePluginPattern("Plugin_64bit")).toBe("plugin");
    expect(normalizePluginPattern("Plugin VST3")).toBe("plugin");
    expect(normalizePluginPattern("Plugin AU")).toBe("plugin");
  });

  it('should handle multiple underscores', () => {
    expect(normalizePluginPattern("Plugin___Test")).toBe("plugin_test");
  });

  it('should handle leading/trailing separators', () => {
    expect(normalizePluginPattern("_Plugin_")).toBe("plugin");
  });
});

describe('normalizePluginPattern — real world cases', () => {
  const cases: Array<[string, string]> = [
    // Bug 1 - chiffres intégrés au nom (doivent être préservés)
    ['FabFilter Pro-C 2.vst3',        'fabfilter_pro_c_2'],
    ['FabFilter Pro-L 2.vst3',        'fabfilter_pro_l_2'],
    ['FabFilter Pro-Q 4.vst3',        'fabfilter_pro_q_4'],
    ['FabFilter Pro-R 2.vst3',        'fabfilter_pro_r_2'],
    ['FabFilter Saturn 2.vst3',       'fabfilter_saturn_2'],
    ['FabFilter Timeless 3.vst3',     'fabfilter_timeless_3'],
    ['FabFilter Twin 3.vst3',         'fabfilter_twin_3'],
    ['FabFilter Volcano 3.vst3',      'fabfilter_volcano_3'],
    ['Kontakt 7.vst3',                'kontakt_7'],
    ['Kontakt 8.vst3',                'kontakt_8'],
    ['Battery 4.vst3',                'battery_4'],
    ['Reaktor 6.vst3',                'reaktor_6'],
    ['FM8.vst3',                      'fm8'],
    ['Guitar Rig 7.vst3',             'guitar_rig_7'],
    ['Ozone 12 Equalizer.vst3',       'ozone_12_equalizer'],
    ['Ozone Imager 2.vst3',           'ozone_imager_2'],
    ['Youlean Loudness Meter 2.vst3', 'youlean_loudness_meter_2'],
    ['Auto-Tune.vst3',                'auto_tune'],
    ['Auto-Tune Artist.vst3',         'auto_tune_artist'],

    // Bug 2 - camelCase (marque collée au produit)
    ['ValhallaVintageVerb.vst3',      'valhalla_vintage_verb'],
    ['ValhallaSupermassive.vst3',     'valhalla_supermassive'],
    ['ValhallaFreqEcho.vst3',         'valhalla_freq_echo'],
    ['ValhallaFutureVerb.vst3',       'valhalla_future_verb'],

    // Versions isolées (doivent être retirées)
    ['Serum_x64.vst3',                'serum'],
    ['Plugin v2.1.0.vst3',            'plugin'],
    ['Plugin_v3.vst3',                'plugin'],
    ['Plugin 2.1.0.vst3',             'plugin'],

    // Combinaisons
    ['ANA2 x64.vst3',                 'ana2'],
    ['bx_digital V3.vst3',            'bx_digital'],          // V3 = version isolée
    ['bx_console SSL 4000 E.vst3',    'bx_console_ssl_4000_e'], // 4000 est du nom
  ];

  test.each(cases)('%s → %s', (input, expected) => {
    expect(normalizePluginPattern(input)).toBe(expected);
  });
});

describe('normalizePluginPattern — idempotence', () => {
  const samples = [
    'ValhallaVintageVerb.vst3',
    'FabFilter Pro-C 2.vst3',
    'Kontakt 7.vst3',
  ];
  test.each(samples)('idempotent on %s', (input) => {
    const once = normalizePluginPattern(input);
    const twice = normalizePluginPattern(once);
    expect(twice).toBe(once);
  });
});
