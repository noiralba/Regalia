import { useEffect, useState } from "react";
import { get } from "../api/api";

interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function useFetchUserFirstName(userId?: string) {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (!userId) return;

    async function fetchFirstName() {
      try {
        const user = await get<UserResponse>(
          `/api/users/${encodeURIComponent(userId!)}`,
        );
        setFirstName(user.first_name);
      } catch (err) {
        console.error("Kunde inte hämta förnamn:", err);
      }
    }

    fetchFirstName();
  }, [userId]);

  return firstName;
}