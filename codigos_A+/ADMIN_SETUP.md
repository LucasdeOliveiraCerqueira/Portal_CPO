# 🔧 Sistema de Administração - Portal CPO

## Visão Geral

O sistema de admin permite que administradores:
- ✅ Gerenciar usuários (editar roles, deletar)
- ✅ Atribuir professores a matérias específicas
- ✅ Gerenciar matérias (criar, deletar)

## 📋 Setup Inicial

### 1. Criar as Tabelas no Supabase

1. Abra [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor**
3. Crie uma nova query
4. Abra o arquivo `SETUP_ADMIN.sql` deste repositório
5. Cole o código no SQL Editor
6. Clique em **Run**

Isso vai criar as tabelas necessárias:
- `profiles` - Extensão de usuários com role (admin, professor, aluno)
- `professor_materias` - Relacionamento entre professores e matérias
- `materias` - Lista de matérias

### 2. Definir seu Usuário como Admin

No Supabase SQL Editor, execute:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'seu-email@gmail.com';
```

Substitua `seu-email@gmail.com` pelo seu email de cadastro.

### 3. Acessar o Painel Admin

1. Faça login no Portal CPO com sua conta
2. Você verá um item **🔧 Admin** no sidebar
3. Clique para acessar o painel

## 🎯 Como Usar o Admin

### Aba Usuários

- **Listar**: Vê todos os usuários cadastrados
- **Editar**: Muda nome ou role do usuário
- **Deletar**: Remove usuário do sistema
- **Roles disponíveis**:
  - 👤 **Aluno** - Pode ver matérias e fazer download
  - 👨‍🏫 **Professor** - Pode ministrar matérias
  - 🔐 **Admin** - Acesso total

### Aba Professores

- **Atribuir**: Vincula um professor a uma matéria
- **Remover**: Desfaz a vinculação

Exemplo: "João é professor de Matemática"

### Aba Matérias

- **Listar**: Vê todas as matérias disponíveis
- **Criar**: Adiciona nova matéria
- **Deletar**: Remove matéria do sistema

## 🔗 Estrutura de Permissões

| Ação | Aluno | Professor | Admin |
|------|-------|-----------|-------|
| Ver matérias | ✅ | ✅ | ✅ |
| Acessar Admin | ❌ | ❌ | ✅ |
| Editar perfil | ✅ | ✅ | ✅ |
| Gerenciar usuários | ❌ | ❌ | ✅ |
| Atribuir professores | ❌ | ❌ | ✅ |
| Gerenciar matérias | ❌ | ❌ | ✅ |

## 📝 Exemplos Comuns

### Criar um novo professor

1. Vá em Aba **Usuários**
2. Clique em **Editar** do usuário
3. Mude a role para **Professor**
4. Clique **Salvar**

### Atribuir professor a uma matéria

1. Vá em Aba **Professores**
2. Clique em **+ Atribuir Professor**
3. Selecione o professor
4. Selecione a matéria
5. Clique **Atribuir**

### Deletar um usuário

1. Vá em Aba **Usuários**
2. Encontre o usuário
3. Clique **Deletar**
4. Confirme a exclusão

## ⚠️ Notas Importantes

- **Backup**: Sempre faça backup de seus dados antes de deletar usuários
- **Admin único**: É recomendado ter pelo menos um admin sempre
- **Email confirmação**: O sistema não exige confirmação de email (em desenvolvimento)
- **Permissões**: Todas as operações respeitam as políticas de segurança do Supabase

## 🐛 Troubleshooting

### "Você não tem permissão para acessar esta página"

- Verifique se sua conta foi marcada como admin
- Execute o comando SQL novamente:
  ```sql
  UPDATE profiles SET role = 'admin' WHERE email = 'seu-email@gmail.com';
  ```

### Tabelas não encontradas

- Volte ao passo 1 e execute o SQL completo
- Verifique se não houve erros na execução

### Admin não aparece no sidebar

- Recarregue a página (F5)
- Faça logout e login novamente

## 📞 Suporte

Qualquer dúvida, abra um arquivo `diagnostico.html` para verificar o status da sua autenticação.
