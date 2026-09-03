import { useState, useEffect } from "react";

const useTimeline = () => {
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/timeline`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur timeline");
        return res.json();
      })
      .then(setTimeline)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { timeline, loading, error };
};

export default useTimeline;
