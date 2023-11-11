# Astro Quickstart Template   

This is a bare-bones Astro project that has everything you need to quickly deploy it!

Hate reading, here's a video: https://youtu.be/SknFflQVOys!

Love reading, here's blog post: www.netlify.app/blog/deploy-your-astro-project-fast/!

## Table of Contents:

- [Quick Setup + Deploy Option](#quick-setup--deploy-option)
- [Regular Setup](#regular-setup)
  - [Cloning + Install Packages](#1-cloning--install-packages)
  - [Deploying](#2-deploying)
- [Astro + Netlify Resources](#astro--netlify-resources)
- [Project Structure](#project-structure)
- [Styling](#styling)
  - [Notes on Styling](#notes-on-styling)
  - [Remove Styling](#remove-styling)
- [Commands](#commands)
- [Testing](#testing)
  - [Included Default Testing](#included-default-testing)
- [Want to learn more?](#want-to-learn-more)

## Regular Setup

 ### 1. Cloning + Install Packages

  - Clone this repo with one of these options:

    - Click the 'Use this template' button at the top of the page
    - Or via the command line `git clone https://github.com/netlify-templates/astro-quickstart`

  - Then install the necessary packages and run the project locally to make sure everything works.

    ```bash
    npm install
    npm run dev
    ```

  > Alternatively, you can run this locally with [the Netlify CLI](https://docs.netlify.com/cli/get-started/)'s by running the `netlify dev` command for more options like receiving a live preview to share (`netlify dev --live`) and the ability to test [Netlify Functions](https://www.netlify.com/products/functions) and [redirects](https://docs.netlify.com/routing/redirects/). 

  ### 2. Deploying
  - Use the `Astro` GitHib Action Workflow with the pages setting `GitHub Actions`.

---

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── style/
│       └── demo-styling.css
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components or layouts.

Any static assets, like images, can be placed in the `public/` directory.

## Styling

We've added some modern styling to this template using css within an external stylesheet, this will allow you to easily remove our styling and add in your own. 

If you decide that you want to keep our styling you can review our style notes below. 

### Notes on Styling

The variables below give you the ability to change the gradient colors of the blobs and are interpolated into the URL string of the background-img within the body. 

```css
// Controls the blob blur gradient colors within the main tag's svg
--top-right-blur-1: #20C6B7;
--top-right-blur-2: #4D9ABF;
--bttm-left-blur-1: #FF5C02;
--bttm-left-blur-2: #FFCDB1;
```

### Remove Styling

If you decide that our styling is not for you, all you'll need to do is remove the [demo-styling.css](https://github.com/netlify-templates/astro-quickstart/tree/main/src/style/demo-styling.css) file. 


## Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:3000`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

## Testing

### Included Default Testing

We’ve included some tooling that helps us maintain these templates. This template currently uses:

- [Cypress Netlify Build Plugin](https://github.com/cypress-io/netlify-plugin-cypress) - to run our tests during our build process

If your team is not interested in this tooling, you can remove them with ease!

## Want to learn more?

Feel free to check [our documentation](https://github.com/withastro/astro) or jump into our [Discord server](https://astro.build/chat).
