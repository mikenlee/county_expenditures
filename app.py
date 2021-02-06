import pandas as pd
import json
from flask import Flask, jsonify, render_template

# SQL Alchemy
from sqlalchemy import create_engine

# PyMySQL 
import pymysql
pymysql.install_as_MySQLdb()

# Config variables
import config
from config import remote_db_endpoint, remote_db_port
from config import remote_db_name, remote_db_user, remote_db_pwd

# Import Pandas
import pandas as pd


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
@app.route("/api/ncr_counties_expenditures")
def fairfax(): 
    # Cloud MySQL Database Connection on AWS
    cloud_engine = create_engine(f"mysql://{remote_db_user}:{remote_db_pwd}@{remote_db_endpoint}:{remote_db_port}/{remote_db_name}")
    # Create a remote database engine connection
    cloud_conn = cloud_engine.connect()
    
    #read in from AWS
    ncr_county = pd.read_sql("SELECT * FROM ncr_county_expenditures", cloud_conn)
    ncr_county

    # Opening JSON file 
    # f = open('static/data/fairfax_data.json',)
    # fairfax_data = json.load(f)

    return jsonify(ncr_county.to_dict(orient="records"))

#%%
@app.route("/api/geojson/ncr")
def geojson(): 
    # Opening JSON file 
    f = open('static/data/scoped_counties_info.geojson',)
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