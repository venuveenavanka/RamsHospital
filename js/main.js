/**
 * RAMS Andrology & Urology Centre - Main Javascript
 * Author: Antigravity AI
 * Includes: Smooth Scroll, Sticky Header, Interactive Quiz, Appointment Handler, Map trigger
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize elements
  initNavbarScroll();
  initBackToTop();
  initQuiz();
  initBookingForm();
  initSmoothScroll();
  initGallery();
});

/**
 * Navbar scroll effect
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-custom');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page loaded scrolled
}

/**
 * Back to Top Button visibility & click
 */
function initBackToTop() {
  const topBtn = document.querySelector('.btn-floating-top');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      topBtn.classList.add('show');
    } else {
      topBtn.classList.remove('show');
    }
  });

  topBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      
      e.preventDefault();
      
      // Close mobile menu if open
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }

      const navbarHeight = document.querySelector('.navbar-custom').offsetHeight || 80;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update active nav item
      document.querySelectorAll('.nav-link-custom').forEach(n => n.classList.remove('active'));
      if (this.classList.contains('nav-link-custom')) {
        this.classList.add('active');
      }
    });
  });
}

/**
 * Interactive Self-Assessment Quiz (SHIM/IIEF-5 Standard for Male Wellness)
 */
function initQuiz() {
  const quizSection = document.getElementById('quiz-widget');
  if (!quizSection) return;

  // Question bank with points (0 to 5 standard scale)
  const questions = [
    {
      text: "How do you rate your confidence that you can get and keep an erection?",
      options: [
        { text: "Very Low", score: 1 },
        { text: "Low", score: 2 },
        { text: "Moderate", score: 3 },
        { text: "High", score: 4 },
        { text: "Very High", score: 5 }
      ]
    },
    {
      text: "When you have erections with sexual stimulation, how often are they hard enough for penetration?",
      options: [
        { text: "Almost Never or Never", score: 1 },
        { text: "A Few Times (Less than half the time)", score: 2 },
        { text: "Sometimes (About half the time)", score: 3 },
        { text: "Most Times (Much more than half the time)", score: 4 },
        { text: "Almost Always or Always", score: 5 }
      ]
    },
    {
      text: "During sexual intercourse, how often are you able to maintain your erection after you have penetrated?",
      options: [
        { text: "Almost Never or Never", score: 1 },
        { text: "A Few Times (Less than half the time)", score: 2 },
        { text: "Sometimes (About half the time)", score: 3 },
        { text: "Most Times (Much more than half the time)", score: 4 },
        { text: "Almost Always or Always", score: 5 }
      ]
    },
    {
      text: "During sexual intercourse, how difficult is it to maintain your erection to completion of intercourse?",
      options: [
        { text: "Extremely Difficult", score: 1 },
        { text: "Very Difficult", score: 2 },
        { text: "Difficult", score: 3 },
        { text: "Slightly Difficult", score: 4 },
        { text: "Not Difficult", score: 5 }
      ]
    },
    {
      text: "When you attempt sexual intercourse, how often is it satisfactory for you?",
      options: [
        { text: "Almost Never or Never", score: 1 },
        { text: "A Few Times (Less than half the time)", score: 2 },
        { text: "Sometimes (About half the time)", score: 3 },
        { text: "Most Times (Much more than half the time)", score: 4 },
        { text: "Almost Always or Always", score: 5 }
      ]
    }
  ];

  let currentQuestionIndex = 0;
  let totalScore = 0;

  // DOM Elements
  const questionTitle = document.getElementById('quiz-question-title');
  const questionText = document.getElementById('quiz-question-text');
  const optionsContainer = document.getElementById('quiz-options-container');
  const progressText = document.getElementById('quiz-progress-text');
  const progressBar = document.getElementById('quiz-progress');
  const resultCard = document.getElementById('quiz-result-card');
  const quizActiveArea = document.getElementById('quiz-active-area');

  const resultTitle = document.getElementById('result-level');
  const resultScoreText = document.getElementById('result-score');
  const resultAdviceText = document.getElementById('result-advice');

  // Render first question
  renderQuestion();

  function renderQuestion() {
    if (currentQuestionIndex >= questions.length) {
      showResults();
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    
    // Update progress
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressText.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    
    questionTitle.innerText = `Section ${currentQuestionIndex + 1}`;
    questionText.innerText = currentQuestion.text;

    // Clear and render options
    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'quiz-option-btn';
      button.innerText = option.text;
      button.addEventListener('click', () => {
        totalScore += option.score;
        currentQuestionIndex++;
        
        // Brief delay for nice visual feedback
        button.classList.add('selected');
        setTimeout(() => {
          renderQuestion();
        }, 200);
      });
      optionsContainer.appendChild(button);
    });
  }

  function showResults() {
    quizActiveArea.style.display = 'none';
    resultCard.style.display = 'block';
    
    resultScoreText.innerText = totalScore;
    
    let level = "";
    let advice = "";
    
    if (totalScore >= 22) {
      level = "Excellent Wellness Score";
      advice = "Your assessment indicates healthy urological and sexual functioning. Continue maintaining a balanced lifestyle, healthy diet, and regular exercise to sustain this score. If you have any other minor concerns, we are always here to advise.";
    } else if (totalScore >= 17) {
      level = "Mild Issues Detected";
      advice = "Your score suggest slight variations in wellness levels. This is very common and frequently caused by temporary elements like daily fatigue, work stress, or minor lifestyle adjustments. A brief consultation can provide easy guidance to restore peak levels.";
    } else if (totalScore >= 12) {
      level = "Mild to Moderate Concerns";
      advice = "Your score indicates noticeable shifts in sexual wellness. Seeking timely guidance from a dedicated specialist like Dr. Rammohan is recommended. Most minor issues are highly treatable and resolvable with safe, standard medical care.";
    } else {
      level = "Moderate to Severe Urological/Sexual Wellness Concerns";
      advice = "Your score suggests significant concerns in urological or sexual functioning. Please do not worry, as advanced solutions (such as standard treatments, medication, or penile implants) have high clinical success rates. A private and confidential discussion with Dr. Rammohan will outline the exact roadmap to rebuild your quality of life.";
    }
    
    resultTitle.innerText = level;
    resultAdviceText.innerText = advice;

    // Direct pre-fill to booking button
    const discussBtn = document.getElementById('discuss-results-btn');
    if (discussBtn) {
      discussBtn.addEventListener('click', () => {
        // Scroll to booking section
        const bookingSection = document.getElementById('appointment');
        const navbarHeight = document.querySelector('.navbar-custom').offsetHeight || 80;
        const targetPos = bookingSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
        
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Pre-fill notes field
        const notesField = document.getElementById('bookNotes');
        if (notesField) {
          notesField.value = `Completed the Private Wellness Assessment. Score obtained: ${totalScore}/25 (${level}). I would like to discuss these results confidentially.`;
        }
      });
    }
  }

  // Handle Quiz Reset
  const resetBtn = document.getElementById('reset-quiz-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentQuestionIndex = 0;
      totalScore = 0;
      resultCard.style.display = 'none';
      quizActiveArea.style.display = 'block';
      renderQuestion();
    });
  }
}

