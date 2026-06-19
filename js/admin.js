/**
 * admin.js
 * Lógica do painel administrativo
 */

let usuarioAtualId = null;

/**
 * Verifica se o usuário é admin e carrega dados
 */
async function inicializarAdmin() {
    try {
        const { data: { user } } = await window.supabase.auth.getUser();
        
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        // Busca o role da tabela profiles
        const { data: profile, error: profileError } = await window.supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            console.error('Erro ao buscar perfil:', profileError);
            alert('Erro ao verificar permissões. Tente fazer login novamente.');
            window.location.href = 'index.html';
            return;
        }

        // Verifica se é admin
        if (profile.role !== 'admin') {
            alert('Você não tem permissão para acessar esta página.');
            window.location.href = 'Home.html';
            return;
        }

        // Carrega usuários na primeira aba
        await carregarUsuarios();
    } catch (erro) {
        console.error('Erro ao inicializar admin:', erro);
        window.location.href = 'index.html';
    }
}

/**
 * Abre uma aba no admin
 */
function abrirAbaAdmin(abaId) {
    // Remove classe ativo de todas as abas e botões
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('ativo'));
    document.querySelectorAll('.admin-tab').forEach(el => el.classList.remove('ativo'));

    // Adiciona classe ativo à aba e botão selecionados
    document.getElementById(abaId).classList.add('ativo');
    event.target.classList.add('ativo');

    // Carrega dados da aba
    if (abaId === 'usuarios') {
        carregarUsuarios();
    } else if (abaId === 'professores') {
        carregarProfessores();
    } else if (abaId === 'materias') {
        carregarMaterias();
    }
}

/**
 * Carrega lista de usuários
 */
