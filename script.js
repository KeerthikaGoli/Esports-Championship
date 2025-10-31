(function() {
    'use strict';

    // Global variables
    let currentSlide = 0;
    const totalSlides = 4;

    // Safe element getter
    function getElement(id) {
        try {
            return document.getElementById(id);
        } catch (e) {
            console.warn('Element not found:', id);
            return null;
        }
    }

    // Safe event listener adder
    function safeAddEventListener(element, event, handler) {
        if (element && typeof element.addEventListener === 'function') {
            element.addEventListener(event, handler);
        } else {
            console.warn('Cannot add event listener to element:', element);
        }
    }

    // Create particles
    function createParticles() {
        const particlesContainer = getElement('particles');
        if (!particlesContainer) return;
        
        const particleCount = window.innerWidth < 768 ? 30 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Theme management
    function initTheme() {
        const themeToggle = getElement('themeToggle');
        const body = document.body;
        
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
            if (themeToggle) themeToggle.textContent = '☀️';
        }
        
        safeAddEventListener(themeToggle, 'click', function() {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            if (themeToggle) themeToggle.textContent = isLight ? '☀️' : '🌙';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // Navbar scroll effect
    function initNavbar() {
        const navbar = getElement('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu
    function initMobileMenu() {
        const mobileToggle = getElement('mobileToggle');
        const mobileMenu = getElement('mobileMenu');
        
        safeAddEventListener(mobileToggle, 'click', function() {
            if (mobileMenu) {
                mobileMenu.classList.toggle('show');
            }
        });
    }

    // Smooth scrolling
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('.navbar-link, .mobile-menu-item');
        const mobileMenu = getElement('mobileMenu');
        
        navLinks.forEach(function(link) {
            safeAddEventListener(link, 'click', function(e) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    if (mobileMenu) {
                        mobileMenu.classList.remove('show');
                    }
                    
                    // Update active nav
                    document.querySelectorAll('.navbar-link').forEach(function(nl) {
                        nl.classList.remove('active');
                    });
                    if (link.classList.contains('navbar-link')) {
                        link.classList.add('active');
                    }
                }
            });
        });
    }

    // Slider functionality
    function initSlider() {
        const slider = getElement('slider');
        const navDots = document.querySelectorAll('.nav-dot');
        
        function updateSlider() {
            if (slider) {
                const translateX = -currentSlide * 100;
                slider.style.transform = 'translateX(' + translateX + '%)';
            }
            
            navDots.forEach(function(dot, index) {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }
        
        // Auto-advance slider
        setInterval(nextSlide, 6000);
        
        // Dot navigation
        navDots.forEach(function(dot, index) {
            safeAddEventListener(dot, 'click', function() {
                currentSlide = index;
                updateSlider();
            });
        });
    }

    // Countdown timer
    function startCountdown() {
        const countdownElement = getElement('countdown');
        if (!countdownElement) return;

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);
        targetDate.setHours(18, 0, 0, 0);
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                countdownElement.textContent = 'TOURNAMENT LIVE!';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElement.textContent = 
                days.toString().padStart(2, '0') + ':' +
                hours.toString().padStart(2, '0') + ':' +
                minutes.toString().padStart(2, '0') + ':' +
                seconds.toString().padStart(2, '0');
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Tournament brackets
    function createBrackets() {
        const bracketData = {
            quarterfinals: [
                { team1: 'Thunder Bolts', team2: 'Storm Riders', score1: 2, score2: 1, status: 'completed' },
                { team1: 'Phoenix Squad', team2: 'Ice Warriors', score1: 2, score2: 0, status: 'completed' },
                { team1: 'Cyber Legends', team2: 'Neon Knights', score1: 1, score2: 2, status: 'completed' },
                { team1: 'Digital Dragons', team2: 'Pixel Panthers', score1: 0, score2: 2, status: 'completed' }
            ],
            semifinals: [
                { team1: 'Thunder Bolts', team2: 'Phoenix Squad', score1: 0, score2: 0, status: 'upcoming' },
                { team1: 'Neon Knights', team2: 'Pixel Panthers', score1: 0, score2: 0, status: 'upcoming' }
            ],
            finals: [
                { team1: 'TBD', team2: 'TBD', score1: 0, score2: 0, status: 'upcoming' }
            ]
        };

        Object.keys(bracketData).forEach(function(round) {
            const container = getElement(round);
            if (!container) return;
            
            container.innerHTML = '';
            
            bracketData[round].forEach(function(match) {
                const matchElement = document.createElement('div');
                matchElement.className = 'match';
                
                const winner1 = match.status === 'completed' && match.score1 > match.score2;
                const winner2 = match.status === 'completed' && match.score2 > match.score1;
                
                matchElement.innerHTML = 
                    '<div class="match-teams">' +
                        '<div class="team">' +
                            '<div class="team-name ' + (winner1 ? 'text-cyan-400' : '') + '">' + match.team1 + '</div>' +
                            '<div class="team-score ' + (winner1 ? 'text-cyan-400' : '') + '">' + match.score1 + '</div>' +
                        '</div>' +
                        '<div class="vs">VS</div>' +
                        '<div class="team">' +
                            '<div class="team-name ' + (winner2 ? 'text-cyan-400' : '') + '">' + match.team2 + '</div>' +
                            '<div class="team-score ' + (winner2 ? 'text-cyan-400' : '') + '">' + match.score2 + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="text-align: center; font-size: 0.875rem; padding: 0.5rem; border-radius: 0.5rem; ' +
                    (match.status === 'completed' ? 
                        'background: rgba(57, 255, 20, 0.2); color: #39ff14;">' + 'Completed' :
                        'background: rgba(255, 193, 7, 0.2); color: #ffc107;">' + 'Upcoming') +
                    '</div>';
                
                container.appendChild(matchElement);
            });
        });
    }

    // Schedule management
    function initSchedule() {
        const scheduleData = {
            qualifiers: [
                { match: 'Thunder Bolts vs Storm Riders', date: 'December 15, 2025', time: '10:00 AM' },
                { match: 'Phoenix Squad vs Ice Warriors', date: 'December 15, 2025', time: '2:00 PM' },
                { match: 'Cyber Legends vs Neon Knights', date: 'December 16, 2025', time: '6:00 PM' },
                { match: 'Digital Dragons vs Pixel Panthers', date: 'December 16, 2025', time: '8:00 PM' }
            ],
            semis: [
                { match: 'Semifinal Match 1', date: 'December 22, 2025', time: '3:00 PM' },
                { match: 'Semifinal Match 2', date: 'December 22, 2025', time: '7:00 PM' }
            ],
            finals: [
                { match: 'Grand Final', date: 'December 25, 2025', time: '6:00 PM' },
                { match: 'Closing Ceremony', date: 'December 25, 2025', time: '8:00 PM' }
            ]
        };

        function showScheduleTab(tabName) {
            const scheduleContent = getElement('scheduleContent');
            if (!scheduleContent) return;
            
            const tabButtons = document.querySelectorAll('.tab-btn');
            tabButtons.forEach(function(btn) {
                btn.classList.remove('active');
                if (btn.dataset && btn.dataset.tab === tabName) {
                    btn.classList.add('active');
                }
            });

            const data = scheduleData[tabName];
            if (!data) return;

            let content = '';
            data.forEach(function(item) {
                content += 
                    '<div class="schedule-item">' +
                        '<div>' +
                            '<h4 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">' + item.match + '</h4>' +
                            '<div style="color: var(--text-secondary); font-size: 0.875rem;">' + item.date + '</div>' +
                        '</div>' +
                        '<div class="orbitron" style="font-size: 1.25rem; font-weight: 700; color: var(--primary-neon);">' + item.time + '</div>' +
                    '</div>';
            });

            scheduleContent.innerHTML = content;
        }

        // Tab event listeners
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(function(btn) {
            safeAddEventListener(btn, 'click', function() {
                const tabName = btn.dataset ? btn.dataset.tab : null;
                if (tabName) {
                    showScheduleTab(tabName);
                }
            });
        });

        // Initialize with first tab
        showScheduleTab('qualifiers');
    }

    // Modal management
    function initModal() {
        const registerBtn = getElement('registerBtn');
        const modalOverlay = getElement('modalOverlay');
        const modalClose = getElement('modalClose');
        const form = getElement('registrationForm');
        const submitBtn = getElement('submitBtn');
        const successMessage = getElement('successMessage');
        const successCloseBtn = getElement('successCloseBtn');

        function closeModal() {
            if (modalOverlay) {
                modalOverlay.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
            if (form) {
                form.reset();
                form.style.display = 'block';
            }
            if (successMessage) {
                successMessage.classList.remove('show');
            }
            if (submitBtn) {
                submitBtn.innerHTML = 'Register Team';
                submitBtn.disabled = false;
            }
        }

        safeAddEventListener(registerBtn, 'click', function() {
            if (modalOverlay) {
                modalOverlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });

        safeAddEventListener(modalClose, 'click', closeModal);
        safeAddEventListener(successCloseBtn, 'click', closeModal);

        if (modalOverlay) {
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
        }

        // Form submission
        safeAddEventListener(form, 'submit', function(e) {
            e.preventDefault();

            const teamName = form.querySelector('[name="teamName"]');
            const email = form.querySelector('[name="email"]');
            
            if (!teamName || !teamName.value.trim()) {
                alert('Please enter a team name');
                return;
            }
            
            if (!email || !email.value.trim()) {
                alert('Please enter an email address');
                return;
            }

            if (submitBtn) {
                submitBtn.innerHTML = 'Processing...';
                submitBtn.disabled = true;
            }

            setTimeout(function() {
                if (form && successMessage) {
                    form.style.display = 'none';
                    successMessage.classList.add('show');
                }
            }, 2000);
        });
    }

    // Intersection Observer for animations
    function initAnimations() {
        const elements = document.querySelectorAll('.fade-in');
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(function(el) {
            observer.observe(el);
        });
    }

    // Keyboard navigation
    function initKeyboardNav() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modalOverlay = getElement('modalOverlay');
                const mobileMenu = getElement('mobileMenu');
                
                if (modalOverlay) {
                    modalOverlay.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
                if (mobileMenu) {
                    mobileMenu.classList.remove('show');
                }
            }
        });
    }

    // Initialize everything
    function init() {
        try {
            initTheme();
            createParticles();
            initNavbar();
            initMobileMenu();
            initSmoothScrolling();
            initSlider();
            startCountdown();
            createBrackets();
            initSchedule();
            initModal();
            initAnimations();
            initKeyboardNav();
            
            console.log('Esports Championship 2025 loaded successfully!');
        } catch (error) {
            console.error('Error initializing website:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();