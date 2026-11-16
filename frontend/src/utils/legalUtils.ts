/**
 * Markerar en uppgift som ska fyllas i innan lansering.
 * fill("e-postadress") -> "[e-postadress]"
 */
export const fill = (label: string): string => `[${label}]`;

/**
 * Alla uppgifter som policyn behöver, på ett ställe.
 * Byt ut fill("...") mot de riktiga värdena, t.ex. contactEmail: "info@regalia.se".
 */
export const legalInfo = {
  companyName: fill("Filmvisarna AB"),
  orgNumber: fill("xxxxxx-xxxx"),
  address: fill("adress"),
  websiteUrl: fill("webbadress"),
  contactEmail: fill("e-postadress"),
  updatedDate: fill("datum"),

  guestRetention: fill("t.ex. 30 dagar efter visningen"),
  accountDeletionTime: fill("t.ex. inom 30 dagar"),
  logRetention: fill("t.ex. 30 dagar"),
  ageCheckDescription: fill("beskriv hur ni kontrollerar ålder"),

  hosting: fill("t.ex. Netlify"),
  database: fill("leverantör"),
  emailService: fill("leverantör"),
  paymentProvider: fill("leverantör, om ni har betalning"),
} as const;