/**
 * Appointment Form Handler and Success Flow
 */
function initBookingForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic Validation
    const name = document.getElementById('bookName').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const date = document.getElementById('bookDate').value;
    const service = document.getElementById('bookService').value;
    const notes = document.getElementById('bookNotes').value.trim();

    if (!name || !phone || !date || !service) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    // Generate random Appt ID
    const appointmentId = 'RAMS-' + Math.floor(1000 + Math.random() * 9000);

    // Render details in success modal
    document.getElementById('modal-appt-id').innerText = appointmentId;
    document.getElementById('modal-patient-name').innerText = name;
    document.getElementById('modal-phone').innerText = phone;
    document.getElementById('modal-date').innerText = date;
    document.getElementById('modal-service').innerText = service;

    // Show bootstrap modal
    const successModal = new bootstrap.Modal(document.getElementById('bookingSuccessModal'));
    successModal.show();

    // Reset Form
    form.reset();

    // Configure the WhatsApp button inside the modal for instant routing
    const waModalBtn = document.getElementById('modal-wa-confirm-btn');
    if (waModalBtn) {
      waModalBtn.onclick = () => {
        const textMessage = `Hello Dr. Rammohan, I would like to confirm my consultation booking at RAMS Andrology Center.\n\n` +
          `• Appointment ID: ${appointmentId}\n` +
          `• Name: ${name}\n` +
          `• Contact: ${phone}\n` +
          `• Service: ${service}\n` +
          `• Date Requested: ${date}\n` +
          `• Notes: ${notes ? notes : 'None'}`;
        
        const encodedText = encodeURIComponent(textMessage);
        window.open(`https://wa.me/919536972369?text=${encodedText}`, '_blank');
      };
    }
  });
}

/**
 * Gallery Lightbox Modal Handler
 */
function initGallery() {
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('galleryLightboxModal');
  if (!lightboxModal) return;

  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  
  galleryCards.forEach(card => {
    card.addEventListener('click', function() {
      const imgSrc = this.getAttribute('data-src');
      const imgTitle = this.getAttribute('data-title');
      
      if (lightboxImg && lightboxCaption) {
        lightboxImg.src = imgSrc;
        lightboxCaption.innerText = imgTitle;
        
        const bsModal = new bootstrap.Modal(lightboxModal);
        bsModal.show();
      }
    });
  });
}
