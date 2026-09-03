import { useState, useEffect } from "react";

const useProfile = () => {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/profil`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur profil");
        return res.json();
      })
      .then((data) => setProfil(data[0]))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { profil, loading, error };
};

export default useProfile;
