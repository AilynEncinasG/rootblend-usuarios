// frontend/src/components/dashboard/StreamGrid.tsx
const StreamGrid = () => {
  const streams = [
    { id: 1, title: "Stream 1", description: "Descripción del stream" },
    { id: 2, title: "Stream 2", description: "Otro stream interesante" },
    { id: 3, title: "Stream 3", description: "Contenido en vivo" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {streams.map((stream) => (
          <div
            key={stream.id}
            style={{
              background: "#1e1e2f",
              color: "white",
              padding: "15px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <h3>{stream.title}</h3>
            <p>{stream.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamGrid;