/*
 * SQL para criar as tabelas do sistema de admin
 * 
 * Instruções:
 * 1. Abra https://supabase.com/dashboard
 * 2. Vá em SQL Editor
 * 3. Crie uma nova query
 * 4. Cole este código
 * 5. Clique em "Run"
 */

-- 1. Criar tabela de profiles (estende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    nome text,
    role text DEFAULT 'aluno' CHECK (role IN ('aluno', 'professor', 'admin')),
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para profiles
CREATE POLICY "Profiles são visíveis para admins" 
    ON profiles FOR SELECT 
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Usuários veem seu próprio perfil" 
    ON profiles FOR SELECT 
    USING (id = auth.uid());

-- 2. Criar tabela de atribuição de professores às matérias
CREATE TABLE IF NOT EXISTS professor_materias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    professor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    materia_id uuid NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT now(),
    UNIQUE(professor_id, materia_id)
);

-- Habilitar RLS
ALTER TABLE professor_materias ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para professor_materias
CREATE POLICY "professor_materias são visíveis para todos" 
    ON professor_materias FOR SELECT 
    USING (true);

CREATE POLICY "Apenas admins podem inserir" 
    ON professor_materias FOR INSERT 
    WITH CHECK (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- 3. Verificar se a tabela materias já existe e adicionar campos se necessário
-- Se a tabela já existe, este código será ignorado
CREATE TABLE IF NOT EXISTS materias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome text NOT NULL UNIQUE,
    icone text DEFAULT '📚',
    created_at timestamp DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE materias ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para materias
CREATE POLICY "Matérias são visíveis para todos" 
    ON materias FOR SELECT 
    USING (true);

CREATE POLICY "Apenas admins podem gerenciar matérias" 
    ON materias FOR INSERT 
    WITH CHECK (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Apenas admins podem deletar matérias" 
    ON materias FOR DELETE 
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- 4. Criar função para popular o profiles automaticamente quando um usuário se cadastra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (id, email, nome, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.user_metadata->>'nome', NEW.email),
        COALESCE(NEW.user_metadata->>'role', 'aluno')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        nome = COALESCE(EXCLUDED.nome, profiles.nome);
    
    RETURN NEW;
END;
$$;

-- 5. Criar trigger para chamar a função quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Pronto! Agora as tabelas estão criadas e configuradas.
-- 
-- PRÓXIMOS PASSOS:
-- 1. Para tornar um usuário admin, execute (substitua o email):
--    UPDATE profiles SET role = 'admin' WHERE email = 'seu-email@gmail.com';
--
-- 2. Para ver o painel admin, faça login com uma conta admin e acesse /Admin.html
