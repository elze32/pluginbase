import { describe, it, expect } from 'vitest';
import { detectMultiFormatDuplicates, detectFunctionalDuplicates } from '../duplicate-detector';
import { InventoryItem } from '../../stores/inventory-store';

const mockItem = (id: string, nameRaw: string, format: string, category: string | null = null): InventoryItem => ({
  id,
  nameRaw,
  format,
  brand: 'Test Brand',
  displayName: nameRaw.replace('.vst3', '').replace('.component', ''),
  category,
  status: 'UNCLASSIFIED',
  favorite: false,
  customTags: []
});

describe('duplicate-detector', () => {
  describe('detectMultiFormatDuplicates', () => {
    it('should return empty array when no duplicates exist', () => {
      const items = [
        mockItem('1', 'Serum.vst3', 'VST3'),
        mockItem('2', 'FabFilter.vst3', 'VST3')
      ];
      expect(detectMultiFormatDuplicates(items)).toHaveLength(0);
    });

    it('should detect same plugin in multiple formats', () => {
      const items = [
        mockItem('1', 'Serum.vst3', 'VST3'),
        mockItem('2', 'Serum.component', 'AU'),
        mockItem('3', 'Other.vst3', 'VST3')
      ];
      const result = detectMultiFormatDuplicates(items);
      expect(result).toHaveLength(1);
      expect(result[0].items).toHaveLength(2);
      expect(result[0].key).toBe('serum');
    });

    it('should sort groups by size descending', () => {
      const items = [
        mockItem('1', 'Serum.vst3', 'VST3'),
        mockItem('2', 'Serum.component', 'AU'),
        mockItem('3', 'FabFilter.vst3', 'VST3'),
        mockItem('4', 'FabFilter.component', 'AU'),
        mockItem('5', 'FabFilter.clap', 'CLAP')
      ];
      const result = detectMultiFormatDuplicates(items);
      expect(result).toHaveLength(2);
      expect(result[0].items).toHaveLength(3); // FabFilter
      expect(result[1].items).toHaveLength(2); // Serum
    });
  });

  describe('detectFunctionalDuplicates', () => {
    it('should return empty array when no functional duplicates exist', () => {
      const items = [
        mockItem('1', 'Serum.vst3', 'VST3', 'Synth'),
        mockItem('2', 'Pro-Q.vst3', 'VST3', 'EQ')
      ];
      expect(detectFunctionalDuplicates(items)).toHaveLength(0);
    });

    it('should detect plugins in the same category', () => {
      const items = [
        mockItem('1', 'Room.vst3', 'VST3', 'Reverb'),
        mockItem('2', 'Plate.vst3', 'VST3', 'Reverb'),
        mockItem('3', 'Serum.vst3', 'VST3', 'Synth')
      ];
      const result = detectFunctionalDuplicates(items);
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('Reverb');
      expect(result[0].items).toHaveLength(2);
    });

    it('should ignore items without category', () => {
      const items = [
        mockItem('1', 'Unknown1.vst3', 'VST3', null),
        mockItem('2', 'Unknown2.vst3', 'VST3', null)
      ];
      expect(detectFunctionalDuplicates(items)).toHaveLength(0);
    });

    it('should sort functional groups by size descending', () => {
      const items = [
        mockItem('1', 'R1.vst3', 'VST3', 'Reverb'),
        mockItem('2', 'R2.vst3', 'VST3', 'Reverb'),
        mockItem('3', 'S1.vst3', 'VST3', 'Synth'),
        mockItem('4', 'S2.vst3', 'VST3', 'Synth'),
        mockItem('5', 'S3.vst3', 'VST3', 'Synth')
      ];
      const result = detectFunctionalDuplicates(items);
      expect(result).toHaveLength(2);
      expect(result[0].category).toBe('Synth');
      expect(result[0].items).toHaveLength(3);
    });
  });

  it('should handle both types of duplicates simultaneously', () => {
    const items = [
      mockItem('1', 'Serum.vst3', 'VST3', 'Synth'),
      mockItem('2', 'Serum.component', 'AU', 'Synth'),
      mockItem('3', 'Vital.vst3', 'VST3', 'Synth')
    ];
    
    const multi = detectMultiFormatDuplicates(items);
    const functional = detectFunctionalDuplicates(items);
    
    expect(multi).toHaveLength(1); // Serum (VST3 + AU)
    expect(functional).toHaveLength(1); // Synths (Serum VST3 + Serum AU + Vital)
    expect(functional[0].items).toHaveLength(3);
  });
});
