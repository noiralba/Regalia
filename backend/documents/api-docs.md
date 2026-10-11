# Regalia API – Documentation

Follow this examples and document all the respones for CRUD!

# Mall
### GET /movies

Get all the movies from database.

**Status:** `200 OK`

```json
//An example of how you can document an endpoint

    {
      "id": "bb058c9e-8e1c-5458-a144-b2c1a34d4940",
      "title": "The Odyssey",
      "productionYear": 2026,
      "ageRating": 11,
      "duration": 180,
      "language": {
        "original": "Engelska",
        "subtitles": "Svenska"
      },
      "posterImage": "https://cdng.europosters.eu/pod_public/1300/321147.jpg",
      "trailerUrl": "https://www.youtube.com/watch?v=Mzw2ttJD2qQ",
      "shortDescription": "Odysseus ger sig ut på en lång och farofylld resa hem efter det trojanska kriget, där han möter gudar, monster och andra prövningar.",
      "longDescription": "Efter det trojanska kriget försöker kung Odysseus återvända hem till Ithaka och sin familj. Resan blir ett episkt äventyr fyllt av faror, mytiska varelser, mäktiga gudar och svåra val. Samtidigt väntar hans hustru Penelope och sonen Telemachos hemma på hans återkomst.",
      "director_id": "bab4795d-c38e-51c4-a013-f931be094a4c"
    }
```

**Status:** `404 Not Found`

```json 
//An example of how to document 404-respons

{
    "error": "Filmen hittades inte"
}
```
---

# Regalia API

Base-URL: `http://localhost:3000`

**Status:** `200 OK`

```json
{
  "message": "Regalia API fungerar"
}
```

### GET /movies

**Status:** `200 OK`

