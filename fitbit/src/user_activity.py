from fitbit.src.intraday_processor import IntradayProcessor
from fitbit.src.fetch_intraday import FetchIntraday

class UserActivity:
    def get_user_activity(self):
        client = FetchIntraday()
        processor = IntradayProcessor(client)
        processor.process_and_save()