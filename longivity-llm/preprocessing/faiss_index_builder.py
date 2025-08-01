import os
import json
import numpy as np
import faiss

EMBED_DIR = "../data/embeddings"
INDEX_OUT_PATH = "../data/faiss_index"
os.makedirs(INDEX_OUT_PATH, exist_ok=True)

all_embeddings = []
all_metadata = []

for file in os.listdir(EMBED_DIR):
    if not file.endswith(".npz"):
        continue
    path = os.path.join(EMBED_DIR, file)
    print(f"Loading {file}...")
    data = np.load(path, allow_pickle=True)
    emb = data["embeddings"]
    meta = data["metadata"].tolist()
    all_embeddings.append(emb)
    all_metadata.extend(meta)

all_embeddings = np.vstack(all_embeddings).astype("float32")

print(f"Building FAISS index with {len(all_embeddings)} vectors...")
index = faiss.IndexFlatIP(all_embeddings.shape[1])  # use cosine similarity on normalized vectors
index.add(all_embeddings)

faiss.write_index(index, os.path.join(INDEX_OUT_PATH, "index.faiss"))

with open(os.path.join(INDEX_OUT_PATH, "metadata.json"), "w", encoding="utf-8") as f:
    json.dump(all_metadata, f, ensure_ascii=False, indent=2)

print(f" FAISS index saved to {INDEX_OUT_PATH}")
