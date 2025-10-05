import requests


url = "http://127.0.0.1:8000/predict/manual"
data = {
    "data_type": "tess",
    "features": {
        "ra": 290.123,
        "dec": 45.678,
        "st_pmra": 12.3,
        "st_pmraerr1": 0.1,
        "st_pmraerr2": -0.1,
        "st_pmdec": -8.7,
        "st_pmdecerr1": 0.1,
        "st_pmdecerr2": -0.1,
        "pl_tranmid": 2459000.123,
        "pl_tranmiderr1": 0.002,
        "pl_tranmiderr2": -0.002,
        "pl_orbper": 290.0,
        "pl_orbpererr1": 0.5,
        "pl_orbpererr2": -0.5,
        "pl_trandurh": 10.5,
        "pl_trandurherr1": 0.1,
        "pl_trandurherr2": -0.1,
        "pl_trandep": 0.01,
        "pl_trandeperr1": 0.001,
        "pl_trandeperr2": -0.001,
        "pl_rade": 2.1,
        "pl_radeerr1": 0.1,
        "pl_radeerr2": -0.1,
        "pl_insol": 150.0,
        "pl_eqt": 500,
        "st_tmag": 12.5,
        "st_tmagerr1": 0.01,
        "st_tmagerr2": -0.01,
        "st_dist": 150.0,
        "st_disterr1": 5.0,
        "st_disterr2": -5.0,
        "st_teff": 5800,
        "st_tefferr1": 50,
        "st_tefferr2": -50,
        "st_logg": 4.4,
        "st_loggerr1": 0.05,
        "st_loggerr2": -0.05,
        "st_rad": 1.0,
        "st_raderr1": 0.05,
        "st_raderr2": -0.05
    }
}
response = requests.post(url, json=data)
print(response.json())
