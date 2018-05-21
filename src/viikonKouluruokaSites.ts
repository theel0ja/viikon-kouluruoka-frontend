interface IViikonKouluruokaSites {
  name: string; // Such as "Tampere"
  url: string;  // Such as "https://tampere.kouluruoka.eliasojala.me/"
}

const viikonKouluruokaSites: IViikonKouluruokaSites[] = [
  {
    name: "Turku",
    url: "https://turku.kouluruoka.eliasojala.me/",
  },
  {
    name: "Tampere",
    url: "https://tampere.kouluruoka.eliasojala.me/",
  },
];

export default viikonKouluruokaSites;
