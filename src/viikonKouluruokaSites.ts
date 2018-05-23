interface IViikonKouluruokaSites {
  name: string; // Such as "Tampere"
  id: string;   // Such as "tampere"
  url: string;  // Such as "https://tampere.kouluruoka.eliasojala.me/"
}

const viikonKouluruokaSites: IViikonKouluruokaSites[] = [
  {
    name: "Turku",
    id: "turku",
    url: "https://turku.kouluruoka.eliasojala.me/",
  },
  {
    name: "Tampere",
    id: "tampere",
    url: "https://tampere.kouluruoka.eliasojala.me/",
  },
];

export default viikonKouluruokaSites;
