# ComplianceAlpha - Indian Freelancer Tax Compliance Generator

## Project Overview
ComplianceAlpha is an AI-powered compliance tool designed for Indian freelancers and SMBs. It interviews users about their cross-border income and generates a personalized tax compliance roadmap using the Claude 3.5 API.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui patterns
- **AI:** Anthropic Claude 3.5 Sonnet API
- **PDF Generation:** jsPDF + jspdf-autotable
- **Validation:** Zod
- **Markdown:** react-markdown + remark-gfm

## Installation Steps
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd compliance-alpha
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Environment Variables Setup
1.  Copy the example environment file:
    ```bash
    cp .env.example .env.local
    ```
2.  Add your Anthropic API key to `.env.local`:
    ```
    ANTHROPIC_API_KEY=your_actual_api_key_here
    ```

## Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Building for Production
```bash
npm run build
npm start
```

## Deployment Guide (Vercel)
1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the `ANTHROPIC_API_KEY` in the Vercel Project Settings > Environment Variables.
4.  Deploy.

## API Rate Limits & Costs
-   The `generate-plan` API route implements a basic rate limiter (10 requests/IP/hour) to control costs.
-   Each plan generation consumes tokens via the Anthropic API. Monitor your usage in the Anthropic Console.

## Known Issues / TODOs
-   **Stripe Integration:** The UI includes a "Unlock Templates" button, but the actual payment processing logic is not yet implemented.
-   **Database:** Currently, state is persisted via `localStorage`. For a production app, a database (Postgres/Supabase) would be better for saving user histories.
-   **Testing:** Basic manual testing is recommended. Automated tests (Jest/Playwright) are not yet included.

## License
MIT
