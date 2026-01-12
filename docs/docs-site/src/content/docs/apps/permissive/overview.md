---
title: Permissive Overview
description: Complete documentation for Permissive - Free Web Development Resources (무료 웹개발 자료 모음)
sidebar:
  order: 1
  ---

  # Permissive — Web Dev Resources

  **무료 웹개발 자료 모음** | 8 SSG pages

  Permissive is a curated collection of web development libraries with permissive licenses (MIT, Apache, BSD, etc.) and Web API documentation.

  ## Live Demo

  🌐 **[permissive.soundbluemusic.com](https://permissive.soundbluemusic.com)**

  ## Features

  ### 📚 Library Collection

  - Curated list of web development libraries
  - - All libraries have permissive licenses (MIT, Apache 2.0, BSD)
    - - Categorized by purpose (UI, State Management, Animation, etc.)
     
      - ### 📖 Web API Documentation
     
      - - Modern Web APIs documentation
        - - Browser compatibility information
          - - Code examples and usage patterns
           
            - ### 🌐 Multilingual Support
           
            - - English and Korean interface
              - - URL-based language switching
                - - SEO-optimized for both languages
                 
                  - ## Project Structure
                 
                  - ```
                    apps/permissive/
                    ├── app/
                    │   ├── components/      # React components
                    │   ├── routes/          # React Router routes
                    │   ├── data/            # Library data
                    │   └── utils/           # Utility functions
                    ├── public/              # Static assets
                    └── react-router.config.ts  # SSG configuration
                    ```

                    ## Key Routes

                    | Route | Description |
                    |-------|-------------|
                    | `/` | Homepage with library categories |
                    | `/libraries` | All libraries list |
                    | `/web-apis` | Web APIs documentation |
                    | `/ko/...` | Korean versions |

                    ## Library Categories

                    | Category | Description |
                    |----------|-------------|
                    | UI Components | React component libraries |
                    | State Management | State management solutions |
                    | Animation | Animation libraries |
                    | Utilities | Utility libraries |
                    | Testing | Testing frameworks |

                    ## Data Structure

                    Each library entry contains:

                    ```typescript
                    interface Library {
                      id: string;
                      name: string;
                      description: string;
                      license: 'MIT' | 'Apache-2.0' | 'BSD-3-Clause' | string;
                      repository: string;
                      npm?: string;
                      category: string;
                      tags: string[];
                    }
                    ```

                    ## Development

                    ### Start Development Server

                    ```bash
                    pnpm dev:permissive
                    # → http://localhost:3004
                    ```

                    ### Build for Production

                    ```bash
                    pnpm build:permissive
                    ```

                    ## Deployment

                    Permissive is deployed to Cloudflare Pages via GitHub Actions.

                    ### Cloudflare Pages Configuration

                    - **Project Name:** `permissive`
                    - - **Build Output:** `apps/permissive/build/client`
                      - - **Domain:** `permissive.soundbluemusic.com`
                       
                        - ## Why "Permissive"?
                       
                        - The name reflects our focus on permissively-licensed software:
                       
                        - - **MIT License** - Simple, permissive
                          - - **Apache 2.0** - Patent protection included
                            - - **BSD Licenses** - Academic-friendly
                              - - **ISC License** - Simplified MIT
                               
                                - All featured libraries can be freely used in both open-source and commercial projects.