async function carregarUsuarios() {
    try {
        const loadingEl = document.getElementById('usuarios-loading');
        const tableEl = document.getElementById('usuarios-table');
        const tbodyEl = document.getElementById('usuarios-tbody');

        loadingEl.style.display = 'block';
        tableEl.style.display = 'none';
        tbodyEl.innerHTML = '';

        // Busca usuários na tabela auth.users
        const { data: usuariosRaw, error } = await window.supabase
            .from('profiles')
            .select('id, email, nome, role')
            .order('email');

        if (error && error.code !== 'PGRST116') {
            // Se a tabela não existe, tenta pegar do auth.users
            // Nota: isso requer políticas de segurança configuradas
            throw error;
        }

        const usuarios = usuariosRaw || [];

        if (usuarios.length === 0) {
            loadingEl.innerHTML = '<p>Nenhum usuário encontrado</p>';
            loadingEl.style.display = 'block';
            return;
        }

        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.email || '—'}</td>
                <td>${usuario.nome || 'Sem nome'}</td>
                <td><span class="role-badge role-${usuario.role || 'aluno'}">${usuario.role || 'aluno'}</span></td>
                <td>—</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-small" onclick="abrirModalEditarUsuario('${usuario.id}', '${usuario.email}', '${usuario.nome}', '${usuario.role}')">Editar</button>
                        <button class="btn-small danger" onclick="deletarUsuario('${usuario.id}')">Deletar</button>
                    </div>
                </td>
            `;
            tbodyEl.appendChild(row);
        });

        loadingEl.style.display = 'none';
        tableEl.style.display = 'table';
    } catch (erro) {
        console.error('Erro ao carregar usuários:', erro);
        document.getElementById('usuarios-loading').innerHTML = '<p style="color: red;">Erro ao carregar usuários: ' + erro.message + '</p>';
    }
}

/**
 * Carrega lista de atribuições de professores
 */
async function carregarProfessores() {
    try {
        const loadingEl = document.getElementById('professores-loading');
        const tableEl = document.getElementById('professores-table');
        const tbodyEl = document.getElementById('professores-tbody');

        loadingEl.style.display = 'block';
        tableEl.style.display = 'none';
        tbodyEl.innerHTML = '';

        // Tenta carregar de uma tabela professor_materias se existir
        const { data: professorMaterias, error } = await window.supabase
            .from('professor_materias')
            .select('id, professor_id, materia_id, created_at, profiles(nome), materias(nome)')
            .order('created_at', { ascending: false });

        if (error) {
            loadingEl.innerHTML = '<p style="color: #5a738f;">Nenhuma atribuição de professor ainda</p>';
            loadingEl.style.display = 'block';
            return;
        }

        if (!professorMaterias || professorMaterias.length === 0) {
            loadingEl.innerHTML = '<p style="color: #5a738f;">Nenhuma atribuição de professor</p>';
            loadingEl.style.display = 'block';
            return;
        }

        professorMaterias.forEach(item => {
            const row = document.createElement('tr');
            const profNome = item.profiles?.nome || 'Desconhecido';
            const materiaNome = item.materias?.nome || 'Desconhecida';
            row.innerHTML = `
                <td>${profNome}</td>
                <td>${materiaNome}</td>
                <td>—</td>
                <td>
                    <button class="btn-small danger" onclick="removerAtribuicaoProfessor('${item.id}')">Remover</button>
                </td>
            `;
            tbodyEl.appendChild(row);
        });

        loadingEl.style.display = 'none';
        tableEl.style.display = 'table';
    } catch (erro) {
        console.error('Erro ao carregar professores:', erro);
        document.getElementById('professores-loading').innerHTML = '<p style="color: red;">Erro: ' + erro.message + '</p>';
    }
}

/**
 * Carrega lista de matérias
 */
async function carregarMaterias() {
    try {
        const loadingEl = document.getElementById('materias-loading');
        const tableEl = document.getElementById('materias-table');
        const tbodyEl = document.getElementById('materias-tbody');

        loadingEl.style.display = 'block';
        tableEl.style.display = 'none';
        tbodyEl.innerHTML = '';

        const { data: materias, error } = await window.supabase
            .from('materias')
            .select('id, nome, icone, created_at')
            .order('nome');

        if (error) {
            throw error;
        }

        if (!materias || materias.length === 0) {
            loadingEl.innerHTML = '<p style="color: #5a738f;">Nenhuma matéria cadastrada</p>';
            loadingEl.style.display = 'block';
            return;
        }

        materias.forEach(materia => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${materia.nome}</td>
                <td style="font-size: 20px;">${materia.icone || '📚'}</td>
                <td>—</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-small" onclick="abrirModalEditarMateria('${materia.id}', '${materia.nome}', '${materia.icone}')">Editar</button>
                        <button class="btn-small danger" onclick="deletarMateria('${materia.id}')">Deletar</button>
                    </div>
                </td>
            `;
            tbodyEl.appendChild(row);
        });

        loadingEl.style.display = 'none';
        tableEl.style.display = 'table';
    } catch (erro) {
        console.error('Erro ao carregar matérias:', erro);
        document.getElementById('materias-loading').innerHTML = '<p style="color: red;">Erro: ' + erro.message + '</p>';
    }
}

/**
 * Modal: Novo usuário
 */
function abrirModalNovoUsuario() {
    document.getElementById('modalUsuarioTitle').textContent = 'Novo Usuário';
    document.getElementById('modalUsuarioEmail').value = '';
    document.getElementById('modalUsuarioNome').value = '';
    document.getElementById('modalUsuarioRole').value = 'aluno';
    usuarioAtualId = null;
    document.getElementById('modalUsuario').classList.add('ativo');
}

/**
 * Modal: Editar usuário
 */
function abrirModalEditarUsuario(id, email, nome, role) {
    document.getElementById('modalUsuarioTitle').textContent = 'Editar Usuário';
    document.getElementById('modalUsuarioEmail').value = email;
    document.getElementById('modalUsuarioNome').value = nome;
    document.getElementById('modalUsuarioRole').value = role || 'aluno';
    usuarioAtualId = id;
    document.getElementById('modalUsuario').classList.add('ativo');
}

function fecharModalUsuario() {
    document.getElementById('modalUsuario').classList.remove('ativo');
}

