# Documento de Requisitos – EduGen

## 1. Introdução

### 1.1 Propósito
Este documento descreve os requisitos do EduGen, um sistema web que gera trilhas de aprendizagem com IA Generativa. Ele serve de referência para o desenvolvimento, a manutenção e a avaliação do sistema.

### 1.2 Escopo
O EduGen permite:
- criar um curso a partir de parâmetros informados pelo usuário;
- gerar com IA a estrutura do curso (capítulos e tópicos) e uma imagem de capa;
- revisar e editar a estrutura antes de gerar o conteúdo;
- gerar com IA o conteúdo didático de cada capítulo e, opcionalmente, buscar vídeos;
- matricular-se em cursos próprios ou de outros usuários;
- ler os capítulos e marcar o progresso.

**Fora do escopo:**
- adaptação automática da trilha ao desempenho do estudante;
- edição do curso depois que o conteúdo foi gerado;
- verificação de aprendizagem ou de domínio do conteúdo;
- validação pedagógica automática do material gerado.

### 1.3 Origem dos requisitos
Os requisitos foram definidos na fase de proposição do artefato, dentro da Design Science Research. Eles se basearam no problema de organizar materiais educacionais e nas funcionalidades encontradas na revisão narrativa da literatura. Não houve levantamento validado com todo o público potencial da plataforma.

### 1.4 Definições
| Termo | Significado no EduGen |
|---|---|
| Curso | Unidade armazenada e disponibilizada pela plataforma |
| Trilha | Estrutura de capítulos e tópicos de um curso |
| Estrutura | Resultado da primeira etapa de geração: capítulos, durações e tópicos |
| Conteúdo | Texto didático de cada tópico, gerado na segunda etapa |
| Autor | Usuário que criou o curso |
| Progresso | Capítulos que o próprio usuário marcou como concluídos |

## 2. Atores

| Ator | Descrição |
|---|---|
| Usuário | Pessoa autenticada. Pode criar cursos (como autor), explorar, matricular-se e ler cursos |
| Serviço de IA (OpenAI) | Gera a estrutura, a capa e o conteúdo dos capítulos |
| YouTube Data API | Fornece vídeos relacionados a cada capítulo, quando solicitados |
| Provedor de identidade (Clerk) | Faz login, cadastro e controle de sessão |

## 3. Requisitos Funcionais

| ID | Requisito |
|---|---|
| RF01 | Autenticação de usuários (login e cadastro) mediante provedor de identidade externo |
| RF02 | Criação de curso mediante parâmetros fornecidos pelo usuário: tema, descrição, quantidade de capítulos, nível de aprofundamento, categoria e preferência por inclusão de vídeos |
| RF03 | Geração automática, via IA Generativa, da estrutura do curso (capítulos e respectivos tópicos) a partir dos parâmetros informados |
| RF04 | Geração automática, via IA Generativa, de uma imagem de capa (*banner*) para o curso |
| RF05 | Revisão, pelo usuário, da estrutura gerada antes da solicitação de geração do conteúdo completo |
| RF06 | Geração automática, via IA Generativa, do conteúdo didático completo de cada tópico de cada capítulo do curso |
| RF07 | Busca e associação automática de vídeos complementares a cada capítulo do curso |
| RF08 | Matrícula do usuário em cursos disponíveis, próprios ou de terceiros |
| RF09 | Acompanhamento do progresso do usuário no curso, com marcação de capítulos como concluídos ou não concluídos |
| RF10 | Listagem, para o usuário, dos cursos por ele criados, dos cursos em que está matriculado e dos cursos disponíveis para exploração |

## 4. Requisitos Não Funcionais

