# 🛡️ ISC2 CC Exam Practice

> **502 Questions · 5 Domains · 4 Modes · Fully Free · No Login Required**

A complete browser-based practice exam for the **ISC2 Certified in Cybersecurity (CC)** certification.

🔗 **[Launch Exam → https://anku0669.github.io/isc2-cc-exam_practice/](https://anku0669.github.io/isc2-cc-exam_practice/)**

---

## 📋 Domain Coverage

| Domain | Topic | Exam Weight |
|--------|-------|-------------|
| D1 | Security Principles | 26% |
| D2 | Business Continuity, DR & IR | 10% |
| D3 | Access Control Concepts | 22% |
| D4 | Network Security | 24% |
| D5 | Security Operations | 18% |

---

## 🚀 Features

- **502 MCQ questions** covering all 5 official ISC2 CC domains
- **4 study modes:**
  - 📖 **Practice** — instant right/wrong feedback after every answer
  - ⏱️ **Exam Sim** — full 2.5-hour timed simulation, no feedback until end
  - ⚡ **Quick 50** — random 50-question sprint
  - 🎯 **Weak Areas** — auto-focuses on questions you previously got wrong
- **Live score tracker** — correct count and percentage updates in real time
- **Question map** — sidebar grid (green = correct, red = wrong), click any dot to jump
- **Results screen** — score ring, pass/fail badge (70% threshold), per-domain breakdown
- **Persistent weak-area tracking** — missed questions saved to `localStorage` for targeted re-study

---

## 🗂️ Project Structure

```
isc2-cc-exam_practice/
├── index.html        # Main HTML — structure and screens only
├── style.css         # All styling, themes, layout, responsive
├── app.js            # All logic — modes, timer, scoring, results
└── questions.js      # const ALL_Q = [...] — 502 questions with answers
```

---

## 🖥️ Run Locally

No server needed — just open the file:

```bash
git clone https://github.com/anku0669/isc2-cc-exam_practice.git
cd isc2-cc-exam_practice
open index.html        # macOS
# or drag index.html into any browser
```

> ⚠️ Because `questions.js` is loaded as a `<script>` tag (not `fetch`), it works fine with `file://` — no local server required.

---

## ⏱️ GitHub Pages Update Time

| Action | Time to Go Live |
|--------|----------------|
| First push + Pages enabled | ~60 seconds |
| Any subsequent `git push` | **~30–60 seconds** |
| After changing Pages branch | up to 5 minutes |
| During GitHub incidents | up to 10 minutes |

**How to check:** After pushing, go to your repo → **Actions** tab → you'll see a `pages build and deployment` workflow running. Once it shows ✅ green, the live site is updated.

```bash
# Push changes and the site updates automatically:
git add .
git commit -m "your message"
git push
# ✅ live at https://anku0669.github.io/isc2-cc-exam_practice/ in ~30-60s
```

---

## 🎯 Pass Criteria

| | |
|---|---|
| **Passing score** | 70% |
| **Questions** | 502 (full) / 50 (Quick mode) |
| **Exam time limit** | 2.5 hours (Exam Sim mode) |
---

## ⚠️ Disclaimer

This is a **community study tool**, not affiliated with or endorsed by ISC2.
Questions are based on publicly available CC exam domain objectives for self-study purposes only.

---

<div align="center">

⭐ Star this repo if it helped you prepare!

**[🔗 Start Practicing Now → https://anku0669.github.io/isc2-cc-exam_practice/](https://anku0669.github.io/isc2-cc-exam_practice/)**

</div>
