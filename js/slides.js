/**
 * House Price Prediction ML Studio - Presentation Slide Deck Interactive Engine
 * Renders all 10 slides from the Amity University Jharkhand Colab Project
 */

(function () {
  'use strict';

  const SLIDES = [
    {
      id: 1,
      title: "House Price Prediction using Machine Learning",
      subtitle: "A supervised learning project built in Google Colab",
      institution: "AMITY UNIVERSITY JHARKHAND",
      type: "cover",
      team: [
        { name: "MD Arman Alam", roll: "A357175125020" },
        { name: "Nawed Ahmed", roll: "A357175125009" }
      ],
      takeaways: "Official project submission exploring regression modeling in Python & Scikit-Learn."
    },
    {
      id: 2,
      title: "What is Supervised Learning?",
      subtitle: "The model learns from examples where the correct answer is already known.",
      type: "concept",
      steps: [
        { num: "Step 1", title: "Input Features", desc: "House characteristics: Area, Bedrooms, Bathrooms, Location, Year Built" },
        { num: "Step 2", title: "Model Training", desc: "ML Model learns mathematical relationship between input features & actual target label" },
        { num: "Step 3", title: "Predicted Output", desc: "Estimates fair market value for new or unseen houses: Training examples ➔ Learned relationship ➔ New prediction" }
      ],
      takeaways: "Supervised learning relies on labeled training pairs (X, y) to map inputs to continuous numerical targets."
    },
    {
      id: 3,
      title: "Project Objective",
      subtitle: "Use house characteristics to estimate the price of an unseen house.",
      type: "objective",
      question: "“Given the features of a house, can a machine-learning model predict its price?”",
      specs: [
        { label: "NUMERICAL INPUTS", value: "Area (sq ft), Bedrooms, Bathrooms, Floors, Year Built" },
        { label: "CATEGORICAL INPUTS", value: "Location (Downtown, Suburban, Urban, Rural), Condition (Poor, Fair, Good, Excellent), Garage (Yes, No)" },
        { label: "TARGET VARIABLE", value: "Price (continuous USD value, ranging from $50,000 to $1,000,000)" }
      ],
      takeaways: "Formulating real estate pricing as a multi-feature supervised regression problem."
    },
    {
      id: 4,
      title: "Dataset Overview",
      subtitle: "The uploaded CSV contains 2,000 house records and 10 columns.",
      type: "dataset_stat",
      stats: [
        { num: "2,000", label: "Rows / Houses" },
        { num: "10", label: "Original Columns" },
        { num: "0", label: "Missing Values" }
      ],
      columns: [
        { name: "Area", type: "Numeric" },
        { name: "Bedrooms", type: "Numeric" },
        { name: "Bathrooms", type: "Numeric" },
        { name: "Floors", type: "Numeric" },
        { name: "YearBuilt", type: "Numeric" },
        { name: "Location", type: "Categorical" },
        { name: "Condition", type: "Categorical" },
        { name: "Garage", type: "Categorical" },
        { name: "Price", type: "Target Label" }
      ],
      note: "Id was dropped during preprocessing because it is purely an identifier and contains no predictive signal."
    },
    {
      id: 5,
      title: "EDA — Exploring the Data",
      subtitle: "Exploratory data analysis helps us understand patterns before training the models.",
      type: "eda_visuals",
      chartImg1: "assets/slide_5_0.png",
      chartCaption1: "Distribution of House Prices (Histogram + Normal density curve)",
      chartImg2: "assets/slide_5_1.png",
      chartCaption2: "Area vs House Price (Scatter plot across 500 - 5,000 sq ft)",
      inspectList: ["Price distribution across the dataset", "Relationship between square footage and house price", "Unusual patterns, clustering, and spread"]
    },
    {
      id: 6,
      title: "EDA — Categorical Features & Correlation",
      subtitle: "Different views reveal which features are worth considering as model inputs.",
      type: "eda_visuals",
      chartImg1: "assets/slide_6_0.png",
      chartCaption1: "House Prices by Location (Downtown, Suburban, Urban, Rural box plots)",
      chartImg2: "assets/slide_6_1.png",
      chartCaption2: "Correlation Heatmap among numerical columns",
      inspectList: ["Box plots compare distribution of prices across geographic locations", "Correlation shows linear Pearson coefficients between numeric features and price"]
    },
    {
      id: 7,
      title: "Machine Learning Workflow",
      subtitle: "The project follows a simple supervised-learning pipeline.",
      type: "pipeline",
      steps: [
        { step: 1, name: "Load", desc: "CSV dataset (2,000 records)" },
        { step: 2, name: "Explore", desc: "Shape, info, summary stats, EDA" },
        { step: 3, name: "Prepare", desc: "Drop Id + One-Hot encode text" },
        { step: 4, name: "Split", desc: "Train 80% / Test 20% (random_state=42)" },
        { step: 5, name: "Train", desc: "2 regression models (LR & DT)" },
        { step: 6, name: "Predict", desc: "Estimate unseen prices on test set" }
      ],
      takeaways: "Train data teaches the model; test data checks how it behaves on unseen houses."
    },
    {
      id: 8,
      title: "Models Used",
      subtitle: "Two simple regression algorithms were used so the project stays easy to understand.",
      type: "models_overview",
      model1: {
        title: "Linear Regression",
        idea: "Features ➔ Learned Coefficients ➔ Predicted Price",
        desc: "Finds a mathematical hyperplane relationship between input features and the target price. Good for seeing how a simple parametric linear model approaches prediction."
      },
      model2: {
        title: "Decision Tree Regressor",
        idea: "Question ➔ Branch ➔ Branch ➔ Predicted Price",
        desc: "Recursively splits the data into smaller groups using feature-based thresholds and predicts average value in each leaf node. Useful when relationships are non-linear."
      }
    },
    {
      id: 9,
      title: "Prediction Results",
      subtitle: "The final stage compares actual test-set prices with model predictions visually.",
      type: "eda_visuals",
      chartImg1: "assets/slide_9_0.png",
      chartCaption1: "Linear Regression: Actual vs Predicted (points hover around dataset mean)",
      chartImg2: "assets/slide_9_1.png",
      chartCaption2: "Decision Tree: Actual vs Predicted (discrete leaf scatter)",
      sampleTable: [
        { actual: "514,764", lr: "521,988", dt: "302,051" },
        { actual: "694,256", lr: "549,119", dt: "764,618" },
        { actual: "66,375", lr: "487,101", dt: "939,217" },
        { actual: "650,243", lr: "539,753", dt: "485,485" },
        { actual: "223,285", lr: "553,242", dt: "577,561" }
      ]
    },
    {
      id: 10,
      title: "Conclusion & Future Scope",
      subtitle: "A small project can still demonstrate the complete supervised-learning workflow.",
      type: "conclusion",
      bullets: [
        "How supervised learning uses labeled examples to learn patterns",
        "How a regression problem predicts continuous numerical values",
        "How EDA helps us understand the dataset distributions and correlations",
        "How two ML models (Linear Regression vs Decision Tree) produce predictions with different trade-offs",
        "How train/test splitting separates learning from testing to prevent data leakage"
      ],
      thankYou: "THANK YOU — AMITY UNIVERSITY JHARKHAND"
    }
  ];

  let currentSlideIndex = 0;

  function renderSlide(index) {
    currentSlideIndex = Math.max(0, Math.min(index, SLIDES.length - 1));
    const slide = SLIDES[currentSlideIndex];
    const stage = document.getElementById('slideContentCanvas');
    const counterEl = document.getElementById('slideCounterDisplay');

    if (counterEl) counterEl.textContent = `Slide ${slide.id} of ${SLIDES.length}`;

    // Highlight thumbnail
    document.querySelectorAll('.slide-thumb').forEach((thumb, idx) => {
      thumb.classList.toggle('active', idx === currentSlideIndex);
    });

    if (!stage) return;

    let html = '';

    if (slide.type === 'cover') {
      html = `
        <div style="text-align:center; max-width:700px; margin:0 auto;">
          <div style="display:inline-flex; align-items:center; gap:0.6rem; padding:0.4rem 1rem; background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.3); border-radius:var(--radius-pill); font-size:0.85rem; font-weight:700; color:#a5b4fc; margin-bottom:1.25rem;">
            🏛️ ${slide.institution}
          </div>
          <h2 style="font-family:var(--font-display); font-size: clamp(1.8rem, 3.5vw, 2.75rem); font-weight:800; line-height:1.15; margin-bottom:0.75rem;">
            ${slide.title}
          </h2>
          <p style="font-size:1.05rem; color:var(--text-muted); margin-bottom:2rem;">${slide.subtitle}</p>
          <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:0.75rem; text-align:left; background:rgba(15,23,42,0.8); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            ${slide.team.map(m => `
              <div style="display:flex; flex-direction:column; background:rgba(255,255,255,0.03); padding:0.6rem 0.85rem; border-radius:var(--radius-sm);">
                <span style="font-weight:700; color:#fff;">${m.name}</span>
                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-dim);">Enrollment: ${m.roll}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (slide.type === 'concept') {
      html = `
        <div style="max-width:800px; margin:0 auto; width:100%;">
          <h2 style="font-family:var(--font-display); font-size:1.75rem; font-weight:800; margin-bottom:0.35rem;">${slide.title}</h2>
          <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:1.75rem;">${slide.subtitle}</p>
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1rem;">
            ${slide.steps.map(s => `
              <div style="background:rgba(15,23,42,0.85); border:1px solid var(--border-subtle); padding:1.25rem; border-radius:var(--radius-md);">
                <div style="display:inline-block; font-size:0.75rem; font-weight:700; color:var(--accent-secondary); text-transform:uppercase; margin-bottom:0.5rem;">${s.num}</div>
                <h4 style="font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:0.5rem;">${s.title}</h4>
                <p style="font-size:0.82rem; color:var(--text-muted); line-height:1.5;">${s.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (slide.type === 'eda_visuals') {
      html = `
        <div style="max-width:850px; margin:0 auto; width:100%;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:1rem;">
            <div>
              <h2 style="font-family:var(--font-display); font-size:1.6rem; font-weight:800;">${slide.title}</h2>
              <p style="font-size:0.88rem; color:var(--text-muted);">${slide.subtitle}</p>
            </div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.25rem;">
            <div style="background:rgba(15,23,42,0.85); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.75rem; text-align:center;">
              <img src="${slide.chartImg1}" style="width:100%; max-height:220px; object-fit:contain; border-radius:var(--radius-xs); margin-bottom:0.5rem;" alt="Chart 1" />
              <div style="font-size:0.78rem; font-weight:600; color:var(--text-muted);">${slide.chartCaption1}</div>
            </div>
            <div style="background:rgba(15,23,42,0.85); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.75rem; text-align:center;">
              <img src="${slide.chartImg2}" style="width:100%; max-height:220px; object-fit:contain; border-radius:var(--radius-xs); margin-bottom:0.5rem;" alt="Chart 2" />
              <div style="font-size:0.78rem; font-weight:600; color:var(--text-muted);">${slide.chartCaption2}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      // General fallthrough
      html = `
        <div style="max-width:760px; margin:0 auto; width:100%;">
          <h2 style="font-family:var(--font-display); font-size:1.75rem; font-weight:800; margin-bottom:0.35rem;">${slide.title}</h2>
          <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:1.5rem;">${slide.subtitle}</p>
          ${slide.bullets ? `
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.75rem;">
              ${slide.bullets.map(b => `
                <li style="display:flex; align-items:flex-start; gap:0.6rem; font-size:0.92rem; color:#e2e8f0;">
                  <span style="color:var(--accent-secondary); font-weight:700;">✓</span> ${b}
                </li>
              `).join('')}
            </ul>
          ` : ''}
          ${slide.thankYou ? `
            <div style="margin-top:2rem; text-align:center; padding:1.5rem; background:rgba(99,102,241,0.1); border-radius:var(--radius-md); border:1px dashed var(--border-accent);">
              <h3 style="font-family:var(--font-display); font-size:1.6rem; font-weight:800; color:#fff;">${slide.thankYou}</h3>
            </div>
          ` : ''}
        </div>
      `;
    }

    stage.innerHTML = html;
  }

  function initSlides() {
    const thumbsStrip = document.getElementById('slideThumbsStrip');
    if (thumbsStrip) {
      thumbsStrip.innerHTML = SLIDES.map((s, idx) => `
        <div class="slide-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
          Slide ${s.id}
        </div>
      `).join('');

      thumbsStrip.addEventListener('click', e => {
        const thumb = e.target.closest('.slide-thumb');
        if (!thumb) return;
        const idx = Number(thumb.getAttribute('data-idx'));
        renderSlide(idx);
      });
    }

    document.getElementById('prevSlideBtn')?.addEventListener('click', () => {
      renderSlide(currentSlideIndex - 1);
    });

    document.getElementById('nextSlideBtn')?.addEventListener('click', () => {
      renderSlide(currentSlideIndex + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
      // Check if slides section is in view
      const slidesSec = document.getElementById('presentation');
      if (!slidesSec) return;
      const rect = slidesSec.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') renderSlide(currentSlideIndex - 1);
      if (e.key === 'ArrowRight') renderSlide(currentSlideIndex + 1);
    });

    renderSlide(0);
  }

  document.addEventListener('DOMContentLoaded', initSlides);
})();
