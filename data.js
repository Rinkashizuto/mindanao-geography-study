const mindanaoData = {
    "Region IX (Zamboanga Peninsula)": {
        "Zamboanga del Norte": "Dipolog",
        "Zamboanga del Sur": "Pagadian",
        "Zamboanga Sibugay": "Ipil",
        "Sulu": "Jolo"
    },
    "Region X (Northern Mindanao)": {
        "Bukidnon": "Malaybalay",
        "Camiguin": "Mambajao",
        "Lanao del Norte": "Tubod",
        "Misamis Occidental": "Oroquieta",
        "Misamis Oriental": "Cagayan de Oro",
    },
    "Region XI (Davao Region)": {
        "Davao de Oro": "Nabunturan",
        "Davao del Norte": "Tagum",
        "Davao del Sur": "Digos",
        "Davao Occidental": "Malita",
        "Davao Oriental": "Mati",
    },
    "Region XII (SOCCSKSARGEN)": {
        "South Cotabato": "Koronadal",
        "Cotabato": "Kidapawan",
        "Sultan Kudarat": "Isulan",
        "Sarangani": "Alabel"
    },
    "Region XIII (Caraga)": {
        "Agusan del Norte": "Cabadbaran",
        "Agusan del Sur": "Prosperidad",
        "Dinagat Islands": "San Jose",
        "Surigao del Norte": "Surigao City",
        "Surigao del Sur": "Tandag"
    },
    "BARMM (Bangsamoro Autonomous Region)": {
        "Basilan": "Isabela",
        "Lanao del Sur": "Marawi",
        "Maguindanao del Norte": "Datu Odin Sinsuat",
        "Maguindanao del Sur": "Buluan",
        "Tawi-Tawi": "Bongao"
    }
};

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let answeredQuestions = 0;
let currentQuizType = '';

function generateProvinceQuestions() {
    const questions = [];
    
    for (const region in mindanaoData) {
        for (const province in mindanaoData[region]) {
            const capital = mindanaoData[region][province];
            
            // Question: What is the capital of [Province]?
            questions.push({
                question: `What is the capital of ${province}?`,
                correct: capital,
                options: generateCapitalOptions(capital, region),
                type: 'capital'
            });
            
            // Question: Which province has [Capital] as its capital?
            questions.push({
                question: `Which province/city has ${capital} as its capital?`,
                correct: province,
                options: generateProvinceOptions(province, region),
                type: 'province'
            });
        }
    }
    
    return shuffleArray(questions);
}

function generateRegionQuestions() {
    const questions = [];
    
    for (const region in mindanaoData) {
        for (const province in mindanaoData[region]) {
            // Question: Which region does [Province] belong to?
            questions.push({
                question: `Which region does ${province} belong to?`,
                correct: region,
                options: generateRegionOptions(region),
                type: 'province-to-region'
            });
            
            // Question: Which of these provinces is in [Region]?
            const provincesInRegion = Object.keys(mindanaoData[region]);
            const randomProvince = provincesInRegion[Math.floor(Math.random() * provincesInRegion.length)];
            
            questions.push({
                question: `Which of these provinces/cities is in ${region}?`,
                correct: randomProvince,
                options: generateProvinceFromRegionOptions(randomProvince, region),
                type: 'region-to-province'
            });
        }
    }
    
    // Additional region-specific questions
    for (const region in mindanaoData) {
        const provinces = Object.keys(mindanaoData[region]);
        questions.push({
            question: `How many provinces/cities are in ${region}?`,
            correct: provinces.length.toString(),
            options: generateCountOptions(provinces.length),
            type: 'count'
        });
    }
    
    return shuffleArray(questions);
}

function generateCapitalOptions(correct, region) {
    const options = [correct];
    const allCapitals = [];
    
    // Get capitals from same region first
    for (const prov in mindanaoData[region]) {
        if (mindanaoData[region][prov] !== correct) {
            allCapitals.push(mindanaoData[region][prov]);
        }
    }
    
    // Add capitals from other regions if needed
    for (const reg in mindanaoData) {
        if (reg !== region) {
            for (const prov in mindanaoData[reg]) {
                allCapitals.push(mindanaoData[reg][prov]);
            }
        }
    }
    
    // Shuffle and take 3 random wrong answers
    const shuffled = shuffleArray(allCapitals);
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
        options.push(shuffled[i]);
    }
    
    return shuffleArray(options);
}

function generateProvinceOptions(correct, region) {
    const options = [correct];
    const allProvinces = [];
    
    // Get provinces from same region first
    for (const prov in mindanaoData[region]) {
        if (prov !== correct) {
            allProvinces.push(prov);
        }
    }
    
    // Add provinces from other regions
    for (const reg in mindanaoData) {
        if (reg !== region) {
            for (const prov in mindanaoData[reg]) {
                allProvinces.push(prov);
            }
        }
    }
    
    // Shuffle and take 3 random wrong answers
    const shuffled = shuffleArray(allProvinces);
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
        options.push(shuffled[i]);
    }
    
    return shuffleArray(options);
}

function generateRegionOptions(correctRegion) {
    const allRegions = Object.keys(mindanaoData);
    const options = [correctRegion];
    
    for (const region of allRegions) {
        if (region !== correctRegion && options.length < 4) {
            options.push(region);
        }
    }
    
    return shuffleArray(options);
}

