import { useState, useEffect } from "react";

const useSections = () => {
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/sections`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur sections");
        return res.json();
      })
      .then(setSections)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { sections, loading, error };
};

export default useSections;
