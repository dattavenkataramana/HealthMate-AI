# HealthMate AI — 2 Minute Video Script

Record your screen while the app is running at `http://localhost:3010` and API at `http://localhost:8000`.

## Script

Hello, my name is Dattavenkataramana Bavirisetti.

I am presenting HealthMate AI, an AI-powered healthcare appointment assistant built for this assessment.

I used ChatGPT and Cursor for planning, prompt engineering, and coding support. The stack is Next.js for the frontend, Python FastAPI for the backend, SQLite for appointments, and the OpenAI API for the assistant.

I started by defining the architecture and safety rules, then built provider search, appointment booking, AI chat, and appointment summaries.

For prompt engineering, I first used a basic planning prompt, then refined the assistant system prompt to block diagnosis, prescriptions, invented providers, and unsafe emergency handling. I also improved the appointment summary prompt so it stays short and factual.

One challenge was making the demo work even without an OpenAI key. I solved that with safe fallback replies while keeping full AI responses available when the key is configured.

Now I will demonstrate the app: searching providers, booking a sample appointment, viewing the AI summary, and asking the assistant a booking question.

This project is educational only and does not replace professional medical advice.

Thank you for reviewing my submission.

## Demo checklist while recording

1. Open Home and show HealthMate AI branding
2. Filter providers by specialty
3. Select a provider and book an appointment
4. Open My Appointments and show AI summary
5. Ask AI: "How can I book an appointment?"
6. Mention prompt documentation and GitHub repo
