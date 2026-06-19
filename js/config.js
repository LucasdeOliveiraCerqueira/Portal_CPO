/**
 * config.js
 * Configuração Supabase - conecta ao banco de dados
 * 
 * DESATIVAR CONFIRMAÇÃO DE EMAIL (Desenvolvimento):
 * 1. Acesse: https://supabase.com/dashboard
 * 2. Projeto → Authentication → Providers
 * 3. Em "Email", desabilite "Confirm email"
 * 4. Salve as alterações
 * 
 * Contas criadas serão ativadas imediatamente sem confirmação.
 */

const URL_SUPABASE = 'https://sqvrjomarimaexrunuob.supabase.co';
const CHAVE_SUPABASE = 'sb_publishable_TsANfyuZReeMz96pmZM5xw_yijcBaWB';

// Inicializa cliente Supabase usando a biblioteca carregada pelo CDN
const supabaseLib = typeof supabase !== 'undefined' ? supabase : window.supabase;
const supabaseClient = supabaseLib ? supabaseLib.createClient(URL_SUPABASE, CHAVE_SUPABASE) : null;

if (supabaseClient) {
    window.supabase = supabaseClient;
} else {
    console.error('Erro: Falha ao inicializar cliente Supabase.');
}
