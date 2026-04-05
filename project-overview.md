# Project Folder Structure!

```text
/Users/farmer/Documents/eac/
├── .DS_Store
├── backend/
│   ├── .air.toml
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── README.md
│   ├── cmd/
│   │   └── seed/
│   │       └── main.go
│   ├── docker-compose.yml
│   ├── eac_postman_collection.json
│   ├── go.mod
│   ├── go.sum
│   ├── internal/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── delivery/
│   │   │   │   │   └── http/
│   │   │   │   │       ├── handler/
│   │   │   │   │       │   ├── handler.go
│   │   │   │   │       │   └── handler_Impl.go
│   │   │   │   │       └── routes.go
│   │   │   │   ├── dtos/
│   │   │   │   │   └── dtos.go
│   │   │   │   ├── repository/
│   │   │   │   │   ├── ent_user.go
│   │   │   │   │   └── user_repo.go
│   │   │   │   └── usecase/
│   │   │   │       ├── auth.go
│   │   │   │       └── auth_impl.go
│   │   │   ├── credentials/
│   │   │   │   ├── delivery/
│   │   │   │   │   └── http/
│   │   │   │   │       ├── handler/
│   │   │   │   │       │   ├── credentials_handler.go
│   │   │   │   │       │   └── credentials_impl.go
│   │   │   │   │       └── routes.go
│   │   │   │   ├── dtos/
│   │   │   │   │   └── credentials_dtos.go
│   │   │   │   ├── repository/
│   │   │   │   │   ├── credentials_repo.go
│   │   │   │   │   └── credentials_repo_impl.go
│   │   │   │   └── usecase/
│   │   │   │       ├── credentials_impl.go
│   │   │   │       └── credentials_usecase.go
│   │   │   ├── project/
│   │   │   │   ├── delivery/
│   │   │   │   │   └── http/
│   │   │   │   │       ├── handler/
│   │   │   │   │       │   ├── project_handler.go
│   │   │   │   │       │   └── project_impl.go
│   │   │   │   │       └── routes.go
│   │   │   │   ├── dtos/
│   │   │   │   │   └── project_dtos.go
│   │   │   │   ├── repository/
│   │   │   │   │   ├── ent_project.go
│   │   │   │   │   └── project_repo.go
│   │   │   │   └── usecase/
│   │   │   │       ├── project_impl.go
│   │   │   │       └── project_usecase.go
│   │   │   └── routes.go
│   │   ├── config/
│   │   │   ├── app.go
│   │   │   └── config.go
│   │   ├── core/
│   │   │   ├── api/
│   │   │   │   └── routes.go
│   │   │   ├── audit/
│   │   │   │   └── audit.go
│   │   │   ├── contracts/
│   │   │   ├── engine/
│   │   │   │   ├── delivery/
│   │   │   │   │   └── http/
│   │   │   │   │       ├── handler/
│   │   │   │   │       │   ├── handler.go
│   │   │   │   │       │   └── handler_impl.go
│   │   │   │   │       └── routes.go
│   │   │   │   ├── dtos/
│   │   │   │   │   └── dtos.go
│   │   │   │   ├── engine.go
│   │   │   │   └── engine_test.go
│   │   │   ├── llm/
│   │   │   │   ├── groq_impl.go
│   │   │   │   ├── llm.go
│   │   │   │   └── mock.go
│   │   │   ├── models/
│   │   │   ├── policy/
│   │   │   ├── registry/
│   │   │   │   ├── delivery/
│   │   │   │   │   └── http/
│   │   │   │   │       ├── handler/
│   │   │   │   │       │   ├── handler.go
│   │   │   │   │       │   └── handler_impl.go
│   │   │   │   │       └── routes.go
│   │   │   │   ├── dtos/
│   │   │   │   │   └── dtos.go
│   │   │   │   ├── registry.go
│   │   │   │   ├── registry_impl.go
│   │   │   │   └── usecase/
│   │   │   │       ├── usecase.go
│   │   │   │       └── usecase_impl.go
│   │   │   ├── storage/
│   │   │   └── validation/
│   │   │       └── validation.go
│   │   ├── middleware/
│   │   │   ├── api_key_auth.go
│   │   │   ├── jwt.go
│   │   │   └── rate_limiter.go
│   │   └── utils/
│   │       ├── jwt.go
│   │       ├── methods.go
│   │       ├── password.go
│   │       ├── responses.go
│   │       └── tracer.go
│   ├── main.go
│   └── tmp/
│       ├── build-errors.log
│       └── main*
├── frontend/
│   ├── .env
│   ├── .gitignore
│   ├── README.md
│   ├── app/
│   │   ├── foundation/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── eslint.config.mjs
│   ├── features/
│   │   └── home/
│   │       ├── components/
│   │       │   ├── architecture.tsx
│   │       │   ├── code-section.tsx
│   │       │   ├── cta.tsx
│   │       │   ├── features.tsx
│   │       │   ├── hero.tsx
│   │       │   ├── index.ts
│   │       │   └── use-cases.tsx
│   │       ├── pages/
│   │       ├── screens/
│   │       │   ├── home-page.tsx
│   │       │   └── index.ts
│   │       └── types/
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public/
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── pngs/
│   │   │   ├── favicon.png
│   │   │   ├── main-icon.png
│   │   │   └── main-logo.png
│   │   ├── svgs/
│   │   │   └── main-logo.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── resources/
│   │   └── home_page.html
│   ├── shared/
│   │   ├── anims/
│   │   │   └── animations.css
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Typography.tsx
│   │   └── hooks/
│   └── tsconfig.json
├── project-overview.md
└── web-app/
    ├── .env
    ├── .gitignore
    ├── README.md
    ├── app/
    │   ├── (auth)/
    │   │   ├── sign-in/
    │   │   │   └── page.tsx
    │   │   └── sign-up/
    │   │       └── page.tsx
    │   ├── (protected)/
    │   │   └── project/
    │   │       ├── [projectId]/
    │   │       │   ├── keys/
    │   │       │   │   └── page.tsx
    │   │       │   ├── layout.tsx
    │   │       │   ├── not-found/
    │   │       │   │   └── page.tsx
    │   │       │   ├── page.tsx
    │   │       │   └── settings/
    │   │       └── page.tsx
    │   ├── api/
    │   │   └── auth/
    │   │       ├── login/
    │   │       │   └── route.ts
    │   │       ├── logout/
    │   │       │   └── route.ts
    │   │       ├── register/
    │   │       │   └── route.ts
    │   │       ├── session/
    │   │       │   └── route.ts
    │   │       └── switch-project/
    │   │           └── route.ts
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── config/
    │   └── api-client.ts
    ├── eslint.config.mjs
    ├── features/
    │   ├── auth/
    │   │   ├── apis/
    │   │   │   └── index.ts
    │   │   ├── components/
    │   │   │   ├── index.ts
    │   │   │   ├── sign-in-form.tsx
    │   │   │   └── sign-up-form.tsx
    │   │   ├── hooks/
    │   │   │   └── index.ts
    │   │   ├── pages/
    │   │   │   ├── index.ts
    │   │   │   ├── sign-in-page.tsx
    │   │   │   └── sign-up-page.tsx
    │   │   └── types/
    │   │       └── index.ts
    │   ├── dashboard/
    │   │   ├── components/
    │   │   │   ├── index.ts
    │   │   │   └── project-not-found-content.tsx
    │   │   └── pages/
    │   │       ├── dashboard-page.tsx
    │   │       ├── index.ts
    │   │       └── project-not-found.tsx
    │   ├── keys/
    │   │   ├── apis/
    │   │   │   └── index.ts
    │   │   ├── components/
    │   │   │   └── create-api-key-form.tsx
    │   │   ├── hooks/
    │   │   │   └── index.ts
    │   │   ├── pages/
    │   │   │   ├── index.ts
    │   │   │   └── keys-screen.tsx
    │   │   └── types/
    │   │       └── index.d.ts
    │   └── project/
    │       ├── apis/
    │       │   └── index.ts
    │       ├── components/
    │       │   ├── create-project-form.tsx
    │       │   ├── creation-navbar.tsx
    │       │   └── index.ts
    │       ├── hooks/
    │       │   └── index.ts
    │       ├── pages/
    │       │   ├── create-project.tsx
    │       │   └── index.ts
    │       └── types/
    │           └── index.d.ts
    ├── middleware.ts
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── providers/
    │   ├── auth.tsx
    │   └── index.tsx
    ├── public/
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── window.svg
    ├── resource/
    │   ├── api_keys.html
    │   ├── creat_key_modal.html
    │   ├── create_project.html
    │   ├── dashboard_page.html
    │   ├── sign_in.html
    │   └── sogn_up.html
    ├── shared/
    │   ├── anims/
    │   │   └── animations.css
    │   ├── components/
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── Typography.tsx
    │   │   ├── data-table.tsx
    │   │   ├── forms/
    │   │   │   └── FormInput.tsx
    │   │   └── modal.tsx
    │   ├── hooks/
    │   └── layouts/
    │       └── project-dashboard.tsx
    ├── tsconfig.json
    └── types/
        └── index.d.ts

136 directories, 276 files
```