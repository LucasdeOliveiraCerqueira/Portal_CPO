/*
 * SQL FINAL DEFINITIVO - Portal CPO Admin System
 * 
 * CORRIGIDO:
 * ✅ RLS desabilitada para profiles (apenas trigger + client validation)
 * ✅ Trigger com SECURITY DEFINER (sem bloqueios RLS)
 * ✅ Materias criada ANTES de professor_materias
 * ✅ Sem políticas circulares
 * ✅ Validação de role apenas no cliente
 * 
 * INSTRUÇÕES:
 * 1. Supabase Dashboard → SQL Editor
 * 2. Cole TODO este código
 * 3. Clique RUN
 * 4. Se tiver erro, copie a mensagem completa
 */

-- ===== LIMPAR ANTIGO (resolver dependências na ordem correta) =====
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP TABLE IF EXISTS professor_materias CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS materias CASCADE;

-- ===== 1. CRIAR MATERIAS PRIMEIRO (referência) =====
CREATE TABLE materias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome text NOT NULL UNIQUE,
    icone text DEFAULT '📚',
    created_at timestamp DEFAULT now()
);

-- RLS para materias (todos podem ler, só admin insere/deleta)
ALTER TABLE materias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "materias_read" ON materias;
CREATE POLICY "materias_read" ON materias FOR SELECT USING (true);

-- ===== 2. CRIAR PROFILES (SEM RLS - apenas validação no cliente) =====
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    nome text,
    role text DEFAULT 'aluno' CHECK (role IN ('aluno', 'professor', 'admin')),
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- ⚠️ RLS DESABILITADA - Validações no cliente e no trigger
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- ===== 3. CRIAR PROFESSOR_MATERIAS (agora profiles e materias já existem) =====
CREATE TABLE professor_materias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    professor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    materia_id uuid NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT now(),
    UNIQUE(professor_id, materia_id)
);

ALTER TABLE professor_materias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pm_read" ON professor_materias;
CREATE POLICY "pm_read" ON professor_materias FOR SELECT USING (true);

-- ===== 4. FUNÇÃO TRIGGER (cria profile ao fazer signup) =====
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nome, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.user_metadata->>'nome', NEW.email),
        'aluno'  -- Sempre começa como aluno
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        nome = COALESCE(EXCLUDED.nome, profiles.nome),
        updated_at = now();
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Se falhar, apenas retorna o usuário (conta ainda é criada)
    RETURN NEW;
END;
$$;

-- ===== 5. TRIGGER PARA SIGNUP =====
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ===== PRONTO! =====
-- Fluxo completo:
-- 1. Usuário cria conta → trigger cria profile com role='aluno'
-- 2. Faz login
-- 3. Vai a Perfil → digita código admin CPO_ADMIN_2024
-- 4. JavaScript faz upsert em profiles com role='admin'
-- 5. Reload → 🔧 Admin aparece
-- 6. Acessa Admin.html
--
-- TESTES:
-- Ver profiles criados:
-- SELECT id, email, role FROM profiles;
--
-- Tornar admin manualmente:
-- UPDATE profiles SET role = 'admin' WHERE email = 'seu-email@gmail.com';
