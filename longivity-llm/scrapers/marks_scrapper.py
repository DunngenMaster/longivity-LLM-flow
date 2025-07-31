# scrapers/marks_scraper.py
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time, json, os

BASE_URL = "https://www.marksdailyapple.com"
START_PAGE = "/blog/"
OUTPUT_PATH = "../data/raw/marks_daily_apple.jsonl"

visited = set()
out = []

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

headers = {"User-Agent": "longevity-llm-scraper"}

def crawl_archive():
    next_page = urljoin(BASE_URL, START_PAGE)
    while next_page and len(out) < 1000:
        print(f"Visiting: {next_page}")
        r = requests.get(next_page, headers=headers)
        soup = BeautifulSoup(r.content, "html.parser")

        for a in soup.select(".title a"):
            href = a.get("href")
            if href and href not in visited:
                visited.add(href)
                extract_article(href)
                time.sleep(0.5)

        next_btn = soup.select_one(".next a")
        next_page = urljoin(BASE_URL, next_btn["href"]) if next_btn else None

        time.sleep(1.0)

def extract_article(url):
    print(f"📝 Extracting: {url}")
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.content, "html.parser")
    article = soup.select_one(".entry-content")
    if article:
        text = article.get_text(separator="\n").strip()
        if len(text) > 500:
            out.append({
                "source": "marks_daily_apple",
                "url": url,
                "text": text
            })

    if len(out) % 50 == 0:
        print(f"Articles saved: {len(out)}")

def save():
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        for row in out:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

if __name__ == "__main__":
    crawl_archive()
    save()
    print(f" Finished: {len(out)} articles written to {OUTPUT_PATH}")
