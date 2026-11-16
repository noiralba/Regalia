# Movies

## GET /movies

Returns all movies. Optional filters: `ageRating`, `categories`, `search`. Filters can be combined.

**`200 OK`**

```json
[
  {
    "id": "bb058c9e-8e1c-5458-a144-b2c1a34d4940",
    "title": "The Odyssey",
    "productionYear": 2026,
    "ageRating": "11",
    "duration": 180,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/odyssey-poster.webp",
    "trailerUrl": "Mzw2ttJD2qQ",
    "shortDescription": "Odysseus ger sig ut på en lång och farofylld resa hem efter det trojanska kriget, där han möter gudar, monster och andra prövningar.",
    "longDescription": "Efter det trojanska kriget försöker kung Odysseus återvända hem till Ithaka och sin familj. ...",
    "release_date": "2026-07-16T22:00:00.000Z",
    "director_id": "bab4795d-c38e-51c4-a013-f931be094a4c",
    "categories": ["Äventyr", "Drama", "Action", "Fantasy"]
  }
]
```

> **To confirm:** `ageRating` is shown as a string (`"11"`) in the latest drafts, and as a number in older ones. Check the real response. `trailerUrl` is a YouTube video ID, not a full URL.

### Filters

| Query parameter | Description | Example |
| --------------- | ----------- | ------- |
| `ageRating` | Age rating, positive number | `/movies?ageRating=15` |
| `categories` | Category name in Swedish | `/movies?categories=Familj` |
| `search` | Search term | `/movies?search=resident evil` |
| combined | All filters together | `/movies?ageRating=11&categories=Äventyr&search=odysseus` |

**`400 Bad Request`**: invalid filters

```json
{ "error": "ageRating måste vara ett positivt tal" }
```

```json
{ "error": "Sökordet är för kort" }
```

```json
{ "error": "Kategorin finns inte" }
```

> **To confirm:** the "category does not exist" error was commented out in the latest draft (with a trailing period: `"Kategorin finns inte."`). Check whether the backend still returns it.

## GET /movies/:id

Returns one movie by ID. The response has the same shape as one item in `GET /movies`.

**`200 OK`**

```json
{
  "id": "11c4eb5d-8a47-5c66-9861-fcf3f5375a32",
  "title": "Bortglömda ön",
  "productionYear": 2026,
  "ageRating": "7",
  "duration": 109,
  "language": { "original": "Engelska", "subtitles": "Svenska" },
  "posterImage": "/images/movies/bortglömda-ön-poster.webp",
  "trailerUrl": "Ri2KipSRQ4E",
  "shortDescription": "Jo och Raissa har varit bästa vänner sedan grundskolan ...",
  "longDescription": "...",
  "release_date": "2026-09-24T22:00:00.000Z",
  "director_id": "34cead7e-4ba6-5482-ba3e-68a2006d66ef",
  "categories": ["Familj", "Komedi", "Äventyr"]
}
```

**`404 Not Found`**

```json
{ "error": "Film hittades inte" }
```
