// Wikidata ID Mappings for Entity-Based SEO (The Prestij Protocol)

export const istanbulEntities = {
  districts: {
    besiktas: "Q170566",
    sisli: "Q213606",
    kadikoy: "Q208154",
    atasehir: "Q753882",
    bakirkoy: "Q752528",
    beyoglu: "Q217411",
    uskudar: "Q206584",
    sariyer: "Q857107",
  },
  landmarks: {
    "Zorlu Center": "Q6066268",
    "Galataport": "Q105634621",
    "Istanbul Airport": "Q3661908",
    "Sabiha Gökçen": "Q324082",
    "Maçka Parkı": "Q6098591",
    "Belgrad Ormanı": "Q6098734",
  }
};

export const getDistrictEntityUrl = (slug: string) => {
  const qid = istanbulEntities.districts[slug as keyof typeof istanbulEntities.districts];
  return qid ? `https://www.wikidata.org/wiki/${qid}` : `https://en.wikipedia.org/wiki/${slug}`;
};

export const getLandmarkEntityUrl = (name: string) => {
  const qid = istanbulEntities.landmarks[name as keyof typeof istanbulEntities.landmarks];
  return qid ? `https://www.wikidata.org/wiki/${qid}` : null;
};
