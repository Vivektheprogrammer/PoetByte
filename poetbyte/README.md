# PoetByte

PoetByte is a modern poetry platform that allows users to discover, share, and provide feedback on poems. With a clean, minimalist interface, PoetByte creates a distraction-free environment for poetry enthusiasts.

![PoetByte](https://via.placeholder.com/800x400?text=PoetByte)

## Features

- **Poetry Showcase**: Browse through a curated collection of poems
- **Admin Dashboard**: Manage poems and view user feedback
- **Responsive Design**: Enjoy a seamless experience across all devices
- **Dark/Light Mode**: Choose your preferred viewing experience
- **Feedback System**: Allow readers to provide feedback on poems

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB connection

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/poetbyte.git
   cd poetbyte
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

For deployment instructions, please refer to the [DEPLOYMENT.md](./DEPLOYMENT.md) file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
