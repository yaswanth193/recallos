# RecallOS 🧠
> **Tagline:** *Your learning is scattered. Your knowledge shouldn't be.*  
> **Course:** INT252 Web App Development with ReactJS (100% Syllabus Coverage)

RecallOS is an **AI-powered Personal Learning Intelligence System** that enables students to capture, organize, understand, and retain digital learning experiences across scattered platforms (YouTube, documentation, Medium, LeetCode, PDFs, and courses) into a single, cohesive, and actionable second brain.

---

## 🎓 Specially Tailored for Your Teacher ("Mam") & Laboratory Evaluation

Your teacher requested that your project be **100% built using the topics covered in the INT252 syllabus**. 

RecallOS doesn't just mention the syllabus — it contains a **dedicated interactive "14 Practicals Lab" (`/syllabus-lab`)** where you can click through every single practical and demonstrate it live during your viva or project presentation!

### Complete 14 Practicals Traceability Table

| Practical # | Syllabus Experiment Title | Where It Runs Live in RecallOS | Code File & Concept Reference |
| :---: | :--- | :--- | :--- |
| **1** | Implement JavaScript utility functions using arrow functions, array methods, destructuring, and immutability principles. | [`/syllabus-lab`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/features/syllabus/SyllabusLabView.jsx) & Dashboard | [`src/utils/immutableHelpers.js`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/utils/immutableHelpers.js) (`deepCopy`, `computeMasteryAverages` with `reduce`, `Object.is`) |
| **2** | Set up a React application using Vite and explore project structure, JSX syntax, and functional component rendering. | Whole Application Structure | [`vite.config.js`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/vite.config.js), [`src/main.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/main.jsx) |
| **3** | Develop reusable functional components demonstrating props usage, component composition, and conditional rendering. | Common UI components | [`src/components/common/Card.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/components/common/Card.jsx) (Compound component), [`Button.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/components/common/Button.jsx), [`Badge.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/components/common/Badge.jsx) |
| **4** | Design a responsive user interface using Tailwind CSS utility classes and reusable styling patterns. | Responsive Layout & Breakpoints | [`tailwind.config.js`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/tailwind.config.js), [`src/components/layout/AppLayout.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/components/layout/AppLayout.jsx) |
| **5** | Implement event handling and local state management using useState and analyze component re-render behavior. | Interactive Lab & Quiz View | [`src/features/syllabus/SyllabusLabView.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/features/syllabus/SyllabusLabView.jsx) (Automatic batching demo), [`QuizView.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/features/quiz/QuizView.jsx) |
| **6** | Manage side effects using useEffect and demonstrate effect cleanup and dependency handling. | Lab & Debounce Hook | [`src/features/syllabus/SyllabusLabView.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/features/syllabus/SyllabusLabView.jsx) (`clearInterval` cleanup), [`useDebounce.js`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/hooks/useDebounce.js) |
| **7** | Optimize component performance using useCallback, useMemo, and React.memo. | Lab Performance Benchmark | [`src/features/syllabus/SyllabusLabView.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/features/syllabus/SyllabusLabView.jsx) (MemoizedChild render counter stays 0) |
| **8** | Create and use a custom hook to encapsulate and reuse component logic. | Custom Hooks Folder | [`src/hooks/useDebounce.js`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/hooks/useDebounce.js), [`src/hooks/useLocalStorage.js`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/hooks/useLocalStorage.js) |
| **9** | Build controlled and uncontrolled form components with proper form submission handling. | Lab Form Playground & Tracker Modal | [`src/features/syllabus/SyllabusLabView.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/features/syllabus/SyllabusLabView.jsx) (Controlled `useState` vs Uncontrolled `useRef`) |
| **10** | Implement schema-based form validation using Zod and display validation errors dynamically. | Resource Capture & Lab | [`src/validation/schemas.js`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/validation/schemas.js) (`resourceCaptureSchema.safeParse()`), [`ResourceCaptureModal.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/features/tracker/ResourceCaptureModal.jsx) |
| **11** | Fetch and display server data using Fetch API or Axios with proper loading and error state handling. | Lab Axios Demo & Services | [`src/services/apiService.js`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/services/apiService.js) (Axios client with interceptors, 200 OK & 500 error handlers) |
| **12** | Manage server state using React Query, demonstrating caching and background data synchronization. | Knowledge Vault & Lab | [`src/features/vault/VaultView.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/features/vault/VaultView.jsx) (`useQuery`, `useMutation`, `invalidateQueries`, 5m `staleTime`) |
| **13** | Implement client-side routing with dynamic routes, nested routes, and protected routes. | App Routing & Guard | [`src/App.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/App.jsx) (Dynamic `/quiz/:topicId`, Layout `<Outlet />`, Protected `/pro-workspace`) |
| **14** | Develop a React application using global state management with Context or Zustand and deploy the production build. | Global Store & Context | [`src/store/useRecallStore.js`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/store/useRecallStore.js) (Zustand slices & selectors), [`NotificationContext.jsx`](file:///C:/Users/ravur/.gemini/antigravity/scratch/recallos/src/context/NotificationContext.jsx) |

---

## 🌟 The 7 Core RecallOS Modules

1. **Smart Learning Tracker (`/tracker`)**:
   - Captures tutorials from YouTube, LeetCode, Medium/Dev.to, and MDN Docs.
   - Browser extension simulator with 1-click active tab capture.
   - Form handling with **Zod schema validation** (`resourceCaptureSchema`).

2. **AI Knowledge Builder (`/builder`)**:
   - Extracts concepts, key takeaways, and executive summaries from raw notes and PDFs.
   - 1-click export directly to the Knowledge Vault and Interactive Graph.

3. **Personal Knowledge Vault (`/vault`)**:
   - Centralized indexed repository of all learning resources.
   - Multi-filtering (Platform, Domain, Status) and debounced search (`useDebounce`).

4. **Interactive Knowledge Graph (`/graph`)**:
   - Visual SVG network connecting concepts (*Virtual DOM → Reconciliation → Fiber*, etc.).
   - Color-coded mastery rings (🟢 >80%, 🟣 60-80%, 🔴 <60% Gaps).
   - Side inspector with related links and targeted drill launcher.

5. **Ask Your Brain (`/brain`)**:
   - Conversational second-brain RAG assistant.
   - Answers questions strictly based on saved vault resources with exact source citations.

6. **Knowledge Gap Radar (`/radar`)**:
   - Live SVG Polygon Radar chart measuring retention across skill dimensions.
   - Isolates weak topics (<60%) and provides diagnostic explanations.

7. **Adaptive Quiz & Revision (`/quiz`)**:
   - Generates interactive quizzes dynamically.
   - Recalibrates concept mastery in real time and updates SuperMemo (SM-2) spaced repetition schedules with celebratory confetti (`canvas-confetti`).

---

## 👥 Project Team & Collaborators
- **Yaswanth** (Lead Developer & System Architect) — GitHub: [@yaswanth193](https://github.com/yaswanth193)
- **Surendra** (Co-Developer & Collaborator)

---

## 🎯 Viva Q&A Cheat Sheet (For your presentation to your teacher)

- **Q: Where is immutability and array transformation used? (Unit I)**  
  *A:* In `src/utils/immutableHelpers.js`, we implemented `deepCopy` via `structuredClone`, `shallowEqual` via `Object.is`, and `computeMasteryAverages` using `Array.prototype.reduce`.

- **Q: What is the difference between controlled and uncontrolled components in your project? (Unit IV)**  
  *A:* Demonstrated in `src/features/syllabus/SyllabusLabView.jsx` and `ResourceCaptureModal.jsx`. In controlled components, form input values are bound to React `useState` and update on `onChange`. In uncontrolled components, inputs use `useRef` and their values are pulled directly from the browser DOM only upon submission.

- **Q: Why did you use Zod instead of manual if-else statements? (Unit IV)**  
  *A:* Zod provides declarative, type-safe schema validation. Using `resourceCaptureSchema.safeParse(data)` returns an issues array that dynamically populates field-level errors without `try/catch` runtime overhead.

- **Q: How does Zustand compare to Context API in your architecture? (Unit VI)**  
  *A:* React Context API triggers re-renders across all consumer components whenever its value reference changes. Zustand uses external store selectors (`useRecallStore(state => state.searchQuery)`), re-rendering only the specific component watching that slice. We use Context API for global notifications (`NotificationContext`) and Zustand for the main data store.

- **Q: How does React Query handle caching and server state? (Unit V)**  
  *A:* React Query manages server cache with `staleTime: 5 mins`. When resources are created or deleted, `queryClient.invalidateQueries({ queryKey: ['resources'] })` automatically triggers background synchronization.

---

## 🚀 How to Run

1. Open PowerShell / Terminal in the project directory:
   ```bash
   cd C:\Users\ravur\.gemini\antigravity\scratch\recallos
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
4. Click on **"14 Practicals Lab"** in the sidebar to view the live viva demonstration!
