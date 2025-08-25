document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        // As mesmas 10 perguntas sobre Romanos que tínhamos antes...
        { question: "No capítulo 1, Paulo afirma que não se envergonha do Evangelho...", answers: [{ text: "Pratica boas obras", correct: false }, { text: "Crê", correct: true }, { text: "É batizado", correct: false }, { text: "Obedece à lei", correct: false }] },
        { question: "Segundo Romanos 3:23, 'Pois todos pecaram e carecem da...'", answers: [{ text: "Riqueza do mundo", correct: false }, { text: "Justiça dos homens", correct: false }, { text: "Glória de Deus'", correct: true }, { text: "Sabedoria dos anjos", correct: false }] },
        { question: "Em Romanos 4, qual patriarca é usado como principal exemplo de justificação pela fé?", answers: [{ text: "Moisés", correct: false }, { text: "Isaque", correct: false }, { text: "Jacó", correct: false }, { text: "Abraão", correct: true }] },
        { question: "O que Paulo declara em Romanos 6:23 ser 'o salário do pecado'?", answers: [{ text: "A tristeza", correct: false }, { text: "A perdição", correct: false }, { text: "A morte", correct: true }, { text: "A doença", correct: false }] },
        { question: "No capítulo 7, a que Paulo atribui sua luta interior entre o bem e o mal?", answers: [{ text: "À fraqueza da carne", correct: false }, { text: "Ao pecado que habita nele", correct: true }, { text: "À tentação do diabo", correct: false }, { text: "Às leis humanas", correct: false }] },
        { question: "Complete a famosa afirmação de Romanos 8:1: 'Agora, pois, já nenhuma _________ há...'", answers: [{ text: "Punição", correct: false }, { text: "Tristeza", correct: false }, { text: "Dúvida", correct: false }, { text: "Condenação", correct: true }] },
        { question: "Em Romanos 8:28, lemos: 'Sabemos que todas as coisas cooperam para o bem daqueles que...'", answers: [{ text: "Oram sem cessar", correct: false }, { text: "Amam a Deus", correct: true }, { text: "Dão esmolas", correct: false }, { text: "Fazem jejum", correct: false }] },
        { question: "No capítulo 12, Paulo exorta os crentes a apresentarem seus corpos como um sacrifício vivo, santo e...", answers: [{ text: "Agradável a Deus", correct: true }, { text: "Perfeito aos homens", correct: false }, { text: "Digno de louvor", correct: false }, { text: "Cheio de poder", correct: false }] },
        { question: "Em Romanos 13, a que Paulo instrui os cristãos a serem sujeitos?", answers: [{ text: "Apenas aos líderes da igreja", correct: false }, { text: "Às suas próprias vontades", correct: false }, { text: "Às autoridades governamentais", correct: true }, { text: "Aos costumes da época", correct: false }] },
        { question: "Qual o nome da diaconisa que Paulo recomenda à igreja em Roma no início do capítulo 16?", answers: [{ text: "Priscila", correct: false }, { text: "Lídia", correct: false }, { text: "Maria", correct: false }, { text: "Febe", correct: true }] }
    ];

    const database = firebase.database();
    
    // ... (O resto do código permanece igual ao anterior, mas a lógica de ranking é trocada) ...

    const loginScreen = document.getElementById('login-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    const playerNameInput = document.getElementById('player-name');
    const startButton = document.getElementById('start-btn');
    
    const questionTextElement = document.getElementById('question-text');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');

    const finalScoreText = document.getElementById('final-score-text');
    const rankingList = document.getElementById('ranking-list');
    const restartButton = document.getElementById('restart-btn');
    const loadingRankingText = document.getElementById('loading-ranking');

    let currentQuestionIndex = 0;
    let score = 0;
    let currentPlayer = '';

    startButton.addEventListener('click', () => {
        currentPlayer = playerNameInput.value.trim();
        if (currentPlayer) {
            localStorage.setItem('gincanaPlayerName', currentPlayer); // Salva localmente para persistir
            loginScreen.classList.add('hidden');
            quizScreen.classList.remove('hidden');
            startQuiz();
        } else {
            alert('Por favor, digite seu nome para começar!');
        }
    });
    
    function startQuiz() {
        resultsScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        currentQuestionIndex = 0;
        score = 0;
        nextButton.innerHTML = "Próxima";
        showQuestion();
    }
    
    function showQuestion() {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];
        questionCounter.innerText = `Pergunta ${currentQuestionIndex + 1} de ${questions.length}`;
        progressBar.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;
        questionTextElement.innerText = currentQuestion.question;
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            if (answer.correct) button.dataset.correct = answer.correct;
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
            if (button.dataset.correct === 'true') button.classList.add('correct');
            button.disabled = true;
        });

        if (questions.length > currentQuestionIndex + 1) {
            nextButton.style.display = 'block';
        } else {
            nextButton.innerText = 'Ver Ranking';
            nextButton.style.display = 'block';
        }
    }

    function handleNextButton() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }

    nextButton.addEventListener('click', handleNextButton);
    restartButton.addEventListener('click', startQuiz);
    
    function showResults() {
        quizScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        finalScoreText.innerText = `Sua Pontuação: ${score} de ${questions.length}`;
        updateAndDisplayRanking();
    }

    function updateAndDisplayRanking() {
        loadingRankingText.style.display = 'block';
        rankingList.innerHTML = '';

        const playerRef = database.ref('rankings/' + currentPlayer);

        // Primeiro, verifica se o jogador já tem uma pontuação e só atualiza se a nova for maior
        playerRef.once('value', (snapshot) => {
            const existingScore = snapshot.val() ? snapshot.val().score : 0;
            if (score > existingScore) {
                playerRef.set({ name: currentPlayer, score: score });
            }
        });

        // Agora, busca o ranking completo para exibir
        const rankingsRef = database.ref('rankings').orderByChild('score').limitToLast(10); // Pega os 10 melhores
        rankingsRef.once('value', (snapshot) => {
            loadingRankingText.style.display = 'none';
            const rankings = [];
            snapshot.forEach(childSnapshot => {
                rankings.push(childSnapshot.val());
            });
            
            // Inverte para mostrar a maior pontuação primeiro
            rankings.reverse(); 

            rankings.forEach(entry => {
                const li = document.createElement('li');
                li.innerHTML = `${entry.name} <span class="rank-score">${entry.score} Pontos</span>`;
                if (entry.name === currentPlayer) {
                    li.classList.add('current-player');
                }
                rankingList.appendChild(li);
            });
        });
    }

    // Tenta recuperar o nome do jogador se ele já jogou antes
    const savedPlayerName = localStorage.getItem('gincanaPlayerName');
    if (savedPlayerName) {
        playerNameInput.value = savedPlayerName;
    }
});