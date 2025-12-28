// ===== MENU MOBILE =====
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// ===== SCROLL ACTIVE LINK =====
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            let currentLink = document.querySelector(
                'header nav a[href*="' + id + '"]'
            );
            if (currentLink) {
                currentLink.classList.add('active');
            }
        }
    });

    // tutup menu saat scroll
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};
