-- SQL RÁPIDO: Adicionar política de UPDATE para profiles
-- Se você executou SETUP_ADMIN_FIXED.sql (com RLS), execute isto para liberar UPDATE

-- 1. Se RLS está ativa, adicione política de UPDATE
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
    USING (true)  -- Permite verificar o registro
    WITH CHECK (true);  -- Permite qualquer UPDATE (cliente valida)

-- 2. Se precisar, desabilite RLS completamente (mais permissivo):
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Pronto! Agora tente aplicar o código admin novamente.
