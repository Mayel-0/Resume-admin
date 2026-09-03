import { useState, useEffect } from "react";

const useSocials = () => {
  const [socials, setSocials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/socials`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur socials ");
        return res.json();
      })
      .then(setSocials)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { socials, loading, error };
};

export default useSocials;
