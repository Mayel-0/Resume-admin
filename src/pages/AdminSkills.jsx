import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { EditableField } from "../components/EditableField";
import { CreateField } from "../components/CreateField";
import { DeleteButton } from "../components/DeleteField";


export default function AdminSkills() {
  const {get} = useApi();
  const [skillCategories, setSkillCategories] = useState(null);
  const [skillsItems, setSkillsItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([get("/skill-categories"), get("/skill-items")])
      .then(([categories, items]) => {
        setSkillCategories(categories);
        setSkillsItems(items);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [])

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p>Erreur : {error.message}</p>;
  if (!skillCategories || !skillsItems) return <p>Aucune compétence trouvée.</p>;

  const loadSkills = () => {
    setLoading(true);
    Promise.all([get("/skill-categories"), get("/skill-items")])
      .then(([categories, items]) => {
        setSkillCategories(categories);
        setSkillsItems(items);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const maxCategoryOrder = skillCategories.length > 0
  ? Math.max(...skillCategories.map((category) => Number(category.order) || 0))
  : 0;
  const maxItemOrder = skillsItems.length > 0
  ? Math.max(...skillsItems.map((item) => Number(item.order) || 0))
  : 0;

  return (
    <section className="admin-skills">
      <h2>Compétences</h2>
      <div className="admin-skills__inner">
        <div className="admin-skills__create">
          <h3>Ajouter une catégorie</h3>
          <CreateField
            route="/skill-categories"
            currentOrder={maxCategoryOrder}
            onSuccess={loadSkills}
          >
            <label htmlFor="skill-category-title">Titre</label>
            <input id="skill-category-title" name="title" type="text" required />
          </CreateField>

          <h3>Ajouter une compétence</h3>
          <CreateField
            route="/skill-items"
            currentOrder={maxItemOrder}
            onSuccess={loadSkills}
          >
            <label htmlFor="skill-item-category">Catégorie</label>
            <select id="skill-item-category" name="categoryId" required defaultValue="">
              <option value="" disabled>Choisir une catégorie</option>
              {skillCategories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
            <label htmlFor="skill-item-label">Nom</label>
            <input id="skill-item-label" name="label" type="text" required />
          </CreateField>
        </div>

        <div className="admin-skills__list">
          {skillCategories.map((category) => (
            <article className="admin-skills__card" key={category.order}>
              <div className="admin-skills__category-header">
                <div className="admin-skills__field">
                  <label>Titre de la catégorie</label>
                  <EditableField
                    value={category.title}
                    route={`/skill-categories/${category.id}`}
                    fieldKey="title"
                  />
                </div>
                <DeleteButton
                  route={`/skill-categories/${category.id}`}
                  onSuccess={loadSkills}
                />
              </div>

              <div className="admin-skills__items">
                {skillsItems
                  .filter((item) => item.categoryId === category.id)
                  .map((item) => (
                    <div className="admin-skills__item" key={item.id}>
                      <EditableField
                        value={item.label}
                        route={`/skill-items/${item.id}`}
                        fieldKey="label"
                      />
                      <DeleteButton
                        route={`/skill-items/${item.id}`}
                        onSuccess={loadSkills}
                      />
                    </div>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
