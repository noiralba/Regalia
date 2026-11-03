import React, { useState } from "react";
import {
  Form,
  Button,
  ButtonGroup,
  Container,
  Card,
  Alert,
  Table,
  Row,
  Col,
} from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Show {
  id: string;
  movie_id: string;
  screen_id: string;
  date: string; // ÅÅÅÅ-MM-DD
  time: string; // TT:MM
  movie_title: string;
  screen_name: string;
  capacity: number;
  booked_count: number;
}
interface Movie {
  id: string;
  title: string;
}
interface Screen {
  id: string;
  name: string;
}

type Filter = "upcoming" | "past" | "all";

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

export default function AdminShows() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("upcoming");

  // Formulär
  const [movieId, setMovieId] = useState("");
  const [screenId, setScreenId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // ==========================================
  // DATAHÄMTNING
  // ==========================================
  const { data: showsData, isLoading } = useQuery<Show[]>({
    queryKey: ["adminShows"],
    queryFn: () => request("/api/shows/admin/all", "GET"),
  });
  const { data: moviesData } = useQuery<Movie[]>({
    queryKey: ["adminMovies"],
    queryFn: () => request("/api/movies/admin/all", "GET"),
  });
  const { data: screensData } = useQuery<Screen[]>({
    queryKey: ["screens"],
    queryFn: () => request("/api/screens", "GET"),
  });

  const shows = Array.isArray(showsData) ? showsData : [];
  const movies = Array.isArray(moviesData) ? moviesData : [];
  const screens = Array.isArray(screensData) ? screensData : [];

  const editingShow = shows.find((s) => s.id === editingId);
  const lockedByBookings = !!editingShow && editingShow.booked_count > 0;

  // Nuvarande tid som "ÅÅÅÅ-MM-DD TT:MM" (lokal tid) för jämförelse med visningarna
  const now = new Date().toLocaleString("sv-SE").slice(0, 16);
  const isUpcoming = (s: Show) => `${s.date} ${s.time}` >= now;

  const visibleShows = shows
    .filter((s) =>
      filter === "all" ? true : filter === "upcoming" ? isUpcoming(s) : !isUpcoming(s),
    )
    .sort((a, b) => {
      const result = `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
      return filter === "upcoming" ? result : -result;
    });

  // ==========================================
  // MUTATIONER
  // ==========================================
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["adminShows"] });
    queryClient.invalidateQueries({ queryKey: ["shows"] });
  };

  const resetForm = () => {
    setEditingId(null);
    setMovieId("");
    setScreenId("");
    setDate("");
    setTime("");
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const body = { movie_id: movieId, screen_id: screenId, date, time };
      return editingId
        ? request(`/api/shows/${editingId}`, "PUT", body, "Kunde inte uppdatera visningen.")
        : request("/api/shows", "POST", body, "Kunde inte skapa visningen.");
    },
    onSuccess: () => {
      refresh();
      setMessage({
        type: "success",
        text: editingId ? "Visningen har uppdaterats!" : "Visningen har skapats!",
      });
      resetForm();
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      request(`/api/shows/${id}`, "DELETE", undefined, "Kunde inte radera visningen."),
    onSuccess: () => {
      refresh();
      setMessage({ type: "success", text: "Visningen har raderats." });
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

  const startEdit = (show: Show) => {
    setMessage(null);
    setEditingId(show.id);
    setMovieId(show.movie_id);
    setScreenId(show.screen_id);
    setDate(show.date);
    setTime(show.time);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (show: Show) => {
    if (
      window.confirm(
        `Radera visningen av ${show.movie_title} ${show.date} kl. ${show.time}?`,
      )
    ) {
      setMessage(null);
      deleteMutation.mutate(show.id);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title className="mb-4 fs-4 fw-bold">
            {editingId ? "Redigera visning" : "Planera ny visning"}
          </Card.Title>

          {message && (
            <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Film</Form.Label>
                  <Form.Select
                    value={movieId}
                    onChange={(e) => setMovieId(e.target.value)}
                    disabled={lockedByBookings}
                    required
                  >
                    <option value="">-- Välj en film --</option>
                    {movies.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Salong</Form.Label>
                  <Form.Select
                    value={screenId}
                    onChange={(e) => setScreenId(e.target.value)}
                    disabled={lockedByBookings}
                    required
                  >
                    <option value="">-- Välj en salong --</option>
                    {screens.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Datum</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Starttid</Form.Label>
                  <Form.Control
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {lockedByBookings && (
              <Form.Text className="d-block mb-3" muted>
                Visningen har {editingShow?.booked_count} bokade platser. Film
                och salong kan inte ändras, bara datum och tid.
              </Form.Text>
            )}

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
                    ? "Uppdatera visning"
                    : "Skapa visning"}
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
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <Card.Title className="fs-4 fw-bold mb-0">
              Visningar ({visibleShows.length})
            </Card.Title>
            <ButtonGroup aria-label="Filtrera visningar">
              {(
                [
                  ["upcoming", "Kommande"],
                  ["past", "Tidigare"],
                  ["all", "Alla"],
                ] as [Filter, string][]
              ).map(([key, label]) => (
                <Button
                  key={key}
                  variant={filter === key ? "primary" : "outline-secondary"}
                  size="sm"
                  onClick={() => setFilter(key)}
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {isLoading ? (
            <p>Laddar visningar...</p>
          ) : visibleShows.length === 0 ? (
            <p className="text-secondary mb-0">Inga visningar att visa.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Film</th>
                  <th>Salong</th>
                  <th>Datum</th>
                  <th>Tid</th>
                  <th>Bokade</th>
                  <th style={{ width: "170px" }}>Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {visibleShows.map((s) => (
                  <tr
                    key={s.id}
                    className={editingId === s.id ? "table-warning" : ""}
                  >
                    <td className="fw-semibold">{s.movie_title}</td>
                    <td>{s.screen_name}</td>
                    <td>{s.date}</td>
                    <td>{s.time}</td>
                    <td>
                      {s.booked_count}/{s.capacity}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => startEdit(s)}
                        >
                          Redigera
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={s.booked_count > 0 || deleteMutation.isPending}
                          title={
                            s.booked_count > 0
                              ? "Visningen har bokade platser och kan inte raderas"
                              : undefined
                          }
                          onClick={() => handleDelete(s)}
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
