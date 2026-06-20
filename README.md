# Portal CPO

Portal CPO é uma aplicação web desenvolvida para gerenciamento de usuários e acesso ao portal utilizando autenticação integrada ao Supabase.

O projeto possui interface construída em HTML, CSS e JavaScript, utilizando o Supabase como backend para autenticação e armazenamento dos dados.

---

## Status do Projeto

🚧 Em desenvolvimento

Atualmente o sistema possui:

- ✅ Cadastro de usuários
- ✅ Login utilizando Supabase
- ✅ Integração com banco de dados
- ✅ Persistência de informações
- ✅ Telas principais do portal
- ✅ Painel administrativo funcional, incluindo promoção de usuários a administrador

### Correção recente: promoção de usuários a administrador

A funcionalidade de promoção de usuários a administrador apresentava falhas e já foi corrigida. Causas identificadas:

1. A função `handle_new_user` (trigger executado na criação de conta) usava um campo inexistente do Supabase Auth, o que fazia com que alguns usuários fossem criados em `auth.users` sem o perfil correspondente em `public.profiles`.
2. A tabela `public.profiles` possui Row Level Security (RLS) ativado, mas não havia policy de `SELECT`, impedindo que o próprio usuário lesse seu `role` — por isso o menu de administrador não era exibido mesmo após a promoção.

Ambos os pontos foram corrigidos via script SQL (trigger ajustado para usar `raw_user_meta_data` e policy de SELECT adicionada em `profiles`).

---

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Supabase
- SQL

---

## Estrutura do projeto

```
PortalCpo/
│
├── css/
├── js/
├── Geral/
├── inicio/
├── materias/
├── Telas de erros/
├── botoes_reutilizaveis/
├── codigos_A+/
│
├── index.html
├── Home.html
├── Admin.html
└── diagnostico.html
```

---

## Funcionalidades

- Cadastro de usuários
- Login
- Recuperação de conta
- Perfil de usuário
- Navegação entre páginas
- Integração com Supabase
- Painel administrativo (gerenciamento de usuários, professores e matérias)

---

## Banco de dados

O projeto utiliza o **Supabase** como backend.

A configuração da conexão encontra-se em:

```
PortalCpo/js/config.js
```

Os scripts SQL utilizados para configuração administrativa encontram-se em:

```
PortalCpo/codigos_A+/
```

---

## Como executar

1. Clone o repositório

```bash
git clone https://github.com/LucasdeOliveiraCerqueira/Portal_CPO.git
```

2. Abra o projeto em seu editor de preferência.

3. Configure as credenciais do Supabase em:

```
PortalCpo/js/config.js
```

4. Execute utilizando um servidor local, por exemplo:

- Live Server (VS Code)
- XAMPP
- Apache
- Nginx

---

## Melhorias planejadas

- Revisão das policies de RLS (SELECT/UPDATE/DELETE) em todas as tabelas administrativas
- Painel administrativo completo
- Melhor controle de permissões
- Melhor tratamento de erros
- Melhorias na interface
- Refatoração da organização do JavaScript

---

## Autor

Lucas de Oliveira Cerqueira

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos e de aprendizado.
