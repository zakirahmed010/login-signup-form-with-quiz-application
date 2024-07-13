document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup');
    const loginForm = document.getElementById('login');
    const signupContainer = document.getElementById('signup-form');
    const loginContainer = document.getElementById('login-form');
    const quizContainer = document.getElementById('quiz');
    const showLoginLink = document.getElementById('show-login');
    const showSignupLink = document.getElementById('show-signup');

    const USERS_KEY = 'users';
    let currentUser = null;

    const quizQuestions = [
        {
            question: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'Hyper Tool Markup Language'],
            correctAnswer: 'Hyper Text Markup Language'
        },
        {
            question: 'Which HTML attribute is used to define inline styles?',
            options: ['class', 'style', 'font', 'styles'],
            correctAnswer: 'style'
        },
        {
            question: 'Which property is used to change the background color in CSS?',
            options: ['bgcolor', 'background-color', 'color', 'background'],
            correctAnswer: 'background-color'
        },
        {
            question: 'Which CSS property controls the text size?',
            options: ['text-size', 'font-size', 'text-style', 'font-style'],
            correctAnswer: 'font-size'
        },
        {
            question: 'Inside which HTML element do we put the JavaScript?',
            options: ['<script>', '<js>', '<scripting>', '<javascript>'],
            correctAnswer: '<script>'
        },
        {
            question: 'How do you create a function in JavaScript?',
            options: ['function = myFunction()', 'function myFunction()', 'function:myFunction()', 'myFunction()'],
            correctAnswer: 'function myFunction()'
        },
        {
            question: 'Which event occurs when the user clicks on an HTML element?',
            options: ['onchange', 'onmouseclick', 'onclick', 'onmouseover'],
            correctAnswer: 'onclick'
        },
        {
            question: 'How can you add a comment in a JavaScript?',
            options: ['//This is a comment', '<!--This is a comment-->', '//This is a comment//', '\'This is a comment'],
            correctAnswer: '//This is a comment'
        }
    ];

    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    const totalQuestions = quizQuestions.length;

    const getUsers = () => {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    };

    const setUsers = (users) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    };

    const showQuiz = () => {
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        displayQuestion();
    };

    const displayQuestion = () => {
        const questionText = document.getElementById('question-text');
        const optionsList = document.getElementById('options-list');
        const currentQuestion = quizQuestions[currentQuestionIndex];

        questionText.textContent = currentQuestion.question;
        optionsList.innerHTML = '';

        currentQuestion.options.forEach(option => {
            const li = document.createElement('li');
            li.textContent = option;
            li.addEventListener('click', () => selectAnswer(option, li));
            optionsList.appendChild(li);
        });

        document.getElementById('feedback').textContent = '';
        document.getElementById('next-question').style.display = 'none';
    };

    const selectAnswer = (selectedOption, selectedElement) => {
        const correctAnswer = quizQuestions[currentQuestionIndex].correctAnswer;
        const feedback = document.getElementById('feedback');
        const nextButton = document.getElementById('next-question');
        const optionsList = document.getElementById('options-list');

        optionsList.querySelectorAll('li').forEach(li => {
            li.style.pointerEvents = 'none';
        });

        if (selectedOption === correctAnswer) {
            feedback.textContent = 'Correct!';
            feedback.style.color = 'green';
            selectedElement.style.backgroundColor = 'green';
            correctAnswers++;
        } else {
            feedback.textContent = 'Incorrect!';
            feedback.style.color = 'red';
            selectedElement.style.backgroundColor = 'red';
            incorrectAnswers++;
        }

        nextButton.style.display = 'block';
    };

    const nextQuestion = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < totalQuestions) {
            displayQuestion();
        } else {
            quizComplete();
        }
    };

    const quizComplete = () => {
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = `<h3>Quiz Complete!</h3>
                                       <p>Correct Answers: ${correctAnswers}</p>
                                       <p>Incorrect Answers: ${incorrectAnswers}</p>
                                       <p>Thank you for participating.</p>`;

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Quiz';
        restartButton.addEventListener('click', () => {
            currentQuestionIndex = 0;
            correctAnswers = 0;
            incorrectAnswers = 0;
            questionContainer.innerHTML = '';
            showQuiz();
        });
        questionContainer.appendChild(restartButton);
    };

    const showLogin = () => {
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        quizContainer.style.display = 'none';
    };

    const showSignup = () => {
        signupContainer.style.display = 'block';
        loginContainer.style.display = 'none';
        quizContainer.style.display = 'none';
    };

    const loginUser = (username, password) => {
        const users = getUsers();
        const user = users.find(user => user.username === username && user.password === password);
        return user;
    };

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;

        const users = getUsers();
        if (users.some(user => user.username === username)) {
            console.log('Username already exists.');
        } else {
            users.push({ username, password });
            setUsers(users);
            console.log(`Signup successful! Username: ${username}, Password: ${password}`);
            showLogin();
        }
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const user = loginUser(username, password);
        if (user) {
            console.log(`Login successful! Username: ${username}`);
            showQuiz();
        } else {
            console.log('Invalid username or password.');
        }
    });

    showLoginLink.addEventListener('click', showLogin);
    showSignupLink.addEventListener('click', showSignup);

    document.getElementById('next-question').addEventListener('click', nextQuestion);
});
