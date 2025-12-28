const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
});

window.addEventListener('scroll', () => {
  // aktif link menu sesuai section
  sections.forEach(sec => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 160;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`header nav a[href*="${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });

  // sticky header
  const header = document.querySelector('.header');
  header.classList.toggle('sticky', window.scrollY > 100);

  // kalau scroll, tutup navbar mobile biar rapi
  menuIcon.classList.remove('bx-x');
  navbar.classList.remove('active');
});
