from dotenv import load_dotenv
import os, pathlib

dotenv_path=pathlib.Path(__file__).parents[1].with_name('keys.env')
load_dotenv(dotenv_path)

ACCESS_TOKEN = os.getenv("FITBIT_ACCESS_TOKEN")
API_BASE = "https://api.fitbit.com"
