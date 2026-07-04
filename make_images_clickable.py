#!/usr/bin/env python3
from bs4 import BeautifulSoup
from pathlib import Path

BASE = Path(r"C:\Users\olanj\site web\Site Kardiv")
files = list(BASE.glob("*.html"))

modified_count = 0

for path in files:
    html = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    changed = False

    for card in soup.find_all("article", class_="product-card"):
        name_link = card.select_one("h3.product-name a")
        if not name_link:
            continue
        href = name_link.get("href")
        if not href:
            continue

        product_image = card.select_one(".product-image")
        if not product_image:
            continue

        picture = product_image.find("picture")
        if not picture:
            continue

        # Vérifie si le picture est déjà dans un lien
        if picture.parent and picture.parent.name == "a":
            continue

        product_name = name_link.get_text(strip=True)
        link = soup.new_tag("a", href=href, **{"aria-label": f"Voir la fiche {product_name}"})
        picture.wrap(link)
        changed = True

    if changed:
        path.write_text(str(soup), encoding="utf-8")
        modified_count += 1
        print(f"Modified {path.name}")

print(f"\nTotal files modified: {modified_count}")
