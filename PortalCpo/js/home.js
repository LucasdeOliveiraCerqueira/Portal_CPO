/**
 * home.js
 * Carrega matérias do Supabase, gerencia menu de perfil, autenticação
 */

/**
 * Verifica se usuário está logado
 */
async function verificarAutenticacao() {
    try {
        const { data: { user } } = await window.supabase.auth.getUser();
        
        if (!user) {
            abrirTelaErro('Você precisa estar logado para acessar esta página. Faça login novamente.', 'Sessão expirada', '../index.html');
            return null;
        }

        // Mostra nome do usuário na top bar
        const nomeUsuario = user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário';
        document.getElementById('usuario-nome').textContent = `Bem-vindo, ${nomeUsuario}`;
        
        // Busca role da tabela profiles
        const { data: profile, error: profileError } = await window.supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profileError && profile?.role === 'admin') {
            const adminItem = document.getElementById('admin-item');
            if (adminItem) {
                adminItem.style.display = 'block';
            }
        }
        
        return user;
    } catch (erro) {
        abrirTelaErro('Erro ao verificar autenticação. Tente fazer login novamente.', 'Erro de autenticação', '../index.html');
        return null;
    }
}

/**
 * Faz logout do usuário
 */
async function fazerLogout() {
    try {
        await window.supabase.auth.signOut();
    } catch (erro) {
        abrirTelaErro('Não foi possível encerrar a sessão agora. Tente novamente.', 'Erro ao sair');
        return;
    }

    window.location.href = 'index.html';
}

/**
 * Abre página de perfil ou configurações.
 */
function abrirPerfil() {
    window.location.href = 'Geral/Perfil/Perfil.html';
}

/**
 * Carrega matérias do Supabase ao abrir Home
 */
async function carregarMaterias() {
    try {
        const { data, error } = await window.supabase
            .from('materias')
            .select('id, nome, icone')
            .order('nome');

        if (error) throw error;

        const grid = document.getElementById('grid-materias');
        if (!grid) return;

        grid.innerHTML = '';

        // Se não há matérias, mostra mensagem
        if (!data || data.length === 0) {
            grid.innerHTML = '<p style="color: #5a738f; padding: 20px; grid-column: 1/-1;">Nenhuma matéria disponível no momento.</p>';
            return;
        }

        // Cria um card para cada matéria
        data.forEach(materia => {
            const card = document.createElement('div');
            card.className = 'card';
            card.onclick = () => abrirMateria(materia.id, materia.nome);
            card.innerHTML = `
                <div class="card-icon">${materia.icone || '📚'}</div>
                <div class="card-title">${materia.nome}</div>
            `;
            grid.appendChild(card);
        });
    } catch (erro) {
        console.error('Erro ao carregar matérias:', erro);
        abrirTelaErro('Não foi possível carregar as matérias. Verifique sua conexão e tente novamente.', 'Erro de carregamento');
    }
}

/**
 * Alterna a exibição do menu de perfil
 */
function togglePerfilMenu() {
    const menu = document.getElementById('perfilMenu');
    menu.classList.toggle('ativo');

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.perfil-icon') && !e.target.closest('.perfil-menu')) {
            menu.classList.remove('ativo');
        }
    });
}

/**
 * Mostra a seção selecionada e esconde as outras
 * @param {string} secaoId - ID da seção a mostrar
 * @param {HTMLElement} elemento - item clicado da sidebar
 */
function mostrarSecao(secaoId, elemento) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('ativo');
    });
    if (elemento) {
        elemento.classList.add('ativo');
    }

    document.querySelectorAll('.secao').forEach(secao => {
        secao.style.display = 'none';
    });
    const secao = document.getElementById(secaoId);
    if (secao) {
        secao.style.display = 'block';
    }
}

/**
 * Abre uma matéria e carrega seu conteúdo
 * @param {number} materiaId - ID da matéria
 * @param {string} materiaNome - Nome da matéria
 */
function abrirMateria(materiaId, materiaNome) {
    carregarConteudoMateria(materiaId, materiaNome);
}

/**
 * Carrega e renderiza o conteúdo de uma matéria
 * @param {number} materiaId - ID da matéria
 * @param {string} materiaNome - Nome da matéria
 */
async function carregarConteudoMateria(materiaId, materiaNome) {
    try {
        // Carrega seções com seus capítulos
        const { data, error } = await window.supabase
            .from('secoes')
            .select(`
                id,
                nome,
                ordem,
                capitulos(
                    id,
                    nome,
                    ordem
                )
            `)
            .eq('materia_id', materiaId)
            .order('ordem');

        if (error) throw error;

        // Renderiza conteúdo
        let html = `
            <div class="btn-container-top">
                <button class="btn-voltar" onclick="mostrarSecao('materias')">← Voltar para Matérias</button>
            </div>
            <div class="content-header">
                <h1>${materiaNome}</h1>
                <p>Estrutura de seções e capítulos</p>
            </div>
        `;

        if (!data || data.length === 0) {
            html += '<p style="color: #5a738f; padding: 20px;">Nenhum conteúdo disponível nesta matéria.</p>';
        } else {
            html += '<div class="cards-grid" id="grid-conteudo">';

            // Renderiza cada seção
            data.forEach(secao => {
                html += `
                    <div class="card">
                        <div class="card-icon">📁</div>
                        <div class="card-title">${secao.nome}</div>
                        <div style="font-size: 0.9rem; color: #5a738f; margin-top: 8px;">
                            ${secao.capitulos?.length || 0} capítulo(s)
                        </div>
                    </div>
                `;
            });

            html += '</div>';
        }

        // Insere no DOM
        const container = document.getElementById('conteudo-dinamico');
        container.innerHTML = html;

        // Esconde seções da sidebar
        document.querySelectorAll('.secao').forEach(s => s.style.display = 'none');

    } catch (erro) {
        console.error('Erro ao carregar matéria:', erro);
        abrirTelaErro('Não foi possível carregar o conteúdo da matéria. Verifique a conexão e tente novamente.', 'Erro de conteúdo');
    }
}

// Verifica autenticação e carrega matérias quando a página abre
document.addEventListener('DOMContentLoaded', async () => {
    await verificarAutenticacao();
    carregarMaterias();
});