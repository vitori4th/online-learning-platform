# EduGen

Sistema web para geração automatizada de trilhas de aprendizagem com IA Generativa.

A partir de poucos parâmetros (tema, descrição, número de capítulos, nível, categoria e opção de vídeos), o EduGen gera a estrutura de um curso. O autor revisa e edita essa estrutura, e só então o conteúdo de cada capítulo é gerado. Depois de pronto, o curso pode receber matrículas e ser lido com acompanhamento de conclusão dos capítulos.

Aplicação publicada: https://online-learning-platform-tau.vercel.app/

Projeto desenvolvido no Trabalho de Conclusão de Curso *EduGen: Um Sistema Web para Geração Automatizada de Trilhas de Aprendizagem com IA Generativa* (Sistemas de Informação, UNIFEI, 2026).

## Funcionalidades

- Login e cadastro de usuários
- Criação de curso a partir de parâmetros
- Geração da estrutura do curso (capítulos e tópicos) e da imagem de capa com IA
- Revisão e edição da estrutura antes da geração do conteúdo
- Geração do conteúdo de cada capítulo, em paralelo, com busca opcional de vídeos no YouTube
- Exploração de cursos e matrícula
- Leitor do curso com marcação de capítulos concluídos

## Tecnologias

- [Next.js](https://nextjs.org) (App Router) e React
- Tailwind CSS e shadcn/ui (Radix UI)
- PostgreSQL serverless ([Neon](https://neon.tech)) com [Drizzle ORM](https://orm.drizzle.team)
- Autenticação com [Clerk](https://clerk.com)
- OpenAI API (texto: `gpt-4o`; imagem: `gpt-image-1-mini`)
- YouTube Data API v3
- Hospedagem na [Vercel](https://vercel.com)

## Como executar

### Pré-requisitos

- Node.js
- Banco PostgreSQL (por exemplo, no Neon)
- Contas e chaves da OpenAI, do Clerk e da YouTube Data API

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL=
OPENAI_API_KEY=
OPENAI_TEXT_MODEL=gpt-4o
OPENAI_IMAGE_MODEL=gpt-image-1-mini
YOUTUBE_API_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

`OPENAI_TEXT_MODEL` e `OPENAI_IMAGE_MODEL` são opcionais; sem elas, o sistema usa os valores acima. Sem `YOUTUBE_API_KEY`, os capítulos são gerados sem vídeos.

### Instalação e execução

```bash
npm install
npm run db:migrate
npm run dev
```

Abra http://localhost:3000 no navegador.

### Scripts

| Script | Função |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run start` | Inicia a versão de produção |
| `npm run lint` | Verifica o código |
| `npm run db:generate` | Gera as migrações do banco a partir do esquema |
| `npm run db:migrate` | Aplica as migrações no banco |

## Documentação

A documentação completa está em [`docs/`](docs/README.md):

- [Requisitos](docs/01-requisitos.md)
- [Casos de uso](docs/02-casos-de-uso.md)
- [Arquitetura e modelo de dados](docs/03-arquitetura.md)
- [Fluxo de geração e prompts](docs/04-fluxo-de-geracao.md)
- [Avaliação de usabilidade](docs/05-avaliacao-usabilidade.md)
- [Wireframes](docs/wireframes/)

## Autora

Vitória Thais da Silva. Orientação: Profa. Simone de Sousa Borges.
