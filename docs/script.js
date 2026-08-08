/* ==========================================================
   RESEARCH PAPER — FLYRANK-INSPIRED JS
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- 1. Topbar Scroll Effect ---- //
    const topbar = document.getElementById('topbar');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init


    // ---- 2. Mobile Menu Toggle ---- //
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('topbarLinks');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        
        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }


    // ---- 3. Active Nav Highlighting ---- //
    const sections = document.querySelectorAll('.s-block, .hero');
    const menuLinks = document.querySelectorAll('.topbar-links a[href^="#"]');
    
    const updateActiveLink = () => {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            if (window.scrollY >= top) {
                current = sec.getAttribute('id');
            }
        });
        
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();


    // ---- 4. Scroll Reveal Animations ---- //
    // Select elements that should animate in
    const revealElements = document.querySelectorAll('.anim-reveal, .anim-reveal-line');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // only animate once
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ---- 5. Number Counters ---- //
    const counters = document.querySelectorAll('.metric-val[data-count]');
    let hasAnimatedCounters = false;

    const animateCounters = () => {
        if (hasAnimatedCounters) return;
        
        counters.forEach(counter => {
            const raw = counter.getAttribute('data-count');
            const target = parseFloat(raw);
            const decimals = (raw.split('.')[1] || '').length;
            const duration = 2000; // ms
            const startTime = performance.now();
            
            // Ease out cubic
            const easeOut = t => 1 - Math.pow(1 - t, 3);
            
            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const currentVal = easeOut(progress) * target;
                counter.textContent = decimals > 0
                    ? currentVal.toFixed(decimals)
                    : Math.floor(currentVal).toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
                }
            };
            requestAnimationFrame(update);
        });
        hasAnimatedCounters = true;
    };

    // Trigger counters when the hero metrics section comes into view
    const metricsSection = document.querySelector('.hero-metrics');
    if (metricsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.disconnect();
            }
        }, { threshold: 0.5 });
        statsObserver.observe(metricsSection);
    }

    
    // ---- 6. Smooth Scrolling for Anchor Links ---- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = 80; // topbar height approx
                const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

});
