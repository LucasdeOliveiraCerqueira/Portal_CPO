-- SQL: Criar função para atualizar role (bypassa RLS com SECURITY DEFINER)

DROP FUNCTION IF EXISTS set_user_role_admin(uuid) CASCADE;

CREATE OR REPLACE FUNCTION set_user_role_admin(user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    result json;
BEGIN
    -- Atualiza o role para admin
    UPDATE public.profiles
    SET role = 'admin', updated_at = now()
    WHERE id = user_id;
    
    -- Retorna sucesso
    result := json_build_object('success', true, 'message', 'Role atualizado para admin');
    RETURN result;
    
EXCEPTION WHEN OTHERS THEN
    -- Retorna erro
    result := json_build_object('success', false, 'error', SQLERRM);
    RETURN result;
END;
$$;

-- Teste: chamar a função (depois de ter criado uma conta)
-- SELECT set_user_role_admin('seu-user-id-aqui');
