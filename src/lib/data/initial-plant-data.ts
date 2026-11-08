import { FacilityProfile, ActivityBatchLog } from "@/types/plant";

export const INITIAL_FACILITY_PROFILE: FacilityProfile = {
  companyName: "Apex Steels & Alloys Ltd",
  facilityName: "Ludhiana Meltshop #3",
  facilityId: "IND-PB-7749",
  installationId: "IN-MSME-PB-0442",
  unLocode: "IN LUH",
  state: "Punjab",
  city: "Ludhiana",
  subSector: "Iron & Steel (Integrated Mini-Mill)",
  annualCapacityMt: 65000,
  route: "EAF",
  udyamNumber: "UDYAM-PB-12-004921",
  gstin: "03AABCA1234D1Z5",
  cnSeries: "7200 Series",
  targetPorts: ["HAMBURG", "GENOVA", "ANTWERP"],
  contactPerson: "Rajesh Sharma",
  contactTitle: "Managing Director",
};

export const INITIAL_BATCH_LOG: ActivityBatchLog = {
  id: "BATCH-2025-Q1-0842",
  batchTimestamp: "2025-03-28T09:30:00Z",
  heatsCount: 3,
  crudeBilletsMt: 142.0,
  scrapMt: 145.0,
  spongeIronDriMt: 12.0,
  electricityKwh: 84200,
  gridProvider: "Punjab State Power Corporation Ltd (PSPCL)",
  gridFactorKgPerKwh: 0.713,
  cokeMt: 3.20,
  graphiteElectrodeKgPerMt: 21.0,
  reheatNaturalGasNm3: 420.0,
  reheatHours: 10,
  inputSource: "voice",
  rawSpokenText: "आज हमने EAF फर्नेस में 3 heats चलाईं। 145 टन MS स्क्रैप डाला और 12 टन स्पंज आयरन यूज़ किया। बिजली का सब-मीटर 84,200 यूनिट्स दिखा रहा है और 3.2 टन कोक कंज्यूम हुआ।",
  translatedText: "Today we ran 3 heats in EAF furnace. Charged 145 MT MS scrap and used 12 MT sponge iron. Sub-meter reading is 84,200 units electricity, and 3.2 tonnes coke consumed.",
  confidenceScore: 0.984,
};

export const FACILITY_PROFILE_STORAGE_KEY = "carbonready_facility_profile";
export const ACTIVE_BATCH_STORAGE_KEY = "carbonready_active_batch";
export const SAVED_REPORTS_STORAGE_KEY = "carbonready_saved_reports";

export function getStoredFacilityProfile(): FacilityProfile {
  if (typeof window === "undefined") return INITIAL_FACILITY_PROFILE;
  try {
    const raw = localStorage.getItem(FACILITY_PROFILE_STORAGE_KEY);
    if (!raw) return INITIAL_FACILITY_PROFILE;
    return { ...INITIAL_FACILITY_PROFILE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_FACILITY_PROFILE;
  }
}

export function saveStoredFacilityProfile(profile: Partial<FacilityProfile>): FacilityProfile {
  if (typeof window === "undefined") return { ...INITIAL_FACILITY_PROFILE, ...profile };
  try {
    const current = getStoredFacilityProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(FACILITY_PROFILE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("carbonready_profile_updated"));
    return updated;
  } catch (err) {
    console.warn("Could not save facility profile:", err);
    return { ...INITIAL_FACILITY_PROFILE, ...profile };
  }
}

export function resetToDemoBaseline(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FACILITY_PROFILE_STORAGE_KEY);
    localStorage.setItem(
      ACTIVE_BATCH_STORAGE_KEY,
      JSON.stringify({
        batchId: INITIAL_BATCH_LOG.id,
        crudeBilletsMt: INITIAL_BATCH_LOG.crudeBilletsMt,
        scrapMt: INITIAL_BATCH_LOG.scrapMt,
        spongeIronDriMt: INITIAL_BATCH_LOG.spongeIronDriMt,
        electricityKwh: INITIAL_BATCH_LOG.electricityKwh,
        cokeMt: INITIAL_BATCH_LOG.cokeMt,
        heatsCount: INITIAL_BATCH_LOG.heatsCount,
        reheatNaturalGasNm3: INITIAL_BATCH_LOG.reheatNaturalGasNm3,
        source: "demo_preset",
        isDemoBatch: true,
        completenessScorePct: 100.0,
        rawSpokenText: INITIAL_BATCH_LOG.rawSpokenText,
        translatedEnglish: INITIAL_BATCH_LOG.translatedText,
        confirmedAt: INITIAL_BATCH_LOG.batchTimestamp,
        confirmedByManufacturer: true,
      })
    );
    window.dispatchEvent(new Event("carbonready_batch_updated"));
    window.dispatchEvent(new Event("carbonready_profile_updated"));
  } catch (err) {
    console.warn("Could not reset demo baseline:", err);
  }
}
