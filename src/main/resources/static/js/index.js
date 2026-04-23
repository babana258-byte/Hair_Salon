var modal = document.getElementById('id01');
window.onclick = function (event) { if (event.target == modal) modal.style.display = "none"; }

const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.15 });
fadeEls.forEach(el => observer.observe(el));
