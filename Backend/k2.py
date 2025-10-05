import requests


url = "http://127.0.0.1:8000/predict/manual"
#url1="https://cutaneously-unliable-argentina.ngrok-free.dev/predict/manual/" #working
data = {
    "data_type": "k2",
    "features": {
        "sy_snum": 1,                   # Number of stars in system
        "sy_pnum": 2,                   # Number of planets in system
        "soltype": "Transit",           # Solution type (Transit / RV / Imaging)
        "pl_orbper": 45.67,             # Orbital period (days)
        "pl_orbpererr1": 0.2,
        "pl_orbpererr2": -0.2,
        "pl_rade": 1.9,                 # Planet radius (Earth radii)
        "pl_radeerr1": 0.1,
        "pl_radeerr2": -0.1,
        "pl_radj": 0.18,                # Planet radius (Jupiter radii)
        "pl_radjerr1": 0.01,
        "pl_radjerr2": -0.01,
        "ttv_flag": 0,                  # Transit timing variation flag
        "st_teff": 5600,                # Stellar effective temperature (K)
        "st_tefferr1": 60,
        "st_tefferr2": -60,
        "st_rad": 0.95,                 # Stellar radius (Solar radii)
        "st_raderr1": 0.05,
        "st_raderr2": -0.05,
        "ra": 285.123,                  # Right Ascension (deg)
        "dec": 47.456,                  # Declination (deg)
        "sy_dist": 220.5,               # Distance (parsecs)
        "sy_disterr1": 5.5,
        "sy_disterr2": -5.5,
        "sy_vmag": 13.2,                # Visual magnitude
        "sy_kmag": 11.5,                # K-band magnitude
        "sy_kmagerr1": 0.05,
        "sy_kmagerr2": -0.05,
        "sy_gaiamag": 13.1,             # Gaia magnitude
        "sy_gaiamagerr1": 0.02,
        "sy_gaiamagerr2": -0.02
    }
}

response = requests.post(url, json=data)
print(response.json())
