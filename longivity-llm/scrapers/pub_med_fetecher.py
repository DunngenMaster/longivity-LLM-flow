# scrapers/pubmed_fetcher.py
import requests
import time
import json
import os

# Config
SEARCH_TERMS = ["longevity", "anti-aging", "healthy aging", "supplement longevity", "biological age"]
MAX_RESULTS = 5000  # per term (use high value to hit goal)
ENTREZ_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
OUTPUT_PATH = "../data/raw/pubmed.jsonl"
EMAIL = "your-email@example.com"  # replace with real email (required by NCBI)

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

headers = {"User-Agent": f"pubmed-fetcher (mailto:{EMAIL})"}

def search_pubmed(term, retmax=MAX_RESULTS):
    url = f"{ENTREZ_BASE}/esearch.fcgi"
    params = {
        "db": "pubmed",
        "term": term,
        "retmode": "json",
        "retmax": retmax
    }
    r = requests.get(url, params=params, headers=headers)
    r.raise_for_status()
    return r.json()["esearchresult"]["idlist"]

def fetch_details(pmids):
    url = f"{ENTREZ_BASE}/efetch.fcgi"
    params = {
        "db": "pubmed",
        "retmode": "xml",
        "id": ",".join(pmids)
    }
    r = requests.get(url, params=params, headers=headers)
    r.raise_for_status()
    return r.text

from xml.etree import ElementTree as ET

def parse_xml(xml):
    root = ET.fromstring(xml)
    results = []
    for article in root.findall(".//PubmedArticle"):
        try:
            pmid = article.findtext(".//PMID")
            title = article.findtext(".//ArticleTitle")
            abstract = " ".join([abst.text.strip() for abst in article.findall(".//AbstractText") if abst.text])
            authors = [au.findtext("LastName") for au in article.findall(".//Author") if au.findtext("LastName")]
            results.append({
                "pmid": pmid,
                "title": title,
                "abstract": abstract,
                "authors": authors,
                "url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
            })
        except:
            continue
    return results

def run():
    seen_pmids = set()
    with open(OUTPUT_PATH, "w", encoding="utf-8") as out:
        for term in SEARCH_TERMS:
            print(f"Searching for '{term}'...")
            pmids = search_pubmed(term)
            print(f"Found {len(pmids)} articles for term '{term}'")
            for i in range(0, len(pmids), 200):
                chunk = pmids[i:i+200]
                xml = fetch_details(chunk)
                parsed = parse_xml(xml)
                for record in parsed:
                    if record["pmid"] not in seen_pmids:
                        out.write(json.dumps(record, ensure_ascii=False) + "\n")
                        seen_pmids.add(record["pmid"])
                time.sleep(1.0)  # rate limit
    print(f"✅ Saved {len(seen_pmids)} articles → {OUTPUT_PATH}")

if __name__ == "__main__":
    run()
