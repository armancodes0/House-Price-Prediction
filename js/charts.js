/**
 * House Price Prediction ML Studio - Interactive Charts & EDA Dashboard
 * Powered by Chart.js with custom dark glass theme
 */

(function () {
  'use strict';

  let charts = {};

  // Custom Chart.js Global Theme Defaults
  function applyChartDefaults() {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Plus Jakarta Sans', -apple-system, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.92)';
    Chart.defaults.plugins.tooltip.titleColor = '#f8fafc';
    Chart.defaults.plugins.tooltip.bodyColor = '#cbd5e1';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.12)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
  }

  // 1. Price Distribution Chart (Slide 5)
  function initPriceDistChart() {
    const ctx = document.getElementById('priceDistCanvas');
    if (!ctx || !window.DATASET_STATS) return;

    const bins = window.DATASET_STATS.price_bins;
    const labels = bins.map(b => b.range);
    const counts = bins.map(b => b.count);

    // Approximate normal KDE curve
    const mean = window.DATASET_STATS.price_summary.mean;
    const std = window.DATASET_STATS.price_summary.std;
    const totalCount = window.DATASET_STATS.total_houses;
    const binWidth = bins[0].max - bins[0].min;

    const kdeValues = bins.map(b => {
      const mid = (b.min + b.max) / 2;
      const z = (mid - mean) / std;
      const pdf = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
      return Math.round(pdf * totalCount * binWidth);
    });

    charts.priceDist = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'line',
            label: 'Normal Density Fit (KDE)',
            data: kdeValues,
            borderColor: '#38bdf8',
            borderWidth: 2.5,
            pointRadius: 0,
            tension: 0.4,
            fill: false
          },
          {
            type: 'bar',
            label: 'Number of Houses',
            data: counts,
            backgroundColor: 'rgba(99, 102, 241, 0.65)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 14 }
          },
          tooltip: {
            callbacks: {
              title: (ctx) => `Price Range: ${ctx[0].label}`,
              label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} houses`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { maxRotation: 45, minRotation: 30 }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            title: { display: true, text: 'Number of Houses' }
          }
        }
      }
    });
  }

  // 2. Area vs House Price Scatter Plot (Slide 5)
  function initAreaScatterChart() {
    const ctx = document.getElementById('areaScatterCanvas');
    if (!ctx || !window.DATASET_STATS) return;

    const scatterData = window.DATASET_STATS.area_price_scatter;
    const locColors = {
      Downtown: 'rgba(99, 102, 241, 0.75)',
      Suburban: 'rgba(6, 182, 212, 0.75)',
      Urban: 'rgba(16, 185, 129, 0.75)',
      Rural: 'rgba(245, 158, 11, 0.75)'
    };

    const datasetsByLoc = {};
    ['Downtown', 'Suburban', 'Urban', 'Rural'].forEach(loc => {
      datasetsByLoc[loc] = {
        label: loc,
        data: [],
        backgroundColor: locColors[loc],
        borderColor: locColors[loc].replace('0.75', '1'),
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });

    scatterData.forEach(item => {
      if (datasetsByLoc[item.Location]) {
        datasetsByLoc[item.Location].data.push({ x: item.Area, y: item.Price });
      }
    });

    // Linear regression trendline
    const trendline = [
      { x: 500, y: Math.round(500 * -0.575 + 508446) },
      { x: 5000, y: Math.round(5000 * -0.575 + 508446) }
    ];

    charts.areaScatter = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          ...Object.values(datasetsByLoc),
          {
            type: 'line',
            label: 'Linear Trendline',
            data: trendline,
            borderColor: 'rgba(239, 68, 68, 0.85)',
            borderWidth: 2,
            borderDash: [6, 6],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: Area ${ctx.raw.x} sq ft ➔ $${ctx.raw.y.toLocaleString('en-US')}`
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            title: { display: true, text: 'House Area (sq ft)' },
            min: 400,
            max: 5200
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            title: { display: true, text: 'Price (USD)' },
            ticks: {
              callback: (val) => '$' + (val / 1000).toFixed(0) + 'k'
            }
          }
        }
      }
    });
  }

  // 3. House Prices by Location (Slide 6)
  function initLocationChart() {
    const ctx = document.getElementById('locationCanvas');
    if (!ctx || !window.DATASET_STATS) return;

    const locStats = window.DATASET_STATS.location_stats;
    const locations = ['Downtown', 'Suburban', 'Urban', 'Rural'];

    const medians = locations.map(l => locStats[l].median);
    const means = locations.map(l => locStats[l].mean);
    const q1s = locations.map(l => locStats[l].q1);
    const q3s = locations.map(l => locStats[l].q3);

    charts.locationChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: locations,
        datasets: [
          {
            label: 'Median Price',
            data: medians,
            backgroundColor: 'rgba(99, 102, 241, 0.75)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: 'Mean (Average) Price',
            data: means,
            backgroundColor: 'rgba(6, 182, 212, 0.75)',
            borderColor: '#06b6d4',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: '75th Percentile (Q3)',
            data: q3s,
            backgroundColor: 'rgba(16, 185, 129, 0.45)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: $${ctx.raw.toLocaleString('en-US')}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            title: { display: true, text: 'Price (USD)' },
            ticks: {
              callback: (val) => '$' + (val / 1000).toFixed(0) + 'k'
            }
          }
        }
      }
    });
  }

  // 4. Correlation Heatmap Table (Slide 6)
  function renderCorrelationHeatmap() {
    const container = document.getElementById('correlationHeatmapWrap');
    if (!container || !window.DATASET_STATS) return;

    const corr = window.DATASET_STATS.correlation;
    const cols = ['Id', 'Area', 'Bedrooms', 'Bathrooms', 'Floors', 'YearBuilt', 'Price'];

    function getCellColor(val) {
      if (val === 1) return { bg: 'rgba(239, 68, 68, 0.85)', color: '#fff' };
      if (val > 0) {
        const intensity = Math.min(Math.abs(val) * 10, 1);
        return { bg: `rgba(239, 68, 68, ${0.15 + intensity * 0.45})`, color: '#f8fafc' };
      } else {
        const intensity = Math.min(Math.abs(val) * 10, 1);
        return { bg: `rgba(59, 130, 246, ${0.15 + intensity * 0.45})`, color: '#f8fafc' };
      }
    }

    let html = '<table class="heatmap-table"><thead><tr><th>Feature</th>';
    cols.forEach(c => { html += `<th>${c}</th>`; });
    html += '</tr></thead><tbody>';

    cols.forEach(row => {
      html += `<tr><th>${row}</th>`;
      cols.forEach(col => {
        const val = corr[row][col];
        const style = getCellColor(val);
        html += `<td class="heatmap-cell" style="background:${style.bg}; color:${style.color};" title="Pearson correlation between ${row} and ${col}: ${val.toFixed(2)}">${val.toFixed(2)}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
  }

  // 5. Actual vs Predicted Comparison Chart (Slide 9)
  function initActualVsPredChart() {
    const ctx = document.getElementById('actualVsPredCanvas');
    if (!ctx || !window.MODEL_DATA) return;

    const points = window.MODEL_DATA.scatter_test_points; // 400 test points
    const lrPoints = points.map(p => ({ x: p.actual, y: p.lr }));
    const dtPoints = points.map(p => ({ x: p.actual, y: p.dt }));

    const diagonal = [
      { x: 50000, y: 50000 },
      { x: 1000000, y: 1000000 }
    ];

    charts.actualVsPred = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Linear Regression Predictions',
            data: lrPoints,
            backgroundColor: 'rgba(129, 140, 248, 0.65)',
            borderColor: '#6366f1',
            pointRadius: 3.5,
            pointHoverRadius: 6
          },
          {
            label: 'Decision Tree Predictions',
            data: dtPoints,
            backgroundColor: 'rgba(249, 115, 22, 0.65)',
            borderColor: '#ea580c',
            pointRadius: 3.5,
            pointHoverRadius: 6
          },
          {
            type: 'line',
            label: 'Perfect Prediction Reference (y = x)',
            data: diagonal,
            borderColor: 'rgba(255, 255, 255, 0.45)',
            borderDash: [6, 6],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: Actual $${ctx.raw.x.toLocaleString()} ➔ Predicted $${ctx.raw.y.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            title: { display: true, text: 'Actual Price in Test Set (USD)' },
            ticks: { callback: (val) => '$' + (val / 1000).toFixed(0) + 'k' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            title: { display: true, text: 'Model Predicted Price (USD)' },
            ticks: { callback: (val) => '$' + (val / 1000).toFixed(0) + 'k' }
          }
        }
      }
    });
  }

  // Setup EDA Tabs
  function setupTabs() {
    const tabBtns = document.querySelectorAll('.tabs-navigation .tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = document.getElementById(btn.getAttribute('data-tab'));
        if (targetTab) {
          targetTab.classList.add('active');
          // Resize chart inside tab
          Object.values(charts).forEach(c => c.resize());
        }
      });
    });
  }

  // Init all charts on page load
  document.addEventListener('DOMContentLoaded', () => {
    applyChartDefaults();
    initPriceDistChart();
    initAreaScatterChart();
    initLocationChart();
    renderCorrelationHeatmap();
    initActualVsPredChart();
    setupTabs();
  });
})();
