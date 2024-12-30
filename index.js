let currentQuestionIndex = 0;
let answers = {
    clima: null,
    fragrancia: null,
    perfume_intensidade: null
};

// Perguntas e opções
const questions = [
    {
        question: "Qual é o seu clima favorito?",
        options: [
            { text: "Verão", score: 1 },
            { text: "Outono", score: 2 },
            { text: "Inverno", score: 3 },
            { text: "Primavera", score: 4 }
        ]
    },
    {
        question: "Qual tipo de fragrância você prefere?",
        options: [
            { text: "Fragrâncias doces", score: 1 },
            { text: "Fragrâncias frescas", score: 2 },
            { text: "Fragrâncias amadeiradas", score: 3 },
            { text: "Fragrâncias florais", score: 4 }
        ]
    },
    {
        question: "Você prefere perfumes mais leves ou intensos?",
        options: [
            { text: "Leves", score: 1 },
            { text: "Intensos", score: 2 }
        ]
    }
];

// Função para renderizar a próxima pergunta
function renderQuestion() {
    if (currentQuestionIndex < questions.length) {
        const questionData = questions[currentQuestionIndex];
        const questionContainer = document.querySelector('.quiz');
        const questionElement = questionContainer.querySelector('.question');
        const optionsContainer = questionContainer.querySelector('.options');

        // Atualizar o conteúdo da pergunta
        questionElement.textContent = questionData.question;

        // Limpar as opções antigas
        optionsContainer.innerHTML = '';

        // Adicionar as novas opções
        questionData.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option');
            button.textContent = option.text;
            button.dataset.score = option.score;
            button.onclick = handleOptionClick;
            optionsContainer.appendChild(button);
        });

        // Mostrar o container da pergunta
        questionContainer.style.display = 'block';
    }
}

// Função para lidar com a seleção da opção
function handleOptionClick(event) {
    // Obter o score selecionado
    const score = parseInt(event.target.dataset.score);
    
    // Armazenar a resposta de acordo com a pergunta
    switch (currentQuestionIndex) {
        case 0:
            answers.clima = score;
            break;
        case 1:
            answers.fragrancia = score;
            break;
        case 2:
            answers.perfume_intensidade = score;
            break;
    }

    // Avançar para a próxima pergunta ou enviar as respostas
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        renderQuestion();
    } else {
        sendResponsesToFlask();
    }
}

// Função para enviar as respostas para o Flask
function sendResponsesToFlask() {
    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            answers: answers
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.result) {
            showResult(data.result);  // Exibe o resultado retornado
        } else {
            throw new Error('Resultado não encontrado na resposta');
        }
    })
    .catch(error => {
        console.error('Erro ao enviar as respostas:', error);
        alert('Ocorreu um erro ao processar a resposta. Tente novamente.');
    });
}

// Função para mostrar o resultado da previsão
function showResult(result) {
    const questionContainer = document.querySelector('.quiz');
    questionContainer.style.display = 'none';

    // Mostrar a tela de resultado
    const resultSection = document.querySelector('.result');
    resultSection.querySelector('h2').innerText = `Resultado: ${result}`;
    resultSection.style.display = 'block';
}

// Iniciar o quiz renderizando a primeira pergunta
document.addEventListener('DOMContentLoaded', () => {
    renderQuestion();
});