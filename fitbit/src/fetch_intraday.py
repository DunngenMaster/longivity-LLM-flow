import requests
from datetime import datetime
from fitbit.src.config import ACCESS_TOKEN, API_BASE

class FetchIntraday:
    def __init__(self, access_token=ACCESS_TOKEN, api_base=API_BASE):
        self.access_token = access_token
        self.api_base = api_base
        self.headers = {"Authorization": f"Bearer {self.access_token}"}

    def fetch_intraday_for_metric(self, metric, date):
        if metric == "heart":
            url = f"{self.api_base}/1/user/-/activities/heart/date/{date}/1d/1min.json"
            key = "activities-heart-intraday"
        else:
            url = f"{self.api_base}/1/user/-/activities/{metric}/date/{date}/1d/1min.json"
            key = f"activities-{metric}-intraday"

        response = requests.get(url, headers=self.headers)
        return response.json().get(key, {}).get("dataset", [])

    def fetch_intraday_metrics(self, metrics):
        today = datetime.now().strftime("%Y-%m-%d")
        all_data = {}

        for metric in metrics:
            all_data[metric] = self.fetch_intraday_for_metric(metric, today)

        return all_data, today
