import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import AdminPage from "../shared/components/AdminPage";
import FormCard from "../shared/components/FormCard";
import { SelectField } from "../shared/components/FormFields";
import { useAdminMovies, useMovieDetails, usePersons } from "../shared/useAdminQueries";
import { useStatusMessage } from "../shared/useStatusMessage";
import CastTab from "./CastTab";
import DirectorTab from "./DirectorTab";

export default function AdminMovieConnections() {
  const status = useStatusMessage();
  const { movies } = useAdminMovies();
  const { persons } = usePersons();

  const [movieId, setMovieId] = useState("");
  const [activeTab, setActiveTab] = useState("director");
  const { isLoaded, isLoading, director, cast } = useMovieDetails(movieId);

  const handleMovieChange = (id: string) => {
    status.clearMessage();
    setMovieId(id);
  };

  return (
    <AdminPage maxWidth="900px">
      <FormCard title="Regissör och rollista för en film" status={status}>
        <SelectField
          label="Välj film att hantera"
          value={movieId}
          onChange={handleMovieChange}
          emptyLabel="-- Välj en film --"
          options={movies.map((m) => ({ value: m.id, label: m.title }))}
        />

        {movieId && isLoading && <p>Laddar film...</p>}

        {movieId && isLoaded && (
          // key={movieId}: flikarna startar om när en annan film väljs
          <Tabs
            key={movieId}
            id="movie-connections-tabs"
            activeKey={activeTab}
            onSelect={(key) => {
              setActiveTab(key ?? "director");
              status.clearMessage();
            }}
            className="mb-4"
            fill
          >
            <Tab eventKey="director" title="Regissör">
              <DirectorTab
                movieId={movieId}
                currentDirector={director}
                persons={persons}
                status={status}
              />
            </Tab>
            <Tab eventKey="cast" title={`Rollista (${cast.length})`}>
              <CastTab movieId={movieId} cast={cast} persons={persons} status={status} />
            </Tab>
          </Tabs>
        )}
      </FormCard>
    </AdminPage>
  );
}
