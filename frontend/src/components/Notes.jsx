import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getNotes, createNote, updateNote, deleteNote } from "../services/api";

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR") + " " + d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
};

const Notes = () => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNotes().then(setNotes).catch(console.error);
  }, []);

  const sorted = [...notes].sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? tb - ta : ta - tb;
  });

  const openCreate = () => {
    setEditId(null);
    setFormTitle("");
    setFormContent("");
    setShowForm(true);
  };

  const openEdit = (note) => {
    setEditId(note._id);
    setFormTitle(note.title);
    setFormContent(note.content);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setFormTitle("");
    setFormContent("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;
    setSaving(true);
    try {
      if (editId) {
        const updated = await updateNote(editId, formTitle.trim(), formContent.trim());
        setNotes((prev) => prev.map((n) => (n._id === editId ? updated : n)));
      } else {
        const created = await createNote(formTitle.trim(), formContent.trim());
        setNotes((prev) => [created, ...prev]);
      }
      handleCancel();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("noteDeleteConfirm"))) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notes-page">
      <div className="card notes-header-card">
        <div className="notes-header">
          <div className="title">📝 {t("notesTitle")}</div>
          <div className="notes-header-actions">
            <div className="notes-sort-toggle">
              <button
                className={`notes-sort-btn ${sortOrder === "newest" ? "active" : ""}`}
                onClick={() => setSortOrder("newest")}
              >
                ↓ {t("noteSortNewest")}
              </button>
              <button
                className={`notes-sort-btn ${sortOrder === "oldest" ? "active" : ""}`}
                onClick={() => setSortOrder("oldest")}
              >
                ↑ {t("noteSortOldest")}
              </button>
            </div>
            {!showForm && (
              <button className="button notes-add-btn" onClick={openCreate}>
                + {t("noteAdd")}
              </button>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card notes-form-card">
          <form onSubmit={handleSubmit} className="notes-form">
            <input
              className="input notes-title-input"
              type="text"
              placeholder={t("noteNewTitle")}
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              maxLength={200}
              autoFocus
            />
            <textarea
              className="notes-content-input"
              placeholder={t("noteNewContent")}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              rows={5}
            />
            <div className="notes-form-actions">
              <button
                type="button"
                className="button secondary"
                onClick={handleCancel}
              >
                {t("noteCancel")}
              </button>
              <button
                type="submit"
                className="button"
                disabled={saving || !formTitle.trim() || !formContent.trim()}
              >
                {saving ? t("saving") : t("noteSave")}
              </button>
            </div>
          </form>
        </div>
      )}

      {sorted.length === 0 && !showForm ? (
        <div className="card notes-empty">{t("noteEmpty")}</div>
      ) : (
        <div className="notes-list">
          {sorted.map((note) => (
            <div key={note._id} className="card note-card">
              <div className="note-card-header">
                <div className="note-title">{note.title}</div>
                <div className="note-actions">
                  <button
                    className="note-action-btn note-edit-btn"
                    onClick={() => openEdit(note)}
                  >
                    ✏️ {t("noteEdit")}
                  </button>
                  <button
                    className="note-action-btn note-delete-btn"
                    onClick={() => handleDelete(note._id)}
                  >
                    🗑️ {t("noteDelete")}
                  </button>
                </div>
              </div>
              <div className="note-content">{note.content}</div>
              <div className="note-meta">
                <span>🕐 {formatDate(note.createdAt)}</span>
                {note.updatedAt !== note.createdAt && (
                  <span className="note-updated">· {t("noteUpdatedAt")}: {formatDate(note.updatedAt)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
