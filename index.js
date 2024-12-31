// Variáveis de controle
let currentQuestionIndex = 0;  // Índice da pergunta atual
const quizQuestions = document.querySelectorAll('.question-container');  // Todos os containers de perguntas
const resultSection = document.querySelector('.result');  // Seção do resultado
const resultText = document.getElementById('resultText');  // Texto do resultado
let answers = {};  // Objeto para armazenar as respostas

// Função para mostrar a próxima pergunta
function showNextQuestion() {
    if (quizQuestions[currentQuestionIndex]) {
        // Esconde a pergunta atual
        quizQuestions[currentQuestionIndex].style.display = 'none';

        // Verifica se ainda existem mais perguntas
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;  // Avança para a próxima pergunta
            // Exibe a próxima pergunta
            if (quizQuestions[currentQuestionIndex]) {
                quizQuestions[currentQuestionIndex].style.display = 'block';
            }
        } else {
            enviarRespostasParaFlask();  // Envia as respostas para o Flask quando terminar
        }
    } else {
        console.error('Erro: Pergunta não encontrada!');
    }
}

// Função para enviar as respostas para o Flask
function enviarRespostasParaFlask() {
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })  // Envia as respostas como JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            resultText.textContent = `Erro: ${data.error}`;
        } else {
            resultText.textContent = `Perfume: ${data.perfume} | Intensidade: ${data.intensidade}`;
        }
        resultSection.style.display = 'block';  // Exibe a seção de resultado
    })
    .catch(error => {
        console.error("Erro ao comunicar com o backend", error);
        resultText.textContent = "Erro ao comunicar com o backend.";
        resultSection.style.display = 'block';  // Exibe a seção de erro
    });
}

// Função para capturar a resposta e atualizar o objeto 'answers'
function capturarResposta(pergunta, resposta) {
    if (pergunta.includes("ocasião")) {
        answers['ocasião'] = resposta;
    } else if (pergunta.includes("período")) {
        answers['periodo'] = resposta;
    } else if (pergunta.includes("clima")) {
        answers['clima'] = resposta;
    } else if (pergunta.includes("sexo")) {
        answers['sexo'] = resposta;
    } else if (pergunta.includes("sentimento")) {
        answers['sentimento'] = resposta;
    } else if (pergunta.includes("notas")) {
        answers['notas'] = resposta;
    } else if (pergunta.includes("estilo")) {
        answers['estilo'] = resposta;
    } else if (pergunta.includes("faixa etária")) {
        answers['faixa_etaria'] = resposta;
    }
}

// Evento de clique para as opções
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', (event) => {
        const answer = event.target.dataset.answer;  // Obtém a resposta da opção clicada
        const questionText = event.target.closest('.question-container').querySelector('.question')?.textContent;  // Obtém o texto da pergunta, com verificação

        // Verifique se o questionText existe
        if (questionText) {
            // Armazena as respostas
            capturarResposta(questionText, answer);

            // Exibe a próxima pergunta após clicar
            showNextQuestion();
        } else {
            console.error("Erro: Não foi possível encontrar o texto da pergunta.");
        }
    });
});

// Função para reiniciar o quiz
function restartQuiz() {
    answers = {};  // Limpa as respostas
    currentQuestionIndex = 0;  // Reseta o índice da pergunta
    quizQuestions.forEach(q => q.style.display = 'none');  // Esconde todas as perguntas
    if (quizQuestions[0]) {
        quizQuestions[0].style.display = 'block';  // Exibe a primeira pergunta
    }
    resultSection.style.display = 'none';  // Esconde o resultado
}

// Exibe a primeira pergunta inicialmente
if (quizQuestions[0]) {
    quizQuestions[0].style.display = 'block';
}