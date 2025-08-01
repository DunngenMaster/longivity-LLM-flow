import json, faiss, numpy as np, uvicorn, os
from pathlib import Path
from fastapi import FastAPI
from pydantic import BaseModel
import requests
from sentence_transformers import SentenceTransformer

EMBED_MODEL  = "nomic-ai/nomic-embed-text-v1"
INDEX_FILE   = "../data/chunks/index.faiss"
META_FILE    = "../data/chunks/metadata.json"
TOP_K        = 8                        
OLLAMA_HOST  = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")  
# -----------------------------

# 1️⃣  Load index & metadata once at startup
index = faiss.read_index(INDEX_FILE)
with open(META_FILE, encoding="utf-8") as f:
    metadata = json.load(f)

embedder = SentenceTransformer(EMBED_MODEL, trust_remote_code=True)

# ---------- FastAPI ----------
app = FastAPI()

class Query(BaseModel):
    question: str
    k: int | None = None   # allow override

def embed(texts: list[str]) -> np.ndarray:
    vectors = embedder.encode(texts, batch_size=16, normalize_embeddings=True)
    return np.asarray(vectors, dtype="float32")

@app.post("/ask")
def ask(q: Query):
    # 2️⃣  Embed and search
    vec = embed([q.question])
    k = q.k or TOP_K
    D, I = index.search(vec, k)     # I → indices into metadata list

    # 3️⃣  Build context block
    ctx_blocks = []
    for rank, idx in enumerate(I[0]):
        meta = metadata[str(idx)]
        snippet = meta["text"].strip().replace("\n", " ")
        ctx_blocks.append(f"[{rank+1}] {snippet}")
    context = "\n".join(ctx_blocks)

    system_prompt = (
        "You are a longevity & supplementation assistant. "
        "Answer based **only** on the numbered context passages. "
        "When unsure, say you don’t know.\n\n"
        f"Context:\n{context}\n\n"
        f"User question: {q.question}\n\n"
        "Answer:"
    )

    # 4️⃣  Call Ollama
    resp = requests.post(
        f"{OLLAMA_HOST}/api/generate",
        json={"model": OLLAMA_MODEL, "prompt": system_prompt, "stream": False},
        timeout=120,
    )
    resp.raise_for_status()
    answer = resp.json()["response"]

    return {
        "answer": answer.strip(),
        "citations": [
            {"rank": r + 1, "source": metadata[str(i)]["source"], "url": metadata[str(i)].get("url", "")}
            for r, i in enumerate(I[0])
        ],
    }

# Optional: run directly with `python rag_server.py`
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
