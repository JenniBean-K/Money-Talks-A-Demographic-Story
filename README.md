# Money Talks: A Demographic Story

## Project 3 — Data Visualization Capstone

### Overview

**Money Talks: A Demographic Story** is a data analytics project created to investigate how weekly earnings in the U.S. workforce vary based on gender, occupation, education level, and years of experience. Our team utilized weighted statistical methods and interactive data visualizations to uncover persistent wage gaps and identify roles with more equitable compensation structures.
  
🔗 [Explore the live interactive dashboard](https://incomparable-semolina-1febd4.netlify.app)

---

### Table of Contents

1. [Overview](#overview)
2. [Purpose](#purpose)
3. [Technologies Used](#technologies-used)
4. [How It Works](#how-it-works)
5. [Ethical Considerations](#ethical-considerations)
6. [Repo Structure](#repo-structure)
7. [Getting Started](#getting-started)
8. [Key Insights](#key-insights)
9. [Recommendations](#recommendations)
10. [Data Sources](#data-sources)
11. [Code References](#code-references)
12. [Contributors](#contributors)

---

### Purpose

This project aims to tell a compelling, data-driven story about pay equity in the American workforce. By integrating Python, JavaScript, and SQLite3, we built a modern, interactive tool for visual exploration of wage disparities and population-level insights. Our dashboard allows users to explore the wage gap by role, sex, and time, empowering more informed discussion and advocacy around workplace equity.

---

### Technologies Used

- **Frontend:** HTML, CSS, JavaScript, D3.js
- **Backend / Analysis:** Python, Pandas, Jupyter Notebook
- **Database:** SQLite3
- **Hosting:** GitHub Pages
- **Data Sources:** U.S. Census Bureau (CPS Survey), Bureau of Labor Statistics
- **Uncovered Library:** Bokeh for visualization

---

### How It Works

Users can explore wage data via:
- A dropdown menu of occupations
- A dynamically generated bar chart comparing male and female earnings
- A real-time summary box describing the pay gap
- Visual cues (color-coded boxes) to highlight severity of inequity

---

### Ethical Considerations

This project includes several key ethical considerations:
- **Privacy:** No personally identifiable information (PII) is used; all data is publicly available and anonymized.
- **Bias Mitigation:** We applied population weights (PWSSWGT) from the CPS survey to ensure representative insights and reduce bias.
- **Transparency:** All analysis and code are published openly on GitHub, and visualizations clearly label gaps, limitations, and assumptions.
- **Inclusion:** Data visualizations aim to promote awareness of gender-based income inequality without sensationalism.

---

### Repo Structure

```
Money-Talks-A-Demographic-Story/
│
├── images/                        # Visual assets for the dashboard
│   └── hero.png
│
├── notebooks/                     # Jupyter notebooks for analysis and setup
│   ├── bls_cps_data.ipynb
│   ├── bls_sqlite_setup.ipynb
│   └── bls-analysis.ipynb
│
├── outputs/                       # Exported datasets and processed files
│   ├── avg_wage_data_over_time.csv
│   ├── bls_data.csv
│   ├── bls_data.csv.zip
│   ├── bls_wage_data.db
│   ├── bls_wage_data.db.zip
│   ├── earnings_chart.json
│   ├── equity_gap.csv
│   ├── wage_gap_by_occupation.csv
│   └── wage_gap_by_occupation.csv.zip
│
├── resources/                     # Supporting reference files and documentation
│   ├── 2025_Basic_CPS_Public_Use_Record_Layout_plus_IO_Code_list.txt
│   └── PWSSWGT Column Instructions
│
├── static/
│   ├── css/
│   │   └── styles.css             # Custom CSS styles
│   ├── js/                        # JavaScript files for data visualizations
│   │   ├── bls.js
│   │   ├── compare.js
│   │   ├── earnings_chart.js
│   │   ├── earnings_gap.js
│   │   ├── education_chart.js
│   │   └── gender_gap.js
│   └── json/                      # Pre-processed JSON datasets
│       ├── compare_wage.json
│       └── education_enrollment_wage.json
│
├── index.html                     # Main web dashboard
├── README.md                      # Project overview and usage instructions
├── .gitattributes
├── .gitignore
```

---

### Getting Started

To explore the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/JenniBean-K/Money-Talks-A-Demographic-Story.git
   ```

2. (Optional) Open the `notebooks/` folder to explore the analysis in Jupyter.

3. Open `index.html` in your browser to interact with the dashboard.

No additional installations are required unless you want to run the Python analysis.

---

### Key Insights

- A consistent **gender wage gap** exists across most occupations, even when controlling for education and experience.
- **Higher education** strongly correlates with increased earnings, but not always with increased equity.
- In some industries, **experience plateaus**—more years on the job do not necessarily translate to higher pay.
- **Lower-paid occupations** tend to have higher pay equity between genders.
- Weighted averages (using `PWSSWGT`) provided more accurate population insights.

---

### Recommendations

- **Pay Transparency:** Encourage publication of salary bands by role and experience.
- **Upskilling:** Promote access to certifications and training to enable upward mobility.
- **Equity Audits:** Organizations should regularly assess pay structures to address demographic inequities.

---

### Data Sources

- [Current Population Survey (CPS)](https://www.census.gov/programs-surveys/cps.html) — U.S. Census Bureau
- [Bureau of Labor Statistics](https://www.bls.gov/)

---

### Code References

This project uses several public libraries and datasets. Special thanks to:
- D3.js documentation and community for data binding and transitions
- U.S. Census Bureau and BLS for making data publicly available
- ObservableHQ and GitHub community examples for inspiration on visualization styling

---

### Contributors

- **Joe Portnoy** – Data Visualization, Narrative Design, Web Integration  
- **Tatenda Manenji** – Data Cleaning, Exploratory Analysis, Statistical Modeling  
- **Jenni Kim** – Front-End Development, UX/UI Design, Data Pipeline

---
