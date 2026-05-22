(() => {
        'use strict';

        // Slide de subtítulos com transição suave e chamada para ação sutil no final
        const slideTexts = [
                "Você pode estar pagando juros abusivos sem saber.",
                "A lei garante o direito à revisão contratual.",
                "É possível obter um desconto de até 70% da sua dívida",
                "Fale com um especialista e saiba mais."
        ];
        let currentIndex = 0;
        const slideElement = document.getElementById('subtitle-slide');

        function showNextText() {
                if (!slideElement) return;
                slideElement.style.opacity = '0';
                setTimeout(() => {
                        slideElement.textContent = slideTexts[currentIndex];
                        slideElement.style.opacity = '1';
                        currentIndex = (currentIndex + 1) % slideTexts.length;
                }, 600);
        }

        function initSubtitleSlide() {
                if (!slideElement) return;
                slideElement.textContent = slideTexts[0];
                currentIndex = 1;
                setInterval(showNextText, 4000);
        }

        // Validação do formulário com fallback para usuários sem JS
        function validateForm() {
                let isValid = true;
                let firstInvalidField = null;

                const valorFinanciamento = document.getElementById('valor-financiamento');
                const estadoContrato = document.getElementById('estado-contrato');
                const negociouBanco = document.getElementById('negociou-banco');

                const errorValor = document.getElementById('error-valor-financiamento');
                const errorEstado = document.getElementById('error-estado-contrato');
                const errorNegociou = document.getElementById('error-negociou-banco');

                // Reset erros
                [valorFinanciamento, estadoContrato, negociouBanco].forEach(field => {
                        field.classList.remove('error');
                });
                [errorValor, errorEstado, errorNegociou].forEach(err => {
                        err.textContent = '';
                });

                // Validar valor financiamento
                if (!valorFinanciamento.value.trim() || isNaN(valorFinanciamento.value) || Number(valorFinanciamento.value) <= 0) {
                        errorValor.textContent = 'Por favor, informe um valor válido.';
                        valorFinanciamento.classList.add('error');
                        if (!firstInvalidField) firstInvalidField = valorFinanciamento;
                        isValid = false;
                }

                // Validar estado contrato
                if (!estadoContrato.value) {
                        errorEstado.textContent = 'Por favor, selecione o estado do contrato.';
                        estadoContrato.classList.add('error');
                        if (!firstInvalidField) firstInvalidField = estadoContrato;
                        isValid = false;
                }

                // Validar negociou banco
                if (!negociouBanco.value) {
                        errorNegociou.textContent = 'Por favor, informe se já tentou negociar com o banco.';
                        negociouBanco.classList.add('error');
                        if (!firstInvalidField) firstInvalidField = negociouBanco;
                        isValid = false;
                }

                if (firstInvalidField) {
                        firstInvalidField.focus();
                }

                return isValid;
        }

        // Scroll suave para o formulário
        function scrollToLeadForm() {
                const form = document.getElementById('lead-form');
                if (!form) return;
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const firstInput = form.querySelector('input, select, textarea');
                if (firstInput) firstInput.focus();
        }

        // Envio do formulário e abertura do WhatsApp com tratamento de erros
        async function handleFormSubmit(event) {
                event.preventDefault();

                const form = event.currentTarget;
                const submitButton = form.querySelector('input[type="submit"]');
                if (!submitButton) return;

                // Reset botão
                submitButton.disabled = false;
                submitButton.value = "Quero Revisar Meu Contrato";

                if (!validateForm()) {
                        submitButton.disabled = false;
                        submitButton.value = "Quero Revisar Meu Contrato";
                        return;
                }

                submitButton.disabled = true;
                submitButton.value = "Enviando...";

                try {
                        const valorFinanciamento = document.getElementById('valor-financiamento').value.trim();
                        const estadoContrato = document.getElementById('estado-contrato').value;
                        const negociouBanco = document.getElementById('negociou-banco').value;

                        let mensagem = `Olá, gostaria de uma avaliação para revisão do meu financiamento.\n` +
                                `Valor do financiamento: R$ ${valorFinanciamento}\n` +
                                `Estado do contrato: ${estadoContrato}`;

                        if (negociouBanco === 'sim') {
                                mensagem += `\nJá tentei negociar com o banco.`;
                        } else if (negociouBanco === 'nao') {
                                mensagem += `\nAinda não tentei negociar com o banco.`;
                        }

                        const mensagemCodificada = encodeURIComponent(mensagem);
                        const numeroWhatsApp = '+5586999765214';
                        const linkWhatsApp = `https://wa.me/${numeroWhatsApp.replace(/\D/g, '')}?text=${mensagemCodificada}`;

                        // Substituir conteúdo do formulário por mensagem de confirmação
                        const formSection = form.parentElement;
                        if (!formSection) throw new Error('Erro interno: seção do formulário não encontrada.');

                        formSection.innerHTML = `
        <div class="confirmation-message" role="alert" aria-live="polite">
          Obrigado pelo contato! Em breve um especialista entrará em contato com você via WhatsApp.
          <br><br>
          <button type="button" id="manual-open-whatsapp" style="background-color:#2980b9; color:#fff; border:none; padding:10px 20px; border-radius:4px; cursor:pointer; font-weight:600; font-size:14px; margin-top:10px;">Clique aqui se não abrir automaticamente</button>
        </div>`;

                        const manualBtn = document.getElementById('manual-open-whatsapp');
                        if (manualBtn) {
                                manualBtn.addEventListener('click', () => {
                                        try {
                                                window.open(linkWhatsApp, '_blank');
                                        } catch {
                                                alert('Não foi possível abrir o WhatsApp automaticamente. Por favor, tente manualmente.');
                                        }
                                });
                        }

                        // Tentar abrir o WhatsApp automaticamente após 1500ms
                        setTimeout(() => {
                                try {
                                        const newWindow = window.open(linkWhatsApp, '_blank');
                                        if (!newWindow) {
                                                alert('Não foi possível abrir o WhatsApp automaticamente. Por favor, clique no botão para abrir manualmente.');
                                        }
                                } catch {
                                        alert('Erro ao tentar abrir o WhatsApp. Por favor, clique no botão para abrir manualmente.');
                                }
                        }, 1500);

                } catch (error) {
                        if (submitButton) {
                                submitButton.disabled = false;
                                submitButton.value = "Quero Revisar Meu Contrato";
                        }
                        alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente mais tarde.');
                        console.error(error);
                }
        }

        // Inicialização dos eventos
        function initEventListeners() {
                // Atualizar link do Instagram
                const instagramLink = document.getElementById('instagram-link');
                if (instagramLink) {
                        instagramLink.href = 'https://www.instagram.com/italobezerra';
                }

                // Inicializar slide de subtítulos
                initSubtitleSlide();

                // Scroll suave para botões whatsapp-fluent-btn
                const whatsappButtons = document.querySelectorAll('.whatsapp-fluent-btn');
                whatsappButtons.forEach(button => {
                        button.addEventListener('click', event => {
                                event.preventDefault();
                                scrollToLeadForm();
                        });
                });

                // Envio do formulário
                const leadForm = document.getElementById('lead-form');
                if (leadForm) {
                        leadForm.addEventListener('submit', handleFormSubmit);
                }
        }

        // Executar inicialização após DOM carregado
        if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initEventListeners);
        } else {
                initEventListeners();
        }
})();
