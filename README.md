# 🌿 EcoVerify – The Greenwash Sentinel

EcoVerify is an AI-powered sustainability auditing platform that detects potential greenwashing in corporate sustainability claims. It uses a **multi-agent AI pipeline** to analyze company sustainability pages, verify claims against public evidence, and generate an explainable **Greenwash Risk Score**.

---

## 🚀 Features

- 🔍 AI-powered sustainability claim extraction
- 🤖 Multi-agent verification pipeline
- 📑 Public evidence cross-checking
- ⚖️ Explainable AI verdicts
- 📊 Greenwash Risk Score
- 📈 Interactive audit dashboard
- ⚡ Modern, responsive UI
- 🎯 Real-time audit progress visualization

---

## 🏗️ System Architecture

```
User
   │
   ▼
Enter Sustainability URL
   │
   ▼
Fact-Finder Agent
   │
Extract Sustainability Claims
   │
   ▼
Challenger Agent
   │
Search Public Evidence
   │
   ▼
Judge Agent
   │
Compare Claims vs Evidence
   │
   ▼
Generate Verdicts
   │
   ▼
Greenwash Risk Score
   │
   ▼
Interactive Dashboard
```

---

## 🤖 Multi-Agent Workflow

### 🟢 Fact-Finder Agent

- Reads sustainability webpages
- Identifies measurable environmental claims
- Categorizes claims
- Extracts metrics and timelines

---

### 🟠 Challenger Agent

- Searches public evidence
- Collects:
  - Regulatory reports
  - NGO publications
  - Scientific papers
  - News articles
  - Court records
  - Financial disclosures

---

### 🔵 Judge Agent

- Evaluates evidence credibility
- Determines whether claims are:
  - ✅ Verified
  - ⚠ Needs Context
  - ❌ Misleading
  - 🚩 Unsubstantiated
- Produces explainable reasoning

---

## 📊 Output

For every audit EcoVerify generates:

- Company information
- Extracted sustainability claims
- Supporting & contradicting evidence
- AI reasoning
- Individual claim verdicts
- Greenwash Risk Score
- Overall audit summary

---

## 🛠 Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

### AI

- Vercel AI SDK
- Google AI SDK

### Development

- TypeScript
- PostCSS
- ESLint

---

## 📂 Project Structure

```
.
├── app/
├── components/
├── lib/
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/ecoverify.git
```

Move into the project

```bash
cd ecoverify
```

Install dependencies

```bash
npm install
```

or

```bash
pnpm install
```

or

```bash
yarn install
```

---

## ▶️ Run Locally

```bash
npm run dev
```

Open your browser at

```
http://localhost:3000
```

---

## 📦 Build

```bash
npm run build
```

Start production server

```bash
npm run start
```

---

## 📸 Example Audit

Input:

```
https://company.com/sustainability
```

Output:

- Sustainability claims extracted
- Evidence collected
- AI explanations
- Risk score
- Final Greenwashing assessment

---

## 🎯 Use Cases

- ESG auditing
- Corporate sustainability verification
- Environmental compliance
- Due diligence
- Investor research
- NGO investigations
- Journalism
- Academic research

---

## 🔒 Explainable AI

EcoVerify emphasizes transparency by providing:

- Evidence-backed conclusions
- Confidence scores
- Public citations
- Explainable reasoning
- Human-readable summaries

---

## 🌍 Future Enhancements

- PDF sustainability report analysis
- SEC/ESG filing integration
- Multi-language support
- Live web crawling
- Historical sustainability tracking
- Industry benchmarking
- Export reports (PDF/CSV)
- API access

---

## 👥 Contributors

Contributions are welcome!

Feel free to fork the repository, create a feature branch, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub to support future development.
