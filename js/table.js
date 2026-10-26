/**
 * House Price Prediction ML Studio - Dataset Explorer Table
 * Fast client-side filtering, sorting, pagination for 2,000 records
 */

(function () {
  'use strict';

  let rawData = [];
  let filteredData = [];
  let currentPage = 1;
  let pageSize = 20;
  let sortColumn = 'Id';
  let sortDirection = 'asc';

  // Format currency
  function formatMoney(amount) {
    return '$' + Number(amount).toLocaleString('en-US');
  }

  // Location Badge color
  function getLocationBadge(loc) {
    const colors = {
      Downtown: 'background:rgba(99,102,241,0.15); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3);',
      Suburban: 'background:rgba(6,182,212,0.15); color:#67e8f9; border:1px solid rgba(6,182,212,0.3);',
      Urban: 'background:rgba(16,185,129,0.15); color:#6ee7b7; border:1px solid rgba(16,185,129,0.3);',
      Rural: 'background:rgba(245,158,11,0.15); color:#fcd34d; border:1px solid rgba(245,158,11,0.3);'
    };
    return `<span class="badge" style="${colors[loc] || ''}">${loc}</span>`;
  }

  // Condition Badge
  function getConditionBadge(cond) {
    const colors = {
      Excellent: 'background:rgba(16,185,129,0.15); color:#6ee7b7; border:1px solid rgba(16,185,129,0.3);',
      Good: 'background:rgba(59,130,246,0.15); color:#93c5fd; border:1px solid rgba(59,130,246,0.3);',
      Fair: 'background:rgba(245,158,11,0.15); color:#fcd34d; border:1px solid rgba(245,158,11,0.3);',
      Poor: 'background:rgba(239,68,68,0.15); color:#fca5a5; border:1px solid rgba(239,68,68,0.3);'
    };
    return `<span class="badge" style="${colors[cond] || ''}">${cond}</span>`;
  }

  // Garage Badge
  function getGarageBadge(garage) {
    if (garage === 'Yes') {
      return `<span class="badge" style="background:rgba(16,185,129,0.12); color:#34d399;">✓ Yes</span>`;
    }
    return `<span class="badge" style="background:rgba(255,255,255,0.05); color:#94a3b8;">✕ No</span>`;
  }

  function applyFilters() {
    const searchVal = (document.getElementById('tableSearchInput')?.value || '').toLowerCase().trim();
    const locVal = document.getElementById('filterLocation')?.value || 'all';
    const condVal = document.getElementById('filterCondition')?.value || 'all';
    const garageVal = document.getElementById('filterGarage')?.value || 'all';

    filteredData = rawData.filter(item => {
      // Search
      if (searchVal) {
        const matchesId = item.Id.toString().includes(searchVal);
        const matchesArea = item.Area.toString().includes(searchVal);
        const matchesLoc = item.Location.toLowerCase().includes(searchVal);
        const matchesPrice = item.Price.toString().includes(searchVal);
        if (!matchesId && !matchesArea && !matchesLoc && !matchesPrice) return false;
      }

      // Location
      if (locVal !== 'all' && item.Location !== locVal) return false;

      // Condition
      if (condVal !== 'all' && item.Condition !== condVal) return false;

      // Garage
      if (garageVal !== 'all' && item.Garage !== garageVal) return false;

      return true;
    });

    // Sorting
    filteredData.sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];
      if (typeof valA === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    currentPage = 1;
    renderTable();
  }

  function renderTable() {
    const tbody = document.getElementById('datasetTableBody');
    const countEl = document.getElementById('tableCountDisplay');
    const pageNumEl = document.getElementById('currentPageDisplay');
    const totalPagesEl = document.getElementById('totalPagesDisplay');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');

    if (!tbody) return;

    const totalRows = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

    if (countEl) countEl.textContent = `Showing ${Math.min(totalRows, (currentPage - 1) * pageSize + 1)} - ${Math.min(totalRows, currentPage * pageSize)} of ${totalRows.toLocaleString()} houses`;
    if (pageNumEl) pageNumEl.textContent = currentPage;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;

    if (prevBtn) prevBtn.disabled = (currentPage <= 1);
    if (nextBtn) nextBtn.disabled = (currentPage >= totalPages);

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 2.5rem; color: var(--text-dim);">No houses match your current filter criteria.</td></tr>`;
      return;
    }

    let rowsHtml = '';
    pageData.forEach(item => {
      rowsHtml += `
        <tr>
          <td style="font-family:var(--font-mono); font-weight:700; color:var(--text-dim);">${item.Id}</td>
          <td style="font-family:var(--font-mono); font-weight:600;">${item.Area.toLocaleString()} <span style="font-size:0.75rem; color:var(--text-dim);">sq ft</span></td>
          <td>${item.Bedrooms}</td>
          <td>${item.Bathrooms}</td>
          <td>${item.Floors}</td>
          <td style="font-family:var(--font-mono);">${item.YearBuilt}</td>
          <td>${getLocationBadge(item.Location)}</td>
          <td>${getConditionBadge(item.Condition)}</td>
          <td>${getGarageBadge(item.Garage)}</td>
          <td style="font-family:var(--font-mono); font-weight:700; color:#fff;">${formatMoney(item.Price)}</td>
          <td style="text-align:right;">
            <button class="btn-load-sample" onclick="window.loadHouseIntoPredictor(${JSON.stringify(item).replace(/"/g, '&quot;')})" title="Load these parameters into the live ML predictor">
              ⚡ Test in ML
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHtml;
  }

  // Export filtered dataset as CSV
  function exportFilteredCSV() {
    if (filteredData.length === 0) return;
    const headers = ['Id', 'Area', 'Bedrooms', 'Bathrooms', 'Floors', 'YearBuilt', 'Location', 'Condition', 'Garage', 'Price'];
    const csvRows = [headers.join(',')];

    filteredData.forEach(row => {
      const values = headers.map(h => row[h]);
      csvRows.push(values.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `house_prices_filtered_${filteredData.length}_rows.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function initTable() {
    rawData = window.DATASET_FULL || [];
    filteredData = [...rawData];

    // Inputs
    document.getElementById('tableSearchInput')?.addEventListener('input', applyFilters);
    document.getElementById('filterLocation')?.addEventListener('change', applyFilters);
    document.getElementById('filterCondition')?.addEventListener('change', applyFilters);
    document.getElementById('filterGarage')?.addEventListener('change', applyFilters);

    // Page size
    document.getElementById('pageSizeSelect')?.addEventListener('change', e => {
      pageSize = Number(e.target.value);
      currentPage = 1;
      renderTable();
    });

    // Pagination
    document.getElementById('prevPageBtn')?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });

    document.getElementById('nextPageBtn')?.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredData.length / pageSize);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });

    // Column Header Sorting
    document.querySelectorAll('.dataset-table th[data-col]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-col');
        if (sortColumn === col) {
          sortDirection = (sortDirection === 'asc') ? 'desc' : 'asc';
        } else {
          sortColumn = col;
          sortDirection = 'asc';
        }
        applyFilters();
      });
    });

    // Export CSV
    document.getElementById('btnExportCSV')?.addEventListener('click', exportFilteredCSV);

    renderTable();
  }

  document.addEventListener('DOMContentLoaded', initTable);
})();
