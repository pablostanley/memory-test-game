# Memory Game with Lummi Illustrations

A fun and playful web-based memory matching game using random illustrations from Lummi.

## Features

- Start screen with game introduction
- 4x4 grid of cards with random illustrations
- Smooth card flip animations using Framer Motion
- Lives system with heart indicators
- Restart functionality
- Win/lose game states

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui for UI components

## Setup and Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is set up for easy deployment on Vercel.

## How to Play

1. Click "Start Game" on the welcome screen
2. Flip cards by clicking on them to find matching pairs
3. You have 6 lives (hearts) - each incorrect match costs one life
4. Match all pairs before running out of lives to win!

## API Integration

The game connects to Lummi's API to fetch random illustrations. If the API is unavailable, it falls back to placeholder images.
