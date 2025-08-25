"use client";

export default function Loader({ text = "Loading..." }) {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p>{text}</p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(120deg, #af191b, #2c2c2c)",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid rgba(255, 255, 255, 0.3)",
    borderTop: "6px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px",
  },
};
