# 🏡 House Price Prediction using Machine Learning

[![Amity University Jharkhand](https://img.shields.io/badge/Amity_University-Jharkhand-orange.svg)](https://amity.edu/ranchi/)
[![Machine Learning](https://img.shields.io/badge/ML-Supervised_Learning-blue.svg)](https://scikit-learn.org/)
[![Google Colab](https://img.shields.io/badge/Colab-Notebook-F9AB00?logo=googlecolab&logoColor=white)](https://colab.research.google.com/drive/10GfFtzfsD2QnG5EV956oiMoeLkzaBmcG?usp=sharing)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An interactive, end-to-end Machine Learning web application and laboratory analyzing **2,000 real estate records**. Compare real-time predictions between **Linear Regression** and **Decision Tree Regressor**, explore exploratory data analysis (EDA) distributions, inspect 2,000 dataset rows, and review the academic 10-slide presentation deck.

---

## 👥 Project Team

- **MD Arman Alam** — Roll No: `A357175125020`
- **Nawed Ahmed** — Roll No: `A357175125009`

*Department of Computer Science & Engineering, Amity University Jharkhand*

---

## ⚡ Key Features

1. **Live ML Predictor Studio**
   - Real-time client-side inference executing both:
     - **Linear Regression Hyperplane**: $y = \beta_0 + \sum \beta_i x_i$
     - **Decision Tree Regressor**: Exact 34-level deep recursive partitioner exported from Scikit-Learn.
   - Interactive characteristic tuning (Area slider, Bedrooms, Bathrooms, Floors, Year Built, Neighborhood, Condition, Garage).
   - Pre-built archetypes: Downtown Penthouse, Suburban Family, Rural Estate, Urban Starter.
   - Live inter-model variance tracking ($\Delta$ difference and percentage).
   - Decision Tree traversal path breakdown showing the first dominant splits leading to the leaf node.
   - Colab Slide 9 test row verification table with instant **Load ➔** buttons.

2. **Exploratory Data Analysis (EDA) Dashboard**
   - **Price Distribution**: 20-bin histogram spanning \$50k–\$1M overlayed with a Gaussian KDE normal density curve (Slide 5).
   - **Area vs. Price Scatter**: 500 to 5,000 sq ft color-coded by location with regression trendline (Slide 5).
   - **Prices by Geographic Location**: Box plot distributions across Downtown, Suburban, Urban, and Rural (Slide 6).
   - **Pearson Correlation Heatmap**: Linear coefficients among numerical features and target price (Slide 6).
   - **Actual vs. Predicted**: Test split scatter evaluation against the ideal $y = x$ reference line (Slide 9).

3. **Machine Learning Workflow & Methodology**
   - End-to-end 6-stage supervised pipeline: `Load` ➔ `Explore` ➔ `Prepare` ➔ `Split` ➔ `Train` ➔ `Predict`.
   - Comprehensive model architecture cards and evaluation scorecard comparing MAE, RMSE, and $R^2$ metrics.

4. **2,000 Records Dataset Explorer**
   - Instant search across ID, Area, Location, and Price.
   - Multi-parameter filters (Location, Condition, Garage) and multi-column sorting.
   - Configurable pagination (20, 50, 100 rows per page) and CSV export.
   - **"⚡ Test in ML"** button on every record to immediately load parameters into the live predictor engine.

5. **10-Slide Academic Deck Viewer**
   - Fully interactive slide deck viewer reproducing the presentation deck for Amity University Jharkhand.
   - Slide thumbnail strip, stage navigation buttons, and keyboard arrow key controls (‹ / ›).

6. **Google Colab Notebook Hub**
   - Direct link to the official Google Colab project notebook.
   - Formatted Python training code with one-click clipboard copying.

---

## 📊 Dataset & Model Evaluation Metrics

Evaluated on an 80/20 train/test split (1,600 training houses, 400 unseen test houses):

| Model | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) | $R^2$ Score | Interpretability |
| :--- | :---: | :---: | :---: | :---: |
| **Linear Regression** | **\$243,242** | **\$279,860** | **-0.0067** | High (Direct linear weights) |
| **Decision Tree Regressor** | **\$328,973** | **\$401,354** | **-1.0705** | Moderate (Hierarchical decision rules) |

---

## 🚀 Getting Started

### Option 1: Standalone (No dependencies needed)
Simply double-click [`index.html`](index.html) to open it in any modern web browser (Chrome, Edge, Firefox, Brave, Safari). All models and data are self-contained.

### Option 2: Local Server via Node.js
```bash
# Start the built-in server
node server.js
```
Then navigate to:
```text
http://127.0.0.1:3000/
```

---

## 📁 Repository Structure

```text
├── assets/                     # Presentation slide figures, hero image & Chart.js
│   ├── chart.min.js
│   ├── hero.jpg
│   └── slide_*.png
├── css/
│   └── style.css               # Glassmorphism dark mode responsive stylesheet
├── data/                       # Raw and extracted JSON datasets & statistics
│   ├── dataset_full.json
│   ├── dataset_stats.json
│   └── model_data.json
├── js/
│   ├── app.js                  # Main UI controller & navigation
│   ├── charts.js               # EDA Chart.js dashboards & heatmaps
│   ├── data.js                 # Embedded 2,000 dataset & precomputed decision tree
│   ├── predictor.js            # Dual ML inference engine (LR + Decision Tree)
│   ├── slides.js               # 10-slide academic deck controller
│   └── table.js                # Dataset explorer, sorting & pagination
├── house_prices.csv            # Original 2,000-row CSV dataset
├── index.html                  # Single-page application root
├── server.js                   # Lightweight static HTTP server
└── README.md                   # Project documentation
```

---

## 🔗 Notebook Reference

Access the interactive Google Colab notebook here:
[Google Colab — House Price Prediction](https://colab.research.google.com/drive/10GfFtzfsD2QnG5EV956oiMoeLkzaBmcG?usp=sharing)
