# ISpace: AI-Powered Interior Design Studio

[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)
[![Firebase Studio](https://custom-icon-badges.demolab.com/badge/Firebase%20Studio-F66C21?logo=firebase-studio&logoColor=fff)](#)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-886FBF?logo=googlegemini&logoColor=fff)](#)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](#)

ISpace is a cutting-edge web application that leverages generative AI to empower both professional designers and everyday users to create stunning, personalized interior designs. By combining user-provided images with contextual information, ISpace transforms ideas into photorealistic visual proposals, streamlining the creative process.

This project demonstrates a modern, full-stack application built with a focus on user experience, scalability, and the practical application of generative AI.

## Key Features

- **AI-Powered Design Generation:** Utilizes Google's Gemini model via Genkit to generate high-quality interior design images from text and image prompts.
- **Iterative Feedback Loop:** Users can provide feedback ("love it" / "not quite") and text-based suggestions to refine and evolve the generated designs.
- **Visual Version History:** All design iterations are saved, allowing users to track the project's evolution and revert to previous versions.
- **Interactive Chat Interface:** A familiar chat-based UI for intuitive interaction with the AI assistant.
- **Image & Text Prompts:** Supports uploading reference images of a space, which the AI uses alongside text prompts for more accurate results.
- **Collapsible Panels:** A clean, modern layout with responsive side panels for chat and controls, inspired by professional design software.
- **Export Functionality:** Users can export their favorite design to save and share.

## Technology Stack

This project is built on a modern, robust, and scalable technology stack:

- **Frontend:**
  - **Framework:** [Next.js](https://nextjs.org/) (App Router)
  - **Language:** [TypeScript](https://www.typescriptlang.org/)
  - **UI Library:** [React](https://reactjs.org/)
  - **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  - **Component Library:** [ShadCN UI](https://ui.shadcn.com/) for beautiful, accessible, and customizable components.

- **Backend & AI:**
  - **Hosting:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
  - **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit) (Google's open-source generative AI framework)
  - **AI Model:** [Gemini](https://deepmind.google/technologies/gemini/) for advanced image generation capabilities.

- **Testing:**
  - **E2E Testing:** [Cypress](https://www.cypress.io/) for comprehensive end-to-end test suites.
  - **Cloud-Based Testing:** [Firebase Test Lab](https://firebase.google.com/docs/test-lab) integration for simulating various devices and browsers.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/ispace.git
    cd ispace
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Google AI API key:
    ```env
    GEMINI_API_KEY=your_google_ai_api_key
    ```

4.  **Run the Genkit developer server:**
    In a separate terminal, start the Genkit server to enable AI functionalities.
    ```sh
    npm run genkit:dev
    ```

5.  **Run the development server:**
    In your main terminal, start the Next.js development server.
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Running Tests

To run the end-to-end tests, use the following command:

```sh
npm run cypress:run
```

To open the Cypress test runner for interactive testing:

```sh
npm run cypress:open
```
**Note:** For file upload tests to pass, ensure you have placeholder images (`room-1.jpg`, `room-2.jpg`) in the `cypress/fixtures` directory.

## License

Distributed under the MIT License. See `LICENSE` for more information.
