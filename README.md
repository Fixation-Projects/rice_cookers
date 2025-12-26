# rice_cookers
Helpful tool to find the right rice cooker for your specific needs

# Rice Cooker Index (Fixation Projects)

A static, zero-cost, privacy-preserving comparison engine for US-market rice cookers. 

**Live Site:** [Insert GitHub Pages Link Here]  
**Status:** 🟢 Passive Maintenance (Best Effort)

---

## 🎯 Purpose
Buying a rice cooker is unnecessarily difficult. Marketing materials confuse "cooked" vs. "uncooked" capacity, generic terms like "smart cooking" obscure actual technology (Micom/Fuzzy Logic), and "Top 10" review sites are often clogged with affiliate spam.

This project aims to be an **honest, transparent database** that prioritizes:
1.  **Truth over Completeness:** We explicitly flag whether data is from a manual (`explicit`), a best-guess (`inferred`), or simply `unknown`.
2.  **Privacy:** No cookies, no tracking, no backend, no affiliate links.
3.  **Longevity:** A static site that requires no server maintenance and costs $0 to run.

## ⚙️ How It Works
* **Architecture:** 100% Client-side. A single `rice_cookers.json` file feeds a vanilla JS frontend.
* **Hosting:** GitHub Pages.
* **Data Structure:** We use a strict schema that handles ambiguity. If we don't know a spec, we don't guess—we mark it as `unknown`.

## 🔍 Data Methodology
Unlike standard retail sites, every data point in this index has a **provenance**:
* 🟢 **Explicit:** Confirmed via official user manual or manufacturer spec sheet.
* 🟠 **Inferred:** Derived from context (e.g., assuming a 10-cup "cooked" model is 5 cups "uncooked"). These are visually highlighted so you know to double-check.
* ⚪ **Unknown:** Data was not available.

## 🛠️ Local Development
Because there is no build step or backend, you can run this locally instantly:

1.  Clone the repo:
    ```bash
    git clone [https://github.com/Fixation-Projects/rice-cookers.git](https://github.com/Fixation-Projects/rice-cookers.git)
    ```
2.  Open `index.html` in your browser.
3.  That's it.

## 🤝 Contributing
This is a "Fixation Project"—created during a burst of hyper-focus. I maintain it on a **best-effort basis**. 

**You are welcome to contribute!** * **Found a mistake?** Please open an Issue or submit a PR editing `rice_cookers.json`. 
* **Want to add a model?** Copy an existing object in the JSON file and fill in the details. Please cite your sources in the `raw_statement` or `notes` fields.
* **Code improvements:** If you can make the CSS cleaner or the JS faster without adding dependencies, go for it.

*Note: I may not respond to PRs immediately, but I appreciate every correction.*

## 📄 License & Disclaimer
* **License:** MIT. Feel free to fork this and build a comparison site for toasters, mechanical keyboards, or whatever your current fixation is.
* **Disclaimer:** This site is for informational purposes only. I am not affiliated with any rice cooker manufacturer. Use the "Inferred" data at your own risk.
