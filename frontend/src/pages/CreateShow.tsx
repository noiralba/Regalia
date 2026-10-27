import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
  Row,
  Col,
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

interface ShowInput {
  movie_id: string;
  screen_id: string;
  date: string;
  time: string;
}

export default function CreateShow() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ShowInput>({
    movie_id: "",
    screen_id: "",
    date: "",
    time: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Hämta filmer till rullistan
  const { data: movies, isLoading: loadingMovies } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: async () => {
      const res = await fetch("/api/movies");
      if (!res.ok) throw new Error("Kunde inte hämta filmer");
      return res.json();
    },
  });

  // 2. Hämta salonger till rullistan
  const { data: screens, isLoading: loadingScreens } = useQuery<Screen[]>({
    queryKey: ["screens"],
    queryFn: async () => {
      const res = await fetch("/api/screens");
      if (!res.ok) throw new Error("Kunde inte hämta salonger");
      return res.json();
    },
  });

  // 3. Mutation för att posta den nya visningen
  const mutation = useMutation({
    mutationFn: async (newShow: ShowInput) => {
      const res = await fetch("/api/shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShow),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Kunde inte skapa visningen.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      setSuccessMessage("Visningen har skapats utan problem!");
      setFormData({ movie_id: "", screen_id: "", date: "", time: "" });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const isLoadingData = loadingMovies || loadingScreens;

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4 text-center fs-3 fw-bold">
            Skapa Ny Filmvisning
          </Card.Title>

          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {mutation.isError && (
            <Alert variant="danger">{mutation.error.message}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* VÄLJ FILM */}
            <Form.Group className="mb-3" controlId="formMovie">
              <Form.Label className="fw-semibold">Film</Form.Label>
              <Form.Select
                name="movie_id"
                value={formData.movie_id}
                onChange={handleChange}
                required
                disabled={isLoadingData}
              >
                <option value="">-- Välj en film --</option>
                {movies?.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* VÄLJ SALONG */}
            <Form.Group className="mb-3" controlId="formScreen">
              <Form.Label className="fw-semibold">Salong</Form.Label>
              <Form.Select
                name="screen_id"
                value={formData.screen_id}
                onChange={handleChange}
                required
                disabled={isLoadingData}
              >
                <option value="">-- Välj en salong --</option>
                {screens?.map((screen) => (
                  <option key={screen.id} value={screen.id}>
                    {screen.name} (Kapacitet: {screen.capacity})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* DATUM OCH TID */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDate">
                  <Form.Label className="fw-semibold">Datum</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formTime">
                  <Form.Label className="fw-semibold">Starttid</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* SKICKA-KNAPP */}
            <div className="d-grid mt-4">
              <Button
                variant="primary"
                type="submit"
                size="lg"
                disabled={mutation.isPending || isLoadingData}
              >
                {mutation.isPending ? "Sparar..." : "Skapa visning"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
