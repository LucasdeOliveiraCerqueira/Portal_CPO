# Portal CPO - Plataforma de Estudos

Plataforma de estudos web com HTML/CSS/JavaScript, utilizando Supabase como backend para autenticação e dados dinâmicos.

---

## 🎯 Fluxo Completo do Site

```
index.html (Login)
    ↓ [Email + Senha]
    ├─→ ✅ Sucesso → Home.html
    ├─→ ❌ Erro → Telas de erros/Erro.html
    └─→ "Criar conta" → inicio/Conta.html
           ↓ [Nome + Email + Senha]
           ├─→ ✅ Sucesso → Home.html
           └─→ ❌ Erro → Telas de erros/Erro.html

Home.html (Dashboard)
    ├─→ 📚 Matérias (carregadas do Supabase)
    │   └─→ Clique em uma matéria
    │       ├─→ Carrega seções e capítulos
    │       └─→ "Voltar" volta ao Dashboard
    │
    ├─→ ⬇️ Meus Downloads (Placeholder - em desenvolvimento)
    ├─→ ⭐ Favoritos (Placeholder - em desenvolvimento)
    │
    └─→ ⚙️ Configurações / 👤 Perfil
        └─→ Geral/Perfil/Perfil.html
            ├─→ Alterar foto de perfil
            ├─→ Modo escuro (toggle)
            ├─→ Notificações (toggle)
            └─→ "Sair" → index.html (logout)

Telas de Erros/Erro.html
    └─→ Exibe erros com título, mensagem e botão de voltar
```

---

## ✅ Funcionalidades Implementadas

### Autenticação (100% ✅)
- ✅ Login com email/senha
- ✅ Cadastro de novo usuário
- ✅ Logout com confirmação
- ✅ Recuperação de senha (placeholder com tela de erro)
- ✅ Validação de campos (email, senha)
- ✅ Tratamento de erros com telas personalizadas
- ✅ Verificação de sessão expirada

### Dashboard (100% ✅)
- ✅ Carregamento de matérias do Supabase
- ✅ Exibição de matérias em cards
- ✅ Navegação por sidebar
- ✅ Nome do usuário na top bar
- ✅ Menu de perfil com dropdown
- ✅ Logo "Portal CPO" no topo

### Perfil & Preferências (100% ✅)
- ✅ Upload de foto de perfil (salva em localStorage)
- ✅ Modo escuro (salvo em localStorage)
- ✅ Notificações (toggle salvo)
- ✅ Visualização de email
- ✅ Retorno ao Home

### Matérias Dinâmicas (100% ✅)
- ✅ Carregamento de seções
- ✅ Carregamento de capítulos
- ✅ Estrutura aninhada (Matéria → Seção → Capítulo)
- ✅ Visualização de contagem de capítulos
- ✅ Tratamento de erros ao carregar

### Telas de Erro (100% ✅)
- ✅ Erro de autenticação expirada
- ✅ Erro de login inválido
- ✅ Erro de cadastro duplicado
- ✅ Erro de conexão
- ✅ Erro ao carregar matérias
- ✅ Erro ao fazer logout
- ✅ Links de retorno contextualizados

### Funcionalidades em Desenvolvimento (Placeholders)
- ⏳ Meus Downloads - seção vazia
- ⏳ Favoritos - seção vazia
- ⏳ Conteúdo de Capítulos - não renderiza conteúdo ainda

---

## 🔧 Configuração Inicial

