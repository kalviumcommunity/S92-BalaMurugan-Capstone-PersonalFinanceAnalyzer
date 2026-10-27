import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function UploadTransactions() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: "error", message: "Please choose a CSV file first." });
      return;
    }
    const formData = new FormData();
    formData.append("file", file); // must match upload.single("file") on the server

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });
      setErrors([]);
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setStatus({
        type: "success",
        message: `Imported ${data.imported} transactions, skipped ${data.skipped}.`,
      });
      setErrors(data.errors);
      setFile(null);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 420, padding: 24, borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,.2)" }}
    >
      <h2>Import Transactions (CSV)</h2>
      <label htmlFor="csv-file">Columns: type, category, amount, date, note</label>
      <input id="csv-file" type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit" disabled={loading} style={{ display: "block", marginTop: 12 }}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {status.message && (
        <p role="status" style={{ color: status.type === "error" ? "crimson" : "green" }}>
          {status.message}
        </p>
      )}
      {errors.length > 0 && (
        <ul style={{ color: "crimson" }}>
          {errors.map((e) => (
            <li key={e.row}>Row {e.row}: {e.reason}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
