import { describe, expect, it } from 'vitest';
import {
  COMPREHENSIVE_MEDICINES,
  MEDICINE_CATEGORIES,
  searchMedicines,
} from '../data';
import {
  calculateDistanceKm,
  DISTRICT_LIST,
  NEARBY_PHARMACIES,
} from '../pharmacies';

describe('Medicine Information & Directory', () => {
  it('should have a comprehensive list of essential medicines', () => {
    expect(COMPREHENSIVE_MEDICINES.length).toBeGreaterThanOrEqual(14);
    COMPREHENSIVE_MEDICINES.forEach((med) => {
      expect(med.id).toBeTruthy();
      expect(med.genericName).toBeTruthy();
      expect(med.hindiName).toBeTruthy();
      expect(med.brandNames.length).toBeGreaterThan(0);
      expect(med.treatingConditions.length).toBeGreaterThan(0);
      expect(med.treatingConditionsHi.length).toBeGreaterThan(0);
      expect(med.standardDosage).toBeTruthy();
      expect(med.dosageHi).toBeTruthy();
      expect(med.janAushadhiPrice).toBeTruthy();
      expect(med.marketPrice).toBeTruthy();
      expect(['OTC', 'Rx']).toContain(med.prescriptionType);
    });
  });

  it('should find medicine by fever / bukhar search', () => {
    const results = searchMedicines('bukhar');
    expect(results.length).toBeGreaterThan(0);
    const hasParacetamol = results.some((m) => m.id === 'paracetamol');
    expect(hasParacetamol).toBe(true);
  });

  it('should find medicine by sugar / diabetes search', () => {
    const results = searchMedicines('sugar');
    expect(results.length).toBeGreaterThan(0);
    const hasMetformin = results.some((m) => m.id === 'metformin');
    expect(hasMetformin).toBe(true);
  });

  it('should find medicine by blood pressure / bp search', () => {
    const results = searchMedicines('bp');
    expect(results.length).toBeGreaterThan(0);
    const hasBpMed = results.some((m) => m.id === 'amlodipine' || m.id === 'telmisartan');
    expect(hasBpMed).toBe(true);
  });

  it('should find medicine by acidity / gas search', () => {
    const results = searchMedicines('gas');
    expect(results.length).toBeGreaterThan(0);
    const hasPantoprazole = results.some((m) => m.id === 'pantoprazole');
    expect(hasPantoprazole).toBe(true);
  });

  it('should find medicine by brand name (e.g. Dolo or Pan 40)', () => {
    const doloResults = searchMedicines('Dolo');
    expect(doloResults.some((m) => m.id === 'paracetamol')).toBe(true);

    const panResults = searchMedicines('Pan 40');
    expect(panResults.some((m) => m.id === 'pantoprazole')).toBe(true);
  });

  it('should filter medicines by category', () => {
    const feverMeds = searchMedicines('', 'Fever & Pain');
    expect(feverMeds.length).toBeGreaterThan(0);
    feverMeds.forEach((m) => expect(m.category).toBe('Fever & Pain'));
  });
});

describe('Pharmacy & Medical Store Locator', () => {
  it('should provide verified Jan Aushadhi and 24x7 chemist stores', () => {
    expect(NEARBY_PHARMACIES.length).toBeGreaterThanOrEqual(10);
    NEARBY_PHARMACIES.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.nameHi).toBeTruthy();
      expect(p.phone).toBeTruthy();
      expect(p.lat).toBeGreaterThan(20);
      expect(p.lng).toBeGreaterThan(70);
      expect(p.services.length).toBeGreaterThan(0);
    });
  });

  it('should accurately calculate distance using Haversine formula', () => {
    // Distance between Gorakhpur (26.7588, 83.3732) and Lucknow (26.8467, 80.9462) is ~242-245 km
    const dist = calculateDistanceKm(26.7588, 83.3732, 26.8467, 80.9462);
    expect(dist).toBeGreaterThan(230);
    expect(dist).toBeLessThan(260);

    // Distance from point to itself is 0
    expect(calculateDistanceKm(26.7588, 83.3732, 26.7588, 83.3732)).toBe(0);
  });
});

