import pandas as pd
import os

class IntradayProcessor:
    def __init__(self, client):
        self.metrics = ["steps", "calories", "distance", "floors", "elevation", "heart"]
        self.metric_to_column = {
            "steps": "steps",
            "calories": "calories",
            "distance": "distance",
            "floors": "floors",
            "elevation": "elevation",
            "heart": "heart_rate"
        }
        self.client = client

    def process_and_save(self):
        data, today = self.client.fetch_intraday_metrics(self.metrics)
        combined_df = pd.DataFrame()

        for metric in self.metrics:
            dataset = data.get(metric, [])
            if dataset:
                df = pd.DataFrame(dataset)
                df = df.rename(columns={"value": self.metric_to_column[metric]})
                if combined_df.empty:
                    combined_df["time"] = df["time"]
                combined_df = pd.merge(combined_df, df, on="time", how="outer")
            else:
                print(f"No data for {metric}")

        if not combined_df.empty:
            combined_df["date"] = today
            combined_df = combined_df.sort_values(by="time")
            cols = ["time"] + list(self.metric_to_column.values()) + ["date"]
            combined_df = combined_df[cols]

            # Append if file exists
            path = "intraday_activity_metrics.csv"
            if os.path.exists(path):
                existing_df = pd.read_csv(path)
                combined_df = pd.concat([existing_df, combined_df], ignore_index=True)

            # Drop full duplicates (ignoring 'time')
            combined_df = combined_df.drop_duplicates(subset=[col for col in combined_df.columns if col != "time"])

            # Save to file
            combined_df.to_csv(path, index=False)
            print(f"Saved {len(combined_df)} rows to {path}")
        else:
            print("No data available to save")