#!/usr/bin/env python3
"""Gera manifest.json listando as fotos de galeria/<ano>/ e images/sobre/.

Roda automaticamente no GitHub Actions a cada push, mas também pode ser
executado localmente:  python3 scripts/gerar_manifest.py
"""
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}


def fotos(pasta: Path) -> list[str]:
    if not pasta.is_dir():
        return []
    return sorted(p.name for p in pasta.iterdir() if p.is_file() and p.suffix.lower() in EXT)


def main() -> None:
    galeria = {}
    for pasta in sorted((RAIZ / "galeria").glob("*"), reverse=True):
        if pasta.is_dir() and re.fullmatch(r"\d{4}", pasta.name):
            lista = fotos(pasta)
            if lista:
                galeria[pasta.name] = lista

    manifest = {"galeria": galeria, "sobre": fotos(RAIZ / "images" / "sobre")}
    (RAIZ / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"manifest.json: {len(galeria)} ano(s), {sum(len(v) for v in galeria.values())} foto(s) na galeria, "
          f"{len(manifest['sobre'])} foto(s) em images/sobre")


if __name__ == "__main__":
    main()
