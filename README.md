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
- ✅ Estrutura inicial do painel administrativo

### Limitação conhecida

No estado atual do projeto, **a funcionalidade de promoção de usuários para administrador ainda não está funcionando corretamente**.

Foram identificados arquivos de configuração e scripts SQL destinados a esse recurso, porém o fluxo completo ainda necessita de ajustes para funcionar conforme esperado.

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
- Estrutura para painel administrativo

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

## Problemas conhecidos

- Não é possível promover usuários para administrador pelo fluxo atual da aplicação.
- O módulo administrativo ainda está em desenvolvimento.

---

## Melhorias planejadas

- Correção do gerenciamento de administradores
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
