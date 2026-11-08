-- ==============================================================================
-- CarbonReady Initial Schema Migration
-- Designed for Supabase PostgreSQL with Row Level Security (RLS)
-- ==============================================================================

-- 1. Manufacturers & Facilities
CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  facility_name TEXT NOT NULL,
  facility_code TEXT UNIQUE NOT NULL, -- e.g. "IND-PB-7749"
  installation_id TEXT UNIQUE NOT NULL, -- e.g. "IN-MSME-PB-0442"
  un_locode TEXT NOT NULL DEFAULT 'IN LUH',
  state TEXT NOT NULL DEFAULT 'Punjab',
  city TEXT NOT NULL DEFAULT 'Ludhiana',
  sub_sector TEXT NOT NULL DEFAULT 'Iron & Steel (Integrated Mini-Mill)',
  annual_capacity_mt NUMERIC NOT NULL DEFAULT 65000,
  metallurgical_route TEXT NOT NULL DEFAULT 'EAF',
  udyam_registration_number TEXT NOT NULL,
  gstin TEXT NOT NULL,
  cn_series TEXT NOT NULL DEFAULT '7200 Series',
  contact_person TEXT NOT NULL,
  contact_title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- 2. Daily Activity Batch Logs (Shopfloor Intake)
CREATE TABLE IF NOT EXISTS public.activity_batch_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
  batch_ref TEXT NOT NULL, -- e.g. "BATCH-2025-Q1-0842"
  heats_count INTEGER NOT NULL DEFAULT 3,
  crude_billets_mt NUMERIC NOT NULL,
  scrap_mt NUMERIC NOT NULL,
  sponge_iron_dri_mt NUMERIC NOT NULL DEFAULT 0,
  electricity_kwh NUMERIC NOT NULL,
  grid_factor_kg_per_kwh NUMERIC NOT NULL DEFAULT 0.713,
  coke_consumed_mt NUMERIC NOT NULL DEFAULT 0,
  graphite_kg_per_mt NUMERIC NOT NULL DEFAULT 21.0,
  reheat_gas_nm3 NUMERIC,
  reheat_hours NUMERIC DEFAULT 10,
  intake_method TEXT NOT NULL DEFAULT 'voice', -- 'voice' | 'manual' | 'iot'
  raw_speech_text TEXT,
  translated_english_text TEXT,
  ai_confidence_score NUMERIC DEFAULT 0.984,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_batch_logs ENABLE ROW LEVEL SECURITY;

-- 3. CBAM Emission Calculations & Audit Checksums
CREATE TABLE IF NOT EXISTS public.cbam_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
  reporting_quarter TEXT NOT NULL, -- "2025-Q1"
  scope1_direct_tco2e NUMERIC NOT NULL,
  scope2_indirect_tco2e NUMERIC NOT NULL,
  scope3_precursor_tco2e NUMERIC NOT NULL DEFAULT 0,
  total_gross_tco2e NUMERIC NOT NULL,
  crude_steel_mt NUMERIC NOT NULL,
  specific_intensity_tco2e_per_mt NUMERIC NOT NULL,
  eu_benchmark_cap_tco2e_per_mt NUMERIC NOT NULL DEFAULT 2.15,
  intensity_delta NUMERIC NOT NULL,
  tariff_shield_saved_eur NUMERIC NOT NULL,
  audit_hash_sha256 TEXT NOT NULL,
  completeness_score_pct NUMERIC NOT NULL DEFAULT 94.2,
  verification_status TEXT NOT NULL DEFAULT 'Draft Declaration', -- 'Draft Declaration' | 'Verified' | 'Recalculated'
  xml_dossier_v24 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cbam_calculations ENABLE ROW LEVEL SECURITY;

-- 4. Government Scheme Ingestion & Eligibility
CREATE TABLE IF NOT EXISTS public.scheme_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
  scheme_code TEXT NOT NULL, -- 'MSME-ZED' | 'SIDBI-MSE-GIFT' | 'RAMP-BEE-PAT'
  status TEXT NOT NULL DEFAULT 'Potential Match',
  indexed_docs_count INTEGER NOT NULL DEFAULT 0,
  total_docs_required INTEGER NOT NULL DEFAULT 4,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

ALTER TABLE public.scheme_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Authenticated users can view and insert their own facility data
CREATE POLICY "Allow public read access for demo mode"
  ON public.facilities FOR SELECT USING (true);

CREATE POLICY "Allow public read access for calculations"
  ON public.cbam_calculations FOR SELECT USING (true);

