import pandas as pd
import json
from flask import Flask, jsonify
from flask_cors import CORS # enables CORS support on all routes

file_location = '/Users/mikenlee/Documents/Personal/analytics/GWU/county_expenditures/static/js/fairfax_data.json'

with open (file_location) as json_file:
    fairfax_data = json.load(json_file)

#%%

#################################################
# Flask Setup
#################################################
#instantiate an app
app = Flask(__name__)

#initialize the Flask-Cors extension to allow CORS for all domains on all routes
CORS(app)
#%%
#################################################
# Flask Routes
#################################################
#%%

#default route
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/fairfax<br/>"
        f"/api/v1.0/arlington   <-- Coming Soon<br/>"
        f"/api/v1.0/louden   <-- Coming Soon<br/>"
        f"/api/v1.0/prince_william   <-- Coming Soon<br/>"
        f"/api/v1.0/prince_georges   <-- Coming Soon<br/>"
        f"/api/v1.0/montgomery   <-- Coming Soon<br/>"
        f"/api/v1.0/dc   <-- Coming Soon<br/>"
    )

#%%
@app.route("/api/v1.0/fairfax")
def fairfax():
    
    return jsonify(fairfax_data)

#%%
if __name__ == '__main__':
    app.run(debug=True)