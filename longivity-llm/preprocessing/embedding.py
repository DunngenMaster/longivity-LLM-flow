import json, os
from tqdm import tqdm
from sentence_transformers import SentenceTransformer
import numpy as np

CHUNK_FILES = [
    "../data/chunks/json_chunks.jsonl",
    "../data/chunks/pdf_chunks.jsonl"
]
SAVE_PATH = "../data/embeddings/"
MODEL_NAME = "nomic-ai/nomic-embed-text-v1"

os.makedirs(SAVE_PATH, exist_ok=True)

print("Loading model...")
model = SentenceTransformer(MODEL_NAME, trust_remote_code=True)

for file in CHUNK_FILES:
    if not os.path.exists(file):
        continue

    embeddings = []
    metadatas = []
    texts = []

    with open(file, "r", encoding="utf-8") as f:
        for line in f:
            row = json.loads(line)
            text = row.get("text", "").strip()
            if len(text) < 20:
                continue
            texts.append(text)
            metadatas.append({k: v for k, v in row.items() if k != "text"})

    print(f"Embedding {len(texts)} chunks from {file}...")
    batch_embeddings = model.encode(texts, show_progress_bar=True, batch_size=64, normalize_embeddings=True)

    out_file = os.path.join(SAVE_PATH, os.path.basename(file).replace(".jsonl", ".npz"))
    np.savez_compressed(out_file, embeddings=batch_embeddings, metadata=metadatas)
    print(f"Saved: {out_file}")
