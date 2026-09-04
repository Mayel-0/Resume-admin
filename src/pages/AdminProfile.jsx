import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { EditableField } from "../components/EditableField";

export default function AdminProfile() {
  const { get } = useApi();
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    get("/profil")
      .then(setProfil)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p>Erreur : {error.message}</p>;
  if (!profil) return <p>Aucun profil trouvé.</p>;

  return (
    <div className="admin-profile">
      <h2>Profil</h2>

      <div className="admin-profile__field">
        <label>Prénom</label>
        <EditableField
          value={profil.firstName}
          route="/profil"
          fieldKey="firstName"
        />
      </div>

      <div className="admin-profile__field">
        <label>Nom</label>
        <EditableField
          value={profil.lastName}
          route="/profil"
          fieldKey="lastName"
        />
      </div>

      <div className="admin-profile__field">
        <label>Rôle</label>
        <EditableField
          value={profil.role}
          route="/profil"
          fieldKey="role"
        />
      </div>

      <div className="admin-profile__field">
        <label>Localisation</label>
        <EditableField
          value={profil.location}
          route="/profil"
          fieldKey="location"
        />
      </div>

      <div className="admin-profile__field">
        <label>Tagline</label>
        <EditableField
          value={profil.tagline}
          route="/profil"
          fieldKey="tagline"
          type="html"
        />
      </div>

    </div>
  );
}
