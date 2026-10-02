# MedGuide — Front-end

Aplicação web do MedGuide para conectar pacientes a profissionais de saúde. Oferece fluxos separados para pacientes e médicos, busca de profissionais e gestão de consultas. A API fica no repositório [Medguide](https://github.com/PedroHSFreire/Medguide).

## Funcionalidades

- Páginas iniciais e de dúvidas.
- Cadastro e login separados para pacientes e médicos.
- Painéis e páginas de perfil para os dois tipos de usuário.
- Busca de médicos e especialidades.
- Criação, consulta e cancelamento de agendamentos.
- Proteção de páginas e gerenciamento de sessão no cliente.

## Tecnologias

- Next.js 16 com App Router e React 19.
- TypeScript, Tailwind CSS 4 e ESLint.
- `fetch`/Axios para comunicação com a API e NextAuth para integração de autenticação.

## Requisitos e execução

Use uma versão do Node.js compatível com Next.js 16 e npm.

```bash
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`. Para conferir a versão de produção e as regras de lint:

```bash
npm run build
npm run start
npm run lint
```

`npm run start` serve a compilação existente; execute `npm run build` antes.

## Configuração

O cliente lê as seguintes variáveis de ambiente:

| Variável | Finalidade |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL base do back-end, sem o sufixo `/api` (por exemplo, `http://localhost:8080`) |
| `NEXTAUTH_URL` | URL pública da aplicação usada pela configuração de autenticação |
| `NEXTAUTH_SECRET` | Segredo da sessão NextAuth; use valor aleatório e mantenha fora do Git |

Copie `.env.example` para `.env.local` e preencha os valores do seu ambiente. Nunca publique credenciais ou segredos. O arquivo `.env.local` que estava rastreado foi removido da versão atual e passou a ser ignorado pelo Git; como os valores anteriores permanecem no histórico, considere o segredo NextAuth e quaisquer credenciais reais que estavam nele expostos e rotacione-os. O front-end chama a API configurada em `NEXT_PUBLIC_API_URL`; a persistência de cadastros e consultas é feita pelo SQLite no back-end.

## Organização do código

```text
src/app/
  doctor/                 login, cadastro, painel e perfil do médico
  pacient/                login, cadastro, painel e perfil do paciente
  doubts/                 página de dúvidas
  api/auth/[...nextauth]/ integração do NextAuth
  lib/                    autenticação, hooks, serviços e tipos da API
src/components/           componentes e telas compartilhados
public/                   recursos estáticos
```

As páginas vivem no App Router. Os módulos em `src/app/lib/service` concentram chamadas HTTP de autenticação, perfis, busca e consultas; hooks em `src/app/lib/hooks` conectam essas operações às páginas. O estado de autenticação e os componentes de acesso protegido ficam em `lib/auth*`, `useAuth` e `ProtectedRoute`.

## Integração com o back-end

O front-end espera a API no formato `${NEXT_PUBLIC_API_URL}/api`. Entre os caminhos consumidos estão:

- `/doctor/register`, `/doctor/login`, `/doctor/profile`, `/doctor/search` e `/doctor/specialties`.
- `/pacient/register`, `/pacient/login` e `/pacient/profile`.
- `/appointments` e caminhos para buscar ou cancelar consultas.

As chamadas autenticadas obtêm o token armazenado no navegador e o enviam como `Authorization: Bearer <token>`. Consulte o README do back-end para rotas disponíveis e campos esperados.

## Pontos encontrados na avaliação

- A listagem de consultas usa `/api/appointments/patient/:patientId`, alinhado com a rota do back-end nesta revisão.
- Há mais de um serviço de busca de médicos e agendamentos com contratos parcialmente diferentes. Ao alterar a API, confira todos os módulos consumidores.
- A integração NextAuth e a autenticação própria via token no `localStorage` coexistem no código. Revise qual fluxo é a fonte oficial de sessão antes de ampliar o uso.
- O `.env.local` foi removido da versão atual do Git e passou a ser ignorado, mas continua no histórico anterior. Segredos que já foram publicados precisam ser rotacionados; removê-los em um commit futuro não apaga o histórico.
- Não foi encontrado script de testes; os scripts disponíveis são `dev`, `build`, `start` e `lint`.
