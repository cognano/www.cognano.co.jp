The Corporate Website.
==

This is a corporate website for the cognano, inc.

[![Build and Deploy](https://github.com/cognano/www.cognano.co.jp/actions/workflows/build.yml/badge.svg)](https://github.com/cognano/www.cognano.co.jp/actions/workflows/build.yml)

Getting Started
--

First, run the development server:

```sh
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

Learn More
--

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

Deployment
--

Deployed to each environment by FTP of deploy workflow in GitHub Actions. The environment has `production` and `staging`, and only builds on the `main` branch are production deployed.
