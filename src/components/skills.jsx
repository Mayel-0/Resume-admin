import useSkillsItems from "../hooks/useSkillsItems.js";
import useSkillCategories from "../hooks/useSkillCategories.js";

function Skills() {

  const {skillCategories, loading: loadingskillCategories} = useSkillCategories();
  const {skillsItems, loading: loadingskillsitems} = useSkillsItems();

  if (loadingskillCategories || loadingskillsitems) return <p>Chargement...</p>;

  return (
    <section id="competences" className="section shell">
      <div className="section__head">
        <span className="section__index">03</span>
        <h2>Compétences</h2>
      </div>
      <p className="section__lead">
        Les technologies que j'utilise au quotidien dans mes projets d'école et personnels.
      </p>

      <div className="skills">
        {skillCategories.map((category) => (
          <article className="card" key={category.order}>
            <h3>{category.title}</h3>
            <div className="tag-list">
              {skillsItems
                .filter((item) => item.categoryId === category.id)
                .map((item) => (
                  <span className="tag" key={item.id}>
                    {item.label}
                  </span>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Skills;
