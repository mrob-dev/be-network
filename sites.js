// The one list of Berlin Experiences sites. Every site of the network renders its banner from
// this file, so a change here (and a new version tag) is a change everywhere. Same wording and
// order on every site; `id` names the thumbnail in assets/.

export const network = {
  name: 'Berlin Experiences',
  url: 'https://berlinexperiences.com/',
};

export const sites = [
  { id: 'whereisthewall', name: 'Where Is The Wall', url: 'https://whereisthewall.com', blurb: 'Pieces of the Berlin Wall standing around the world' },
  { id: 'berlinwallescapes', name: 'Berlin Wall Escapes', url: 'https://berlinwallescapes.com', blurb: 'Under, over and through the Wall: the escapes' },
  { id: 'victimsofthewall', name: 'Victims of the Wall', url: 'https://victimsofthewall.com', blurb: 'The 140 people who died at the Berlin Wall' },
  { id: 'berlinisclosed', name: 'Berlin Is Closed', url: 'https://berlinisclosed.com', blurb: 'Which Berlin museums and landmarks are shut, and until when' },
  { id: 'berlinfographics', name: 'Berlinfographics', url: 'https://berlinfographics.com', blurb: 'The history of Berlin drawn from the record, in original infographics' },
  { id: 'battleofberlin', name: 'Battle of Berlin 1945', url: 'https://battleofberlin.com', blurb: 'The Battle of Berlin reconstructed day by day, 16 April – 2 May 1945' },
  { id: 'potsdamconference', name: 'Potsdam Conference 1945', url: 'https://potsdamconference.com', blurb: 'A day-by-day record of the Potsdam Conference, 17 July – 2 August 1945' },
  { id: 'democracydestroyed', name: 'Democracy Destroyed', url: 'https://democracydestroyed.com', blurb: 'The first 100 days of Nazi rule, day by day, 30 January – 9 May 1933' },
];
