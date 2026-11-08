-- ==============================================================================
-- CarbonReady Extension Features Migration (V3 Master Roadmap)
-- Suppliers, Benchmarks, Verification Requests, Digital Product Passports,
-- Group-Buying Pools & Export Paperwork Records
-- ==============================================================================

-- 5. Upstream Suppliers & Scope 3 Precursors
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
  supplier_name TEXT NOT NULL,
  location TEXT NOT NULL,
  material_category TEXT NOT NULL, -- 'recycled_scrap' | 'sponge_iron_dri' | 'ferro_alloys' | 'petroleum_coke'
  material_name TEXT NOT NULL,
  quarterly_supply_mt NUMERIC NOT NULL DEFAULT 0,
  reported_intensity_tco2e_per_mt NUMERIC,
  verification_status TEXT NOT NULL DEFAULT 'missing_documentation',
  certificate_ref TEXT,
  has_cbam_dossier BOOLEAN NOT NULL DEFAULT false,
  is_demo_entry BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- 6. Peer Benchmarks & Consent-Based Leaderboards
CREATE TABLE IF NOT EXISTS public.peer_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_alias TEXT UNIQUE NOT NULL,
  cluster_name TEXT NOT NULL,
  state TEXT NOT NULL,
  route TEXT NOT NULL DEFAULT 'EAF (Secondary)',
  scrap_ratio_pct NUMERIC NOT NULL,
  carbon_intensity_tco2e_per_mt NUMERIC NOT NULL,
  is_consent_enabled BOOLEAN NOT NULL DEFAULT true,
  is_demo_entry BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.peer_benchmarks ENABLE ROW LEVEL SECURITY;

-- 7. Accredited Auditor Verification Requests
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
  auditor_name TEXT NOT NULL,
  auditor_accreditation_number TEXT NOT NULL,
  reporting_period TEXT NOT NULL,
  dossier_reference TEXT NOT NULL,
  sha256_audit_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Under Review',
  request_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- 8. Digital Product Passports (ESPR / CIRPASS)
CREATE TABLE IF NOT EXISTS public.digital_product_passports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
  passport_urn TEXT UNIQUE NOT NULL,
  product_name TEXT NOT NULL,
  cn_code TEXT NOT NULL DEFAULT '7207 11 00',
  batch_ref TEXT NOT NULL,
  steel_grade TEXT NOT NULL,
  dimensions TEXT NOT NULL,
  recycled_content_pct NUMERIC NOT NULL DEFAULT 91.2,
  specific_intensity_tco2e_per_mt NUMERIC NOT NULL DEFAULT 1.42,
  sha256_seal TEXT NOT NULL,
  verification_badge_tier TEXT NOT NULL DEFAULT 'declared', -- 'draft' | 'declared' | 'verified'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.digital_product_passports ENABLE ROW LEVEL SECURITY;

-- 9. Group-Buying Campaigns & Interest Ledger
CREATE TABLE IF NOT EXISTS public.group_buying_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'solar_ppa' | 'waste_heat_recovery' | 'scrap_pooling'
  cluster_name TEXT NOT NULL,
  target_capacity TEXT NOT NULL,
  current_committed_capacity TEXT NOT NULL,
  progress_pct NUMERIC NOT NULL DEFAULT 0,
  participating_mills_count INTEGER NOT NULL DEFAULT 1,
  volume_discount_pct NUMERIC NOT NULL DEFAULT 0,
  closing_deadline DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_buying_campaigns ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.group_buying_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.group_buying_campaigns(id) ON DELETE CASCADE,
  facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
  committed_volume TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_buying_participants ENABLE ROW LEVEL SECURITY;

-- 10. Auto-Fill Export Paperwork Records
CREATE TABLE IF NOT EXISTS public.export_paperwork_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  bill_of_lading TEXT NOT NULL,
  consignee_name TEXT NOT NULL,
  destination_port TEXT NOT NULL,
  net_mass_mt NUMERIC NOT NULL,
  specific_intensity_tco2e_per_mt NUMERIC NOT NULL,
  total_emissions_tco2e NUMERIC NOT NULL,
  sha256_audit_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.export_paperwork_records ENABLE ROW LEVEL SECURITY;

-- Demo Mode Read-Access Policies
CREATE POLICY "Allow public read access for suppliers in demo mode"
  ON public.suppliers FOR SELECT USING (true);

CREATE POLICY "Allow public read access for peer benchmarks"
  ON public.peer_benchmarks FOR SELECT USING (true);

CREATE POLICY "Allow public read access for verification requests"
  ON public.verification_requests FOR SELECT USING (true);

CREATE POLICY "Allow public read access for product passports"
  ON public.digital_product_passports FOR SELECT USING (true);

CREATE POLICY "Allow public read access for group buying"
  ON public.group_buying_campaigns FOR SELECT USING (true);

