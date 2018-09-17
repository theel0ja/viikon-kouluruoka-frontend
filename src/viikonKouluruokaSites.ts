interface IViikonKouluruokaSites {
  name: string;    // Such as "Tampere"
  id: string;      // Such as "tampere"
  url: string;     // Such as "https://tampere.kouluruoka.eliasojala.me/"
  api_url: string; // Such as "https://turku.kouluruoka-api.theel0ja.info"
}

const viikonKouluruokaSites: IViikonKouluruokaSites[] = [
  {
    name: "Turku",
    id: "turku",
    url: "https://turku.kouluruoka.eliasojala.me/",
    api_url: "https://turku.kouluruoka-api.theel0ja.info",
  },
  {
    name: "Tampere",
    id: "tampere",
    url: "https://tampere.kouluruoka.eliasojala.me/",
    api_url: "https://tampere.kouluruoka-api.theel0ja.info",
  },
];

export default viikonKouluruokaSites;
