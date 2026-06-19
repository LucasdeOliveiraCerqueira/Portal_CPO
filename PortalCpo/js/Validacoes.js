/**
 * Exibe uma mensagem de erro simples ao usuário.
 * @param {string} mensagem Mensagem a ser exibida.
 */
function mostrarErro(mensagem) {
    alert(mensagem);
}

function getErroPageUrl() {
    const href = window.location.href;
    if (href.includes('/Geral/Perfil/') || href.includes('Geral/Perfil/')) {
        return new URL('../../Telas de erros/Erro.html', href).href;
    }
    if (href.includes('/inicio/') || href.includes('inicio/')) {
        return new URL('../Telas de erros/Erro.html', href).href;
    }
    return new URL('Telas de erros/Erro.html', href).href;
}

function abrirTelaErro(mensagem, titulo = 'Erro', back = null) {
    const url = getErroPageUrl();
    const backUrl = back || getErroBackUrl();
    window.location.href = `${url}?title=${encodeURIComponent(titulo)}&msg=${encodeURIComponent(mensagem)}&back=${encodeURIComponent(backUrl)}`;
}

function getErroBackUrl() {
    const href = window.location.href;
    if (href.includes('/Geral/Perfil/') || href.includes('Geral/Perfil/')) {
        return '../../Home.html';
    }
    if (href.includes('/inicio/') || href.includes('inicio/')) {
        return '../index.html';
    }
    return '../index.html';
}

/**
 * Verifica se um valor é um email básico válido.
 * @param {string} valor Texto de email a validar.
 * @returns {boolean} true se o email estiver no formato aceito.
 */
function validarEmail(valor) {
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return padraoEmail.test(valor.trim());
}

/**
 * Valida o formulário de login.
 * Autentica no Supabase e redireciona para Home.
 * @returns {boolean} false para evitar envio real do formulário.
 */
async function validarLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    if (!email || !validarEmail(email)) {
        mostrarErro('Informe um email válido.');
        return false;
    }

    if (!senha) {
        mostrarErro('Informe a senha.');
        return false;
    }

    if (!window.supabase) {
        abrirTelaErro('Falha de conexão: o cliente Supabase não foi inicializado.', 'Erro de configuração', '../index.html');
        return false;
    }

    try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: email,
            password: senha
        });

        if (error) {
            abrirTelaErro('Email ou senha incorretos. Verifique suas credenciais e tente novamente.', 'Falha na autenticação', '../index.html');
            return false;
        }

        // Em alguns casos (configuração de email), a sessão pode não ser retornada.
        // Consideramos sucesso se o usuário foi retornado.
        const signedUser = data?.user;
        if (!data?.session && !signedUser) {
            abrirTelaErro('Não foi possível iniciar sessão. Tente novamente.', 'Falha na autenticação', '../index.html');
            return false;
        }

        // Login bem-sucedido
        window.location.href = 'Home.html';
        return false;
    } catch (erro) {
        abrirTelaErro('Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.', 'Falha de conexão', '../index.html');
        return false;
    }
}

/**
 * Valida o formulário de criação de conta.
 * Cadastra no Supabase e redireciona para Home (sem confirmação de email).
 * @returns {boolean} false para evitar envio real do formulário.
 */
async function validarConta(event) {
    event.preventDefault();
    const nome = document.getElementById('contaNome').value;
    const email = document.getElementById('contaEmail').value;
    const senha = document.getElementById('contaSenha').value;
    const confirmarSenha = document.getElementById('contaSenha2').value;

    if (!nome.trim()) {
        mostrarErro('Informe seu nome.');
        return false;
    }

    if (!email || !validarEmail(email)) {
        mostrarErro('Informe um email válido.');
        return false;
    }

    if (!senha) {
        mostrarErro('Informe a senha.');
        return false;
    }

    if (senha !== confirmarSenha) {
        mostrarErro('As senhas não conferem.');
        return false;
    }

    if (!window.supabase) {
        abrirTelaErro('Falha de conexão: o cliente Supabase não foi inicializado.', 'Erro de configuração', '../inicio/Conta.html');
        return false;
    }

    try {
        // Cria usuário no Supabase (sem confirmação de email em desenvolvimento)
        const { data, error } = await window.supabase.auth.signUp({
            email: email,
            password: senha,
            options: {
                data: {
                    nome: nome
                }
            }
        });

        if (error) {
            // Formata mensagem de erro com mais detalhes para depuração
            let detalhe = 'Tente novamente mais tarde.';
            try {
                detalhe = error?.message || error?.msg || JSON.stringify(error);
            } catch (e) {
                detalhe = String(error);
            }
            console.error('SignUp error:', error);
            abrirTelaErro('Erro ao criar conta: ' + detalhe, 'Erro ao criar conta', '../inicio/Conta.html');
            return false;
        }

        // Se o objeto user for retornado, consideramos a criação bem-sucedida
        const createdUser = data?.user;
        if (createdUser) {
            // Se houver sessão, já está logado
            if (data?.session) {
                window.location.href = '../Home.html';
                return false;
            }

            // Conta criada com sucesso, redireciona para login
            alert('Conta criada com sucesso! Agora faça login com suas credenciais.');
            window.location.href = '../index.html';
            return false;
        }

        // Caso inesperado: nenhum erro, mas sem user retornado
        abrirTelaErro('Conta criada, mas não foi possível validar o usuário. Faça login manualmente.', 'Aviso', '../index.html');
        return false;
    } catch (erro) {
        let detalhe = 'Erro inesperado';
        try {
            detalhe = erro?.message || JSON.stringify(erro);
        } catch (e) {
            detalhe = String(erro);
        }
        console.error('Exception during signUp:', erro);
        abrirTelaErro('Erro ao conectar: ' + detalhe, 'Falha de conexão', '../inicio/Conta.html');
        return false;
    }
}

/**
 * Valida o formulário de recuperação de senha.
 * @returns {boolean} false para evitar envio real do formulário.
 */
function validarRecuperacao(event) {
    event.preventDefault();
    const email = document.getElementById('senhaEmail').value;

    if (!email || !validarEmail(email)) {
        mostrarErro('Informe um email válido.');
        return false;
    }

    // TODO: Implementar envio de email via Supabase
    abrirTelaErro('O serviço de recuperação de senha está em manutenção. Tente novamente mais tarde.', 'Serviço indisponível', '../index.html');
    return false;
}