```json
[
  {
    "id": "11c4eb5d-8a47-5c66-9861-fcf3f5375a32",
    "title": "Bortglömda ön",
    "productionYear": 2026,
    "ageRating": 7,
    "duration": 109,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/bortglömda-ön-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=Ri2KipSRQ4E",
    "shortDescription": "Jo och Raissa har varit bästa vänner sedan grundskolan men har nu gått ut High School och ska påbörja sina separata livsresor.",
    "longDescription": "Jo och Raissa har varit bästa vänner sedan grundskolan men har nu gått ut High School och ska påbörja sina separata livsresor. När de firar sin sista kväll tillsammans, råkar Jo och Raissa hitta en mystisk portal som transporterar dem till den fantastiska ön Nakali, full av de magiska och mytologiska väsen som hört berättelser om under uppväxten i sina filippinska familjer. En del av de här varelserna blir vänner, andra blir fiender. I sällskap med den välmenande men olyckliga hunden Raww och ett litet men mäktiga gäng kompisar, måste Jo och Raissa möta Den Fruktande Manananggal, den mest skräckinjagande varelsen på ön. När de upptäcker att priset för att återvända hem är att förlora alla minnena av deras vänskap, måste Jo och Raissa skynda sig att hitta ett sätt att lämna ön innan de helt glömmer bort varandra, för evigt.",
    "director_id": "34cead7e-4ba6-5482-ba3e-68a2006d66ef"
  },
  {
    "id": "21fd09b4-8739-5130-a69c-67590fd343a1",
    "title": "Arkipelag",
    "productionYear": 2026,
    "ageRating": 15,
    "duration": 107,
    "language": {
      "original": "Svenska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/arkipelag-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=ke00C6G7ewg",
    "shortDescription": "Tre pappor följer med sina döttrar på en skolresa till en idyllisk skärgårdsö där lek snabbt övergår i maktkamp.",
    "longDescription": "Tre pappor följer med sina döttrar på en skolresa till en idyllisk skärgårdsö. När de blir strandsatta tillsammans med en stökig högstadieklass väcks gamla tonårstrauman till liv. Snart börjar både ungdomar och vuxna tvingas fundera över gränsen mellan lek, maktkamp, offer och förövare.",
    "director_id": "b272b14e-fe62-5ed0-a8d3-62f8ee295589"
  },
  {
    "id": "3a4697bf-7d1a-53a1-98bf-708a03160659",
    "title": "The Exorcist",
    "productionYear": 1973,
    "ageRating": 15,
    "duration": 123,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/the-exorcist-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=BU2eYAO31Cc",
    "shortDescription": "Vågar du möta natten med en av skräckfilmens mest ikoniska filmer?",
    "longDescription": "När en ung flicka börjar uppvisa allt mer skrämmande beteende söker hennes mamma desperat efter hjälp. En legendarisk skräckklassiker visas vid midnatt på Halloween.",
    "director_id": "f49933d6-433d-4dd7-8c6a-c51856f61eb4"
  },
  {
    "id": "3b67867a-3f00-5705-beb3-9c9c8eea8740",
    "title": "The Rocky Horror Picture Show",
    "productionYear": 1975,
    "ageRating": 15,
    "duration": 105,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/the-rocky-horror-picture-show-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=JWoYy4Ah81s&list=RDJWoYy4Ah81s&start_radio=1",
    "shortDescription": "En galen Halloweenkväll med kultfilmen som aldrig går ur tiden.",
    "longDescription": "När Brad och Janet får problem med bilen söker de skydd i ett mystiskt slott. Där möter de den excentriske Dr. Frank-N-Furter och dras in i en natt de sent kommer att glömma.",
    "director_id": "ad86a093-3309-4795-bcff-f7a24e590f53"
  },
  {
    "id": "3dee0c55-9dc7-529e-9a6c-da46d4f78f02",
    "title": "The Nightmare Before Christmas",
    "productionYear": 1993,
    "ageRating": 7,
    "duration": 77,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/the-nightmare-before-christmas-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=wr6N_hZyBCk",
    "shortDescription": "Följ med Jack Skellington när Halloween möter julens magi.",
    "longDescription": "Jack Skellington, kungen av Halloween Town, har tröttnat på samma gamla Halloweenfirande. När han upptäcker Christmas Town bestämmer han sig för att själv skapa jul – med minst sagt kaotiska konsekvenser.",
    "director_id": "0e8f5c3e-9856-4fa7-b187-ea2babe4b8de"
  },
  {
    "id": "3e9ab7b0-80a9-5af3-bb39-7b4a9027addb",
    "title": "Nelly Rapp - Porten till underjorden",
    "productionYear": 2026,
    "ageRating": 11,
    "duration": 84,
    "language": {
      "original": "Svenska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/nelly-rapp-porten-till-underjorden-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=hA6Ep3Nmx2c",
    "shortDescription": "Nelly måste stoppa en uråldrig vampyr från att öppna porten till underjorden.",
    "longDescription": "När Nelly återförenas med sin mamma får hon veta att en uråldrig vampyr planerar att öppna porten till underjorden. Där väntar en slumrande ondska som hotar att släppas fri. Tillsammans med Valle och London måste Nelly försöka stoppa vampyren innan katastrofen är ett faktum.",
    "director_id": "efc84425-3cd3-50c8-90dd-359fb8219398"
  },
  {
    "id": "4c2133da-b560-5edc-9d8e-c61ea189277a",
    "title": "Verity",
    "productionYear": 2026,
    "ageRating": 15,
    "duration": 117,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/verity-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=xdPMKhjMSFs",
    "shortDescription": "En ung författare upptäcker mörka hemligheter när hon flyttar in hos den berömda författaren Verity Crawford.",
    "longDescription": "Lowen Ashleigh får i uppdrag att slutföra bokserien åt den berömda författaren Verity Crawford efter att en olycka gjort Verity oförmögen att skriva. När Lowen flyttar in hos familjen hittar hon ett manuskript som avslöjar mörka och skrämmande hemligheter. Snart börjar hon tvivla på vad som egentligen är sant.",
    "director_id": "a866b4d3-6591-5ef7-96c4-0bfa7d419932"
  },
  {
    "id": "552a1b46-ed3c-52ce-bfb8-964550cd90c4",
    "title": "Hocus Pocus",
    "productionYear": 1993,
    "ageRating": 7,
    "duration": 96,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/hocus-pocus-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=F4e6YQFrt1s",
    "shortDescription": "En magisk Halloweenvisning för hela familjen med de tre busiga Sanderson-systrarna.",
    "longDescription": "När tre häxor återuppstår på Halloween måste en grupp barn försöka stoppa dem innan de sprider kaos över staden. En färgstark Halloweenklassiker för både barn och vuxna.",
    "director_id": "03d341ee-8d53-4a34-82d0-20ccf8901bc9"
  },
  {
    "id": "7982d999-171a-5e70-9e4c-a1033c462d98",
    "title": "Beetlejuice",
    "productionYear": 1988,
    "ageRating": 11,
    "duration": 92,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/beetlejuice-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=ickbVzajrk0",
    "shortDescription": "En färgstark Halloweenkväll fylld av mörk humor, spöken och Beetlejuice.",
    "longDescription": "Ett nygift par dör i en olycka och upptäcker att deras hus fortfarande är deras hem. När en ny familj flyttar in försöker de få hjälp av den kaotiske och excentriske Beetlejuice.",
    "director_id": "23930651-81b8-40bd-b5d8-cdfa158ecc6d"
  },
  {
    "id": "7c0a34fd-1a2f-505b-8e35-1eed97d98875",
    "title": "Wildwood",
    "productionYear": 2026,
    "ageRating": 11,
    "duration": 110,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/wildwood-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=dtr5JL1zkiM",
    "shortDescription": "En flicka ger sig in i en magisk och farlig skog för att rädda sin lillebror.",
    "longDescription": "Prue McKeel kastas in i ett mystiskt och farligt äventyr när hennes lillebror försvinner in i Wildwood, en förbjuden skog fylld av magiska varelser och hemligheter. Tillsammans med sin vän Curtis måste hon ge sig in i den okända världen för att hitta sin bror och upptäcka vad som egentligen döljer sig bakom skogen.",
    "director_id": "094ddac6-0fe2-5d3e-a512-11853573d562"
  },
  {
    "id": "7d77af8d-37f8-58ae-802a-bc4b92e5cd60",
    "title": "Scream",
    "productionYear": 1996,
    "ageRating": 15,
    "duration": 111,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/scream-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=i3J6ACKQ7K0",
    "shortDescription": "Ghostface är tillbaka – upplev den ikoniska slasherklassikern på stor duk.",
    "longDescription": "En mystisk mördare börjar terrorisera en liten stad och använder skräckfilmernas regler för att välja sina offer. Upplev Wes Cravens moderna skräckklassiker under en exklusiv Halloweenkväll.",
    "director_id": "1932590b-2056-4be9-9ec0-b443fa6d8f61"
  },
  {
    "id": "8c47b045-0053-5ea6-a1e2-a716c32e3f82",
    "title": "Resident Evil",
    "productionYear": 2026,
    "ageRating": 15,
    "duration": 94,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/resident-evil-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=mNd1gb19A-c",
    "shortDescription": "Den medicinske kuriren Bryan dras ovetande in i en intensiv kamp för överlevnad.",
    "longDescription": "Den medicinske kuriren Bryan dras ovetande in i en intensiv kamp för överlevnad i en skoningslös kamp mot klockan. Resident Evil är en actionfylld skräckfilm som tar tittarna med på en spännande resa genom en värld fylld av faror och mysterier.",
    "director_id": "b811763b-bef3-5e8f-b32c-d93f61d94cc4"
  },
  {
    "id": "a2778a3b-8dd0-5d2a-80cf-59bb1457b090",
    "title": "The Hunger Games: Sunrise on the Reaping",
    "productionYear": 2026,
    "ageRating": 15,
    "duration": 150,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/hunger-games-sunrise-on-the-reaping-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=fS35YSjopjE",
    "shortDescription": "Haymitch kastas in i den 50:e Hungerspelen, där han måste kämpa för sitt liv i Panems brutala arena.",
    "longDescription": "Berättelsen utspelar sig 24 år före den första Hunger Games-filmen och börjar på morgonen då den 50:e upplagan av Hungerspelen ska lottas. Haymitch Abernathy väljs ut som deltagare och tvingas in i en brutal kamp där han måste försöka överleva samtidigt som han bildar en oväntad allians med Maysilee Donner.",
    "director_id": "e6149c0d-26d0-5362-9541-1626f5264f6b"
  },
  {
    "id": "a5dbdf5a-254e-54aa-8db2-25e62ee4d8cb",
    "title": "The Shining",
    "productionYear": 1980,
    "ageRating": 15,
    "duration": 138,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/the-shining-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=S014oGZiSdI",
    "shortDescription": "Fira Halloween med Stanley Kubricks ikoniska psykologiska skräckklassiker.",
    "longDescription": "Jack Torrance tar med sin familj till ett isolerat hotell där han ska arbeta som vaktmästare under vintern. När hotellets mörka historia börjar göra sig påmind förändras allt.",
    "director_id": "61d94730-a7b2-4c4d-b164-c4b33325c5c3"
  },
  {
    "id": "b1259117-ed00-5435-baf5-4a87a00bccc7",
    "title": "Avengers: Doomsday",
    "productionYear": 2026,
    "ageRating": 11,
    "duration": 150,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/avengers-doomsday-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=irVNGjRFZGk",
    "shortDescription": "Marvels Avengers återvänder för att möta ett nytt hot som kan förändra hela universum.",
    "longDescription": "Avengers: Doomsday samlar flera av Marvels hjältar när ett nytt och mycket stort hot dyker upp. Filmen blir nästa stora kapitel i Marvel Cinematic Universe och samlar en omfattande ensemble av både nya och välbekanta karaktärer.",
    "director_id": "8fc64bc1-2fdd-59c7-b2b3-05f0b5cf24ac"
  },
  {
    "id": "b316b362-d7c8-5129-8e60-23f098d5c9e4",
    "title": "Halloween",
    "productionYear": 1978,
    "ageRating": 15,
    "duration": 91,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/halloween-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=3JsrH8eUVOo",
    "shortDescription": "Fira Halloween med John Carpenters ikoniska skräckklassiker Halloween.",
    "longDescription": "En mörk Halloweenkväll återvänder Michael Myers till Haddonfield efter flera år på institution. Upplev en av skräckfilmshistoriens mest ikoniska filmer på stor duk i en exklusiv Halloweenvisning.",
    "director_id": "e1bdeadc-090d-48c1-a81b-204e3d90fe94"
  },
  {
    "id": "b4685044-a0e4-5836-9e8b-11102d8e1cd5",
    "title": "The Conjuring",
    "productionYear": 2013,
    "ageRating": 15,
    "duration": 112,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/the-conjuring-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=ejMMn0t58Lc",
    "shortDescription": "En klassisk spökhistoria för dig som vågar stanna kvar när lamporna släcks.",
    "longDescription": "Ed och Lorraine Warren hjälper en familj som flyttat in i ett hus där något mörkt och övernaturligt verkar ha vaknat. Se filmen tillsammans med andra skräckälskare under en sen Halloweenvisning.",
    "director_id": "40a9cff9-4eaf-48b0-a054-4fb136ae1dd6"
  },
  {
    "id": "bb058c9e-8e1c-5458-a144-b2c1a34d4940",
    "title": "The Odyssey",
    "productionYear": 2026,
    "ageRating": 11,
    "duration": 180,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/odyssey-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=Mzw2ttJD2qQ",
    "shortDescription": "Odysseus ger sig ut på en lång och farofylld resa hem efter det trojanska kriget, där han möter gudar, monster och andra prövningar.",
    "longDescription": "Efter det trojanska kriget försöker kung Odysseus återvända hem till Ithaka och sin familj. Resan blir ett episkt äventyr fyllt av faror, mytiska varelser, mäktiga gudar och svåra val. Samtidigt väntar hans hustru Penelope och sonen Telemachos hemma på hans återkomst.",
    "director_id": "bab4795d-c38e-51c4-a013-f931be094a4c"
  },
  {
    "id": "cfacf3cc-ddad-502b-bee8-acb226a67a00",
    "title": "Coraline",
    "productionYear": 2009,
    "ageRating": 11,
    "duration": 100,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/coraline-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=m9bOpeuvNwY",
    "shortDescription": "Coraline upptäcker en annan värld bakom en hemlig dörr – men allt är inte som det verkar.",
    "longDescription": "Coraline upptäcker en hemlig dörr i sitt nya hem som leder till en alternativ värld. Där verkar allt vara bättre än hemma, men snart upptäcker hon att den perfekta världen döljer en mörk hemlighet.",
    "director_id": "0e8f5c3e-9856-4fa7-b187-ea2babe4b8de"
  },
  {
    "id": "ef33e1fe-a3d6-5bc3-807a-44f2ebf55d70",
    "title": "Fjord",
    "productionYear": 2026,
    "ageRating": 11,
    "duration": 146,
    "language": {
      "original": "Norska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/fjord-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=0gdRZZVoinM",
    "shortDescription": "En familj flyttar till Norge för att börja om, men en konflikt med en grannfamilj förändrar allt.",
    "longDescription": "Det rumänsk-norska paret Mihai och Lisbeth flyttar till Norge med sina barn efter att Mihais föräldrar gått bort. De lär känna grannfamiljen Halberg och relationerna blir allt närmare. Men när parets dotter Elia kommer till skolan med blåmärken väcks misstankar och snart hamnar de båda familjerna i en konflikt om uppfostran, tro och frihet.",
    "director_id": "80fc4e70-3109-5b7c-b03e-de1788cce0bc"
  },
  {
    "id": "fdb64c04-c883-5830-b4b7-96efdef437a1",
    "title": "Digger",
    "productionYear": 2026,
    "ageRating": 11,
    "duration": 129,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/digger-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=qORTe1wW3Wg",
    "shortDescription": "En mäktig oljemiljardär försöker övertyga världen om att han är mänsklighetens räddare innan katastrofen han själv orsakat förstör allt.",
    "longDescription": "Digger Rockwell är världens mäktigaste man och en av världens rikaste oljemiljardärer. När en katastrof som han själv har orsakat hotar att förändra världen försöker han desperat övertyga mänskligheten om att han är dess räddare. Filmen är en mörk och satirisk berättelse om makt, girighet, miljökatastrofer och ansvar.",
    "director_id": "98444e80-98ad-5c03-80de-2abd73692930"
  }
]
```