async function salvarUsuario() {
    const email = document.getElementById('modalUsuarioEmail').value;
    const nome = document.getElementById('modalUsuarioNome').value;
    const role = document.getElementById('modalUsuarioRole').value;

    if (!nome.trim()) {
        alert('Informe o nome');
        return;
    }

    try {
        if (usuarioAtualId) {
            // Atualizar usuário existente
            const { error } = await window.supabase
                .from('profiles')
                .update({ nome, role })
                .eq('id', usuarioAtualId);

            if (error) throw error;
            alert('Usuário atualizado com sucesso!');
        } else {
            // Criar novo usuário (apenas no metadata por enquanto)
            alert('Para criar usuários, use a página de cadastro regular');
        }

        fecharModalUsuario();
        carregarUsuarios();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

async function deletarUsuario(id) {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
        const { error } = await window.supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) throw error;
        alert('Usuário deletado!');
        carregarUsuarios();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

/**
 * Modal: Atribuir Professor
 */
async function abrirModalAtribuirProfessor() {
    // Carrega lista de professores
    try {
        const { data: professores } = await window.supabase
            .from('profiles')
            .select('id, nome')
            .eq('role', 'professor');

        const selectProf = document.getElementById('modalProfessorUsuario');
        selectProf.innerHTML = '<option value="">Selecione um professor...</option>';
        professores?.forEach(prof => {
            const option = document.createElement('option');
            option.value = prof.id;
            option.textContent = prof.nome;
            selectProf.appendChild(option);
        });
    } catch (e) {
        console.error('Erro ao carregar professores:', e);
    }

    // Carrega lista de matérias
    try {
        const { data: materias } = await window.supabase
            .from('materias')
            .select('id, nome');

        const selectMat = document.getElementById('modalProfessorMateria');
        selectMat.innerHTML = '<option value="">Selecione uma matéria...</option>';
        materias?.forEach(mat => {
            const option = document.createElement('option');
            option.value = mat.id;
            option.textContent = mat.nome;
            selectMat.appendChild(option);
        });
    } catch (e) {
        console.error('Erro ao carregar matérias:', e);
    }

    document.getElementById('modalProfessor').classList.add('ativo');
}

function fecharModalProfessor() {
    document.getElementById('modalProfessor').classList.remove('ativo');
}

async function salvarProfessor() {
    const profId = document.getElementById('modalProfessorUsuario').value;
    const matId = document.getElementById('modalProfessorMateria').value;

    if (!profId || !matId) {
        alert('Selecione professor e matéria');
        return;
    }

    try {
        const { error } = await window.supabase
            .from('professor_materias')
            .insert([{ professor_id: profId, materia_id: matId }]);

        if (error) throw error;
        alert('Professor atribuído!');
        fecharModalProfessor();
        carregarProfessores();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

async function removerAtribuicaoProfessor(id) {
    if (!confirm('Remover esta atribuição?')) return;

    try {
        const { error } = await window.supabase
            .from('professor_materias')
            .delete()
            .eq('id', id);

        if (error) throw error;
        carregarProfessores();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

/**
 * Modal: Nova Matéria
 */
function abrirModalNovaMateria() {
    document.getElementById('modalMateriaNome').value = '';
    document.getElementById('modalMateriaIcone').value = '';
    document.getElementById('modalMateria').classList.add('ativo');
}

function fecharModalMateria() {
    document.getElementById('modalMateria').classList.remove('ativo');
}

async function salvarMateria() {
    const nome = document.getElementById('modalMateriaNome').value;
    const icone = document.getElementById('modalMateriaIcone').value;

    if (!nome.trim()) {
        alert('Informe o nome da matéria');
        return;
    }

    try {
        const { error } = await window.supabase
            .from('materias')
            .insert([{ nome, icone }]);

        if (error) throw error;
        alert('Matéria criada!');
        fecharModalMateria();
        carregarMaterias();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

async function abrirModalEditarMateria(id, nome, icone) {
    // TODO: Implementar edição de matéria
    alert('Edição de matéria ainda não implementada');
}

async function deletarMateria(id) {
    if (!confirm('Tem certeza que deseja deletar esta matéria?')) return;

    try {
        const { error } = await window.supabase
            .from('materias')
            .delete()
            .eq('id', id);

        if (error) throw error;
        carregarMaterias();
    } catch (erro) {
        alert('Erro: ' + erro.message);
    }
}

/**
 * Toggle menu de perfil
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
 * Faz logout
 */
async function fazerLogout() {
    try {
        await window.supabase.auth.signOut();
        window.location.href = 'index.html';
    } catch (erro) {
        alert('Erro ao sair: ' + erro.message);
    }
}

// Carrega admin ao abrir a página
document.addEventListener('DOMContentLoaded', inicializarAdmin);
