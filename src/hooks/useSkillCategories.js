import { useState, useEffect } from "react";

const useSkillCategories = () => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/skill-categories`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur skill-categories");
        return res.json();
      })
      .then(setSkillCategories)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { skillCategories, loading, error };
};

export default useSkillCategories;
