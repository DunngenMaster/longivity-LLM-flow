import requests, os, time, json

API_KEY = ""  # Optional: add your Semantic Scholar API key here
SEARCH_TERMS = ["supplements", "micronutrients", "longevity", "anti-aging", "nutraceuticals"]
SAVE_DIR = "../data/semantic_pdfs"
MAX_RESULTS = 5000
PER_PAGE = 100

os.makedirs(SAVE_DIR, exist_ok=True)
HEADERS = {"x-api-key": API_KEY} if API_KEY else {}

BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"

params = {
    "limit": PER_PAGE,
    "fields": "title,year,authors,url,openAccessPdf"
}

def fetch_papers(term):
    print(f"Searching: {term}")
    all_papers = []
    offset = 0
    while offset < MAX_RESULTS:
        query_params = {
            **params,
            "query": term,
            "offset": offset
        }
        try:
            resp = requests.get(BASE_URL, params=query_params, headers=HEADERS, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            papers = data.get("data", [])
            if not papers:
                break
            all_papers.extend(papers)
            print(f"Fetched {len(papers)} papers (offset {offset})")
            offset += PER_PAGE
            time.sleep(1.0)
        except Exception as e:
            print(f"Error: {e}")
            break
    return all_papers

def download_pdf(paper):
    pdf_info = paper.get("openAccessPdf")
    if not pdf_info:
        return False
    url = pdf_info.get("url")
    if not url or not url.endswith(".pdf"):
        return False
    paper_id = paper.get("paperId") or paper.get("url", "").split("/")[-1]
    filename = os.path.join(SAVE_DIR, f"{paper_id}.pdf")
    if os.path.exists(filename):
        return True
    try:
        r = requests.get(url, timeout=15)
        if r.ok and b"%PDF" in r.content[:5]:
            with open(filename, "wb") as f:
                f.write(r.content)
            print(f"Saved: {filename}")
            return True
    except Exception:
        pass
    return False

if __name__ == "__main__":
    all_downloaded = []
    for term in SEARCH_TERMS:
        papers = fetch_papers(term)
        for paper in papers:
            if download_pdf(paper):
                all_downloaded.append(paper)
            time.sleep(0.5)
        print(f"Done term: {term}, total downloaded so far: {len(all_downloaded)}")
    # Save metadata
    with open("semantic_metadata.json", "w", encoding="utf-8") as f:
        json.dump(all_downloaded, f, ensure_ascii=False, indent=2)
    print(f" Finished. {len(all_downloaded)} PDFs downloaded.")
