---
title: Roots Overview
description: Complete documentation for Roots - Math Documentation for Learners (학습자를 위한 수학 문서)
sidebar:
  order: 1
  ---

  # Roots — Math Documentation

  **학습자를 위한 수학 문서** | 920 SSG pages

  Roots is a systematically organized mathematics documentation site covering algebra, geometry, calculus, and various mathematical fields for learners.

  ## Live Demo

  🌐 **[roots.soundbluemusic.com](https://roots.soundbluemusic.com)**

  ## Features

  ### 📐 Comprehensive Math Coverage

  - **920 pages** of mathematical content
  - - Topics from basic algebra to advanced calculus
    - - Clear explanations with visual examples
      - - Step-by-step problem solving
       
        - ### 🎯 Organized by Topic
       
        - | Category | Topics |
        - |----------|--------|
        - | Algebra | Equations, Polynomials, Functions |
        - | Geometry | Shapes, Angles, Trigonometry |
        - | Calculus | Limits, Derivatives, Integrals |
        - | Statistics | Probability, Distributions |
        - | Linear Algebra | Vectors, Matrices |
       
        - ### 🌐 Multilingual Support
       
        - - Full Korean and English content
          - - Mathematical notation preserved across languages
            - - URL-based language switching
             
              - ### 📱 Interactive Features
             
              - - Mathematical formula rendering with KaTeX
                - - Interactive examples where applicable
                  - - Responsive design for mobile learning
                   
                    - ## Project Structure
                   
                    - ```
                      apps/roots/
                      ├── app/
                      │   ├── components/      # React components
                      │   ├── routes/          # React Router routes
                      │   ├── data/            # Math content data
                      │   │   ├── algebra/     # Algebra topics
                      │   │   ├── geometry/    # Geometry topics
                      │   │   └── calculus/    # Calculus topics
                      │   └── utils/           # Utility functions
                      ├── public/              # Static assets
                      └── react-router.config.ts  # SSG configuration
                      ```

                      ## Key Routes

                      | Route | Description |
                      |-------|-------------|
                      | `/` | Homepage with topic overview |
                      | `/topic/:topicId` | Individual topic page |
                      | `/category/:categoryId` | Category listing |
                      | `/ko/...` | Korean versions |
                      | `/sitemap.xml` | XML sitemap |

                      ## Math Rendering

                      Roots uses KaTeX for mathematical formula rendering:

                      ```tsx
                      // Example component usage
                      <MathDisplay>
                        {`\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}`}
                      </MathDisplay>
                      ```

                      Rendered as: ∫₀^∞ e^(-x²) dx = √π/2

                      ## Data Structure

                      Each math topic contains:

                      ```typescript
                      interface MathTopic {
                        id: string;
                        title: string;
                        category: 'algebra' | 'geometry' | 'calculus' | 'statistics';
                        content: {
                          definition: string;
                          explanation: string;
                          formulas?: string[];
                          examples?: Example[];
                          exercises?: Exercise[];
                        };
                        prerequisites?: string[];
                        relatedTopics?: string[];
                      }
                      ```

                      ## Development

                      ### Start Development Server

                      ```bash
                      pnpm dev:roots
                      # → http://localhost:3005
                      ```

                      ### Build for Production

                      ```bash
                      pnpm build:roots
                      ```

                      ### Run Tests

                      ```bash
                      pnpm test:roots
                      ```

                      ## Deployment

                      Roots is deployed to Cloudflare Pages via GitHub Actions.

                      ### Cloudflare Pages Configuration

                      - **Project Name:** `ro0ts`
                      - - **Build Output:** `apps/roots/build/client`
                        - - **Domain:** `roots.soundbluemusic.com`
                         
                          - ## Why "Roots"?
                         
                          - The name has multiple meanings:
                         
                          - 1. **Mathematical Roots** - Square roots, nth roots, roots of equations
                            2. 2. **Foundational Knowledge** - Getting to the root of mathematical concepts
                               3. 3. **Growing Understanding** - Like roots of a tree, building strong foundations
                                 
                                  4. ## Content Guidelines
                                 
                                  5. All math content follows these principles:
                                 
                                  6. 1. **Progressive Complexity** - Start simple, build up
                                     2. 2. **Visual Learning** - Include diagrams and visual aids
                                        3. 3. **Practical Examples** - Real-world applications
                                           4. 4. **Multiple Approaches** - Show different solving methods
                                              5. 5. **Prerequisites Linked** - Clear learning path
