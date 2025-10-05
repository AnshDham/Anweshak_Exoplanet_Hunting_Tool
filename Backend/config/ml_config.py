MODEL_CONFIGS = {
    "k2": {
        "expected_columns": [
            'disposition','default_flag', 'sy_snum', 'sy_pnum', 'soltype', 'pl_controv_flag', 
            'pl_orbper', 'pl_orbpererr1', 'pl_orbpererr2', 'pl_orbperlim', 
            'pl_rade', 'pl_radeerr1', 'pl_radeerr2', 'pl_radelim', 'pl_radj', 
            'pl_radjerr1', 'pl_radjerr2', 'pl_radjlim', 'ttv_flag', 'st_teff', 
            'st_tefferr1', 'st_tefferr2', 'st_tefflim', 'st_rad', 'st_raderr1', 
            'st_raderr2', 'st_radlim', 'st_logg', 'st_logglim', 'ra', 'dec', 
            'sy_dist', 'sy_disterr1', 'sy_disterr2', 'sy_vmag', 'sy_vmagerr1', 
            'sy_vmagerr2', 'sy_kmag', 'sy_kmagerr1', 'sy_kmagerr2', 
            'sy_gaiamag', 'sy_gaiamagerr1', 'sy_gaiamagerr2'
        ],
        "target_column": "disposition",
        "model_name": "k2_exoplanet_model"
    },
    "koi": {
        "expected_columns": [
            'koi_disposition','koi_pdisposition', 'koi_score', 'koi_fpflag_nt', 'koi_fpflag_ss', 
            'koi_fpflag_co', 'koi_fpflag_ec', 'koi_period', 'koi_period_err1', 
            'koi_period_err2', 'koi_time0bk', 'koi_time0bk_err1', 
            'koi_time0bk_err2', 'koi_impact', 'koi_impact_err1', 
            'koi_impact_err2', 'koi_duration', 'koi_duration_err1', 
            'koi_duration_err2', 'koi_depth', 'koi_depth_err1', 
            'koi_depth_err2', 'koi_prad', 'koi_prad_err1', 'koi_prad_err2', 
            'koi_teq', 'koi_insol', 'koi_insol_err1', 'koi_insol_err2', 
            'koi_model_snr', 'koi_tce_plnt_num', 'koi_tce_delivname', 
            'koi_steff', 'koi_steff_err1', 'koi_steff_err2', 'koi_slogg', 
            'koi_slogg_err1', 'koi_slogg_err2', 'koi_srad', 'koi_srad_err1', 
            'koi_srad_err2', 'ra', 'dec', 'koi_kepmag'
        ],
        "target_column": "koi_disposition", 
        "model_name": "koi_exoplanet_model"
    },
    "tess": {
        "expected_columns": [
            'tfopwg_disp','ra', 'dec', 'st_pmra', 'st_pmraerr1', 'st_pmraerr2', 'st_pmralim', 
            'st_pmrasymerr', 'st_pmdec', 'st_pmdecerr1', 'st_pmdecerr2', 
            'st_pmdeclim', 'st_pmdecsymerr', 'pl_tranmid', 'pl_tranmiderr1', 
            'pl_tranmiderr2', 'pl_tranmidlim', 'pl_tranmidsymerr', 'pl_orbper', 
            'pl_orbpererr1', 'pl_orbpererr2', 'pl_orbperlim', 'pl_orbpersymerr', 
            'pl_trandurh', 'pl_trandurherr1', 'pl_trandurherr2', 'pl_trandurhlim', 
            'pl_trandurhsymerr', 'pl_trandep', 'pl_trandeperr1', 'pl_trandeperr2', 
            'pl_trandeplim', 'pl_trandepsymerr', 'pl_rade', 'pl_radeerr1', 
            'pl_radeerr2', 'pl_radelim', 'pl_radesymerr', 'pl_insol', 'pl_eqt', 
            'st_tmag', 'st_tmagerr1', 'st_tmagerr2', 'st_tmaglim', 
            'st_tmagsymerr', 'st_dist', 'st_disterr1', 'st_disterr2', 
            'st_distlim', 'st_distsymerr', 'st_teff', 'st_tefferr1', 
            'st_tefferr2', 'st_tefflim', 'st_teffsymerr', 'st_logg', 
            'st_loggerr1', 'st_loggerr2', 'st_logglim', 'st_loggsymerr', 
            'st_rad', 'st_raderr1', 'st_raderr2', 'st_radlim', 'st_radsymerr'
        ],
        "target_column": "tfopwg_disp",  # Adjust based on your actual target
        "model_name": "tess_exoplanet_model"
    }
}