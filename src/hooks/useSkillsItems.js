import { useState, useEffect } from "react";

const useSkillsItems = () => {
  const [skillsItems, setSkillsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/skill-items`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur skill-items");
        return res.json();
      })
      .then(setSkillsItems)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { skillsItems, loading, error };
};

export default useSkillsItems;
