import { useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Movie {
  id: string;
  title: string;
}
interface Person {
  id: string;
  name: string;
}

export default function AdminMovieConnections() {
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  // States för formulären
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedDirectorId, setSelectedDirectorId] = useState("");
  const [selectedActorId, setSelectedActorId] = useState("");
  const [characterName, setCharacterName] = useState("");

  // Hämta alla filmer och alla personer till rullistorna
  const { data: movies } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: () => fetch("/api/movies").then((res) => res.json()),
  });
  const { data: persons } = useQuery<Person[]>({
    queryKey: ["persons"],
    queryFn: () => fetch("/api/persons").then((res) => res.json()),
  });

  // Mutation för att sätta regissör
  const setDirectorMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/movies/${selectedMovieId}/director`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ director_id: selectedDirectorId }),
      });
      if (!res.ok) throw new Error("Kunde inte spara regissör.");
      return res.json();
    },
    onSuccess: () => {
      setStatusMessage({
        type: "success",
        text: "Regissör har kopplats till filmen!",
      });
      setSelectedDirectorId("");
      queryClient.invalidateQueries({ queryKey: ["movie", selectedMovieId] });
    },
    onError: (err) => setStatusMessage({ type: "danger", text: err.message }),
  });

  // Mutation för att lägga till i rollistan
  const addCastMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/movies/${selectedMovieId}/cast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person_id: selectedActorId,
          character_name: characterName,
        }),
      });
      if (!res.ok)
        throw new Error(
          (await res.json()).error || "Kunde inte lägga till skådespelare.",
        );
      return res.json();
    },
    onSuccess: () => {
      setStatusMessage({
        type: "success",
        text: "Skådespelaren har lagts till i rollistan!",
      });
      setSelectedActorId("");
      setCharacterName("");
      queryClient.invalidateQueries({ queryKey: ["movie", selectedMovieId] });
    },
    onError: (err) => setStatusMessage({ type: "danger", text: err.message }),
  });

  return (
    <Card className="shadow-sm mt-4">
      <Card.Body>
        <Card.Title className="fw-bold mb-4">
          Koppla Regissör & Rollista till Film
        </Card.Title>

        {statusMessage && (
          <Alert variant={statusMessage.type}>{statusMessage.text}</Alert>
        )}

        {/* 1. VÄLJ FILM (Gemensam för båda åtgärderna) */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">
            1. Välj Film att hantera
          </Form.Label>
          <Form.Select
            value={selectedMovieId}
            onChange={(e) => {
              setSelectedMovieId(e.target.value);
              setStatusMessage(null);
            }}
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

        {selectedMovieId && (
          <Row>
            {/* SEKTION: SÄTT REGISSÖR */}
            <Col md={6} className="border-end">
              <h5 className="fw-bold text-primary mb-3">Ange Regissör</h5>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDirectorMutation.mutate();
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Select
                    value={selectedDirectorId}
                    onChange={(e) => setSelectedDirectorId(e.target.value)}
                    required
                  >
                    <option value="">-- Välj regissör --</option>
                    {persons?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={setDirectorMutation.isPending}
                >
                  {setDirectorMutation.isPending
                    ? "Sparar..."
                    : "Spara Regissör"}
                </Button>
              </Form>
            </Col>

            {/* SEKTION: LÄGG TILL ROLLISTA */}
            <Col md={6}>
              <h5 className="fw-bold text-success mb-3">
                Lägg till i Rollista (Cast)
              </h5>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  addCastMutation.mutate();
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted">
                    Skådespelare
                  </Form.Label>
                  <Form.Select
                    value={selectedActorId}
                    onChange={(e) => setSelectedActorId(e.target.value)}
                    required
                  >
                    <option value="">-- Välj skådespelare --</option>
                    {persons?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted">
                    Karaktärsnamn (Roll)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="t.ex. Alexandra"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  disabled={addCastMutation.isPending}
                >
                  {addCastMutation.isPending
                    ? "Lägger till..."
                    : "Lägg till i rollistan"}
                </Button>
              </Form>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}
