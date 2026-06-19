# 🧪 Teste - Sistema de Código de Admin

## ✅ Implementação Concluída

### O que foi adicionado:

1. **Página de Perfil** (Geral/Perfil/Perfil.html)
   - Nova seção: "Código de Administrador"
   - Input password para digitar o código
   - Botão "Aplicar Código"
   - Feedback visual de sucesso/erro

2. **Funções JavaScript**
   - `aplicarCodigoAdmin()` - Valida e aplica o código
   - `mostrarStatus()` - Mostra feedback colorido
   - Código correto: **`CPO_ADMIN_2024`**

3. **Banco de Dados**
   - Atualiza `role = 'admin'` na tabela `profiles`
   - Usa o `user.id` para identificar o usuário

---

## 🎯 Teste Passo a Passo

### Pré-requisitos:
- ✅ Tabela `profiles` criada (via SETUP_ADMIN.sql)
- ✅ Usuário logado e autenticado

### Passos do Teste:

#### 1. **Acessar Perfil com Conta Normal**
   - [ ] Faça login com uma conta que **NÃO é admin**
   - [ ] Clique em "Meu Perfil"
   - [ ] Verifique se a seção "Código de Administrador" aparece
   - [ ] Verifique se o item **🔧 Admin** **NÃO aparece** na sidebar

#### 2. **Testar Código Inválido**
   - [ ] Na seção "Código de Administrador", digite: `CODIGO_ERRADO`
   - [ ] Clique em "Aplicar Código"
   - [ ] Verifique se mostra: **❌ Código inválido. Tente novamente.**
   - [ ] Verifique se a cor é **vermelha** (feedback de erro)
   - [ ] Verifique se o input foi limpo

#### 3. **Testar Código Correto**
   - [ ] Na seção "Código de Administrador", digite: `CPO_ADMIN_2024`
   - [ ] Clique em "Aplicar Código"
   - [ ] Verifique se mostra: **✅ Parabéns! Você é agora um administrador! Recarregando...**
   - [ ] Verifique se a cor é **verde** (feedback de sucesso)
   - [ ] Verifique se redirecionou para Home em ~2 segundos

#### 4. **Verificar Admin Ativado**
   - [ ] Na página Home, verifique se o item **🔧 Admin** aparece na sidebar
   - [ ] Clique em "🔧 Admin"
   - [ ] Verifique se a página Admin.html carrega corretamente
   - [ ] Verifique se as 3 abas aparecem (Usuários, Professores, Matérias)

#### 5. **Fazer Logout e Login Novamente**
   - [ ] Clique em "Sair" para fazer logout
   - [ ] Faça login novamente com a mesma conta
   - [ ] Verifique se o item **🔧 Admin** ainda aparece na sidebar
   - [ ] Verifique se consegue acessar Admin.html

---

## 📊 Resultado Esperado

| Passo | Status | Esperado |
|-------|--------|----------|
| 1. Código Inválido | ✅ | Erro em vermelho |
| 2. Código Correto | ✅ | Sucesso em verde + redirect |
| 3. Admin Link Visible | ✅ | Aparece na sidebar |
| 4. Admin Panel Access | ✅ | Abre Admin.html normalmente |
| 5. Persist After Logout | ✅ | Admin permanece após relogin |

---

## 🔧 Customizações Possíveis

### Mudar o Código:
Abra `Geral/Perfil/Perfil.html` e procure por:
```javascript
const CODIGO_CORRETO = 'CPO_ADMIN_2024';
```
Altere o valor conforme necessário.

### Diferentes Códigos por Role:
```javascript
const CODIGOS = {
    'professor': 'CPO_PROF_2024',
    'admin': 'CPO_ADMIN_2024'
};
```

---

## 📝 Notas Importantes

- O código é **case-sensitive** (maiúsculas/minúsculas importam)
- O input é `password` para ocultar o que o usuário digita
- A atualização é **permanente** no banco de dados
- Funciona em tempo real - nenhum refresh necessário além do redirect automático

---

## 🐛 Troubleshooting

### "Código inválido" mesmo com código correto
- Verifique se digitou exatamente: `CPO_ADMIN_2024`
- Verifique se não há espaços extras

### "Admin" não aparece na sidebar após aplicar código
- Recarregue a página (Ctrl+F5)
- Faça logout e login novamente

### Erro ao processar código
- Verifique se a tabela `profiles` existe no Supabase
- Verifique se sua conta tem um registro em `profiles`
- Verifique os logs do navegador (F12 → Console)

---

## ✨ Próximos Passos

- Após confirmar que tudo funciona, considere:
  - Adicionar mais códigos para diferentes roles (professor, etc.)
  - Registrar em log quem virou admin e quando
  - Adicionar um código de recuperação para caso de emergência
