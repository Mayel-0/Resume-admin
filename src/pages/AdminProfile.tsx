import { useResource } from "../hooks/useResource";
import { EditableField } from "../components/EditableField";

export default function AdminProfile() {
  const { data: profil, loading, error } = useResource("/profil");

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p>Erreur : {error.message}</p>;
  if (!profil) return <p>Aucun profil trouvé.</p>;

  return (
    <div className="admin-profile">
      <h2>Profil</h2>

      <div className="admin-profile__field">
        <label>Prénom</label>
        <EditableField
          item={profil}
          route="/profil"
          fieldKey="firstName"
        />
      </div>

      <div className="admin-profile__field">
        <label>Nom</label>
        <EditableField
          item={profil}
          route="/profil"
          fieldKey="lastName"
        />
      </div>

      <div className="admin-profile__field">
        <label>Rôle</label>
        <EditableField
          item={profil}
          route="/profil"
          fieldKey="role"
        />
      </div>

      <div className="admin-profile__field">
        <label>Localisation</label>
        <EditableField
          item={profil}
          route="/profil"
          fieldKey="location"
        />
      </div>

      <div className="admin-profile__field">
        <label>Tagline</label>
        <EditableField
          item={profil}
          route="/profil"
          fieldKey="tagline"
          type="html"
        />
      </div>

    </div>
  );
}
