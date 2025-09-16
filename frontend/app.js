const BASE_URL = 'http://localhost:3000';

const form = document.getElementById('form');
const resultEl = document.getElementById('result');
const tbody = document.getElementById('tbody');


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  resultEl.classList.remove('success', 'error');

  try {
    const res = await fetch(`${BASE_URL}/form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      resultEl.textContent = 'Submission successful!';
      resultEl.classList.add('success');
      form.reset();
    } else {
      resultEl.textContent = `Error: ${data.error.message}`;
      resultEl.classList.add('error');
    }
    await loadData();
  } catch (err) {
    console.error('Form submission error:', err);
    resultEl.textContent = 'Error: ' + err.message;
    resultEl.classList.add('error');
  }
});

async function loadData(search = '') {
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    const res = await fetch(`${BASE_URL}/form?${query.toString()}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || `Server error: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    tbody.innerHTML = '';
    json.data.forEach((row, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${row.name}</td>
        <td>${row.email}</td>
        <td>${row.message}</td>
        <td>${row.createdAt}</td>
      `;
      tbody.appendChild(tr);
    });
    if (json.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No data yet. Submit a form above.</td></tr>';
    }
  } catch (err) {
    console.error('Load data error:', err);
    tbody.innerHTML = `<tr><td colspan="5">Error: ${err.message}</td></tr>`;
  }
}


const filterInput = document.getElementById('filter-input');

filterInput.addEventListener('input', () => {
  const search = filterInput.value;
  loadData(search);
});

loadData();