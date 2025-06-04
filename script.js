// script.js (Atualizado)

document.addEventListener('DOMContentLoaded', () => {
    console.log("O site NeoReflect foi carregado com sucesso!");

    // Funcionalidade do Menu Hamburger
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active'); // Mostra/esconde o menu de navegação
            menuToggle.classList.toggle('active'); // Anima o ícone do hamburger para 'X' e vice-versa
        });
    }

    // Destacar o link da página atual na navegação
    // Pega o nome do arquivo da URL atual (ex: "sobre.html")
    // Se a URL for apenas o domínio (ex: "meusite.com/"), considera "home.html" como padrão.
    const currentPath = window.location.pathname.split('/').pop() || 'home.html'; 
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Normaliza o href do link para remover "./" se houver (ex: "./sobre.html" -> "sobre.html")
        const normalizedLinkHref = linkHref.startsWith('./') ? linkHref.substring(2) : linkHref;
        
        // Compara o href normalizado com o caminho atual para adicionar a classe 'active'
        if (normalizedLinkHref === currentPath) {
            link.classList.add('active');
        }

        // Removemos o alert antigo do botão "Ver Produtos".
        // A navegação direta já é o comportamento padrão de um link <a>.
        // Se houver um botão específico "Ver Produtos" com funcionalidade extra, 
        // ele deve ser tratado com um seletor mais específico.
        // O código abaixo é um exemplo genérico se o botão tiver uma classe como 'ver-produtos-btn'.
        // if (link.classList.contains('ver-produtos-btn')) {
        //     link.addEventListener('click', function(event) {
        //         // event.preventDefault(); // Descomente se precisar fazer algo ANTES de navegar
        //         console.log(`Botão 'Ver Produtos' clicado. Navegando para: ${this.href}`);
        //         // window.location.href = this.href; // Necessário apenas se event.preventDefault() for usado
        //     });
        // }
    });

    // Adicionar link ao H1 do cabeçalho para voltar à home
    const headerTitleLink = document.querySelector('header h1 a'); // Seleciona o <a> dentro do <h1>
    // Não é necessário adicionar um event listener de clique se já é um link <a>.
    // O código abaixo seria para o caso de o H1 não ser um link por si só.
    /*
    const headerTitle = document.querySelector('header h1');
    if (headerTitle && !headerTitle.querySelector('a')) { // Se o H1 não contiver um link
        headerTitle.style.cursor = 'pointer'; // Adiciona cursor de link
        headerTitle.addEventListener('click', () => {
            window.location.href = 'home.html'; // Ou o nome da sua página inicial
        });
    }
    */
    

    // Smooth scroll para links âncora (ex: <a href="#secao-alvo">)
    // Esta funcionalidade permite rolar suavemente para seções na MESMA página.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Verifica se o link âncora é mais do que apenas "#" (que geralmente leva ao topo)
            if (href.length > 1) { 
                try {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        e.preventDefault(); // Previne o salto brusco padrão do navegador
                        targetElement.scrollIntoView({
                            behavior: 'smooth' // Efeito de rolagem suave
                        });
                    }
                } catch (error) {
                    // Se o seletor for inválido (ex: href="#[inválido]"), o querySelector pode dar erro.
                    console.error("Erro ao tentar rolar para a âncora:", error);
                }
            }
        });
    });

    // Animação para cards de produto ao rolar para eles (efeito "fadeInUp")
    const productCards = document.querySelectorAll('.product'); // Seleciona todos os cards com a classe 'product'
    
    // Função que será chamada pelo IntersectionObserver
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            // Se o elemento (card) estiver visível na tela (isIntersecting)
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards'; // Aplica a animação
                entry.target.style.opacity = '1'; // Garante que fique visível após a animação
                observer.unobserve(entry.target); // Para a observação após a animação (anima apenas uma vez)
            }
        });
    };

    if (productCards.length > 0) {
        // Cria um IntersectionObserver que chamará 'animateOnScroll'
        const observer = new IntersectionObserver(animateOnScroll, {
            root: null, // Observa em relação à viewport
            threshold: 0.1, // Aciona quando 10% do elemento estiver visível
        });

        // Aplica o observador a cada card de produto
        productCards.forEach(card => {
            card.style.opacity = '0'; // Começa invisível para o efeito de fade-in
            observer.observe(card);
        });

        // Adiciona os keyframes da animação 'fadeInUp' ao <head> do documento
        // Isso é feito dinamicamente para manter o CSS da animação junto com o JS que a utiliza.
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px); /* Começa um pouco abaixo */
                }
                to {
                    opacity: 1;
                    transform: translateY(0); /* Termina na posição original */
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // Atualizar o ano no rodapé dinamicamente
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Lógica para formulário de contato (se existir e for ativado)
    // O formulário na página de contato está comentado no HTML, mas o JS pode ficar preparado.
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Preenche o campo "Assunto" se vier da URL (ex: de um botão "Registrar Interesse")
        const urlParams = new URLSearchParams(window.location.search);
        const subjectFromUrl = urlParams.get('assunto');
        const produtoFromUrl = urlParams.get('produto');
        const subjectField = contactForm.querySelector('#subject'); // Busca dentro do formulário

        if (subjectField) {
            if (subjectFromUrl) {
                // Transforma "InteresseNeoReflect" em "Interesse Neo Reflect"
                subjectField.value = subjectFromUrl.replace(/([A-Z])/g, ' $1').trim(); 
            }
            if (produtoFromUrl) {
                 subjectField.value = `Interesse no produto: ${produtoFromUrl.replace(/([A-Z0-9])/g, ' $1').trim()}`;
            }
        }

        // Event listener para o envio do formulário
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Previne o envio padrão do formulário
            
            // Coleta os dados do formulário
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email_contact'); // Usando o ID correto do campo de email
            const subject = formData.get('subject');
            const message = formData.get('message');

            console.log("Dados do formulário para envio (simulação):");
            console.log("Nome:", name);
            console.log("Email:", email);
            console.log("Assunto:", subject);
            console.log("Mensagem:", message);

            // Simulação de envio. Em um site real, aqui ocorreria uma chamada AJAX para um backend.
            // Substitua o alert por uma mensagem mais elegante na interface do usuário.
            const feedbackMessage = document.createElement('p');
            feedbackMessage.style.marginTop = '15px';
            feedbackMessage.style.color = 'green';
            feedbackMessage.textContent = 'Mensagem enviada com sucesso (simulação)!';
            
            // Remove mensagem anterior, se houver
            const existingFeedback = contactForm.querySelector('.feedback-message');
            if(existingFeedback) existingFeedback.remove();
            
            feedbackMessage.classList.add('feedback-message');
            contactForm.appendChild(feedbackMessage);


            contactForm.reset(); // Limpa o formulário após o "envio"

            // Remove a mensagem de feedback após alguns segundos
            setTimeout(() => {
                feedbackMessage.remove();
            }, 5000);
        });
    }

});