### GET /movies/:id

**Status:** `200 OK`

```json
{
  "id": "11c4eb5d-8a47-5c66-9861-fcf3f5375a32",
  "title": "Bortglömda ön",
  "productionYear": 2026,
  "ageRating": 7,
  "duration": 109,
  "language": {
    "original": "Engelska",
    "subtitles": "Svenska"
  },
  "posterImage": "/images/movies/bortglömda-ön-poster.jpg",
  "trailerUrl": "https://www.youtube.com/watch?v=Ri2KipSRQ4E",
  "shortDescription": "Jo och Raissa har varit bästa vänner sedan grundskolan men har nu gått ut High School och ska påbörja sina separata livsresor.",
  "longDescription": "Jo och Raissa har varit bästa vänner sedan grundskolan men har nu gått ut High School och ska påbörja sina separata livsresor. När de firar sin sista kväll tillsammans, råkar Jo och Raissa hitta en mystisk portal som transporterar dem till den fantastiska ön Nakali, full av de magiska och mytologiska väsen som hört berättelser om under uppväxten i sina filippinska familjer. En del av de här varelserna blir vänner, andra blir fiender. I sällskap med den välmenande men olyckliga hunden Raww och ett litet men mäktiga gäng kompisar, måste Jo och Raissa möta Den Fruktande Manananggal, den mest skräckinjagande varelsen på ön. När de upptäcker att priset för att återvända hem är att förlora alla minnena av deras vänskap, måste Jo och Raissa skynda sig att hitta ett sätt att lämna ön innan de helt glömmer bort varandra, för evigt.",
  "director_id": "34cead7e-4ba6-5482-ba3e-68a2006d66ef"
}
```

**Status:** `404 Not Found`

```json
{
  "error": "Film hittades inte"
}
```