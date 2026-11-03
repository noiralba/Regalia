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

interface Screen {
  id: string;
  name: string;
  capacity: number;
  seat_count: number;
  row_count: number;
  show_count: number;
}

const ROW_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MAX_ROWS = ROW_LETTERS.length;
const MAX_SEATS_PER_ROW = 50;

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

export default function AdminScreens() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulär
  const [name, setName] = useState("");
  const [rows, setRows] = useState("8");
  const [seatsPerRow, setSeatsPerRow] = useState("12");

  // Delas med CreateShow (samma queryKey) så att visningsformuläret också uppdateras
  const { data, isLoading } = useQuery<Screen[]>({
    queryKey: ["screens"],
    queryFn: () => request("/api/screens", "GET"),
  });
  const screens = Array.isArray(data) ? data : [];

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRows("8");
    setSeatsPerRow("12");
  };

  const saveMutation = useMutation({
    mutationFn: () =>
      editingId
        ? request(
            `/api/screens/${editingId}`,
            "PUT",
            { name },
            "Kunde inte uppdatera salongen.",
          )
        : request(
            "/api/screens",
            "POST",
            {
              name,
              rows: Number(rows),
              seats_per_row: Number(seatsPerRow),
            },
            "Kunde inte skapa salongen.",
          ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screens"] });
      setMessage({
        type: "success",
        text: editingId ? "Salongen har uppdaterats!" : "Salongen har skapats!",
      });
      resetForm();
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      request(`/api/screens/${id}`, "DELETE", undefined, "Kunde inte radera salongen."),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screens"] });
      setMessage({ type: "success", text: "Salongen har raderats." });
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    saveMutation.mutate();
  };

  const startEdit = (screen: Screen) => {
    setMessage(null);
    setEditingId(screen.id);
    setName(screen.name);
    setRows(String(screen.row_count));
    setSeatsPerRow(
      screen.row_count > 0 ? String(Math.round(screen.seat_count / screen.row_count)) : "",
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (screen: Screen) => {
    if (
      window.confirm(
        `Radera ${screen.name}? Alla ${screen.seat_count} platser tas bort.`,
      )
    ) {
      setMessage(null);
      deleteMutation.mutate(screen.id);
    }
  };

  // Förhandsvisning av vad som skapas, t.ex. "96 platser (A1–H12)"
  const rowsN = Number(rows);
  const seatsN = Number(seatsPerRow);
  const validLayout =
    Number.isInteger(rowsN) &&
    Number.isInteger(seatsN) &&
    rowsN >= 1 &&
    rowsN <= MAX_ROWS &&
    seatsN >= 1 &&
    seatsN <= MAX_SEATS_PER_ROW;
  const preview = validLayout
    ? `${rowsN * seatsN} platser (A1–${ROW_LETTERS[rowsN - 1]}${seatsN})`
    : null;

  return (
    <Container className="mt-5 mb-5" style={{ maxWidth: "900px" }}>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title className="mb-4 fs-4 fw-bold">
            {editingId ? "Byt namn på salong" : "Lägg till salong"}
          </Card.Title>

          {message && (
            <Alert
              variant={message.type}
              dismissible
              onClose={() => setMessage(null)}
            >
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Namn</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="t.ex. Salong 1"
                    value={name}
                    maxLength={100}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Antal rader</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={MAX_ROWS}
                    value={rows}
                    onChange={(e) => setRows(e.target.value)}
                    disabled={!!editingId}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Platser per rad</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={MAX_SEATS_PER_ROW}
                    value={seatsPerRow}
                    onChange={(e) => setSeatsPerRow(e.target.value)}
                    disabled={!!editingId}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Text className="d-block mb-3" muted>
              {editingId
                ? "Platslayouten kan inte ändras i efterhand, eftersom befintliga bokningar hör till platserna. Skapa en ny salong om layouten ska ändras."
                : preview
                  ? `Skapar ${preview}. Rader namnges A, B, C … och platser numreras från 1.`
                  : `Ange 1–${MAX_ROWS} rader och 1–${MAX_SEATS_PER_ROW} platser per rad.`}
            </Form.Text>

            <div className="d-flex gap-2">
              <Button
                variant={editingId ? "warning" : "primary"}
                type="submit"
                className="flex-grow-1"
                disabled={saveMutation.isPending || (!editingId && !validLayout)}
              >
                {saveMutation.isPending
                  ? "Sparar..."
                  : editingId
                    ? "Spara namn"
                    : "Skapa salong"}
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
            Salonger ({screens.length})
          </Card.Title>

          {isLoading ? (
            <p>Laddar salonger...</p>
          ) : screens.length === 0 ? (
            <p className="text-secondary mb-0">Inga salonger registrerade ännu.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Namn</th>
                  <th>Rader</th>
                  <th>Platser</th>
                  <th>Visningar</th>
                  <th style={{ width: "190px" }}>Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {screens.map((s) => (
                  <tr
                    key={s.id}
                    className={editingId === s.id ? "table-warning" : ""}
                  >
                    <td className="fw-semibold">{s.name}</td>
                    <td>{s.row_count}</td>
                    <td>{s.seat_count}</td>
                    <td>{s.show_count}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => startEdit(s)}
                        >
                          Byt namn
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={s.show_count > 0 || deleteMutation.isPending}
                          title={
                            s.show_count > 0
                              ? "Salongen har visningar och kan inte raderas"
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
