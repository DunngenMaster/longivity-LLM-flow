# scrapers/base_scraper.py
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import time, json, os

class WebScraper:
    def __init__(self, source_file, output_dir, delay=1.0):
        self.source_file = source_file
        self.output_dir = output_dir
        self.delay = delay
        os.makedirs(self.output_dir, exist_ok=True)
        self.tasks = self.load_sources()

    def load_sources(self):
        tasks = {}
        with open(self.source_file, "r") as f:
            for line in f:
                url = line.strip()
                if not url or url.startswith("#"):
                    continue
                domain = urlparse(url).netloc.replace("www.", "").replace(".", "_")
                if domain not in tasks:
                    tasks[domain] = []
                tasks[domain].append(url)
        return tasks

    def fetch(self, url):
        try:
            print(f"Fetching: {url}")
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

    def parse_html(self, html):
        soup = BeautifulSoup(html, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "form"]):
            tag.decompose()
        text = soup.get_text(separator="\n").strip()
        return text

    def scrape(self):
        for domain, urls in self.tasks.items():
            output_path = os.path.join(self.output_dir, f"{domain}.jsonl")
            with open(output_path, "w", encoding="utf-8") as out:
                for url in urls:
                    html = self.fetch(url)
                    if html:
                        clean_text = self.parse_html(html)
                        record = {
                            "source": domain,
                            "url": url,
                            "text": clean_text
                        }
                        out.write(json.dumps(record, ensure_ascii=False) + "\n")
                        time.sleep(self.delay)
            print(f"✅ Scraped {len(urls)} pages → {output_path}")

if __name__ == "__main__":
    scraper = WebScraper(
        source_file="../../data/sources.txt",
        output_dir="../../data/raw",
        delay=1.0
    )
    scraper.scrape()
