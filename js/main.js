// Khởi tạo các hiệu ứng chung của layout như menu mobile, theme toggle và active nav.
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!expanded));
    });

    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !mobileToggle.contains(event.target)) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const themeButton = document.querySelector('[data-theme-toggle]');
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      themeButton.setAttribute('aria-pressed', String(isLight));
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  const backToTop = document.querySelector('[data-back-to-top]');
  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 420);
    };

    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    const formFields = ['name', 'email', 'subject', 'message']
      .map((name) => contactForm.querySelector(`[name="${name}"]`))
      .filter(Boolean);
    const status = contactForm.querySelector('[data-form-status]');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    const setMessage = (message, type) => {
      if (!status) return;
      status.textContent = message;
      status.className = `form-status ${type}`;
    };

    const validateField = (field) => {
      const value = field.value.trim();
      if (field.name === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          field.setAttribute('aria-invalid', 'true');
          return false;
        }
      } else if (!value) {
        field.setAttribute('aria-invalid', 'true');
        return false;
      }

      field.setAttribute('aria-invalid', 'false');
      return true;
    };

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let isValid = true;

      formFields.forEach((field) => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        setMessage('Vui lòng điền đầy đủ và chính xác thông tin bắt buộc.', 'error');
        return;
      }

      setMessage('Đã nhận thông tin. Chúng tôi sẽ liên hệ lại trong vòng 24 giờ.', 'success');
      contactForm.reset();
      formFields.forEach((field) => field.setAttribute('aria-invalid', 'false'));

      if (submitButton) {
        submitButton.disabled = true;
        window.setTimeout(() => {
          submitButton.disabled = false;
        }, 3500);
      }
    });

    formFields.forEach((field) => {
      field.addEventListener('input', () => {
        validateField(field);
        if (status && status.textContent) {
          status.textContent = '';
          status.className = 'form-status';
        }
      });
    });
  }
});
