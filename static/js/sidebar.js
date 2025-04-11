function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  const isVisible = menu.style.display === 'flex';

  menu.style.display = isVisible ? 'none' : 'flex';
  overlay.style.display = isVisible ? 'none' : 'block';
}

function closeMenu() {
  document.getElementById('mobileMenu').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

// メニュー内リンククリック時にも閉じる
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('#mobileMenu a');
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
});