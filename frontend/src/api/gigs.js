import { API_URL } from '../config';

export async function getGigs(token) {
  const res = await fetch(`${API_URL}/api/gigs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createGig(token, gigData) {
  const res = await fetch(`${API_URL}/api/gigs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(gigData),
  });
  return res.json();
}

export async function updateGig(token, gigId, gigData) {
  const res = await fetch(`${API_URL}/api/gigs/${gigId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(gigData),
  });
  return res.json();
}