| ID | Categoria | Requisito |
|---|---|---|
| RNF01 | Usabilidade | Interface responsiva, adaptada a diferentes tamanhos de tela (*mobile-first*) |
| RNF02 | Desempenho | A geração do conteúdo dos capítulos deve ocorrer em paralelo, de modo a reduzir o tempo de espera percebido pelo usuário |
| RNF03 | Resiliência | Falhas ou indisponibilidade de serviços externos complementares (ex.: procura de vídeos) não devem impedir a geração do curso, devendo o sistema degradar-se graciosamente nesses casos |
| RNF04 | Persistência | Os dados de usuários, cursos e matrículas devem ser armazenados de maneira persistente em banco de dados relacional |
| RNF05 | Feedback ao usuário | O sistema deve fornecer indicação visual de carregamento e mensagens de sucesso ou erro durante operações assíncronas |
| RNF06 | Validação | Validação dos dados fornecidos pelo usuário no formulário de criação de curso antes do envio |
| RNF07 | Clareza visual | Organização do conteúdo gerado (estrutura do curso e conteúdo dos capítulos) em elementos tipográficos e visuais consistentes, favorecendo a leitura e a compreensão do material pelo usuário |

**Alcance da verificação.** A especificação de um requisito não funcional não comprova que ele é atendido em todas as condições:
- **RNF02:** os capítulos são de fato solicitados em paralelo, mas não houve comparação cronometrada com a execução sequencial.
- **RNF01:** não houve teste sistemático em todos os dispositivos.
- **RNF03:** não houve teste sistemático de todos os cenários de falha.

## 5. Regras de Negócio

| ID | Regra |
|---|---|
| RN01 | Apenas o autor pode editar a estrutura e solicitar a geração do conteúdo do curso |
| RN02 | A estrutura (nome, duração e tópicos de cada capítulo) só pode ser editada **antes** da geração do conteúdo; depois disso, a edição é bloqueada |
| RN03 | Cada capítulo editado precisa ter nome, duração e pelo menos um tópico válido |
| RN04 | A busca de vídeos só ocorre quando o usuário marcou "Incluir vídeo" na criação; são buscados até 4 vídeos por capítulo, e o leitor exibe até 2 |
| RN05 | Se a geração da capa falhar, o curso é criado mesmo assim e a interface mostra um ícone no lugar da capa |
| RN06 | A marcação de capítulo concluído registra o progresso **declarado** pelo usuário e não verifica aprendizagem |
| RN07 | Na segunda etapa, o modelo recebe apenas os dados do capítulo revisado (nome, duração e tópicos); nível e descrição do formulário não são reenviados |

## 6. Rastreabilidade (requisito → implementação)

| Requisito | Onde está implementado |
|---|---|
| RF01 | `src/app/(auth)/sign-in`, `src/app/(auth)/sign-up`, `src/middleware.js`, `src/app/api/user/route.jsx` |
| RF02 | `src/app/workspace/_components/add-new-course-dialog.jsx` |
| RF03, RF04 | `src/app/api/generate-course-layout/route.jsx`, `src/config/openai.js` |
| RF05 | `src/app/workspace/edit-course/[courseId]/page.jsx`, `edit-chapter-dialog.jsx`, `PATCH` em `src/app/api/courses/route.jsx` |
| RF06, RF07 | `src/app/api/generate-course-content/route.jsx` |
| RF08 | `POST` em `src/app/api/enroll-course/route.jsx` |
| RF09 | `PUT` em `src/app/api/enroll-course/route.jsx`, `src/app/course/[courseId]` |
| RF10 | `src/app/workspace` (meus cursos), `src/app/workspace/my-learning`, `src/app/workspace/explore`, `GET` em `src/app/api/courses/route.jsx` |

## 7. Limitações conhecidas

- O curso não pode ser editado depois que o conteúdo é gerado.
- A indicação de processamento informa que há uma operação em andamento, mas não mostra a etapa atual nem quanto já foi feito.
- O HTML gerado pelo modelo é exibido sem sanitização. O prompt pede apenas elementos de conteúdo, mas isso não substitui um tratamento técnico da saída.
- As chamadas à API da OpenAI não têm repetição automática, tempo limite nem limite de chamadas simultâneas. Cursos com muitos capítulos podem atingir limites de taxa do serviço.
- Há testes automatizados para apenas parte das rotas (`tests/`) e não há verificação de qualidade contínua.
- A fluência do texto gerado não garante correção factual ou pedagógica. O material deve ser conferido antes do uso educacional.
