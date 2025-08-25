document.addEventListener('DOMContentLoaded', () => {

    const questions = [
        {
            question: "Quem construiu uma arca para salvar sua família e os animais do dilúvio?",
            answers: [
                { text: "Abraão", correct: false },
                { text: "Moisés", correct: false },
                { text: "Noé", correct: true },
                { text: "Jacó", correct: false }
            ]
        },
        {
            question: "Quais foram os três presentes que os Reis Magos levaram para Jesus?",
            answers: [
                { text: "Ouro, Prata e Bronze", correct: false },
                { text: "Ouro, Incenso e Mirra", correct: true },
                { text: "Seda, Especiarias e Mirra", correct: false },
                { text: "Pão, Vinho e Azeite", correct: false }
            ]
        },
        {
            question: "Qual profeta foi engolido por um grande peixe?",
            answers: [
                { text: "Jonas", correct: true },
                { text: "Isaías", correct: false },
                { text: "Daniel", correct: false },
                { text: "Elias", correct: false }
            ]
        },
        {
            question: "Quantas pragas Deus enviou sobre o Egito?",
            answers: [
                { text: "7", correct: false },
                { text: "12", correct: false },
                { text: "10", correct: true },
                { text: "3", correct: false }
            ]
        },
        {
            question: "Qual é o livro mais longo da Bíblia (em número de capítulos)?",
            answers: [
                { text: "Gênesis", correct: false },
                { text: "Salmos", correct: true },
                { text: "Isaías", correct: false },
                { text: "Jeremias", correct: false }
            ]
        },
        {
            question: "Quem traiu Jesus por 30 moedas de prata?",
            answers: [
                { text: "Pedro", correct: false },
                { text: "Tomé", correct: false },
                { text: "Judas Iscariotes", correct: true },
                { text: "João", correct: false }
            ]
        },
        {
            question: "Em qual rio Jesus foi batizado por João Batista?",
            answers: [
                { text: "Rio Nilo", correct: false },
                { text: "Rio Eufrates", correct: false },
                { text: "Rio Tigre", correct: false },
                { text: "Rio Jordão", correct: true }
            ]
        },
        {
            question: "Qual arma Davi usou para derrotar o gigante Golias?",
            answers: [
                { text: "Uma espada", correct: false },
                { text: "Uma funda (atiradeira) e uma pedra", correct: true },
                { text: "Um arco e flecha", correct: false },
                { text: "Uma lança", correct: false }
            ]
        },
        {
            question: "Quem foi a mãe de João Batista?",
            answers: [
                { text: "Maria", correct: false },
                { text: "Sara", correct: false },
                { text: "Isabel", correct: true },
                { text: "Rute", correct: false }
            ]
        },
        {
            question: "Qual é o primeiro livro da Bíblia?",
            answers: [
                { text: "Êxodo", correct: false },
                { text: "Gênesis", correct: true },
                { text: "Salmos", correct: false },
                { text: "Mateus", correct: false }
            ]
        }
    ];

    const questionTextElement = document.getElementById('question-text');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');

    let currentQuestionIndex = 0;
    let score = 0;

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        nextButton.innerHTML = "Próxima";
        showQuestion();
    }

    function showQuestion() {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];
        
        // Atualiza contador e barra de progresso
        questionCounter.innerText = `Pergunta ${currentQuestionIndex + 1} de ${questions.length}`;
        progressBar.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;

        questionTextElement.innerText = currentQuestion.question;

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        nextButton.style.display = 'none';
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === 'true';

        if (isCorrect) {
            selectedBtn.classList.add('correct');
            score++;
        } else {
            selectedBtn.classList.add('incorrect');
        }

        Array.from(answerButtonsElement.children).forEach(button => {
            if (button.dataset.correct === 'true') {
                button.classList.add('correct');
            }
            button.disabled = true;
        });

        if (questions.length > currentQuestionIndex + 1) {
            nextButton.style.display = 'block';
        } else {
            progressBar.style.width = '100%';
            nextButton.innerText = 'Ver Resultado';
            nextButton.style.display = 'block';
        }
    }
    
    function showScore() {
        resetState();
        progressBar.style.width = '100%';
        questionCounter.innerText = "Fim de Jogo!";
        questionTextElement.innerText = `Você acertou ${score} de ${questions.length} perguntas!`;
        
        let message = "";
        if (score > 7) {
            message = "Excelente! Você tem um conhecimento profundo das Escrituras.";
        } else if (score > 4) {
            message = "Muito bem! Continue estudando para aprofundar seu conhecimento.";
        } else {
            message = "Bom começo! Continue lendo a Bíblia para aprender mais.";
        }
        
        const messageElement = document.createElement('p');
        messageElement.innerText = message;
        messageElement.style.marginTop = '1rem';
        answerButtonsElement.appendChild(messageElement);

        nextButton.innerText = "Reiniciar";
        nextButton.style.display = 'block';
    }

    function handleNextButton() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showScore();
        }
    }

    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length) {
            handleNextButton();
        } else {
            startQuiz();
        }
    });

    startQuiz();
});