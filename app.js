const app = document.getElementById('app');
const scoreDisplay = document.getElementById('scoreDisplay');

const options = [
    "True now and when I was young",
    "True now only",
    "True only when I was younger than 16",
    "Never true"
];

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        const { questions, specialQuestions } = data;

        questions.forEach((questionText, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question', 'mb-4');

            const questionLabel = document.createElement('p');
            questionLabel.textContent = `${index + 1}. ${questionText}`;
            questionElement.appendChild(questionLabel);

            const optionsList = document.createElement('div');
            optionsList.classList.add('options', 'ml-3');

            options.forEach((option, optionIndex) => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('form-check');
                
                const radioButton = document.createElement('input');
                radioButton.classList.add('form-check-input');
                radioButton.setAttribute('type', 'radio');
                radioButton.setAttribute('name', `question_${index}`);
                radioButton.setAttribute('value', optionIndex);
                radioButton.setAttribute('id', `option_${index}_${optionIndex}`);
                
                const optionLabel = document.createElement('label');
                optionLabel.classList.add('form-check-label');
                optionLabel.setAttribute('for', `option_${index}_${optionIndex}`);
                optionLabel.textContent = option;
                
                optionElement.appendChild(radioButton);
                optionElement.appendChild(optionLabel);
                optionsList.appendChild(optionElement);
            });

            questionElement.appendChild(optionsList);
            app.appendChild(questionElement);
        });
    })
    .catch(error => {
        console.error("Failed to fetch questions:", error);
    });

document.getElementById('calculateScore').addEventListener('click', function() {
    const questionsCount = document.querySelectorAll('.question').length;
    let score = 0;
    let answered = 0;

    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            const { specialQuestions } = data;
            const regularScores = [3, 2, 1, 0];
            const specialScores = [0, 1, 2, 3];

            for (let i = 0; i < questionsCount; i++) {
                const selectedOption = document.querySelector(`input[name="question_${i}"]:checked`);
                if (selectedOption) {
                    answered++;
                    const optionIndex = Number(selectedOption.value);
                    score += specialQuestions.includes(i + 1) ? specialScores[optionIndex] : regularScores[optionIndex];
                }
            }

        if (answered !== questionsCount) {
            scoreDisplay.textContent = "Please answer all the questions!";
            scoreDisplay.classList.add('text-danger');
            scoreDisplay.classList.remove('text-success');
        } else {
            scoreDisplay.classList.remove('text-danger', 'bg-info', 'bg-warning', 'bg-success', 'bg-danger');

            let diagnostic = '';
            if (score <= 25) {
                diagnostic = " You are not autistic.";
                scoreDisplay.classList.add('bg-info');
            } else if (score <= 50) {
                diagnostic = " Some autistic traits, but likely not autistic.";
                scoreDisplay.classList.add('bg-info');
            } else if (score <= 65) {
                diagnostic = " Autism is a consideration at this score.";
                scoreDisplay.classList.add('bg-warning');
            } else if (score <= 130) {
                diagnostic = " Strong evidence for autism.";
                scoreDisplay.classList.add('bg-warning');
            } else if (score <= 160) {
                diagnostic = " Very strong evidence for autism.";
                scoreDisplay.classList.add('bg-danger');
            } else if (score <= 227) {
                diagnostic = " One of the highest scores recorded for autism.";
                scoreDisplay.classList.add('bg-danger');
            } else {
                diagnostic = " The maximum possible RAADS–R score.";
                scoreDisplay.classList.add('bg-danger');
            }

            scoreDisplay.textContent = `Your score is: ${score}. ${diagnostic}`;
        }


        })
        .catch(error => {
            console.error("Failed to fetch special questions:", error);
        });
});
