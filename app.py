from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)
df = pd.read_csv('/Users/joeportnoy/Desktop/repos/Money-Talks-A-Demographic-Story/outputs/bls_data.csv')  # Update the path if needed

# Drop rows with missing data
df = df.dropna(subset=['Weekly Earnings', 'Occupation', 'Sex', 'PWSSWGT'])

@app.route('/')
def index():
    occupations = [
        "Transportation and material moving occupations",
        "Office and administrative support occupations",
        "Community and social service occupations",
        "Building and grounds cleaning and maintenance occupations",
        "Sales and related occupations",
        "Construction and extraction occupations",
        "Protective service occupations",
        "Management occupations",
        "Education instruction and library occupations",
        "Healthcare practitioner and technical occupations",
        "Production occupations",
        "Personal care and service occupations",
        "Business and financial operations occupations",
        "Food preparation and serving related occupations",
        "Healthcare support occupations",
        "Installation, maintenance, and repair occupations",
        "Arts, design, entertainment, sports, and media occupations",
        "Legal occupations",
        "Architecture and engineering occupations",
        "Computer and mathematical occupations",
        "Farming, fishing, and forestry occupations",
        "Life, physical, and social science occupations"
    ]
    return render_template('index.html', occupations=occupations)

@app.route('/compare', methods=['POST'])
def compare():
    data = request.get_json()
    user_occupation = data['occupation']
    user_wage = float(data['wage'])

    filtered = df[df['Occupation'] == user_occupation]

    def weighted_mean(group):
        return round((group['Weekly Earnings'] * group['PWSSWGT']).sum() / group['PWSSWGT'].sum(), 2)

    male_avg = weighted_mean(filtered[filtered['Sex'] == 'Male'])
    female_avg = weighted_mean(filtered[filtered['Sex'] == 'Female'])
    overall_avg = (male_avg + female_avg) / 2

    return jsonify({
        'your_wage': user_wage,
        'male_avg': male_avg,
        'female_avg': female_avg,
        'overall_avg': overall_avg
    })

if __name__ == '__main__':
    app.run(debug=True)