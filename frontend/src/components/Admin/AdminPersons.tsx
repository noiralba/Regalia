import React, { useState } from "react";
import { Form, Button, Container, Card, Alert, Table } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Person {
  id: string;
  name: string;
  bio: string | null;
  image: string | null;
}

interface PersonInput {
  name: string;
  bio: string;
  imageFile: File | null;
}

export default function AdminPersons() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState<PersonInput>({
    name: "",
    bio: "",
    imageFile: null,
  });

  // Håller koll på om vi redigerar en person och i så fall vilket ID
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);

  // ==========================================
  // DATAHÄMTNING (Hämta alla personer)
  // ==========================================
  const { data: persons, isLoading } = useQuery<Person[]>({
    queryKey: ["persons"],
    queryFn: () =>
      fetch("/api/persons").then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta personer.");
        return res.json();
      }),
  });

  // ==========================================
  // MUTATION: SKAPA PERSON (POST)
  // ==========================================
  const createPersonMutation = useMutation({
    mutationFn: async (fd: FormData) => {
      const res = await fetch("/api/persons", { method: "POST", body: fd });
      if (!res.ok)
        throw new Error((await res.json()).error || "Kunde inte skapa person.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      setMessage({ type: "success", text: "Personen har skapats!" });
      setFormData({ name: "", bio: "", imageFile: null });
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  // ==========================================
  // MUTATION: UPPDATERA PERSON (PUT)
  // ==========================================
  const updatePersonMutation = useMutation({
    mutationFn: async ({ id, fd }: { id: string; fd: FormData }) => {
      const res = await fetch(`/api/persons/${id}`, {
        method: "PUT",
        body: fd,
      });
      if (!res.ok)
        throw new Error(
          (await res.json()).error || "Kunde inte uppdatera person.",
        );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      setMessage({
        type: "success",
        text: "Personen har uppdaterats framgångsrikt!",
      });
      setFormData({ name: "", bio: "", imageFile: null });
      setEditingPersonId(null); // Gå ur redigeringsläge
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  // ==========================================
  // MUTATION: TA BORT PERSON (DELETE)
  // ==========================================
  const deletePersonMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/persons/${id}`, { method: "DELETE" });
      if (!res.ok)
        throw new Error(
          (await res.json()).error || "Kunde inte radera person.",
        );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      setMessage({ type: "success", text: "Personen raderades." });
    },
    onError: (err) => setMessage({ type: "danger", text: err.message }),
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("bio", formData.bio);
    if (formData.imageFile) {
      fd.append("image", formData.imageFile);
    }

    if (editingPersonId) {
      updatePersonMutation.mutate({ id: editingPersonId, fd });
    } else {
      createPersonMutation.mutate(fd);
    }
  };

  // Aktiveras när användaren klickar på "Redigera" i tabellen
  const startEdit = (person: Person) => {
    setMessage(null);
    setEditingPersonId(person.id);
    setFormData({
      name: person.name,
      bio: person.bio || "",
      imageFile: null, // Låt filen vara tom tills de eventuellt väljer en ny bild
    });
    // Skrolla upp till formuläret automatiskt för bättre UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingPersonId(null);
    setFormData({ name: "", bio: "", imageFile: null });
    setMessage(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Är du säker på att du vill radera ${name}?`)) {
      setMessage(null);
      deletePersonMutation.mutate(id);
    }
  };

  return (
    <Container className="mt-5 mb-5" style={{ maxWidth: "800px" }}>
      <Card className="shadow-sm mb-5">
        <Card.Body>
          <Card.Title className="mb-4 text-center fs-3 fw-bold">
            {editingPersonId
              ? "Redigera Person"
              : "Hantera Skådespelare & Regissörer"}
          </Card.Title>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Namn</Form.Label>
              <Form.Control
                type="text"
                placeholder="Skriv fullständigt namn..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Biografi</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Kort beskrivning eller bio..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Profilbild{" "}
                {editingPersonId && "(Lämna tom för att behålla nuvarande)"}
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e: any) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setFormData({ ...formData, imageFile: file });
                }}
              />
            </Form.Group>

            <div className="d-flex gap-2 mt-4">
              <Button
                variant={editingPersonId ? "warning" : "success"}
                type="submit"
                size="lg"
                className="flex-grow-1"
                disabled={
                  createPersonMutation.isPending ||
                  updatePersonMutation.isPending
                }
              >
                {editingPersonId ? "Uppdatera Person" : "Spara Person & Bild"}
              </Button>

              {editingPersonId && (
                <Button variant="secondary" size="lg" onClick={cancelEdit}>
                  Avbryt
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* TABELL ÖVER REGISTRERADE PERSONER */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4 fs-4 fw-bold">
            Registrerade Personer ({persons?.length || 0})
          </Card.Title>
          {isLoading ? (
            <p>Laddar personer...</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Namn</th>
                  <th>Bio</th>
                  <th>Bildnamn</th>
                  <th style={{ width: "150px" }}>Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {persons?.map((person) => (
                  <tr
                    key={person.id}
                    className={
                      editingPersonId === person.id ? "table-warning" : ""
                    }
                  >
                    <td className="fw-semibold">{person.name}</td>
                    <td className="text-muted" style={{ fontSize: "0.9rem" }}>
                      {person.bio || "Ingen bio angiven"}
                    </td>
                    <td
                      style={{ fontSize: "0.85rem", fontFamily: "monospace" }}
                    >
                      {person.image || "Ingen bild"}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => startEdit(person)}
                        >
                          Redigera
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(person.id, person.name)}
                          disabled={deletePersonMutation.isPending}
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