### Pré-requisitos
- Conta em [supabase.com](https://supabase.com)
- Navegador web moderno

### 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá a **Settings > API Keys** e copie:
   - **Project URL**
   - **anon public key**
4. Edite `js/config.js` e substitua:
   ```javascript
   const URL_SUPABASE = 'https://seu-projeto.supabase.co';
   const CHAVE_SUPABASE = 'sua-chave-publica-aqui';
   ```

### 2. Criar Tabelas no Supabase

Execute o SQL no editor SQL do Supabase Console:

```sql
-- Tabela: materias
CREATE TABLE materias (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    icone TEXT DEFAULT '📚',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela: secoes
CREATE TABLE secoes (
    id BIGSERIAL PRIMARY KEY,
    materia_id BIGINT REFERENCES materias(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    ordem INT DEFAULT 0
);

-- Tabela: capitulos
CREATE TABLE capitulos (
    id BIGSERIAL PRIMARY KEY,
    secao_id BIGINT REFERENCES secoes(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    ordem INT DEFAULT 0
);

-- Tabela: conteudos (opcional - para futura expansão)
CREATE TABLE conteudos (
    id BIGSERIAL PRIMARY KEY,
    capitulo_id BIGINT REFERENCES capitulos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    tipo TEXT DEFAULT 'texto',
    descricao TEXT
);
```

### 3. Inserir Dados de Exemplo

```sql
-- Inserir matérias de exemplo
INSERT INTO materias (nome, icone) VALUES 
('Matemática', '📐'),
('Português', '📖'),
('História', '🏛️'),
('Biologia', '🔬');

-- Inserir seções para Matemática (materia_id = 1)
INSERT INTO secoes (materia_id, nome, ordem) VALUES
(1, 'Álgebra', 1),
(1, 'Geometria', 2),
(1, 'Cálculo', 3);

-- Inserir capítulos para a seção Álgebra (secao_id = 1)
INSERT INTO capitulos (secao_id, nome, ordem) VALUES
(1, 'Expressões Algébricas', 1),
(1, 'Equações do 1º Grau', 2),
(1, 'Equações do 2º Grau', 3);
```

---

## 🚀 Como Usar

### 1. Testar Login

1. Abra `index.html` no navegador
2. Digite um **email** e **senha** cadastrados no Supabase
3. Clique em **"Entrar"**
4. ✅ Será redirecionado para `Home.html`
5. Seu nome aparecerá no topo à direita

### 2. Testar Cadastro

1. Em `index.html`, clique em **"Criar conta"**
2. Preencha os campos (Nome, Email, Senha)
3. Clique em **"Cadastrar"**
4. ✅ Novo usuário criado no Supabase
5. ✅ Redirecionado automaticamente para `Home.html`

### 3. Explorar Home

1. Veja todas as **matérias** no grid principal
2. Use a **sidebar** para navegar entre seções
3. Clique em uma **matéria** para ver suas seções
4. Clique em **"Voltar"** para retornar

### 4. Acessar Perfil

1. Clique no ícone **👤** no topo direito
2. Selecione **"Meu Perfil"** ou clique em **"⚙️ Configurações"**
3. Você verá:
   - Sua foto (clique para alterar)
   - Seu nome e email
   - Preferências de modo escuro e notificações
4. Clique em **"Salvar preferências"** para guardar mudanças
5. Clique em **"Voltar ao Home"** para retornar

### 5. Fazer Logout

1. Clique no ícone **👤** no topo direito
2. Clique em **"Sair"**
3. ✅ Sessão encerrada
4. ✅ Redirecionado para `index.html`

---

## 📁 Estrutura do Projeto

```
PortalCpo/
├── index.html                           # Login principal
├── Home.html                            # Dashboard após autenticação
├── README.md                            # Este arquivo
│
├── css/
│   ├── home.css                         # Estilos do Dashboard
│   ├── inicio.css                       # Estilos de Login/Cadastro
│   ├── Materias.css                     # Estilos dos cards de matérias
│   └── Perfil.css                       # Estilos da página de perfil
│
├── js/
│   ├── config.js                        # Configuração Supabase (EDITE AQUI)
│   ├── Validacoes.js                    # Login, cadastro, validações, erros
│   └── home.js                          # Funções do Dashboard
│
├── inicio/
│   ├── Conta.html                       # Página de cadastro
│   ├── Senha.html                       # Página de recuperação de senha
│   └── Login.html                       # Login alternativo
│
├── Geral/
│   └── Perfil/
│       └── Perfil.html                  # Página de perfil do usuário
│
├── Telas de erros/
│   └── Erro.html                        # Tela de erro centralizada
│
├── materias/
│   ├── Historia.html                    # Exemplo de matéria
│   └── Exemplo.html                     # Template visual
│
└── botoes_reutilizaveis/
    ├── botoes_reutilizaveis.html        # Componentes reutilizáveis
    └── botoes_reutilizaveis.css         # CSS dos componentes
```

---

## 🐛 Troubleshooting

### "Erro ao conectar ao servidor"
- Verifique se `js/config.js` tem as chaves do Supabase corretas
- Certifique-se de que URL_SUPABASE começa com `https://`
- Verifique se você está conectado à internet

### "Email ou senha incorretos"
- Confirme o email cadastrado no Supabase
- Verifique se a senha está correta
- Se esqueceu, clique em "Recuperar senha"

### "Você precisa estar logado"
- Faça login novamente
- As sessões do Supabase podem expirar após 1 hora de inatividade

### Matérias não carregam
- Verifique se a tabela `materias` existe no Supabase
- Insira dados de exemplo usando o SQL fornecido acima
- Abra o console (F12) e procure por erros de rede

### Estilos não aparecem
- Recarregue a página (Ctrl+Shift+R para hard refresh)
- Abra DevTools (F12) > Network e procure por erros 404
- Confirme que os caminhos de CSS estão corretos

---

## 📝 Arquivos Principais

### `js/config.js` - EDITAR AQUI
```javascript
const URL_SUPABASE = 'https://seu-projeto.supabase.co';
const CHAVE_SUPABASE = 'sua-chave-publica-aqui';
```

### `js/Validacoes.js`
- `validarLogin()` - Autentica usuário com Supabase
- `validarConta()` - Cria novo usuário
- `abrirTelaErro()` - Exibe tela de erro personalizada
- `mostrarErro()` - Exibe alert simples (para validações básicas)

### `js/home.js`
- `verificarAutenticacao()` - Verifica se usuário está logado
- `fazerLogout()` - Faz logout do Supabase
- `carregarMaterias()` - Carrega matérias do Supabase
- `togglePerfilMenu()` - Abre/fecha menu de perfil

### `Geral/Perfil/Perfil.html`
- `carregarPerfil()` - Carrega dados do usuário
- `atualizarAvatar()` - Faz upload de foto
- `salvarPreferencias()` - Salva preferências em localStorage

---

## 🔮 Futuras Melhorias

### 📋 Em Desenvolvimento (Placeholders)
- **Meus Downloads** - seção vazia, pronta para implementação
- **Favoritos** - seção vazia, pronta para implementação
- **Recuperação de Senha** - requer SMTP configurado
- **Conteúdo de Capítulos** - ainda não renderiza o conteúdo dentro dos capítulos

### 🚀 Roadmap Futuro
- Integração com videosaulas
- Sistema de progresso e XP
- Badges e certificados
- Forum/Chat entre alunos
- Resumos automáticos
- Testes e quizzes
- Analytics e relatórios
- Painel administrativo

---

## 📞 Suporte

Para dúvidas sobre o Supabase:
- Documentação: https://supabase.com/docs
- Discord Community: https://discord.supabase.io

Para dúvidas sobre o projeto:
- Verifique se as tabelas foram criadas corretamente
- Revise o console do navegador (F12) para erros
- Certifique-se de que está acessando `http://localhost` ou via servidor local

---

**Última atualização:** Junho 2026  
**Versão:** 1.2.0  
**Status:** ✅ Completo e funcionando  