/**
 * Premium Website - Fobet Media Style JavaScript
 * Includes: Cursor light, timeline scroll, animations, FAQ, calculator
 */

(function () {
    'use strict';

    // =========================================
    // CURSOR LIGHT EFFECT
    // =========================================
    const cursorLight = document.querySelector('.cursor-light');

    if (cursorLight) {
        document.addEventListener('mousemove', (e) => {
            cursorLight.style.left = e.clientX + 'px';
            cursorLight.style.top = e.clientY + 'px';
        });
    }

    // =========================================
    // HEADER SCROLL EFFECT
    // =========================================
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (header) {
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // =========================================
    // MOBILE MENU TOGGLE
    // =========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // =========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // =========================================
    // SCROLL ANIMATIONS
    // =========================================
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => animateObserver.observe(el));

    // =========================================
    // TIMELINE SCROLL PROGRESS
    // =========================================
    const timelineFill = document.getElementById('timeline-fill');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineFill && timelineItems.length > 0) {
        const updateTimeline = () => {
            const container = document.querySelector('.timeline-container');
            if (!container) return;

            const containerRect = container.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerHeight = containerRect.height;
            const windowHeight = window.innerHeight;

            // Calculate scroll progress through the timeline
            const scrollStart = containerTop - windowHeight * 0.5;
            const scrollEnd = containerTop + containerHeight - windowHeight * 0.5;
            const scrollRange = scrollEnd - scrollStart;
            const currentProgress = Math.max(0, Math.min(1, -scrollStart / scrollRange));

            // Update the fill height
            const fillHeight = currentProgress * 100;
            timelineFill.style.height = `${fillHeight}%`;

            // Activate timeline items
            timelineItems.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.top + itemRect.height / 2;

                if (itemCenter < windowHeight * 0.6) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', updateTimeline);
        updateTimeline();
    }

    // =========================================
    // COUNTER ANIMATION
    // =========================================
    const counters = document.querySelectorAll('[data-count]');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        };

        updateCounter();
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // =========================================
    // FAQ ACCORDION
    // =========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        }
    });

    // =========================================
    // ROI CALCULATOR
    // =========================================
    const followersInput = document.getElementById('followers-input');
    const viewsInput = document.getElementById('views-input');
    const valueInput = document.getElementById('value-input');

    const followersDisplay = document.getElementById('followers-display');
    const viewsDisplay = document.getElementById('views-display');
    const valueDisplay = document.getElementById('value-display');

    const resultFollowers = document.getElementById('result-followers');
    const resultRevenue = document.getElementById('result-revenue');
    const resultGrowth = document.getElementById('result-growth');

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(num);
    };

    const calculateROI = () => {
        if (!followersInput || !viewsInput || !valueInput) return;

        const followers = parseInt(followersInput.value);
        const views = parseInt(viewsInput.value);
        const value = parseInt(valueInput.value);

        // Update displays
        if (followersDisplay) followersDisplay.textContent = formatNumber(followers);
        if (viewsDisplay) viewsDisplay.textContent = formatNumber(views);
        if (valueDisplay) valueDisplay.textContent = formatCurrency(value);

        // Engagement ratio: how well content performs relative to audience size
        const engagementRatio = Math.min(views / Math.max(followers, 1), 1);

        // Monthly follower growth with professional content (4-10% per month)
        // Higher engagement ratio = faster organic growth
        const monthlyGrowthRate = 0.04 + (engagementRatio * 0.06);

        // Projected followers after 6 months of professional content
        const projectedFollowers = Math.round(followers * Math.pow(1 + monthlyGrowthRate, 6));

        // Monthly revenue estimation
        // Pro content boosts views ~50%, posting ~15 times/month
        const monthlyReach = views * 1.5 * 15;

        // Diminishing returns at scale (large audiences have more casual viewers)
        const effectiveReach = monthlyReach <= 50000
            ? monthlyReach
            : 50000 + (monthlyReach - 50000) * 0.3;

        // Revenue scales with sqrt of product value (higher price = fewer but bigger sales)
        const revenueRate = Math.sqrt(value) * 2.5;
        const projectedRevenue = Math.round((effectiveReach / 1000) * revenueRate);

        // Yearly growth percentage
        const yearlyProjected = Math.round(followers * Math.pow(1 + monthlyGrowthRate, 12));
        const growthPercent = Math.round(((yearlyProjected - followers) / followers) * 100);

        // Update results
        if (resultFollowers) resultFollowers.textContent = formatNumber(projectedFollowers);
        if (resultRevenue) resultRevenue.textContent = formatCurrency(projectedRevenue);
        if (resultGrowth) resultGrowth.textContent = growthPercent + '%';
    };

    // Add event listeners
    if (followersInput) followersInput.addEventListener('input', calculateROI);
    if (viewsInput) viewsInput.addEventListener('input', calculateROI);
    if (valueInput) valueInput.addEventListener('input', calculateROI);

    // Initial calculation
    calculateROI();

    // =========================================
    // VIDEO CAROUSEL
    // =========================================
    const carouselTrack = document.getElementById('video-carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (carouselTrack && prevBtn && nextBtn) {
        const cards = Array.from(carouselTrack.querySelectorAll('.video-card'));
        const touchLikeDevice = window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches;
        let currentPage = 0;
        let cardsPerPage = 3;
        let totalPages = 1;
        let dots = [];

        const safePlay = (video) => {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => { });
            }
        };

        // Ensure autoplay works on mobile browsers.
        cards.forEach(card => {
            const video = card.querySelector('video');
            if (!video) return;
            video.muted = true;
            video.defaultMuted = true;
            video.loop = true;
            video.autoplay = true;
            video.playsInline = true;
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('autoplay', '');
        });

        const getCardsPerPage = () => {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 968) return 2;
            return 3;
        };

        const buildDots = () => {
            if (!dotsContainer) return [];
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalPages; i += 1) {
                const dot = document.createElement('span');
                dot.className = 'carousel-dot';
                dot.dataset.page = String(i);
                if (i === currentPage) dot.classList.add('active');
                dotsContainer.appendChild(dot);
            }
            return Array.from(dotsContainer.querySelectorAll('.carousel-dot'));
        };

        const updateVisibleVideoPlayback = () => {
            if (!touchLikeDevice) return;
            const startIndex = currentPage * cardsPerPage;
            const endIndex = startIndex + cardsPerPage;

            cards.forEach((card, index) => {
                const video = card.querySelector('video');
                if (!video) return;

                if (index >= startIndex && index < endIndex) {
                    safePlay(video);
                } else {
                    video.pause();
                }
            });
        };

        const updateCarousel = () => {
            if (cards.length === 0) return;

            cardsPerPage = getCardsPerPage();
            totalPages = Math.max(1, Math.ceil(cards.length / cardsPerPage));
            currentPage = Math.min(currentPage, totalPages - 1);
            dots = buildDots();

            const pageFirstCardIndex = currentPage * cardsPerPage;
            const pageFirstCard = cards[pageFirstCardIndex] || cards[0];
            const carouselViewport = carouselTrack.parentElement;
            const maxOffset = Math.max(0, carouselTrack.scrollWidth - carouselViewport.clientWidth);
            let offset = pageFirstCard.offsetLeft;

            // On single-card mobile view, center the card in the viewport.
            if (cardsPerPage === 1) {
                offset -= (carouselViewport.clientWidth - pageFirstCard.offsetWidth) / 2;
            }

            offset = Math.max(0, Math.min(offset, maxOffset));
            carouselTrack.style.transform = `translateX(-${offset}px)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentPage);
            });

            updateVisibleVideoPlayback();
        };

        nextBtn.addEventListener('click', () => {
            currentPage = (currentPage + 1) % totalPages;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentPage = (currentPage - 1 + totalPages) % totalPages;
            updateCarousel();
        });

        if (dotsContainer) {
            dotsContainer.addEventListener('click', (e) => {
                const dot = e.target.closest('.carousel-dot');
                if (!dot) return;
                currentPage = Number(dot.dataset.page || 0);
                updateCarousel();
            });
        }

        // Desktop behavior: play on hover.
        if (!touchLikeDevice) {
            cards.forEach(card => {
                const video = card.querySelector('video');
                if (!video) return;

                card.addEventListener('mouseenter', () => safePlay(video));
                card.addEventListener('mouseleave', () => video.pause());
            });
        } else {
            // Touch fallback: tap to toggle current video.
            cards.forEach(card => {
                const video = card.querySelector('video');
                if (!video) return;

                video.addEventListener('click', () => {
                    if (video.paused) safePlay(video);
                    else video.pause();
                });
            });
        }

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }

    // =========================================
    // ACTIVE NAV HIGHLIGHTING
    // =========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav);

    // =========================================
    // FADE IN ANIMATIONS ON LOAD
    // =========================================
    window.addEventListener('load', () => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            el.style.animationDelay = `${0.1 * (index + 1)}s`;
        });
    });

    // =========================================
    // POPUP MODAL
    // =========================================
    const popupOverlay = document.getElementById('popup-overlay');
    const popupClose = document.getElementById('popup-close');
    const popupForm = document.getElementById('popup-form');

    let popupShown = false;

    const openPopup = () => {
        if (popupOverlay) {
            popupOverlay.classList.remove('closing');
            popupOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closePopup = () => {
        if (popupOverlay) {
            // Add closing class for exit animation
            popupOverlay.classList.add('closing');

            // Wait for animation to complete, then remove classes
            setTimeout(() => {
                popupOverlay.classList.remove('active');
                popupOverlay.classList.remove('closing');
                document.body.style.overflow = '';
            }, 350); // Match the CSS transition duration
        }
    };

    // Close button
    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }

    // Close on overlay click (not modal)
    if (popupOverlay) {
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                closePopup();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupOverlay?.classList.contains('active')) {
            closePopup();
        }
    });

    // Scroll trigger - show popup when user scrolls to FAQ section
    const faqSection = document.getElementById('faq');

    if (faqSection && popupOverlay) {
        const faqObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !popupShown) {
                    // Small delay after FAQ comes into view
                    setTimeout(() => {
                        if (!popupShown) {
                            openPopup();
                            popupShown = true;
                        }
                    }, 500);
                    faqObserver.disconnect(); // Stop observing after triggered
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% of FAQ is visible

        faqObserver.observe(faqSection);
    }

    // Make "Get Started" and CTA buttons open popup
    document.querySelectorAll('.header-cta, .cta-button, .btn-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openPopup();
        });
    });

    // Form submission - sends data to Google Sheets
    // ⚠️ IMPORTANT: Replace this URL with your Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyX48WqsW5Vg9MliIomnap0ydn8Qx8nnn0TTGh-4fPfVGsagzphWAHAJqwlgEBQO6Db/exec';

    if (popupForm) {
        popupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = popupForm.querySelector('.popup-submit');

            // Get form data
            const formData = {
                name: document.getElementById('popup-name')?.value || '',
                email: document.getElementById('popup-email')?.value || '',
                phone: document.getElementById('popup-phone')?.value || '',
                website: document.getElementById('popup-website')?.value || ''
            };

            // Show loading state
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
                submitBtn.disabled = true;
            }

            try {
                // Send data to Google Sheets
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Required for Google Apps Script
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                // Show success state (no-cors doesn't return response body)
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Thank you!</span>';
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                }

                console.log('Form submitted successfully:', formData);

            } catch (error) {
                console.error('Form submission error:', error);

                // Show error state
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> <span>Error - Try Again</span>';
                    submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                    submitBtn.disabled = false;
                }
                return; // Don't close popup on error
            }

            // Close popup after delay
            setTimeout(() => {
                closePopup();
                // Reset form
                popupForm.reset();
                if (submitBtn) {
                    submitBtn.innerHTML = '<span>Request a Call</span><i class="fa-solid fa-arrow-right"></i>';
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }
            }, 2000);
        });
    }

})();

