/**
 * Industrial Metrology & Unit Conversion Helpers
 * Adheres strictly to international engineering constants & CBAM reporting standards.
 */

// Net Calorific Value of Pipeline Natural Gas in Northern India (MoPNG standard)
// 1 Normal Cubic Meter (Nm3) = 0.0385 Gigajoules (GJ) = 0.0000385 Terajoules (TJ)
export const NCV_NATURAL_GAS_TJ_PER_NM3 = 0.0000385;

/**
 * Converts natural gas volume in Nm³ to Terajoules (TJ)
 */
export function naturalGasNm3ToTj(nm3: number): number {
  return nm3 * NCV_NATURAL_GAS_TJ_PER_NM3;
}

/**
 * Converts kWh of electricity to MWh
 */
export function kwhToMwh(kwh: number): number {
  return kwh / 1000;
}

/**
 * Formats a metric value with fixed decimal precision and thousand separators
 */
export function formatMetric(val: number, decimals: number = 2): string {
  return val.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats EUR financial amounts with currency symbol and standard formatting
 */
export function formatEur(amount: number): string {
  return `€${Math.round(amount).toLocaleString("en-US")}`;
}

/**
 * Formats INR Lakhs / Crores
 */
export function formatInrLakhs(lakhs: number): string {
  return `₹${lakhs.toFixed(1)} Lakhs`;
}

