export interface SampleVoiceScript {
  id: string;
  language: "hi" | "mr" | "en";
  languageLabel: string;
  title: string;
  spokenText: string;
  translatedEnglish: string;
  expectedExtraction: {
    heatsCount: number;
    crudeBilletsMt: number;
    scrapMt: number;
    spongeIronDriMt: number;
    electricityKwh: number;
    cokeMt: number;
    reheatNaturalGasNm3?: number;
  };
}

export const SAMPLE_VOICE_SCRIPTS: SampleVoiceScript[] = [
  {
    id: "sample-hi-01",
    language: "hi",
    languageLabel: "हिंदी (Hindi)",
    title: "EAF Meltshop Shift Log (Ludhiana Works)",
    spokenText:
      "आज हमने EAF फर्नेस में 3 heats चलाईं। 145 टन MS स्क्रैप डाला और 12 टन स्पंज आयरन यूज़ किया। बिजली का सब-मीटर 84,200 यूनिट्स दिखा रहा है और 3.2 टन कोक कंज्यूम हुआ। रीहीटिंग फर्नेस में 420 क्यूबिक मीटर गैस गई।",
    translatedEnglish:
      "Today we ran 3 heats in the EAF furnace. Charged 145 MT of MS scrap and used 12 MT of sponge iron. The electricity sub-meter reads 84,200 units and 3.2 tonnes of coke was consumed. The reheating furnace used 420 cubic meters of gas.",
    expectedExtraction: {
      heatsCount: 3,
      crudeBilletsMt: 142.0,
      scrapMt: 145.0,
      spongeIronDriMt: 12.0,
      electricityKwh: 84200,
      cokeMt: 3.20,
      reheatNaturalGasNm3: 420.0,
    },
  },
  {
    id: "sample-mr-01",
    language: "mr",
    languageLabel: "मराठी (Marathi)",
    title: "इन्डक्शन फर्नेस बॅच नोंद (पुणे / जालना क्लस्टर)",
    spokenText:
      "आज पहिल्या शिफ्टमध्ये 2 हीट्स पूर्ण झाल्या. एकूण 95 टन स्क्रॅप आणि 10 टन स्पंज आयर्न वापरले. सब-मीटरवर 56,000 युनिट वीज खर्च झाली आणि 2.1 टन कोक लागला. एकूण 92 टन बिलेट्स तयार झाले.",
    translatedEnglish:
      "Today in the first shift, 2 heats were completed. A total of 95 MT scrap and 10 MT sponge iron was used. 56,000 units of electricity were consumed on the sub-meter and 2.1 MT coke was used. 92 MT billets produced.",
    expectedExtraction: {
      heatsCount: 2,
      crudeBilletsMt: 92.0,
      scrapMt: 95.0,
      spongeIronDriMt: 10.0,
      electricityKwh: 56000,
      cokeMt: 2.10,
      reheatNaturalGasNm3: 310.0,
    },
  },
  {
    id: "sample-en-01",
    language: "en",
    languageLabel: "English",
    title: "Standard Shift Supervisor Report",
    spokenText:
      "Shopfloor update for meltshop line two. Three full heats completed today producing 142 metric tons of crude billets. We charged 145 tons of recycled scrap with 12 tons DRI sponge. Power consumption logged at 84,200 kilowatt hours. Injected 3.2 tons metallurgical coke and billet reheat furnace consumed 420 normal cubic meters natural gas.",
    translatedEnglish:
      "Shopfloor update for meltshop line two. Three full heats completed today producing 142 metric tons of crude billets. We charged 145 tons of recycled scrap with 12 tons DRI sponge. Power consumption logged at 84,200 kilowatt hours. Injected 3.2 tons metallurgical coke and billet reheat furnace consumed 420 normal cubic meters natural gas.",
    expectedExtraction: {
      heatsCount: 3,
      crudeBilletsMt: 142.0,
      scrapMt: 145.0,
      spongeIronDriMt: 12.0,
      electricityKwh: 84200,
      cokeMt: 3.20,
      reheatNaturalGasNm3: 420.0,
    },
  },
];

