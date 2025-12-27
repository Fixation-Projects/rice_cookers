document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('resultsGrid');

  const searchInput = document.getElementById('searchInput');
  const filterRemovable = document.getElementById('filterRemovable');
  const filterLogic = document.getElementById('filterLogic');
  const filterSelfClean = document.getElementById('filterSelfClean');
  const sortSelect = document.getElementById('sortSelect');

  let db = [];

  // ---------- LOAD DATA ----------
  fetch('./rice_cookers.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load JSON');
      return res.json();
    })
    .then(data => {
      db = Array.isArray(data.items) ? data.items : [];
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

      const cooked = item.capacity?.cooked ?? '—';
      const uncooked = item.capacity?.uncooked ?? '—';

      const removable = item.features?.removable_pot ? 'Yes' : 'No';
      const logic = item.features?.logic_type ?? '—';
      const selfClean = item.features?.self_clean ? 'Yes' : 'No';

      const price =
        item.price?.min != null && item.price?.max != null
          ? `$${item.price.min}–$${item.price.max}`
          : '—';

      const topComplaint = item.analysis?.complaints?.[0] ?? '—';
      const confidence = item.analysis?.confidence ?? '—';

      card.innerHTML = `
        <h3>${item.brand ?? ''} ${item.model ?? ''}</h3>

        <p><strong>Cooked:</strong> ${cooked} cups</p>
        <p><strong>Uncooked:</strong> ${uncooked} cups</p>

        <p><strong>Removable Pot:</strong> ${removable}</p>
        <p><strong>Logic:</strong> ${logic}</p>
        <p><strong>Self Clean:</strong> ${selfClean}</p>

        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Top Complaint:</strong> ${topComplaint}</p>
        <p><strong>Confidence:</strong> ${confidence}</p>
      `;

      grid.appendChild(card);
    });
  }

  // ---------- SORT ----------
  function sortItems(items, mode) {
    const get = (o, path, d = 0) =>
      path.reduce((x, k) => (x && x[k] != null ? x[k] : null), o) ?? d;

    return items.sort((a, b) => {
      switch (mode) {
        case 'price_asc':
          return get(a, ['price', 'min']) - get(b, ['price', 'min']);
        case 'price_desc':
          return get(b, ['price', 'min']) - get(a, ['price', 'min']);
        case 'cooked_desc':
          return get(b, ['capacity', 'cooked']) - get(a, ['capacity', 'cooked']);
        case 'uncooked_desc':
          return get(b, ['capacity', 'uncooked']) - get(a, ['capacity', 'uncooked']);
        case 'confidence_desc':
          return get(b, ['analysis', 'confidence']) - get(a, ['analysis', 'confidence']);
        default:
          return 0;
      }
    });
  }

  // ---------- AND FILTER LOGIC ----------
  function passesFilters(item) {
    const query = searchInput.value.toLowerCase();

    if (query) {
      const text = `${item.brand ?? ''} ${item.model ?? ''}`.toLowerCase();
      if (!text.includes(query)) return false;
    }

    if (filterRemovable.value !== '') {
      const expected = filterRemovable.value === 'true';
      if (item.features?.removable_pot !== expected) return false;
    }

    if (filterLogic.value !== '') {
      if (item.features?.logic_type !== filterLogic.value) return false;
    }

    if (filterSelfClean.value !== '') {
      const expected = filterSelfClean.value === 'true';
      if (item.features?.self_clean !== expected) return false;
    }

    return true; // PASSED ALL FILTERS
  }

  // ---------- UPDATE ----------
  function updateView() {
    let filtered = db.filter(passesFilters);

    if (sortSelect.value) {
      filtered = sortItems(filtered, sortSelect.value);
    }

    renderGrid(filtered);
  }

  // ---------- EVENTS ----------
  [
    searchInput,
    filterRemovable,
    filterLogic,
    filterSelfClean,
    sortSelect
  ].forEach(el => el.addEventListener('change', updateView));

  searchInput.addEventListener('input', updateView);
});
