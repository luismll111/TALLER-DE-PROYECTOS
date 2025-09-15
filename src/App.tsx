import React, { useEffect, useState } from "react";
import { z, ZodError } from "zod";

// Esquema de validación con Zod
const docenteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  especialidad: z.string().min(2, "La especialidad debe tener al menos 2 caracteres"),
});

type Docente = {
  id: number;
  nombre: string;
  email: string;
  especialidad: string;
};

export default function App() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [form, setForm] = useState({ nombre: "", email: "", especialidad: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // Cargar docentes
  const fetchDocentes = () => {
    fetch("http://localhost:3000/api/docentes")
      .then((res) => res.json())
      .then(setDocentes);
  };

  useEffect(() => {
    fetchDocentes();
  }, []);

  // Crear o actualizar docente
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

// Validación con Zod
try {
  docenteSchema.parse(form); // intenta validar
} catch (error) {
  if (error instanceof ZodError) {
    console.log("Errores de validación:", error.issues);
    alert(error.issues.map((e) => e.message).join("\n")); // muestra errores al usuario
    return; // detiene el envío si hay errores
  }
}


    // Si pasa la validación, se envían los datos
    if (editId) {
      fetch(`http://localhost:3000/api/docentes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).then(() => {
        fetchDocentes();
        setForm({ nombre: "", email: "", especialidad: "" });
        setEditId(null);
      });
    } else {
      fetch("http://localhost:3000/api/docentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).then(() => {
        fetchDocentes();
        setForm({ nombre: "", email: "", especialidad: "" });
      });
    }
  };

  // Eliminar docente
  const handleDelete = (id: number) => {
    fetch(`http://localhost:3000/api/docentes/${id}`, { method: "DELETE" }).then(
      fetchDocentes
    );
  };

  // Filtrar docentes
  const docentesFiltrados = docentes.filter((d) =>
    d.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ color: "#800020", textAlign: "center", marginBottom: "20px" }}>
          📚 Gestión de Docentes
        </h1>

        {/* Buscador */}
        <input
          type="text"
          placeholder="🔍 Buscar docente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            style={{
              flex: "1",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{
              flex: "1",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
          <input
            type="text"
            placeholder="Especialidad"
            value={form.especialidad}
            onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
            required
            style={{
              flex: "1",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#800020",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {editId ? "Actualizar" : "Agregar"}
          </button>
        </form>

        {/* Lista de docentes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {docentesFiltrados.map((docente) => (
            <div
              key={docente.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                backgroundColor: "#fff",
                boxShadow: "0px 3px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                {docente.nombre}
              </h3>
              <p style={{ margin: "5px 0", color: "#555" }}>📧 {docente.email}</p>
              <p style={{ margin: "5px 0", color: "#555" }}>🎓 {docente.especialidad}</p>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => {
                    setEditId(docente.id);
                    setForm({
                      nombre: docente.nombre,
                      email: docente.email,
                      especialidad: docente.especialidad,
                    });
                  }}
                  style={{
                    marginRight: "8px",
                    background: "orange",
                    color: "white",
                    padding: "6px 10px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(docente.id)}
                  style={{
                    background: "red",
                    color: "white",
                    padding: "6px 10px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
