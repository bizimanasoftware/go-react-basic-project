import { API_URL } from '../config';

export async function getTalents(token) {
  const res = await fetch(`${API_URL}/api/talents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createTalent(token, talentData) {
  const res = await fetch(`${API_URL}/api/talents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(talentData),
  });
  return res.json();
}
