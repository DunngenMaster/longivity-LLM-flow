import requests, time, os, json, random
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from scraper_config import SCRAPE_CONFIG, USER_AGENTS

# ensure the raw data directory exists
RAW_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "raw")
)
os.makedirs(RAW_DIR, exist_ok=True)

def fetch(url):
    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept-Language": "en-US,en;q=0.9"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        return resp
    except requests.RequestException:
        return None

def extract_text(soup, selector):
    block = soup.select_one(selector)
    return block.get_text(separator="\n").strip() if block else ""

def scrape_site(cfg):
    visited = set()
    records = []
    page = urljoin(cfg["base_url"], cfg["start_page"])
    while page:
        res = fetch(page)
        if not res:
            break
        soup = BeautifulSoup(res.content, "html.parser")
        # find all article links on this page
        for link in soup.select(cfg["article_link_selector"]):
            href = link.get("href")
            if not href:
                continue
            url = urljoin(cfg["base_url"], href)
            if url in visited:
                continue
            visited.add(url)
            art_res = fetch(url)
            if not art_res:
                continue
            art_soup = BeautifulSoup(art_res.content, "html.parser")
            text = extract_text(art_soup, cfg["article_selector"])
            if len(text) > 500:
                records.append({
                    "source": cfg["name"],
                    "url": url,
                    "text": text
                })
            time.sleep(random.uniform(0.5, 1.5))
        # follow pagination if any
        if cfg.get("next_selector"):
            nxt = soup.select_one(cfg["next_selector"])
            page = urljoin(cfg["base_url"], nxt["href"]) if nxt else None
        else:
            page = None
    out_path = os.path.join(RAW_DIR, f"{cfg['name']}.jsonl")
    with open(out_path, "w", encoding="utf-8") as f:
        for rec in records:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    print(f"{cfg['name']} saved {len(records)} articles → {out_path}")

if __name__ == "__main__":
    for cfg in SCRAPE_CONFIG:
        print(f"Starting {cfg['name']}")
        scrape_site(cfg)
