// Intersection Observer for scroll animations
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: stop observing once revealed
            // observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Active Navigation Highlight on Scroll
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });

    // Shrink navbar on scroll
    const navbar = document.getElementById('navbar');
    if (scrollY > 50) {
        navbar.style.padding = "0 5%";
        navbar.style.height = "60px";
    } else {
        navbar.style.padding = "0 5%";
        navbar.style.height = "80px";
    }
});

// Trigger animations for elements that are already in view on initial load
window.dispatchEvent(new Event('scroll'));
