/**
 * Screens the device's contact list for names or phone-number labels that
 * suggest a close partner or family member.
 *
 * Why this exists: a "trusted contact" picked quickly during onboarding can
 * end up being exactly the person a survivor needs protection from — an
 * abusive partner is often saved in the phone under an affectionate label
 * like "hubby" or "papi". This check runs entirely on-device against a
 * local keyword list; nothing about a person's contacts is ever read by
 * anything outside this function, transmitted, or stored beyond the
 * screening result itself.
 *
 * This is a keyword nudge, not a judgment — it flags a possible match and
 * lets the person decide. Kept as a plain constant so it's easy to tune
 * without touching the matching logic.
 */
export const RELATIONSHIP_KEYWORDS = [
  'hubby',
  'husband',
  'bae',
  'boo',
  'esposo',
  'marido',
  'novio',
  'papi',
  'mom',
  'dad',
  'mama',
  'papa',
  'mami',
];

export type ScreenableContact = {
  id: string;
  name: string;
  phone: string;
  /** Free-text phone-number labels (e.g. a custom label like "Hubby ❤️"), not just "mobile"/"home". */
  labels: string[];
};

export type ScreeningMatch = {
  contact: ScreenableContact;
  matchedKeyword: string;
};

export function findRelationshipMatches(contacts: ScreenableContact[]): ScreeningMatch[] {
  const matches: ScreeningMatch[] = [];
  for (const contact of contacts) {
    const haystack = `${contact.name} ${contact.labels.join(' ')}`.toLowerCase();
    const keyword = RELATIONSHIP_KEYWORDS.find((word) => haystack.includes(word.toLowerCase()));
    if (keyword) {
      matches.push({ contact, matchedKeyword: keyword });
    }
  }
  return matches;
}
