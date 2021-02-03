import pandas as pd
import json
from flask import Flask, jsonify, render_template

#%%

#################################################
# Flask Setup
#################################################
#instantiate an app
app = Flask(__name__)

#%%
#################################################
# Flask Routes
#################################################
#%%
#default route
@app.route("/")
def home():
    return render_template('index.html')

#%%
#default route
@app.route("/explore")
def explore():
    return render_template('explore.html')
    
#%%

@app.route("/api")
def api_list():
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
@app.route("/api/fairfax")
def fairfax(): 
    # Opening JSON file 
    f = open('static/data/fairfax_data.json',)
    fairfax_data = json.load(f)

    return jsonify(fairfax_data)

#%%
@app.route("/api/geojson/ncr")
def geojson(): 
    # Opening JSON file 
    f = open('static/data/scoped_counties.geojson',)
    county_map = json.load(f)

    return jsonify(county_map)

#%%
@app.route("/css/core")
def core_css(): 
    # Opening JSON file 
    f = open('static/css/core.css',)
    core = json.load(f)

    return core

#%%
if __name__ == '__main__':
    app.run(debug=True)