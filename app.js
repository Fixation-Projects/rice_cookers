document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('resultsGrid');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const filterFuzzy = document.getElementById('filterFuzzy');
  const filterPot = document.getElementById('filterPot');

  let db = [];

  // ---------- LOAD DATA ----------
  fetch('./rice_cookers.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load JSON: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // IMPORTANT: data is now an object, not an array
      db = Array.isArray(data.items) ? data.items : [];

      const ts = document.getElementById('dataTimestamp');
      if (ts) {
        ts.textContent = new Date().toLocaleDateString();
      }

      updateView();
    })
    .catch(err => {
      console.error(err);
      grid.innerHTML = `<p class="error">Failed to load data.</p>`;
    });

  // ---------- RENDER ----------
  function renderGrid(items) {
    grid.innerHTML = '';

    if (!items.length) {
      grid.innerHTML = `<p>No matching rice cookers.</p>`;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      const capacity = item.capacity?.value ?? 'Unknown';
      const capacityUnit = item.capacity?.unit ?? '';
      const fuzzy = item.features?.fuzzy_logic ? 'Yes' : 'No';
      const removablePot = item.features?.removable_pot ? 'Yes' : 'No';
      const confidence = item.analysis?.confidence ?? '—';

      card.innerHTML = `
        <h3>${item.brand ?? ''} ${item.model ?? ''}</h3>
        <p><strong>Capacity:</strong> ${capacity} ${capacityUnit}</p>
        <p><strong>Fuzzy Logic:</strong> ${fuzzy}</p>
        <p><strong>Removable Pot:</strong> ${removablePot}</p>
        <p><strong>Confidence:</strong> ${confidence}</p>
      `;

      grid.appendChild(card);
    });
  }

  // ---------- FILTER + SORT ----------
  function updateView() {
    const query = searchInput.value.toLowerCase();
    const sortMode = sortSelect.value;

    let filtered = db.filter(item => {
      const text =
        `${item.brand ?? ''} ${item.model ?? ''}`.toLowerCase();

      if (query && !text.includes(query)) return false;
      if (filterFuzzy.checked && !item.features?.fuzzy_logic) return false;
      if (filterPot.checked && !item.features?.removable_pot) return false;

      return true;
    });

    filtered.sort((a, b) => {
      const capA = a.capacity?.value ?? 0;
      const capB = b.capacity?.value ?? 0;

      const confA = a.analysis?.confidence ?? 0;
      const confB = b.analysis?.confidence ?? 0;

      if (sortMode === 'capacity_asc') return capA - capB;
      if (sortMode === 'capacity_desc') return capB - capA;
      if (sortMode === 'confidence_desc') return confB - confA;
      return 0;
    });

    renderGrid(filtered);
  }

  // ---------- EVENTS ----------
  searchInput.addEventListener('input', updateView);
  sortSelect.addEventListener('change', updateView);
  filterFuzzy.addEventListener('change', updateView);
  filterPot.addEventListener('change', updateView);
});
