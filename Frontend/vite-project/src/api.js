const API = "http://localhost:8000";
export async function newGame() {
  const res = await fetch(`${API}/new`, { method: "POST" });
  return res.json();
}
export async function getState(id) {
  const res = await fetch(`${API}/state/${id}`);
  return res.json();
}
export async function roll(id) {
  const res = await fetch(`${API}/roll/${id}`, { method: "POST" });
  return res.json();
}