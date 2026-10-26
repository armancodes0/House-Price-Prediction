/**
 * House Price Prediction ML Studio - Predictor Engine
 * Implements real-time Linear Regression and Decision Tree Regressor in Javascript
 */

(function () {
  'use strict';

  // Feature Presets
  const PRESETS = {
    penthouse: {
      Area: 4200,
      Bedrooms: 5,
      Bathrooms: 4,
      Floors: 3,
      YearBuilt: 2018,
      Location: 'Downtown',
      Condition: 'Excellent',
      Garage: 'Yes'
    },
    suburban: {
      Area: 2500,
      Bedrooms: 3,
      Bathrooms: 2,
      Floors: 2,
      YearBuilt: 1995,
      Location: 'Suburban',
      Condition: 'Good',
      Garage: 'Yes'
    },
    rural: {
      Area: 3200,
      Bedrooms: 4,
      Bathrooms: 3,
      Floors: 1,
      YearBuilt: 1950,
      Location: 'Rural',
      Condition: 'Fair',
      Garage: 'Yes'
    },
    starter: {
      Area: 1100,
      Bedrooms: 2,
      Bathrooms: 1,
      Floors: 1,
      YearBuilt: 2010,
      Location: 'Urban',
      Condition: 'Good',
      Garage: 'No'
    }
  };

  // State
  let currentFeatures = { ...PRESETS.suburban };

  // Linear Regression Prediction
  function predictLinear(features) {
    if (!window.MODEL_DATA || !window.MODEL_DATA.lr) return 500000;
    const lr = window.MODEL_DATA.lr;
    const coefs = lr.coefficients;
    let sum = lr.intercept;

    sum += Number(features.Area) * coefs['Area'];
    sum += Number(features.Bedrooms) * coefs['Bedrooms'];
    sum += Number(features.Bathrooms) * coefs['Bathrooms'];
    sum += Number(features.Floors) * coefs['Floors'];
    sum += Number(features.YearBuilt) * coefs['YearBuilt'];

    if (features.Location === 'Rural') sum += coefs['Location_Rural'];
    else if (features.Location === 'Suburban') sum += coefs['Location_Suburban'];
    else if (features.Location === 'Urban') sum += coefs['Location_Urban'];

    if (features.Condition === 'Fair') sum += coefs['Condition_Fair'];
    else if (features.Condition === 'Good') sum += coefs['Condition_Good'];
    else if (features.Condition === 'Poor') sum += coefs['Condition_Poor'];

    if (features.Garage === 'Yes') sum += coefs['Garage_Yes'];

    return Math.round(sum);
  }

  // Decision Tree Prediction
  function predictDecisionTree(features) {
    if (!window.MODEL_DATA || !window.MODEL_DATA.dt || !window.MODEL_DATA.dt.tree) {
      return { prediction: 500000, path: [] };
    }
    const tree = window.MODEL_DATA.dt.tree;
    const featureList = window.MODEL_DATA.features;

    // Build vector matching trained feature columns
    const vec = new Array(featureList.length).fill(0);
    vec[0] = Number(features.Area);
    vec[1] = Number(features.Bedrooms);
    vec[2] = Number(features.Bathrooms);
    vec[3] = Number(features.Floors);
    vec[4] = Number(features.YearBuilt);
    vec[5] = features.Location === 'Rural' ? 1 : 0;
    vec[6] = features.Location === 'Suburban' ? 1 : 0;
    vec[7] = features.Location === 'Urban' ? 1 : 0;
    vec[8] = features.Condition === 'Fair' ? 1 : 0;
    vec[9] = features.Condition === 'Good' ? 1 : 0;
    vec[10] = features.Condition === 'Poor' ? 1 : 0;
    vec[11] = features.Garage === 'Yes' ? 1 : 0;

    let node = 0;
    const path = [];
    while (tree.children_left[node] !== -1) {
      const fIdx = tree.feature[node];
      const thresh = tree.threshold[node];
      const fname = featureList[fIdx];
      const val = vec[fIdx];
      if (val <= thresh) {
        path.push(`${fname} ≤ ${thresh.toFixed(0)}`);
        node = tree.children_left[node];
      } else {
        path.push(`${fname} > ${thresh.toFixed(0)}`);
        node = tree.children_right[node];
      }
    }

    return {
      prediction: Math.round(tree.value[node]),
      path: path.slice(0, 4) // Show first 4 dominant splits
    };
  }

  // Animate Number Utility
  function animateValue(element, start, end, duration = 400) {
    if (!element) return;
    const startTime = performance.now();
    const diff = end - start;

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = Math.round(start + diff * easeProgress);
      element.textContent = '$' + current.toLocaleString('en-US');
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // Update UI with calculated predictions
  function updatePredictions() {
    const lrPrice = predictLinear(currentFeatures);
    const dtResult = predictDecisionTree(currentFeatures);
    const dtPrice = dtResult.prediction;

    const lrEl = document.getElementById('lrPriceDisplay');
    const dtEl = document.getElementById('dtPriceDisplay');

    if (lrEl) {
      const prevLr = parseInt(lrEl.getAttribute('data-val') || '500000', 10);
      animateValue(lrEl, prevLr, lrPrice);
      lrEl.setAttribute('data-val', lrPrice);
    }

    if (dtEl) {
      const prevDt = parseInt(dtEl.getAttribute('data-val') || '500000', 10);
      animateValue(dtEl, prevDt, dtPrice);
      dtEl.setAttribute('data-val', dtPrice);
    }

    // Variance Box
    const diff = Math.abs(lrPrice - dtPrice);
    const diffPct = ((diff / Math.max(lrPrice, dtPrice)) * 100).toFixed(1);
    const varEl = document.getElementById('modelVarianceDisplay');
    if (varEl) {
      varEl.textContent = `Δ $${diff.toLocaleString('en-US')} (${diffPct}%)`;
    }

    // Decision Path Preview
    const pathEl = document.getElementById('treePathPreview');
    if (pathEl) {
      pathEl.textContent = dtResult.path.length
        ? 'Path: ' + dtResult.path.join(' ➔ ') + ' ➔ Leaf'
        : 'Direct leaf match';
    }

    // Formula Breakdown
    const formulaEl = document.getElementById('lrFormulaPreview');
    if (formulaEl && window.MODEL_DATA) {
      const c = window.MODEL_DATA.lr.coefficients;
      const locTerm = currentFeatures.Location === 'Downtown' ? 0 : c['Location_' + currentFeatures.Location];
      formulaEl.textContent = `y = 278,521 + (${c.Area.toFixed(2)} × ${currentFeatures.Area}) + (${c.Floors.toFixed(0)} × ${currentFeatures.Floors}) + (${c.YearBuilt.toFixed(1)} × ${currentFeatures.YearBuilt}) ...`;
    }
  }

  // Sync inputs to state
  function syncInputs() {
    // Area
    const areaSlider = document.getElementById('areaSlider');
    const areaVal = document.getElementById('areaValDisplay');
    if (areaSlider && areaVal) {
      areaSlider.value = currentFeatures.Area;
      areaVal.textContent = Number(currentFeatures.Area).toLocaleString('en-US') + ' sq ft';
    }

    // Year Built
    const yearSlider = document.getElementById('yearSlider');
    const yearVal = document.getElementById('yearValDisplay');
    if (yearSlider && yearVal) {
      yearSlider.value = currentFeatures.YearBuilt;
      const age = new Date().getFullYear() - currentFeatures.YearBuilt;
      yearVal.textContent = `${currentFeatures.YearBuilt} (${age} yrs old)`;
    }

    // Bedrooms
    document.querySelectorAll('.bedrooms-group .segment-btn').forEach(btn => {
      btn.classList.toggle('active', Number(btn.getAttribute('data-val')) === Number(currentFeatures.Bedrooms));
    });

    // Bathrooms
    document.querySelectorAll('.bathrooms-group .segment-btn').forEach(btn => {
      btn.classList.toggle('active', Number(btn.getAttribute('data-val')) === Number(currentFeatures.Bathrooms));
    });

    // Floors
    document.querySelectorAll('.floors-group .segment-btn').forEach(btn => {
      btn.classList.toggle('active', Number(btn.getAttribute('data-val')) === Number(currentFeatures.Floors));
    });

    // Location
    document.querySelectorAll('input[name="locationRadio"]').forEach(radio => {
      radio.checked = (radio.value === currentFeatures.Location);
    });

    // Condition
    document.querySelectorAll('input[name="conditionRadio"]').forEach(radio => {
      radio.checked = (radio.value === currentFeatures.Condition);
    });

    // Garage
    const garageCheckbox = document.getElementById('garageCheckbox');
    if (garageCheckbox) {
      garageCheckbox.checked = (currentFeatures.Garage === 'Yes');
    }

    updatePredictions();
  }

  // Event Listeners initialization
  function initPredictorListeners() {
    // Area Slider
    const areaSlider = document.getElementById('areaSlider');
    if (areaSlider) {
      areaSlider.addEventListener('input', e => {
        currentFeatures.Area = Number(e.target.value);
        document.getElementById('areaValDisplay').textContent = currentFeatures.Area.toLocaleString('en-US') + ' sq ft';
        updatePredictions();
      });
    }

    // Year Slider
    const yearSlider = document.getElementById('yearSlider');
    if (yearSlider) {
      yearSlider.addEventListener('input', e => {
        currentFeatures.YearBuilt = Number(e.target.value);
        const age = new Date().getFullYear() - currentFeatures.YearBuilt;
        document.getElementById('yearValDisplay').textContent = `${currentFeatures.YearBuilt} (${age} yrs old)`;
        updatePredictions();
      });
    }

    // Segmented Buttons (Bedrooms, Bathrooms, Floors)
    ['bedrooms-group', 'bathrooms-group', 'floors-group'].forEach(groupClass => {
      const container = document.querySelector('.' + groupClass);
      if (container) {
        container.addEventListener('click', e => {
          const btn = e.target.closest('.segment-btn');
          if (!btn) return;
          const val = Number(btn.getAttribute('data-val'));
          if (groupClass.includes('bedrooms')) currentFeatures.Bedrooms = val;
          if (groupClass.includes('bathrooms')) currentFeatures.Bathrooms = val;
          if (groupClass.includes('floors')) currentFeatures.Floors = val;
          syncInputs();
        });
      }
    });

    // Location Radios
    document.querySelectorAll('input[name="locationRadio"]').forEach(radio => {
      radio.addEventListener('change', e => {
        currentFeatures.Location = e.target.value;
        updatePredictions();
      });
    });

    // Condition Radios
    document.querySelectorAll('input[name="conditionRadio"]').forEach(radio => {
      radio.addEventListener('change', e => {
        currentFeatures.Condition = e.target.value;
        updatePredictions();
      });
    });

    // Garage Toggle
    const garageCheckbox = document.getElementById('garageCheckbox');
    if (garageCheckbox) {
      garageCheckbox.addEventListener('change', e => {
        currentFeatures.Garage = e.target.checked ? 'Yes' : 'No';
        updatePredictions();
      });
    }

    // Preset buttons
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const presetKey = chip.getAttribute('data-preset');
        if (PRESETS[presetKey]) {
          currentFeatures = { ...PRESETS[presetKey] };
          syncInputs();
        }
      });
    });

    // Initial sync
    syncInputs();
  }

  // Public API to load house from table or sample
  window.loadHouseIntoPredictor = function (house) {
    currentFeatures = {
      Area: Number(house.Area),
      Bedrooms: Number(house.Bedrooms),
      Bathrooms: Number(house.Bathrooms),
      Floors: Number(house.Floors),
      YearBuilt: Number(house.YearBuilt),
      Location: house.Location,
      Condition: house.Condition,
      Garage: house.Garage
    };
    syncInputs();

    // Scroll to predictor studio smoothly
    const predictorSection = document.getElementById('predictor');
    if (predictorSection) {
      predictorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Expose methods
  window.PredictorEngine = {
    init: initPredictorListeners,
    predictLinear,
    predictDecisionTree,
    getCurrentFeatures: () => ({ ...currentFeatures })
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.PredictorEngine.init();
  });
})();