function generateProvinceFromRegionOptions(correct, correctRegion) {
    const options = [correct];
    const otherProvinces = [];
    
    // Get provinces from other regions
    for (const region in mindanaoData) {
        if (region !== correctRegion) {
            for (const province in mindanaoData[region]) {
                otherProvinces.push(province);
            }
        }
    }
    
    // Add 3 random provinces from other regions
    const shuffled = shuffleArray(otherProvinces);
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
        options.push(shuffled[i]);
    }
    
    return shuffleArray(options);
}

function generateCountOptions(correctCount) {
    const options = [correctCount.toString()];
    const possibleCounts = [correctCount - 2, correctCount - 1, correctCount + 1, correctCount + 2];
    
    for (const count of possibleCounts) {
        if (count > 0 && count !== correctCount && options.length < 4) {
            options.push(count.toString());
        }
    }
    
    // Fill with more options if needed
    while (options.length < 4) {
        const randomCount = Math.floor(Math.random() * 8) + 1;
        if (!options.includes(randomCount.toString())) {
            options.push(randomCount.toString());
        }
    }
    
    return shuffleArray(options);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function startProvinceQuiz() {
    currentQuestions = generateProvinceQuestions(); // Use ALL questions, no limit
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = 0;
    totalQuestions = currentQuestions.length;
    currentQuizType = 'provinces';
    
    document.getElementById('studyModes').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('studyList').style.display = 'none';
    
    // Update quiz header
    document.querySelector('.quiz-header h2').textContent = 'Provinces & Capitals Quiz';
    
    displayQuestion();
    updateProgress();
}

function startRegionQuiz() {
    currentQuestions = generateRegionQuestions(); // Use ALL questions, no limit
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = 0;
    totalQuestions = currentQuestions.length;
    currentQuizType = 'regions';
    
    document.getElementById('studyModes').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('studyList').style.display = 'none';
    
    // Update quiz header
    document.querySelector('.quiz-header h2').textContent = 'Regions Quiz';
    
    displayQuestion();
    updateProgress();
}

function displayQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showQuizResults();
        return;
    }

    const question = currentQuestions[currentQuestionIndex];
    document.getElementById('quizQuestion').textContent = question.question;
    document.getElementById('scoreDisplay').textContent = `Score: ${score}/${answeredQuestions}`;
    document.getElementById('questionCounter').textContent = 
        `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectAnswer(option, question.correct);
        optionsContainer.appendChild(optionDiv);
    });
    
    document.getElementById('nextBtn').disabled = true;
}

function selectAnswer(selected, correct) {
    answeredQuestions++;
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach(option => {
        option.onclick = null; // Disable further clicking
        if (option.textContent === correct) {
            option.classList.add('correct');
        } else if (option.textContent === selected && selected !== correct) {
            option.classList.add('incorrect');
        }
    });
    
    if (selected === correct) {
        score++;
    }
    
    document.getElementById('nextBtn').disabled = false;
    updateProgress();
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function showQuizResults() {
    const percentage = Math.round((score / totalQuestions) * 100);
    let performance = '';
    
    if (percentage >= 90) performance = 'Excellent! 🏆';
    else if (percentage >= 80) performance = 'Very Good! 👍';
    else if (percentage >= 70) performance = 'Good! 😊';
    else if (percentage >= 60) performance = 'Fair 📚';
    else performance = 'Keep Studying! 💪';
    
    document.getElementById('quizQuestion').textContent = 
        `Quiz Complete! You scored ${score} out of ${totalQuestions} (${percentage}%) - ${performance}`;
    document.getElementById('quizOptions').innerHTML = 
        `<div style="text-align: center; padding: 20px; background: rgba(218, 165, 32, 0.2); border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 1.1em; margin-bottom: 15px;">
                You answered ${score} questions correctly out of ${totalQuestions} total questions.
            </p>
            <button class="btn" onclick="restartCurrentQuiz()" style="margin-right: 10px;">🔄 Try Again</button>
            <button class="btn" onclick="goHome()">🏠 Back to Home</button>
        </div>`;
    document.getElementById('nextBtn').style.display = 'none';
}

function restartCurrentQuiz() {
    if (currentQuizType === 'provinces') {
        startProvinceQuiz();
    } else if (currentQuizType === 'regions') {
        startRegionQuiz();
    }
}

function showStudyList() {
    document.getElementById('studyModes').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('studyList').style.display = 'block';
    
    const regionsList = document.getElementById('regionsList');
    regionsList.innerHTML = '';
    
    for (const region in mindanaoData) {
        const regionDiv = document.createElement('div');
        regionDiv.className = 'region-section';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'region-header';
        headerDiv.textContent = region;
        headerDiv.onclick = () => toggleRegion(regionDiv);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'region-content';
        
        for (const province in mindanaoData[region]) {
            const capital = mindanaoData[region][province];
            const provinceDiv = document.createElement('div');
            provinceDiv.className = 'province-item';
            provinceDiv.innerHTML = `
                <span class="province-name">${province}</span>
                <span class="capital-name">${capital}</span>
            `;
            contentDiv.appendChild(provinceDiv);
        }
        
        regionDiv.appendChild(headerDiv);
        regionDiv.appendChild(contentDiv);
        regionsList.appendChild(regionDiv);
    }
}

function toggleRegion(regionDiv) {
    const content = regionDiv.querySelector('.region-content');
    content.classList.toggle('active');
}

function goHome() {
    document.getElementById('studyModes').style.display = 'grid';
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('studyList').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';
    
    // Reset progress
    answeredQuestions = 0;
    totalQuestions = 0;
    updateProgress();
}

function updateProgress() {
    let percentage = 0;
    if (totalQuestions > 0) {
        percentage = Math.round((answeredQuestions / totalQuestions) * 100);
    }
    
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `Progress: ${percentage}%`;
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();

});
