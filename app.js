document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('resultsGrid');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const filterFuzzy = document.getElementById('filterFuzzy');
    const filterPot = document.getElementById('filterPot');
    
    let db = []; 

    fetch('rice_cookers.json')
        .then(response => response.json())
        .then(data => {
            db = data;
            document.getElementById('dataTimestamp').textContent = new Date().toLocaleDateString();
            renderGrid(db);
        })
        .catch(err => {
            grid.innerHTML = `<div class="error">Error loading database. Ensure rice_cookers.json exists.</div>`;
            console.error(err);
        });

    function renderGrid(data) {
        grid.innerHTML = '';
        
        if (data.length === 0) {
            grid.innerHTML = '<div class="no-results">No models match your criteria.</div>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const capProv = item.capacity.provenance;
            const capClass = `prov-${capProv}`;
            const capTooltip = capProv === 'inferred' ? 'Inferred from similar models' : 'Explicitly stated by manufacturer';

            const fuzzy = item.technology.has_fuzzy_logic;
            const fuzzyProv = fuzzy.provenance;
            const fuzzyClass = `prov-${fuzzyProv}`;
            const fuzzyLabel = fuzzy.value ? 'Yes' : 'No';

            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <div class="brand">${item.brand}</div>
                        <h2 class="model">${item.model || 'Unknown Model'}</h2>
                    </div>
                </div>
                
                <div class="spec-row">
                    <span>Capacity (Uncooked):</span>
                    <span title="${capTooltip} - ${item.capacity.raw_statement}">
                        <span class="provenance-dot ${capClass}"></span>
                        <strong>${item.capacity.value} Cups</strong>
                    </span>
                </div>

                <div class="spec-row">
                    <span>Fuzzy Logic:</span>
                    <span title="Data source: ${fuzzyProv}">
                        <span class="provenance-dot ${fuzzyClass}"></span>
                        ${fuzzyLabel}
                    </span>
                </div>

                <div class="spec-row">
                    <span>Inner Pot:</span>
                    <span>${formatMaterial(item.construction.inner_pot_material)}</span>
                </div>

                ${renderIssues(item.analysis.aggregated_complaints)}

                <div class="confidence-meter">
                    Data Confidence: <strong>${item.analysis.confidence_score}/5</strong>
                    <br>
                    <small><a href="${item.analysis.source_url}" target="_blank">View Source</a></small>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function formatMaterial(str) {
        if (!str) return 'Unknown';
        return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    function renderIssues(issues) {
        if (!issues || issues.length === 0) return '';
        return `
            <div class="issues-list">
                <strong>Common Gripes:</strong>
                <ul>${issues.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>
        `;
    }

    function updateView() {
        let filtered = db.filter(item => {
            const term = searchInput.value.toLowerCase();
            const matchesText = (item.brand + ' ' + (item.model || '')).toLowerCase().includes(term);
            const matchesFuzzy = filterFuzzy.checked ? item.technology.has_fuzzy_logic.value === true : true;
            const matchesPot = filterPot.checked ? item.construction.is_inner_pot_removable === true : true;
            return matchesText && matchesFuzzy && matchesPot;
        });

        const sortMode = sortSelect.value;
        filtered.sort((a, b) => {
            if (sortMode === 'capacity_asc') return a.capacity.value - b.capacity.value;
            if (sortMode === 'capacity_desc') return b.capacity.value - a.capacity.value;
            if (sortMode === 'confidence_desc') return b.analysis.confidence_score - a.analysis.confidence_score;
            return 0;
        });

        renderGrid(filtered);
    }

    searchInput.addEventListener('input', updateView);
    sortSelect.addEventListener('change', updateView);
    filterFuzzy.addEventListener('change', updateView);
    filterPot.addEventListener('change', updateView);
});