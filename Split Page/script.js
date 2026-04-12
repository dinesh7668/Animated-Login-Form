/* ============================================
   PORTAL — Futuristic Login / Signup
   JavaScript — Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- DOM References ----
    const toggleLogin    = document.getElementById('toggleLogin');
    const toggleSignup   = document.getElementById('toggleSignup');
    const toggleSlider   = document.getElementById('toggleSlider');
    const loginForm      = document.getElementById('loginForm');
    const signupForm     = document.getElementById('signupForm');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin  = document.getElementById('switchToLogin');
    const transitionRing = document.getElementById('transitionRing');
    const transitionShards = document.getElementById('transitionShards');
    const brandLine2     = document.getElementById('brandLine2');
    const typingText     = document.getElementById('typingText');
    const bgParticles    = document.getElementById('bgParticles');
    const hexGrid        = document.getElementById('hexGrid');

    let currentForm = 'login';
    let isTransitioning = false;

    // ============================================
    // 1. PARTICLES SYSTEM
    // ============================================
    function createParticles() {
        const count = 40;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (6 + Math.random() * 10) + 's';
            p.style.animationDelay = Math.random() * 8 + 's';
            p.style.width = (2 + Math.random() * 3) + 'px';
            p.style.height = p.style.width;

            // Randomize color between crimson, red, orange
            const colors = ['#8B1A1A', '#CC2200', '#E85D04'];
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.boxShadow = `0 0 6px ${p.style.background}`;

            bgParticles.appendChild(p);
        }
    }

    // ============================================
    // 2. HEX GRID DECORATION
    // ============================================
    function createHexGrid() {
        if (!hexGrid) return;

        const cols = 0;
        const rows = 0;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.random() > 0.3) continue; // sparse grid

                const hex = document.createElement('div');
                hex.classList.add('hex-cell');
                hex.style.left = (c * 50 + (r % 2) * 25) + 'px';
                hex.style.top = (r * 55) + 'px';
                hex.style.animationDelay = (Math.random() * 6) + 's';
                hex.style.animationDuration = (3 + Math.random() * 4) + 's';
                hexGrid.appendChild(hex);
            }
        }
    }

    // ============================================
    // 3. TYPING ANIMATION
    // ============================================
    const phrases = [
        'Secure. Fast. Futuristic.',
        'Your gateway to the future.',
        'Built with cutting-edge security.',
        'Experience seamless authentication.',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 60;

    function typePortalTitle(callback) {
        if (!brandLine2) {
            if (typeof callback === 'function') callback();
            return;
        }

        const title = 'PORTAL';
        let titleIndex = 0;
        brandLine2.textContent = '';

        function step() {
            brandLine2.textContent = title.slice(0, titleIndex + 1);
            titleIndex++;

            if (titleIndex < title.length) {
                setTimeout(step, 140);
                return;
            }

            if (typeof callback === 'function') {
                setTimeout(callback, 350);
            }
        }

        step();
    }

    function typeEffect() {
        if (!typingText) return;

        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // pause before deleting
            } else {
                typingSpeed = 60 + Math.random() * 40;
            }
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // pause before next phrase
            }
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // ============================================
    // 4. COUNTER ANIMATION
    // ============================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat__number');
        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.count);
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;

                counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ============================================
    // 5. FORM SWITCHING — THE STANDOUT ANIMATION
    // ============================================
    function switchForm(to) {
        if (isTransitioning || currentForm === to) return;
        isTransitioning = true;

        const portal = document.getElementById('portal');
        const warpFlash = document.getElementById('warpFlash');
        const fromForm = to === 'signup' ? loginForm : signupForm;
        const toForm = to === 'signup' ? signupForm : loginForm;
        const exitClass = to === 'signup' ? 'auth-form--exit-left' : 'auth-form--exit-right';

        // 1) Fade out inner content first
        portal.classList.add('portal--transitioning');

        // 2) Fire warp flash
        warpFlash.classList.remove('active');
        void warpFlash.offsetHeight;
        warpFlash.classList.add('active');
        setTimeout(() => warpFlash.classList.remove('active'), 1000);

        // 3) Fire speed lines
        fireWarpLines();

        // 4) Fire ring burst + shards
        fireRingBurst();
        fireShards();

        // 5) After content fades (300ms), trigger the panel swap
        setTimeout(() => {
            // Toggle panels
            if (to === 'signup') {
                portal.classList.add('portal--swapped');
            } else {
                portal.classList.remove('portal--swapped');
            }

            // Toggle slider
            if (to === 'signup') {
                toggleSlider.classList.add('slide-right');
                toggleLogin.classList.remove('toggle-btn--active');
                toggleSignup.classList.add('toggle-btn--active');
            } else {
                toggleSlider.classList.remove('slide-right');
                toggleSignup.classList.remove('toggle-btn--active');
                toggleLogin.classList.add('toggle-btn--active');
            }

            // Swap forms
            fromForm.classList.remove('auth-form--active');
            fromForm.classList.add(exitClass);

            setTimeout(() => {
                fromForm.classList.remove(exitClass);
                toForm.classList.add('auth-form--active');
            }, 200);
        }, 300);

        // 6) After panels finish sliding, remove transitioning class to fade content back in
        setTimeout(() => {
            portal.classList.remove('portal--transitioning');
            currentForm = to;
        }, 800);

        // 7) Allow next switch after everything settles
        setTimeout(() => {
            isTransitioning = false;
        }, 1200);
    }

    // Warp speed lines during panel swap
    function fireWarpLines() {
        const lineCount = 8;
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.classList.add('warp-line');
            line.style.top = (10 + Math.random() * 80) + '%';
            line.style.left = '0';
            line.style.right = '0';
            line.style.height = (1 + Math.random() * 2) + 'px';
            line.style.animationDelay = (Math.random() * 0.3) + 's';

            const colors = ['var(--clr-crimson)', 'var(--clr-red)', 'var(--clr-orange)'];
            line.style.background = `linear-gradient(90deg, transparent, ${colors[i % 3]}, transparent)`;

            document.body.appendChild(line);
            requestAnimationFrame(() => line.classList.add('active'));
            setTimeout(() => line.remove(), 1000);
        }
    }


    // Ring burst effect
    function fireRingBurst() {
        transitionRing.classList.remove('active');
        void transitionRing.offsetHeight;
        transitionRing.classList.add('active');
        setTimeout(() => transitionRing.classList.remove('active'), 900);
    }

    // Shard burst effect
    function fireShards() {
        transitionShards.innerHTML = '';
        const shardCount = 12;

        for (let i = 0; i < shardCount; i++) {
            const shard = document.createElement('div');
            shard.classList.add('shard');

            const size = 4 + Math.random() * 12;
            const angle = (360 / shardCount) * i + Math.random() * 30;
            const distance = 100 + Math.random() * 200;
            const tx = Math.cos(angle * Math.PI / 180) * distance;
            const ty = Math.sin(angle * Math.PI / 180) * distance;
            const rot = Math.random() * 720 - 360;

            shard.style.width = size + 'px';
            shard.style.height = size * (0.5 + Math.random()) + 'px';
            shard.style.top = '50%';
            shard.style.left = '50%';
            shard.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            shard.style.setProperty('--tx', tx + 'px');
            shard.style.setProperty('--ty', ty + 'px');
            shard.style.setProperty('--rot', rot + 'deg');
            shard.style.animationDelay = (Math.random() * 0.1) + 's';

            transitionShards.appendChild(shard);

            requestAnimationFrame(() => {
                shard.classList.add('active');
            });
        }

        // Cleanup
        setTimeout(() => {
            transitionShards.innerHTML = '';
        }, 800);
    }

    // Add glitch keyframe dynamically
    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = `
        @keyframes stageGlitch {
            0%   { transform: translate(0, 0); filter: hue-rotate(0deg); }
            10%  { transform: translate(-3px, 2px); filter: hue-rotate(30deg) brightness(1.2); }
            20%  { transform: translate(3px, -1px); filter: hue-rotate(-20deg); }
            30%  { transform: translate(-1px, 3px); filter: hue-rotate(15deg) brightness(0.9); }
            40%  { transform: translate(2px, -2px); filter: hue-rotate(-10deg); }
            50%  { transform: translate(0, 0); filter: hue-rotate(0deg); }
            100% { transform: translate(0, 0); filter: hue-rotate(0deg); }
        }
    `;
    document.head.appendChild(glitchStyle);

    // ============================================
    // 6. PASSWORD STRENGTH METER
    // ============================================
    const signupPasswordInput = document.getElementById('signupPasswordInput');
    const strengthBars = [
        document.getElementById('str1'),
        document.getElementById('str2'),
        document.getElementById('str3'),
        document.getElementById('str4'),
    ];
    const strengthText = document.getElementById('strengthText');

    function checkPasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        const levels = ['Weak', 'Fair', 'Strong', 'Very Strong'];
        const classes = ['weak', 'medium', 'strong', 'very-strong'];

        strengthBars.forEach((bar, i) => {
            bar.className = 'strength-bar';
            if (i < score) {
                bar.classList.add(classes[Math.min(score - 1, 3)], 'active');
            }
        });

        strengthText.textContent = password.length > 0 ? levels[Math.max(score - 1, 0)] : 'Password Strength';
    }

    signupPasswordInput.addEventListener('input', () => {
        checkPasswordStrength(signupPasswordInput.value);
    });

    // ============================================
    // 7. PASSWORD VISIBILITY TOGGLE
    // ============================================
    function setupPasswordToggle(toggleBtn, inputField) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = inputField.type === 'password';
            inputField.type = isPassword ? 'text' : 'password';
            const eyeOpen = toggleBtn.querySelector('.eye-open');
            const eyeClosed = toggleBtn.querySelector('.eye-closed');
            eyeOpen.style.display = isPassword ? 'none' : 'block';
            eyeClosed.style.display = isPassword ? 'block' : 'none';
        });
    }

    setupPasswordToggle(
        document.getElementById('loginTogglePass'),
        document.getElementById('loginPasswordInput')
    );
    setupPasswordToggle(
        document.getElementById('signupTogglePass'),
        signupPasswordInput
    );

    // ============================================
    // 8. BUTTON RIPPLE EFFECT
    // ============================================
    document.querySelectorAll('.btn-submit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ripple = btn.querySelector('.btn-submit__ripple');
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.classList.remove('active');
            void ripple.offsetHeight;
            ripple.classList.add('active');
            setTimeout(() => ripple.classList.remove('active'), 600);
        });
    });

    // ============================================
    // 9. FORM SUBMISSION (Demo)
    // ============================================
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('loginSubmit');
        btn.classList.add('loading');
        setTimeout(() => {
            btn.classList.remove('loading');
            showSuccess(btn, 'Welcome Back!');
        }, 2000);
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('signupSubmit');
        btn.classList.add('loading');
        setTimeout(() => {
            btn.classList.remove('loading');
            showSuccess(btn, 'Account Created!');
        }, 2000);
    });

    function showSuccess(btn, message) {
        const originalText = btn.querySelector('.btn-submit__text').textContent;
        btn.querySelector('.btn-submit__text').textContent = message;
        btn.style.background = 'linear-gradient(135deg, #2e7d32, #4caf50)';

        // Emit success particles from button
        emitSuccessParticles(btn);

        setTimeout(() => {
            btn.querySelector('.btn-submit__text').textContent = originalText;
            btn.style.background = '';
        }, 2500);
    }

    function emitSuccessParticles(btn) {
        const rect = btn.getBoundingClientRect();
        const container = document.body;

        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 4px;
                height: 4px;
                background: ${['#E85D04', '#CC2200', '#8B1A1A', '#4caf50', '#fff'][Math.floor(Math.random() * 5)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            container.appendChild(star);

            requestAnimationFrame(() => {
                star.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 300) + 'px';
                star.style.top = (rect.top + rect.height / 2 + (Math.random() - 0.5) * 200) + 'px';
                star.style.opacity = '0';
                star.style.transform = `scale(${Math.random() * 2})`;
            });

            setTimeout(() => star.remove(), 1000);
        }
    }

    // ============================================
    // 10. INPUT FOCUS SOUND-LIKE GLOW PULSE
    // ============================================
    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('focus', () => {
            const group = input.closest('.input-group');
            group.style.animation = 'none';
            void group.offsetHeight;
            group.style.animation = 'inputPulse 0.4s ease-out';
        });
    });

    const inputPulseStyle = document.createElement('style');
    inputPulseStyle.textContent = `
        @keyframes inputPulse {
            0%   { transform: scale(1); }
            50%  { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(inputPulseStyle);

    // ============================================
    // 11. MOUSE PARALLAX ON BRAND PANEL
    // ============================================
    const brandPanel = document.getElementById('brandPanel');
    const logoMark = document.getElementById('logoMark');

    if (window.innerWidth > 1024) {
        brandPanel.addEventListener('mousemove', (e) => {
            const rect = brandPanel.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            logoMark.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        });

        brandPanel.addEventListener('mouseleave', () => {
            logoMark.style.transform = 'translate(0, 0)';
            logoMark.style.transition = 'transform 0.5s ease-out';
        });

        brandPanel.addEventListener('mouseenter', () => {
            logoMark.style.transition = 'none';
        });
    }

    // ============================================
    // 12. EVENT LISTENERS
    // ============================================
    toggleLogin.addEventListener('click', () => switchForm('login'));
    toggleSignup.addEventListener('click', () => switchForm('signup'));
    switchToSignup.addEventListener('click', () => switchForm('signup'));
    switchToLogin.addEventListener('click', () => switchForm('login'));

    // ============================================
    // INIT
    // ============================================
    createParticles();
    createHexGrid();
    typePortalTitle(typeEffect);

    // Animate counters after a short delay
    setTimeout(animateCounters, 800);

    // Periodically add new stray particles for liveliness
    setInterval(() => {
        if (bgParticles.children.length > 60) {
            bgParticles.removeChild(bgParticles.firstChild);
        }
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (6 + Math.random() * 8) + 's';
        const colors = ['#8B1A1A', '#CC2200', '#E85D04'];
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.boxShadow = `0 0 6px ${p.style.background}`;
        const size = (2 + Math.random() * 3) + 'px';
        p.style.width = size;
        p.style.height = size;
        bgParticles.appendChild(p);
    }, 3000);
});
