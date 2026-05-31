 # My AI Collaboration & Engineering Log - Sprint 2

For Sprint 2 (the "Cash-Flow" Dashboard Module), I used Gemini AI as a technical pairing partner. My main goal was to consult the AI to understand core JavaScript architectural concepts, troubleshoot structural bugs, and ensure the application remains strictly within Vanilla JavaScript constraints before moving to React.

Below is the honest log of how I leveraged AI guidance to build this project:

## 1. Troubleshooting Core Calculation & Validation (Phase 1)
* *The String Concatenation Bug:* When I initially hooked up the DOM inputs, JavaScript was concatenating numbers (e.g., treating 10 + 10 as 1010). I consulted the AI, which guided me to explicitly wrap input.value streams inside Number() and parseFloat() functions before executing any mathematical operations.
* *UI Error State:* I worked with the AI to map out a programmatic validation filter. It catches empty inputs or negative values early in the submission lifecycle, blocking bad data and triggering a native error banner on the dashboard.

## 2. Managing State Lifecycle & Visualizations (Phase 2)
* *Chart Duplication/Overlap Fix:* While rendering Chart.js, adding or deleting a new expense caused the canvas UI to glitch or duplicate. The AI helped me understand the Chart instance lifecycle and suggested invoking the .destroy() method on the active chart object before firing a new render cycle.
* *State Serialization:* To prevent the browser's localStorage from returning [object Object], I used AI to understand serialization. I implemented JSON.stringify() to save data arrays safely as strings and JSON.parse() to retrieve and map them seamlessly upon page reloads.

## 3. Designing Advanced Features (Phase 3)
* *jsPDF Canvas Mapping:* I asked the AI for structural references to map out coordinate positioning (doc.text, doc.line) inside the jsPDF library. This helped me build a clean financial report template that dynamically loops through my itemized expense array.
* *Asynchronous Currency Toggle:* I integrated the keyless Frankfurter API via an async/await fetch wrapper. The AI guided me on how to decouple the display currency state from the core dataset so that switching between INR and USD keeps the data mathematically synchronized.
* *10% Threshold Warning:* I implemented a dynamic condition that checks if the remaining balance drops below 10% of the total salary. I used AI to refine how JavaScript mutates Tailwind CSS utility classes in real-time to flash a critical RED alert state to the user.

## Conclusion
I did not use AI to skip the coding process. Instead, I used it to understand the "why" behind DOM lifecycles, memory management (destroying chart instances), data parsing, and clean state handling. This has prepared me thoroughly for manual DOM manipulation principles.