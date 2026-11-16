import { legalInfo as info } from "../utils/legalUtils";
import PolicySection from "../components/PrivacyPolicy/PolicySection";
import PolicyBlock from "../components/PrivacyPolicy/PolicyBlock";
import DataList from "../components/PrivacyPolicy/DataList";
import "../components/PrivacyPolicy/Policy.scss"

export default function PrivacyPolicyPage() {
  return (
    <main className="page-container">
      <article className="privacy-policy">
        <h1 className="privacy-policy__title">Integritetspolicy</h1>
        <p className="privacy-policy__updated">
          <small>Senast uppdaterad: {info.updatedDate}</small>
        </p>

        <PolicySection title="1. Vem ansvarar för dina personuppgifter?">
          <p>
            Regalia ({info.companyName}), organisationsnummer {info.orgNumber},{" "}
            {info.address}, är personuppgiftsansvarig för behandlingen av dina
            personuppgifter på {info.websiteUrl}.
          </p>
          <p>Kontakt i dataskyddsfrågor: {info.contactEmail}</p>
        </PolicySection>

        <PolicySection title="2. Vilka uppgifter samlar vi in och varför?">
          <PolicyBlock title="Du bokar som gäst (endast e-post)">
            <DataList
              items={[
                {
                  label: "Uppgifter",
                  value:
                    "e-postadress, vald film, visning, platser, biljettyp, bokningsnummer och totalpris.",
                },
                {
                  label: "Syfte",
                  value:
                    "att genomföra din bokning och skicka bokningsbekräftelse.",
                },
                {
                  label: "Rättslig grund",
                  value: "fullgörande av avtal (GDPR artikel 6.1 b).",
                },
                {
                  label: "Lagringstid",
                  value: `${info.guestRetention}. Uppgifter som vi är skyldiga att spara enligt bokföringslagen sparas så länge lagen kräver.`,
                },
              ]}
            />
          </PolicyBlock>

          <PolicyBlock title="Du skapar ett medlemskonto">
            <DataList
              items={[
                {
                  label: "Uppgifter",
                  value:
                    "namn, e-postadress, lösenord (lagras hashat), födelsedatum och din bokningshistorik.",
                },
                {
                  label: "Syfte",
                  value:
                    "att du ska kunna logga in, se och avboka dina bokningar och boka snabbare.",
                },
                {
                  label: "Rättslig grund",
                  value: "fullgörande av avtal (artikel 6.1 b).",
                },
                {
                  label: "Lagringstid",
                  value: `så länge du har ett konto. När du avslutar medlemskapet raderas dina kontouppgifter ${info.accountDeletionTime}.`,
                },
              ]}
            />
          </PolicyBlock>

          <PolicyBlock title="Åldersgränser">
            <p>
              Vissa filmer har åldersgräns. {info.ageCheckDescription}. Vi
              sparar inte personnummer eller kopior av legitimation.
            </p>
          </PolicyBlock>

          <PolicyBlock title="Nyhetsbrev och erbjudanden (valfritt)">
            <DataList
              items={[
                { label: "Uppgifter", value: "e-postadress." },
                {
                  label: "Syfte",
                  value: "att skicka information om filmer och erbjudanden.",
                },
                {
                  label: "Rättslig grund",
                  value:
                    "ditt samtycke (artikel 6.1 a). Du kan när som helst ta tillbaka samtycket via länken i varje utskick eller genom att kontakta oss.",
                },
              ]}
            />
          </PolicyBlock>

          <PolicyBlock title="Teknisk information">
            <p>
              Vi kan logga teknisk information som IP-adress och felmeddelanden
              för att driva och skydda tjänsten. Rättslig grund: berättigat
              intresse (artikel 6.1 f). Lagringstid: {info.logRetention}.
            </p>
          </PolicyBlock>
        </PolicySection>

        <PolicySection title="3. Vem får se dina uppgifter?">
          <p>
            Vi delar bara uppgifter med leverantörer som hjälper oss att driva
            tjänsten (personuppgiftsbiträden), och de får bara behandla
            uppgifterna enligt våra instruktioner:
          </p>
          <DataList
            items={[
              { label: "Webbhotell/hosting", value: info.hosting },
              { label: "Databas", value: info.database },
              {
                label: "E-posttjänst för bekräftelser",
                value: info.emailService,
              },
              { label: "Betaltjänst", value: info.paymentProvider },
            ]}
          />
          <p>Vi säljer inte dina personuppgifter.</p>
        </PolicySection>

        <PolicySection title="4. Dina rättigheter">
          <p>Du har rätt att:</p>
          <ul className="privacy-policy__rights-list">
            <li>Få veta vilka uppgifter vi har om dig och få en kopia</li>
            <li>Få felaktiga uppgifter rättade</li>
            <li>
              Få dina uppgifter raderade, om det inte finns ett lagkrav på att
              vi sparar dem
            </li>
            <li>Begränsa eller invända mot vår behandling</li>
            <li>Få ut dina uppgifter i ett maskinläsbart format</li>
            <li>Ta tillbaka ett samtycke du har lämnat</li>
          </ul>
          <p>
            Kontakta oss på {info.contactEmail} så hjälper vi dig. Du har också
            rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY),{" "}
            <a
              className="privacy-policy__link"
              href="https://www.imy.se"
              target="_blank"
              rel="noreferrer"
            >
              www.imy.se
            </a>
            .
          </p>
        </PolicySection>

        <PolicySection title="5. Säkerhet">
          <p>
            Vi skyddar dina uppgifter bland annat med krypterad anslutning
            (HTTPS), hashade lösenord och begränsad åtkomst till databasen.
          </p>
        </PolicySection>

        <PolicySection title="6. Cookies">
          <p>
            Den här webbplatsen använder inga spårningscookies. Om det i
            framtiden läggs till analysverktyg (t.ex. besöksstatistik) kommer
            denna sida att uppdateras och du kommer att informeras.
          </p>
        </PolicySection>

        <PolicySection title="7. Ändringar">
          <p>
            Vi kan uppdatera policyn. Den senaste versionen finns alltid på den
            här sidan, och vid större ändringar informerar vi dig.
          </p>
        </PolicySection>
      </article>
    </main>
  );
}
