import requests


url = "http://127.0.0.1:8000/predict/manual"
data = {
    "data_type": "koi",
    "features": {
        "koi_pdisposition": "CANDIDATE",
        "koi_score": 0.92,
        "koi_fpflag_ss": 0,
        "koi_fpflag_co": 0,
        "koi_fpflag_ec": 0,
        "koi_period": 12.34,
        "koi_period_err1": 0.05,
        "koi_period_err2": -0.05,
        "koi_time0bk": 134.56,
        "koi_time0bk_err1": 0.02,
        "koi_time0bk_err2": -0.02,
        "koi_impact": 0.3,
        "koi_duration": 4.2,
        "koi_duration_err1": 0.1,
        "koi_duration_err2": -0.1,
        "koi_depth": 2500.0,
        "koi_depth_err1": 100.0,
        "koi_depth_err2": -100.0,
        "koi_prad": 1.4,
        "koi_prad_err1": 0.2,
        "koi_prad_err2": -0.2,
        "koi_teq": 550,
        "koi_insol": 1.1,
        "koi_insol_err1": 0.2,
        "koi_insol_err2": -0.2,
        "koi_model_snr": 15.2,
        "koi_tce_plnt_num": 1,
        "koi_tce_delivname": "q1_q16_tce",
        "koi_steff": 5750,
        "koi_steff_err1": 80,
        "koi_steff_err2": -80,
        "koi_slogg": 4.3,
        "koi_slogg_err1": 0.05,
        "koi_slogg_err2": -0.05,
        "koi_srad": 0.95,
        "koi_srad_err1": 0.05,
        "koi_srad_err2": -0.05,
        "ra": 297.445,
        "dec": 45.123,
        "koi_kepmag": 14.2
    }
}

response = requests.post(url, json=data)
print(response.json())