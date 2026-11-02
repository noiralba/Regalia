import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
  Row,
  Col,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Movie {
  id: string;
  title: string;
}
interface Screen {
  id: string;
  name: string;
  capacity: number;
}
interface Theme {
  id: string;
  name: string;
}

interface ShowInput {
  movie_id: string;
  screen_id: string;
  date: string;
  time: string;
}
interface MovieThemeInput {
  movie_id: string;
  theme_id: string;
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("shows");

  // Tillstånd för fel/framgångsmeddelanden
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  // Formulärdata för de två olika flikarna
  const [showForm, setShowForm] = useState<ShowInput>({
    movie_id: "",
    screen_id: "",
    date: "",
    time: "",
  });
  const [themeForm, setThemeForm] = useState<MovieThemeInput>({
    movie_id: "",
    theme_id: "",
  });

  // ==========================================
  // DATAHÄMTNING (QUERIES)
  // ==========================================
  const { data: movies } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: () => fetch("/api/movies").then((res) => res.json()),
  });

  const { data: screens } = useQuery<Screen[]>({
    queryKey: ["screens"],
    queryFn: () => fetch("/api/screens").then((res) => res.json()),
  });

  const { data: themes } = useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: () => fetch("/api/themes").then((res) => res.json()),
  });

  // ==========================================
  // MUTATIONER (POST-ANROP)
  // ==========================================
  const createShowMutation = useMutation({
    mutationFn: async (newShow: ShowInput) => {
      const res = await fetch("/api/shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newShow, id: window.crypto.randomUUID() }),
      });
      if (!res.ok)
        throw new Error(
          (await res.json()).error || "Kunde inte skapa visning.",
        );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      setMessage({ type: "success", text: "Filmvisningen har skapats!" });
      setShowForm({ movie_id: "", screen_id: "", date: "", time: "" });
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  const connectThemeMutation = useMutation({
    mutationFn: async (mapping: MovieThemeInput) => {
      const res = await fetch("/api/themes/movie-themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapping),
      });
      if (!res.ok)
        throw new Error((await res.json()).error || "Kunde inte spara tema.");
      return res.json();
    },
    onSuccess: () => {
      setMessage({ type: "success", text: "Filmen har kopplats till temat!" });
      setThemeForm({ movie_id: "", theme_id: "" });
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleShowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    createShowMutation.mutate(showForm);
  };

  const handleThemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    connectThemeMutation.mutate(themeForm);
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "650px" }}>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4 text-center fs-3 fw-bold">
            Biograf Administration
          </Card.Title>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Tabs
            id="admin-tabs"
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k || "shows");
              setMessage(null);
            }}
            className="mb-4"
            fill
          >
            <Tab eventKey="shows" title="Planera Visning">
              <Form onSubmit={handleShowSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Välj Film</Form.Label>
                  <Form.Select
                    value={showForm.movie_id}
                    onChange={(e) =>
                      setShowForm({ ...showForm, movie_id: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Välj en film --</option>
                    {movies?.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Välj Salong</Form.Label>
                  <Form.Select
                    value={showForm.screen_id}
                    onChange={(e) =>
                      setShowForm({ ...showForm, screen_id: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Välj en salong --</option>
                    {screens?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Datum</Form.Label>
                      <Form.Control
                        type="date"
                        value={showForm.date}
                        onChange={(e) =>
                          setShowForm({ ...showForm, date: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Starttid</Form.Label>
                      <Form.Control
                        type="time"
                        value={showForm.time}
                        onChange={(e) =>
                          setShowForm({ ...showForm, time: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={createShowMutation.isPending}
                  >
                    {createShowMutation.isPending
                      ? "Sparar..."
                      : "Skapa visning"}
                  </Button>
                </div>
              </Form>
            </Tab>

            <Tab eventKey="themes" title="Hantera Temadagar">
              <Form onSubmit={handleThemeSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Välj Film</Form.Label>
                  <Form.Select
                    value={themeForm.movie_id}
                    onChange={(e) =>
                      setThemeForm({ ...themeForm, movie_id: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Välj film --</option>
                    {movies?.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Välj Tema</Form.Label>
                  <Form.Select
                    value={themeForm.theme_id}
                    onChange={(e) =>
                      setThemeForm({ ...themeForm, theme_id: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Välj ett biograf-tema --</option>
                    {themes?.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <div className="d-grid mt-4">
                  <Button
                    variant="gold"
                    type="submit"
                    size="lg"
                    style={{
                      background: "#ffc107",
                      borderColor: "#ffc107",
                      color: "#000",
                    }}
                    disabled={connectThemeMutation.isPending}
                  >
                    {connectThemeMutation.isPending
                      ? "Kopplar..."
                      : "Koppla film till tema"}
                  </Button>
                </div>
              </Form>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
}
