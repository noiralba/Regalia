import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
  Table,
  Row,
  Col,
} from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Movie {
  id: string;
  title: string;
  productionYear: number | null;
  release_date: string | null;
  end_date: string | null;
  ageRating: string | null;
  duration: number | null;
  language: { original?: string; subtitles?: string } | string | null;
  trailerUrl: string | null;
  director_id: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  categoryIds: string[] | string | null;
}
interface Category {
  id: string;
  name: string;
}
interface Person {
  id: string;
  name: string;
}

// JSON-kolumner kan komma som array eller som sträng beroende på databasdrivrutin
function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

// language är {"original": "...", "subtitles": "..."} (objekt eller JSON-sträng)
function parseLanguageObject(value: unknown): {
  original: string;
  subtitles: string;
} {
  let obj: any = value;
  if (typeof value === "string") {
    try {
      obj = JSON.parse(value);
    } catch {
      obj = null;
    }
  }
  return {
    original: obj?.original ? String(obj.original) : "",
    subtitles: obj?.subtitles ? String(obj.subtitles) : "",
  };
}

async function errorMessage(res: Response, fallback: string) {
  try {
    return (await res.json()).error || fallback;
  } catch {
    return fallback;
  }
}

export default function AdminMovies() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulär-states
  const [title, setTitle] = useState("");
  const [productionYear, setProductionYear] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ageRating, setAgeRating] = useState("");
  const [duration, setDuration] = useState("");
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [subtitleLanguage, setSubtitleLanguage] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [directorId, setDirectorId] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  // Queries
  const { data: movies, isLoading } = useQuery<Movie[]>({
    queryKey: ["adminMovies"],
    queryFn: () => fetch("/api/movies/admin/all").then((res) => res.json()),
  });
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then((res) => res.json()),
  });
  const { data: persons } = useQuery<Person[]>({
    queryKey: ["persons"],
    queryFn: () => fetch("/api/persons").then((res) => res.json()),
  });

  // Mutationer
  const saveMutation = useMutation({
    mutationFn: async (fd: FormData) => {
      const url = editingId ? `/api/movies/${editingId}` : "/api/movies";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd });
      if (!res.ok)
        throw new Error(await errorMessage(res, "Kunde inte spara filmen."));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMovies"] });
      setMessage({
        type: "success",
        text: editingId ? "Filmen har uppdaterats!" : "Filmen har skapats!",
      });
      resetForm();
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/movies/${id}`, { method: "DELETE" });
      if (!res.ok)
        throw new Error(await errorMessage(res, "Kunde inte radera filmen."));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMovies"] });
      setMessage({ type: "success", text: "Filmen har raderats." });
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("productionYear", productionYear);
    fd.append("release_date", releaseDate);
    fd.append("end_date", endDate);
    fd.append("ageRating", ageRating);
    fd.append("duration", duration);
    fd.append(
      "language",
      JSON.stringify({
        original: originalLanguage.trim(),
        subtitles: subtitleLanguage.trim(),
      }),
    );
    fd.append("trailerUrl", trailerUrl);
    fd.append("director_id", directorId);
    fd.append("shortDescription", shortDesc);
    fd.append("longDescription", longDesc);
    fd.append("categories", JSON.stringify(selectedCategories));
    if (posterFile) fd.append("posterImage", posterFile);
    if (thumbFile) fd.append("posterThumbnail", thumbFile);

    saveMutation.mutate(fd);
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  };

  const startEdit = (movie: Movie) => {
    setMessage(null);
    setEditingId(movie.id);
    setTitle(movie.title);
    setProductionYear(movie.productionYear?.toString() || "");
    setReleaseDate(movie.release_date ? movie.release_date.split("T")[0] : "");
    setEndDate(movie.end_date ? movie.end_date.split("T")[0] : "");
    setAgeRating(movie.ageRating || "");
    setDuration(movie.duration?.toString() || "");
    const lang = parseLanguageObject(movie.language);
    setOriginalLanguage(lang.original);
    setSubtitleLanguage(lang.subtitles);
    setTrailerUrl(movie.trailerUrl || "");
    setDirectorId(movie.director_id || "");
    setShortDesc(movie.shortDescription || "");
    setLongDesc(movie.longDescription || "");
    // Kategorierna följer med från /api/movies/admin/all
    setSelectedCategories(toArray(movie.categoryIds));
    setPosterFile(null);
    setThumbFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setProductionYear("");
    setReleaseDate("");
    setEndDate("");
    setAgeRating("");
    setDuration("");
    setOriginalLanguage("");
    setSubtitleLanguage("");
    setTrailerUrl("");
    setDirectorId("");
    setShortDesc("");
    setLongDesc("");
    setSelectedCategories([]);
    setPosterFile(null);
    setThumbFile(null);
  };

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow-sm mb-5">
        <Card.Body>
          <Card.Title className="mb-4 text-center fs-3 fw-bold">
            {editingId ? "Redigera Film" : "Lägg till Ny Film"}
          </Card.Title>
          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filmtitel</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Produktionsår</Form.Label>
                  <Form.Control
                    type="number"
                    value={productionYear}
                    onChange={(e) => setProductionYear(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Åldersgräns</Form.Label>
                  <Form.Control
                    type="text"
                    value={ageRating}
                    onChange={(e) => setAgeRating(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Premiärdatum (Release)</Form.Label>
                  <Form.Control
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Slutdatum (End)</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Längd (minuter)</Form.Label>
                  <Form.Control
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Originalspråk</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="t.ex. Engelska"
                    value={originalLanguage}
                    onChange={(e) => setOriginalLanguage(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Undertexter</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="t.ex. Svenska"
                    value={subtitleLanguage}
                    onChange={(e) => setSubtitleLanguage(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Trailer-URL</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://..."
                    value={trailerUrl}
                    onChange={(e) => setTrailerUrl(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Regissör</Form.Label>
                  <Form.Select
                    value={directorId}
                    onChange={(e) => setDirectorId(e.target.value)}
                  >
                    <option value="">Ingen regissör</option>
                    {persons?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Kort beskrivning</Form.Label>
              <Form.Control
                type="text"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lång beskrivning</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Kategorier</Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {categories?.map((cat) => (
                  <Form.Check
                    key={cat.id}
                    type="checkbox"
                    id={cat.id}
                    label={cat.name}
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                  />
                ))}
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Affisch (Poster Image){" "}
                    {editingId && "(Lämna tom för att behålla nuvarande)"}
                  </Form.Label>
                  <Form.Control
                    key={`poster-${editingId ?? "new"}-${saveMutation.submittedAt}`}
                    type="file"
                    accept="image/*"
                    onChange={(e: any) =>
                      setPosterFile(e.target.files?.[0] || null)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Miniatyr (Thumbnail){" "}
                    {editingId && "(Lämna tom för att behålla nuvarande)"}
                  </Form.Label>
                  <Form.Control
                    key={`thumb-${editingId ?? "new"}-${saveMutation.submittedAt}`}
                    type="file"
                    accept="image/*"
                    onChange={(e: any) =>
                      setThumbFile(e.target.files?.[0] || null)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-4">
              <Button
                variant={editingId ? "warning" : "primary"}
                type="submit"
                size="lg"
                className="flex-grow-1"
                disabled={saveMutation.isPending}
              >
                {editingId ? "Uppdatera Film" : "Spara Film"}
              </Button>
              {editingId && (
                <Button variant="secondary" size="lg" onClick={resetForm}>
                  Avbryt
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* FILMLISTA */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4 fs-4 fw-bold">
            Registrerade Filmer ({movies?.length || 0})
          </Card.Title>
          {isLoading ? (
            <p>Laddar filmer...</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Titel</th>
                  <th>År</th>
                  <th>Premiär</th>
                  <th>Slutdatum</th>
                  <th>Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {movies?.map((m) => (
                  <tr
                    key={m.id}
                    className={editingId === m.id ? "table-warning" : ""}
                  >
                    <td className="fw-semibold">{m.title}</td>
                    <td>{m.productionYear || "-"}</td>
                    <td>
                      {m.release_date ? m.release_date.split("T")[0] : "-"}
                    </td>
                    <td>{m.end_date ? m.end_date.split("T")[0] : "-"}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => startEdit(m)}
                        >
                          Redigera
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            if (window.confirm(`Radera ${m.title}?`))
                              deleteMutation.mutate(m.id);
                          }}
                        >
                          Radera
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
