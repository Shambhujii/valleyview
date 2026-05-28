/**
 * =========================================
 * VALLEY VIEW FAMILY RESORT - LOGIC SCRIPT
 * =========================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== 1. MOBILE MENU TOGGLE ====================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            // Toggle body scroll lock
            body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
                body.style.overflow = '';
            });
        });
    }

    // ==================== 2. STICKY NAVBAR ON SCROLL ====================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    // ==================== 3. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER) ====================
    const animElements = document.querySelectorAll('.animate-on-scroll');
    
    const revealOnScrollOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, revealOnScrollOptions);

    animElements.forEach(el => revealObserver.observe(el));

    // ==================== 4. ACTIVE NAV LINK HIGHLIGHT ON SCROLL ====================
    const sections = document.querySelectorAll('section');
    
    const navActiveObserverOptions = {
        threshold: 0.5, // 50% of the section is visible
        rootMargin: "-80px 0px -20% 0px" // Account for header height
    };

    const navActiveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navActiveObserverOptions);

    sections.forEach(sec => navActiveObserver.observe(sec));

    // ==================== 5. BOOKING MODAL LOGIC ====================
    const bookingModal = document.getElementById('booking-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const bookTriggers = document.querySelectorAll('.btn-book-trigger');
    const bookRoomBtns = document.querySelectorAll('.btn-book-room');
    const bookingForm = document.getElementById('booking-form');
    const roomSelect = document.getElementById('book-room');
    const checkinInput = document.getElementById('book-checkin');
    const checkoutInput = document.getElementById('book-checkout');

    // Set checkin/checkout date constraints (minimum today)
    const today = new Date().toISOString().split('T')[0];
    if (checkinInput && checkoutInput) {
        checkinInput.min = today;
        
        checkinInput.addEventListener('change', () => {
            checkoutInput.min = checkinInput.value;
            if (checkoutInput.value && checkoutInput.value < checkinInput.value) {
                checkoutInput.value = checkinInput.value;
            }
        });
    }

    // Function to open modal
    const openBookingModal = (preselectedRoom = '') => {
        bookingModal.classList.add('open');
        body.style.overflow = 'hidden';
        
        if (preselectedRoom && roomSelect) {
            roomSelect.value = preselectedRoom;
        }
    };

    // Function to close modal
    const closeBookingModal = () => {
        bookingModal.classList.remove('open');
        body.style.overflow = '';
        bookingForm.reset();
        document.getElementById('booking-success-msg').style.display = 'none';
        const submitBtn = document.getElementById('booking-submit');
        submitBtn.querySelector('.btn-text').style.display = 'block';
        submitBtn.querySelector('.btn-spinner').style.display = 'none';
        submitBtn.disabled = false;
    };

    // Attach listeners
    bookTriggers.forEach(btn => {
        btn.addEventListener('click', () => openBookingModal());
    });

    bookRoomBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const roomName = e.target.getAttribute('data-room');
            openBookingModal(roomName);
        });
    });

    // Room quick links in footer
    const roomSelectorTriggers = document.querySelectorAll('.room-selector-trigger');
    roomSelectorTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const roomType = e.target.getAttribute('data-room');
            let roomVal = "";
            if (roomType === "cozy-standard") roomVal = "Cozy Standard Room";
            else if (roomType === "deluxe-panorama") roomVal = "Deluxe Panorama Room";
            else if (roomType === "family-suite") roomVal = "Executive Family Suite";
            
            setTimeout(() => {
                openBookingModal(roomVal);
            }, 800); // Wait for smooth scroll to finish
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeBookingModal);
        bookingModal.querySelector('.modal-backdrop').addEventListener('click', closeBookingModal);
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && bookingModal.classList.contains('open')) {
                closeBookingModal();
            }
        });
    }

    // Booking Form Submission Handler
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('booking-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');
            const successMsg = document.getElementById('booking-success-msg');
            
            // Show Loading State
            btnText.style.display = 'none';
            btnSpinner.style.display = 'block';
            submitBtn.disabled = true;
            
            // Simulate API request
            setTimeout(() => {
                btnSpinner.style.display = 'none';
                successMsg.style.display = 'flex';
                bookingForm.reset();
                
                // Close modal after 2.5 seconds
                setTimeout(() => {
                    closeBookingModal();
                }, 2500);
                
            }, 1800);
        });
    }

    // ==================== 6. GALLERY FILTER & LIGHTBOX ====================
    const filterButtons = document.querySelectorAll('.btn-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
    const lightboxNextBtn = document.getElementById('lightbox-next-btn');
    
    let activeGalleryArray = [];
    let currentImageIndex = 0;

    // Gallery Category Filtering
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
            updateActiveGalleryList();
        });
    });

    // Keep track of which gallery items are currently visible
    const updateActiveGalleryList = () => {
        activeGalleryArray = [];
        galleryItems.forEach(item => {
            if (!item.classList.contains('hide')) {
                activeGalleryArray.push(item);
            }
        });
    };
    updateActiveGalleryList(); // Initial list on load

    // Open Lightbox
    galleryItems.forEach(item => {
        const imgBox = item.querySelector('.gallery-img-box');
        imgBox.addEventListener('click', () => {
            updateActiveGalleryList();
            
            // Find current index in visible list
            currentImageIndex = activeGalleryArray.indexOf(item);
            showLightboxImage(item);
            
            lightbox.classList.add('open');
            body.style.overflow = 'hidden';
        });
    });

    // Populate and show lightbox data
    const showLightboxImage = (galleryItem) => {
        const img = galleryItem.querySelector('.gallery-img');
        const cat = galleryItem.querySelector('.gallery-category').textContent;
        const title = galleryItem.querySelector('.gallery-title').textContent;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCategory.textContent = cat;
        lightboxTitle.textContent = title;
    };

    // Lightbox Controls
    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % activeGalleryArray.length;
        showLightboxImage(activeGalleryArray[currentImageIndex]);
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + activeGalleryArray.length) % activeGalleryArray.length;
        showLightboxImage(activeGalleryArray[currentImageIndex]);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        body.style.overflow = '';
    };

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightboxNextBtn.addEventListener('click', showNextImage);
        lightboxPrevBtn.addEventListener('click', showPrevImage);
        
        // Close when clicking background outside content
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Key Navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('open')) {
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'Escape') closeLightbox();
            }
        });
    }

    // ==================== 7. CONTACT FORM SUBMISSION ====================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('contact-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');
            const successMsg = document.getElementById('form-success-msg');
            const errorMsg = document.getElementById('form-error-msg');
            
            // Show Loading State
            btnText.style.display = 'none';
            btnSpinner.style.display = 'block';
            submitBtn.disabled = true;
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            // Simulate API request
            setTimeout(() => {
                btnSpinner.style.display = 'none';
                btnText.style.display = 'block';
                submitBtn.disabled = false;
                
                // Show success
                successMsg.style.display = 'flex';
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);

            }, 1500);
        });
    }

    // ==================== 8. NEWSLETTER SUBMISSION ====================
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMsg = document.getElementById('newsletter-success');
            
            // Show success label
            successMsg.style.display = 'block';
            newsletterForm.reset();
            
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 4000);
        });
    }

    // ==================== 9. STATS COUNTER ANIMATION ====================
    const stats = document.querySelectorAll('.stat-num');
    const statsSection = document.getElementById('about');
    let counted = false;

    const startCounting = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-val'));
            const duration = 1500; // 1.5 seconds
            const startTime = performance.now();
            
            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function outQuad
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * target);
                
                // Formatting
                if (target === 100) {
                    stat.textContent = `${currentValue}%`;
                } else if (target === 5) {
                    stat.textContent = `${currentValue}+`;
                } else if (target === 5000) {
                    stat.textContent = `${currentValue.toLocaleString()}+`;
                } else {
                    stat.textContent = currentValue;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    // Final display match
                    if (target === 100) stat.textContent = '100%';
                    if (target === 5) stat.textContent = '5+';
                    if (target === 5000) stat.textContent = '5,000+';
                }
            };
            
            requestAnimationFrame(updateCount);
        });
    };

    // Trigger counter when about section is scrolled into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                startCounting();
                counted = true;
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});
