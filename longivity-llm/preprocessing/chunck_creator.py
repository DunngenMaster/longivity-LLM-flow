import os, json, re
from pathlib import Path
from PyPDF2 import PdfReader

RAW_PDF_DIR = "../data/semantic_pdfs"
RAW_JSONL_DIR = "../data/raw"
CHUNKED_OUT = "../data/chunks"

os.makedirs(CHUNKED_OUT, exist_ok=True)

MAX_CHARS = 1000
OVERLAP = 200

def chunk_text(text, max_len=MAX_CHARS, overlap=OVERLAP):
    text = re.sub(r"\s+", " ", text.strip())
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + max_len, len(text))
        chunks.append(text[start:end])
        start += max_len - overlap
    return chunks

def process_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        text = "\n".join([p.extract_text() or "" for p in reader.pages])
        return text
    except:
        return ""

def chunk_pdfs():
    out = []
    for pdf_file in Path(RAW_PDF_DIR).glob("*.pdf"):
        full_text = process_pdf(pdf_file)
        if len(full_text) < 500:
            continue
        chunks = chunk_text(full_text)
        for ch in chunks:
            out.append({"text": ch, "source": "semantic_pdf", "file": str(pdf_file.name)})
    with open(f"{CHUNKED_OUT}/pdf_chunks.jsonl", "w", encoding="utf-8") as f:
        for row in out:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    print(f"PDFs chunked: {len(out)} total")

def chunk_jsonls():
    all_chunks = []
    for jl_file in Path(RAW_JSONL_DIR).glob("*.jsonl"):
        with open(jl_file, encoding="utf-8") as f:
            for line in f:
                try:
                    row = json.loads(line)
                    text = row.get("text", "")
                    if len(text) < 300:
                        continue
                    chunks = chunk_text(text)
                    for ch in chunks:
                        all_chunks.append({"text": ch, "source": row.get("source", jl_file.name), "url": row.get("url")})
                except:
                    continue
    with open(f"{CHUNKED_OUT}/json_chunks.jsonl", "w", encoding="utf-8") as f:
        for row in all_chunks:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    print(f"JSONL records chunked: {len(all_chunks)} total")

if __name__ == "__main__":
    chunk_pdfs()
    chunk_jsonls()
