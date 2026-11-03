import { useState } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Tabs,
  Tab,
  Table,
  Row,
  Col,
} from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Movie {
  id: string;
  title: string;
}
interface Person {
  id: string;
  name: string;
}
interface CastMember {
  id: string;
  name: string;
  image: string | null;
  character_name: string | null;
}
interface MovieDetails {
  id: string;
  title: string;
  director: { id: string; name: string } | string | null;
  cast: CastMember[] | string | null;
}

// JSON-kolumner kan komma som objekt/array eller som sträng beroende på databasdrivrutin
function parseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
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

export default function AdminMovieConnections() {
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("director");

  const [selectedMovieId, setSelectedMovieId] = useState("");

  // Regissör: null = orörd (visar nuvarande regissör), "" = ingen regissör
  const [directorChoice, setDirectorChoice] = useState<string | null>(null);

  // Rollista
  const [selectedActorId, setSelectedActorId] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editingCharacter, setEditingCharacter] = useState("");

  // ==========================================
  // DATAHÄMTNING
  // ==========================================
  const { data: movies } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: () => fetch("/api/movies").then((res) => res.json()),
  });
  const { data: persons } = useQuery<Person[]>({
    queryKey: ["persons"],
    queryFn: () => fetch("/api/persons").then((res) => res.json()),
  });
  const { data: movie, isLoading: movieLoading } = useQuery<MovieDetails>({
    queryKey: ["adminMovieDetails", selectedMovieId],
    queryFn: () => request(`/api/movies/${selectedMovieId}`, "GET"),
    enabled: !!selectedMovieId,
  });

  const currentDirector = parseJson<{ id: string; name: string } | null>(
    movie?.director,
    null,
  );
  const cast = parseJson<CastMember[]>(movie?.cast, [])
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));
  const castIds = new Set(cast.map((c) => c.id));
  const availableActors = persons?.filter((p) => !castIds.has(p.id)) ?? [];

  const directorValue = directorChoice ?? currentDirector?.id ?? "";

  // Uppdatera både adminvyn och den publika filmsidan efter ändringar
  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["adminMovieDetails", selectedMovieId],
    });
    queryClient.invalidateQueries({ queryKey: ["movie", selectedMovieId] });
  };

  const showSuccess = (text: string) => setStatusMessage({ type: "success", text });
  const showError = (err: Error) =>
    setStatusMessage({ type: "danger", text: err.message });

  // ==========================================
  // MUTATIONER
  // ==========================================
  const setDirectorMutation = useMutation({
    mutationFn: () =>
      request(
        `/api/movies/${selectedMovieId}/director`,
        "PUT",
        { director_id: directorValue },
        "Kunde inte spara regissör.",
      ),
    onSuccess: () => {
      showSuccess(
        directorValue
          ? "Regissören har sparats!"
          : "Regissören har tagits bort från filmen.",
      );
      setDirectorChoice(null);
      refresh();
    },
    onError: showError,
  });

  const addCastMutation = useMutation({
    mutationFn: () =>
      request(
        `/api/movies/${selectedMovieId}/cast`,
        "POST",
        { person_id: selectedActorId, character_name: characterName },
        "Kunde inte lägga till skådespelare.",
      ),
    onSuccess: () => {
      showSuccess("Skådespelaren har lagts till i rollistan!");
      setSelectedActorId("");
      setCharacterName("");
      refresh();
    },
    onError: showError,
  });

  const updateCastMutation = useMutation({
    mutationFn: ({
      personId,
      character_name,
    }: {
      personId: string;
      character_name: string;
    }) =>
      request(
        `/api/movies/${selectedMovieId}/cast/${personId}`,
        "PUT",
        { character_name },
        "Kunde inte uppdatera rollen.",
      ),
    onSuccess: () => {
      showSuccess("Rollen har uppdaterats!");
      setEditingPersonId(null);
      refresh();
    },
    onError: showError,
  });

  const removeCastMutation = useMutation({
    mutationFn: (personId: string) =>
      request(
        `/api/movies/${selectedMovieId}/cast/${personId}`,
        "DELETE",
        undefined,
        "Kunde inte ta bort från rollistan.",
      ),
    onSuccess: () => {
      showSuccess("Skådespelaren har tagits bort från rollistan.");
      refresh();
    },
    onError: showError,
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleMovieChange = (id: string) => {
    setSelectedMovieId(id);
    setStatusMessage(null);
    setDirectorChoice(null);
    setSelectedActorId("");
    setCharacterName("");
    setEditingPersonId(null);
  };

  const startEditCharacter = (member: CastMember) => {
    setStatusMessage(null);
    setEditingPersonId(member.id);
    setEditingCharacter(member.character_name ?? "");
  };

  const handleRemove = (member: CastMember) => {
    if (window.confirm(`Ta bort ${member.name} från rollistan?`)) {
      setStatusMessage(null);
      removeCastMutation.mutate(member.id);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        {statusMessage && (
          <Alert
            variant={statusMessage.type}
            dismissible
            onClose={() => setStatusMessage(null)}
          >
            {statusMessage.text}
          </Alert>
        )}

        {/* VÄLJ FILM (gemensam för båda flikarna) */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Välj film att hantera</Form.Label>
          <Form.Select
            value={selectedMovieId}
            onChange={(e) => handleMovieChange(e.target.value)}
          >
            <option value="">-- Välj en film --</option>
            {movies?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {selectedMovieId && movieLoading && <p>Laddar film...</p>}

        {selectedMovieId && movie && (
          <Tabs
            id="movie-connections-tabs"
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k || "director");
              setStatusMessage(null);
            }}
            className="mb-4"
            fill
          >
            {/* ---------------- REGISSÖR ---------------- */}
            <Tab eventKey="director" title="Regissör">
              <p className="mb-3">
                Nuvarande regissör:{" "}
                <strong>{currentDirector?.name ?? "Ingen angiven"}</strong>
              </p>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStatusMessage(null);
                  setDirectorMutation.mutate();
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Select
                    value={directorValue}
                    onChange={(e) => setDirectorChoice(e.target.value)}
                    aria-label="Regissör"
                  >
                    <option value="">-- Ingen regissör --</option>
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
                  disabled={
                    setDirectorMutation.isPending ||
                    directorValue === (currentDirector?.id ?? "")
                  }
                >
                  {setDirectorMutation.isPending ? "Sparar..." : "Spara regissör"}
                </Button>
              </Form>
            </Tab>

            {/* ---------------- ROLLISTA ---------------- */}
            <Tab eventKey="cast" title={`Rollista (${cast.length})`}>
              {cast.length === 0 ? (
                <p className="text-secondary">
                  Inga skådespelare i rollistan ännu.
                </p>
              ) : (
                <Table striped bordered hover responsive className="mb-4">
                  <thead>
                    <tr>
                      <th>Skådespelare</th>
                      <th>Roll</th>
                      <th style={{ width: "220px" }}>Åtgärder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cast.map((member) => {
                      const isEditing = editingPersonId === member.id;
                      return (
                        <tr
                          key={member.id}
                          className={isEditing ? "table-warning" : ""}
                        >
                          <td className="fw-semibold">{member.name}</td>
                          <td>
                            {isEditing ? (
                              <Form.Control
                                size="sm"
                                type="text"
                                value={editingCharacter}
                                onChange={(e) =>
                                  setEditingCharacter(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    updateCastMutation.mutate({
                                      personId: member.id,
                                      character_name: editingCharacter,
                                    });
                                  }
                                  if (e.key === "Escape")
                                    setEditingPersonId(null);
                                }}
                                autoFocus
                                aria-label={`Roll för ${member.name}`}
                              />
                            ) : (
                              (member.character_name ?? (
                                <span className="text-secondary">
                                  Ingen roll angiven
                                </span>
                              ))
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              {isEditing ? (
                                <>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    disabled={updateCastMutation.isPending}
                                    onClick={() =>
                                      updateCastMutation.mutate({
                                        personId: member.id,
                                        character_name: editingCharacter,
                                      })
                                    }
                                  >
                                    Spara
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setEditingPersonId(null)}
                                  >
                                    Avbryt
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => startEditCharacter(member)}
                                  >
                                    Ändra roll
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    disabled={removeCastMutation.isPending}
                                    onClick={() => handleRemove(member)}
                                  >
                                    Ta bort
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}

              <h5 className="fw-bold mb-3">Lägg till i rollistan</h5>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStatusMessage(null);
                  addCastMutation.mutate();
                }}
              >
                <Row>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-secondary">
                        Skådespelare
                      </Form.Label>
                      <Form.Select
                        value={selectedActorId}
                        onChange={(e) => setSelectedActorId(e.target.value)}
                        required
                      >
                        <option value="">-- Välj skådespelare --</option>
                        {availableActors.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-secondary">
                        Karaktärsnamn (roll)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="t.ex. Alexandra"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button
                      type="submit"
                      variant="success"
                      className="w-100 mb-3"
                      disabled={addCastMutation.isPending}
                    >
                      {addCastMutation.isPending ? "Lägger till..." : "Lägg till"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Tab>
          </Tabs>
        )}
      </Card.Body>
    </Card>
  );
}
