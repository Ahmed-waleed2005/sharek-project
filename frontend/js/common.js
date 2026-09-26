// ==========================================================
// عناصر مشتركة: شريط التنقل، التوست، النوافذ المنبثقة
// ==========================================================

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function renderNavbar() {
  const mount = document.getElementById('navbar');
  if (!mount) return;
  const user = getCurrentUser();

  mount.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <a href="index.html" class="brand">
          <span class="logo-dot">🌱</span>
          شارك
        </a>
        <ul class="nav-links">
          <li><a href="index.html" data-page="index">الرئيسية</a></li>
          <li><a href="initiatives.html" data-page="initiatives">المبادرات</a></li>
          <li><a href="map.html" data-page="map">خريطة المبادرات</a></li>
          <li><a href="index.html#categories" data-page="categories">الأقسام</a></li>
          <li><a href="about.html" data-page="about">من نحن</a></li>
        </ul>
        <div class="nav-actions" id="nav-actions"></div>
      </div>
    </nav>
  `;

  const actions = document.getElementById('nav-actions');
  if (user) {
    actions.innerHTML = `
      <a href="create-initiative.html" class="btn btn-primary btn-sm">+ أنشئ مبادرة</a>
      <div class="dropdown" id="user-dropdown">
        <button class="avatar-btn" id="avatar-toggle">${(user.fullName || 'م')[0]}</button>
        <div class="dropdown-menu" id="user-menu">
          <div style="padding:8px 12px 12px;border-bottom:1px solid var(--border);margin-bottom:6px;">
            <strong style="font-size:.9rem;">${escapeHtml(user.fullName)}</strong><br/>
            <span style="font-size:.78rem;color:var(--muted);">${escapeHtml(user.email)}</span>
          </div>
          <a href="profile.html">👤 الملف الشخصي</a>
          <a href="profile.html#saved">🕐 ساعات التطوع</a>
          <a href="dashboard.html">📊 لوحة التحكم</a>
          <button id="logout-btn">🚪 تسجيل الخروج</button>
        </div>
      </div>
    `;
    document.getElementById('avatar-toggle').addEventListener('click', () => {
      document.getElementById('user-menu').classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      const dd = document.getElementById('user-dropdown');
      if (dd && !dd.contains(e.target)) document.getElementById('user-menu')?.classList.remove('show');
    });
    document.getElementById('logout-btn').addEventListener('click', () => {
      clearSession();
      showToast('تم تسجيل الخروج');
      setTimeout(() => (window.location.href = 'index.html'), 500);
    });
  } else {
    actions.innerHTML = `
      <a href="login.html" class="btn btn-outline-dark btn-sm">تسجيل الدخول</a>
      <a href="register.html" class="btn btn-primary btn-sm">إنشاء حساب</a>
    `;
  }

  const current = document.body.dataset.page;
  if (current) {
    const link = mount.querySelector(`[data-page="${current}"]`);
    if (link) link.classList.add('active');
  }
}

function renderFooter() {
  const mount = document.getElementById('footer');
  if (!mount) return;
  mount.innerHTML = `
    <footer>
      <div class="container">
        <div style="max-width:280px;">
          <div class="brand" style="color:#fff;margin-bottom:12px;">
            <span class="logo-dot">🌱</span> شارك
          </div>
          <p style="font-size:.88rem;color:#a9c0b6;">منصة تجمع الناس وترتبطهم بفرص العمل التطوعي في مختلف المجالات لخدمة المجتمع وبناء مستقبل أفضل.</p>
        </div>
        <div>
          <h5>روابط سريعة</h5>
          <a href="index.html">الرئيسية</a>
          <a href="initiatives.html">المبادرات</a>
          <a href="map.html">خريطة المبادرات</a>
        </div>
        <div>
          <h5>الحساب</h5>
          <a href="login.html">تسجيل الدخول</a>
          <a href="register.html">إنشاء حساب</a>
          <a href="create-initiative.html">أنشئ مبادرة</a>
        </div>
        <div>
          <h5>تواصل معنا</h5>
          <a href="#">info@sharek.com</a>
          <a href="#">حسابات التواصل الاجتماعي</a>
        </div>
      </div>
      <div class="bottom">© 2026 شارك - جميع الحقوق محفوظة</div>
    </footer>
  `;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? 'م' : 'ص';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${period}`;
}

function requireAuth() {
  if (!getCurrentUser()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
});
