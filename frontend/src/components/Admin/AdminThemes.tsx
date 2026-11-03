import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
  Table,
  Badge,
} from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Theme {
  id: string;
  name: string;
  description: string | null;
  is_active: number | boolean;
  movie_count: number;
  movie_ids: string[] | string | null;
}
interface Movie {
  id: string;
  title: string;
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

async function request(
  url: string,
  method: string,
  body?: unknown,
  fallback = "Något gick fel.",
) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let message = fallback;
    try {
      message = (await res.json()).error || fallback;
    } catch {
      /* svaret var inte JSON */
    }
    throw new Error(message);
  }
  return res.json();
}

export default function AdminThemes() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulär
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedMovieIds, setSelectedMovieIds] = useState<string[]>([]);
  const [movieFilter, setMovieFilter] = useState("");

  // ==========================================
  // DATAHÄMTNING
  // ==========================================
  const { data: themesData, isLoading } = useQuery<Theme[]>({
    queryKey: ["adminThemes"],
    queryFn: () => request("/api/themes/admin/all", "GET"),
  });
  const { data: moviesData } = useQuery<Movie[]>({
    queryKey: ["adminMovies"],
    queryFn: () => request("/api/movies/admin/all", "GET"),
  });

  const themes = Array.isArray(themesData) ? themesData : [];
  const movies = Array.isArray(moviesData) ? moviesData : [];
  const visibleMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(movieFilter.trim().toLowerCase()),
  );

  // ==========================================
  // MUTATIONER
  // ==========================================
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["adminThemes"] });
    queryClient.invalidateQueries({ queryKey: ["themes"] });
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setIsActive(true);
    setSelectedMovieIds([]);
    setMovieFilter("");
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const body = {
        name,
        description,
        is_active: isActive,
        movie_ids: selectedMovieIds,
      };
      return editingId
        ? request(`/api/themes/${editingId}`, "PUT", body, "Kunde inte uppdatera temat.")
        : request("/api/themes", "POST", body, "Kunde inte skapa temat.");
    },
    onSuccess: () => {
      refresh();
      setMessage({
        type: "success",
        text: editingId ? "Temat har uppdaterats!" : "Temat har skapats!",
      });
      resetForm();
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      request(`/api/themes/${id}`, "DELETE", undefined, "Kunde inte radera temat."),
    onSuccess: () => {
      refresh();
      setMessage({ type: "success", text: "Temat har raderats." });
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    saveMutation.mutate();
  };

  const startEdit = (theme: Theme) => {
    setMessage(null);
    setEditingId(theme.id);
    setName(theme.name);
    setDescription(theme.description ?? "");
    setIsActive(Boolean(theme.is_active));
    setSelectedMovieIds(toArray(theme.movie_ids));
    setMovieFilter("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (theme: Theme) => {
    if (
      window.confirm(
        `Radera temat ${theme.name}? Filmerna påverkas inte, bara kopplingarna till temat.`,
      )
    ) {
      setMessage(null);
      deleteMutation.mutate(theme.id);
    }
  };

  const toggleMovie = (id: string) =>
    setSelectedMovieIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );

  return (
    <Container className="mt-5 mb-5" style={{ maxWidth: "900px" }}>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title className="mb-4 fs-4 fw-bold">
            {editingId ? "Redigera tema" : "Skapa tema"}
          </Card.Title>

          {message && (
            <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Namn</Form.Label>
              <Form.Control
                type="text"
                placeholder="t.ex. Halloween-maraton"
                value={name}
                maxLength={100}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Beskrivning</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="theme-active"
                label="Aktivt (visas på webbplatsen)"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                Filmer i temat ({selectedMovieIds.length} valda)
              </Form.Label>
              <Form.Control
                type="search"
                size="sm"
                className="mb-2"
                placeholder="Filtrera filmer..."
                value={movieFilter}
                onChange={(e) => setMovieFilter(e.target.value)}
              />
              <div
                className="border rounded p-2"
                style={{ maxHeight: "220px", overflowY: "auto" }}
              >
                {visibleMovies.length === 0 ? (
                  <span className="text-secondary small">Inga filmer hittades.</span>
                ) : (
                  visibleMovies.map((m) => (
                    <Form.Check
                      key={m.id}
                      type="checkbox"
                      id={`theme-movie-${m.id}`}
                      label={m.title}
                      checked={selectedMovieIds.includes(m.id)}
                      onChange={() => toggleMovie(m.id)}
                    />
                  ))
                )}
              </div>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant={editingId ? "warning" : "primary"}
                type="submit"
                className="flex-grow-1"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending
                  ? "Sparar..."
                  : editingId
                    ? "Uppdatera tema"
                    : "Skapa tema"}
              </Button>
              {editingId && (
                <Button variant="secondary" onClick={resetForm}>
                  Avbryt
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4 fs-4 fw-bold">
            Teman ({themes.length})
          </Card.Title>

          {isLoading ? (
            <p>Laddar teman...</p>
          ) : themes.length === 0 ? (
            <p className="text-secondary mb-0">Inga teman skapade ännu.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Namn</th>
                  <th>Beskrivning</th>
                  <th>Filmer</th>
                  <th>Status</th>
                  <th style={{ width: "170px" }}>Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {themes.map((t) => (
                  <tr
                    key={t.id}
                    className={editingId === t.id ? "table-warning" : ""}
                  >
                    <td className="fw-semibold">{t.name}</td>
                    <td className="text-secondary" style={{ fontSize: "0.9rem" }}>
                      {t.description || "–"}
                    </td>
                    <td>{t.movie_count}</td>
                    <td>
                      <Badge bg={t.is_active ? "success" : "secondary"}>
                        {t.is_active ? "Aktivt" : "Inaktivt"}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => startEdit(t)}
                        >
                          Redigera
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={deleteMutation.isPending}
                          onClick={() => handleDelete(t)}
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
