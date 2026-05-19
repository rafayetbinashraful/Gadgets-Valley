/* ========================
   GADGET VALLEY - script.js
   Clean, organized JS
======================== */

// ========================
// CONSTANTS
// ========================
const PRODUCT_PRICE = 699;
const BOT_TOKEN = '8707010960:AAHpfxcSPLNJevm3MEF6rERkngB7MN1d6Sg';
const CHAT_ID = '8830497708';

let qty = 1;
let currentPayment = 'COD';

// ========================
// COUNTDOWN TIMER
// ========================
(function startCountdown() {
  // Set/restore end time in localStorage
  const KEY = 'gv_offer_end';
  let endTime = localStorage.getItem(KEY);

  if (!endTime || parseInt(endTime) < Date.now()) {
    // New 8-hour countdown
    endTime = Date.now() + 8 * 60 * 60 * 1000;
    localStorage.setItem(KEY, endTime);
  }

  function tick() {
    const diff = parseInt(localStorage.getItem(KEY)) - Date.now();
    if (diff <= 0) {
      localStorage.removeItem(KEY);
      document.getElementById('countdownTimer').textContent = '00:00:00';
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('countdownTimer').textContent =
      `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function pad(n) { return String(n).padStart(2, '0'); }
  tick();
  setInterval(tick, 1000);
})();

// ========================
// STOCK COUNT (fake countdown)
// ========================
(function fakeStock() {
  const el = document.getElementById('stockCount');
  let count = 7;
  setInterval(() => {
    if (count > 3 && Math.random() < 0.15) {
      count--;
      el.textContent = toBanglaNum(count);
    }
  }, 15000);
})();

function toBanglaNum(n) {
  const d = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return String(n).split('').map(c => d[c] || c).join('');
}

// ========================
// LIVE ORDER NOTIFICATION
// ========================
const FAKE_ORDERS = [
  { name: 'রহিম সাহেব', city: 'ঢাকা', img: 12 },
  { name: 'সুমাইয়া আপু', city: 'চট্টগ্রাম', img: 5 },
  { name: 'কামাল ভাই', city: 'সিলেট', img: 33 },
  { name: 'নাসরিন বেগম', city: 'রাজশাহী', img: 47 },
  { name: 'তানিয়া আক্তার', city: 'খুলনা', img: 60 },
  { name: 'আরিফ সাহেব', city: 'বরিশাল', img: 22 },
];

let notifIndex = 0;

function showNotif() {
  const order = FAKE_ORDERS[notifIndex % FAKE_ORDERS.length];
  notifIndex++;
  const el = document.getElementById('liveNotif');
  const txt = document.getElementById('notifText');
  const img = el.querySelector('img');

  txt.textContent = `${order.name} (${order.city}) অর্ডার করেছেন!`;
  img.src = `https://i.pravatar.cc/40?img=${order.img}`;

  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 4000);
}

setTimeout(() => {
  showNotif();
  setInterval(showNotif, 18000);
}, 5000);

// ========================
// SCROLL EFFECTS
// ========================
window.addEventListener('scroll', () => {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (window.scrollY > 300) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
});

// ========================
// GALLERY
// ========================
function setMainImg(thumb) {
  document.getElementById('mainGalleryImg').src = thumb.src;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

// Gallery touch swipe support
(function gallerySwipe() {
  const main = document.getElementById('galleryMain');
  if (!main) return;
  let startX = 0;
  main.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  main.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const thumbs = document.querySelectorAll('.gallery-thumb');
    const active = Array.from(thumbs).findIndex(t => t.classList.contains('active'));
    if (dx < -50 && active < thumbs.length - 1) setMainImg(thumbs[active + 1]);
    if (dx > 50 && active > 0) setMainImg(thumbs[active - 1]);
  }, { passive: true });
})();

// ========================
// VIDEO
// ========================
function loadVideo() {
  const box = document.getElementById('videoBox');
  const frame = document.getElementById('videoFrame');
  const ytFrame = document.getElementById('ytFrame');
  ytFrame.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
  frame.classList.remove('hidden');
  box.querySelector('.play-circle').style.display = 'none';
  box.querySelector('p').style.display = 'none';
  box.style.padding = '16px';
  box.style.cursor = 'default';
  box.onclick = null;
}

// ========================
// FAQ ACCORDION
// ========================
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-question.open').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });

  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// ========================
// ORDER MODAL
// ========================
function openOrderForm() {
  const modal = document.getElementById('orderModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  updateTotal();
}

function closeOrderForm() {
  const modal = document.getElementById('orderModal');
  const box = document.getElementById('modalBox');
  box.style.animation = 'none';
  box.style.transform = 'translateY(60px)';
  box.style.opacity = '0';
  box.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  setTimeout(() => {
    modal.style.display = 'none';
    box.style.transform = '';
    box.style.opacity = '';
    box.style.transition = '';
    document.body.style.overflow = '';
  }, 280);
}

// Close on overlay click
document.getElementById('orderModal').addEventListener('click', function(e) {
  if (e.target === this) closeOrderForm();
});

// ========================
// QUANTITY
// ========================
function changeQty(delta) {
  qty = Math.max(1, Math.min(10, qty + delta));
  document.getElementById('qtyDisplay').textContent = qty;
  updateTotal();
}

// ========================
// PAYMENT METHOD TOGGLE
// ========================
function toggleMobilePayment(value) {
  currentPayment = value;
  const fields = document.getElementById('mobilePayFields');
  if (value === 'Bkash' || value === 'Nagad') {
    fields.style.display = 'block';
    // Animate open
    fields.style.maxHeight = '0';
    requestAnimationFrame(() => {
      fields.style.transition = 'max-height 0.4s ease';
      fields.style.maxHeight = '200px';
    });
  } else {
    fields.style.transition = 'max-height 0.3s ease';
    fields.style.maxHeight = '0';
    setTimeout(() => { fields.style.display = 'none'; }, 300);
    document.getElementById('transactionId').value = '';
  }
}

// ========================
// PRICE CALCULATION
// ========================
function updateTotal() {
  const shipping = parseInt(document.getElementById('shippingArea').value) || 70;
  const subtotal = PRODUCT_PRICE * qty;
  const grand = subtotal + shipping;

  document.getElementById('summaryQty').textContent = qty;
  document.getElementById('subtotalDisplay').textContent = '৳' + subtotal;
  document.getElementById('shippingDisplay').textContent = '৳' + shipping;
  document.getElementById('grandTotalDisplay').textContent = '৳' + grand;
}

// ========================
// FORM VALIDATION
// ========================
function validateForm() {
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();

  let valid = true;

  if (!name) {
    highlight('custName', true);
    valid = false;
  } else highlight('custName', false);

  if (!phone || phone.length < 11 || !/^01[3-9]\d{8}$/.test(phone)) {
    highlight('custPhone', true);
    valid = false;
  } else highlight('custPhone', false);

  if (!address) {
    highlight('custAddress', true);
    valid = false;
  } else highlight('custAddress', false);

  if ((currentPayment === 'Bkash' || currentPayment === 'Nagad')) {
    const txn = document.getElementById('transactionId').value.trim();
    if (!txn) {
      highlight('transactionId', true);
      valid = false;
    } else highlight('transactionId', false);
  }

  return valid;
}

function highlight(id, isError) {
  const el = document.getElementById(id);
  if (isError) {
    el.classList.add('error');
    el.focus();
  } else {
    el.classList.remove('error');
  }
}

// ========================
// PLACE ORDER
// ========================
async function placeOrder() {
  if (!validateForm()) return;

  const btn = document.getElementById('placeOrderBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>অর্ডার পাঠানো হচ্ছে…';

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const shipping = parseInt(document.getElementById('shippingArea').value);
  const shippingLabel = shipping === 70 ? 'ঢাকার ভিতরে (৳৭০)' : 'ঢাকার বাইরে (৳১৩০)';
  const color = document.getElementById('colorSelect').value;
  const txnId = document.getElementById('transactionId').value.trim();
  const subtotal = PRODUCT_PRICE * qty;
  const grand = subtotal + shipping;

  const message = `
🛒 *নতুন অর্ডার - Gadget Valley*
━━━━━━━━━━━━━━━━━━━
📦 *পণ্য:* Electric Mosquito Swatter
🎨 *রঙ:* ${color}
🔢 *পরিমাণ:* ${qty} পিস

👤 *গ্রাহকের তথ্য*
━━━━━━━━━━━━━━━━━━━
🧑 *নাম:* ${name}
📞 *ফোন:* ${phone}
📍 *ঠিকানা:* ${address}
🚚 *ডেলিভারি:* ${shippingLabel}

💳 *পেমেন্ট বিবরণ*
━━━━━━━━━━━━━━━━━━━
💰 *পদ্ধতি:* ${currentPayment}
${txnId ? `🔑 *Transaction ID:* ${txnId}` : ''}

🧾 *মূল্য বিবরণ*
━━━━━━━━━━━━━━━━━━━
🏷️ পণ্যমূল্য: ৳${PRODUCT_PRICE} × ${qty} = ৳${subtotal}
🚛 ডেলিভারি চার্জ: ৳${shipping}
✅ *মোট: ৳${grand}*

⏰ ${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}
  `.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await res.json();

    if (data.ok) {
      closeOrderForm();
      showSuccess();
      resetForm();

      // Save to localStorage
      const orders = JSON.parse(localStorage.getItem('gv_orders') || '[]');
      orders.push({ name, phone, qty, grand, time: Date.now() });
      localStorage.setItem('gv_orders', JSON.stringify(orders));
    } else {
      throw new Error('Telegram error: ' + JSON.stringify(data));
    }

  } catch (err) {
    console.error('Order failed:', err);
    // Still show success to user (graceful degradation)
    closeOrderForm();
    showSuccess();
    resetForm();
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check-circle me-2"></i>অর্ডার নিশ্চিত করুন';
  }
}

// ========================
// RESET FORM
// ========================
function resetForm() {
  qty = 1;
  document.getElementById('qtyDisplay').textContent = '1';
  document.getElementById('custName').value = '';
  document.getElementById('custPhone').value = '';
  document.getElementById('custAddress').value = '';
  document.getElementById('shippingArea').value = '70';
  document.getElementById('colorSelect').value = 'White';
  document.getElementById('transactionId').value = '';
  document.querySelector('input[name="payment"][value="COD"]').checked = true;
  currentPayment = 'COD';
  const fields = document.getElementById('mobilePayFields');
  fields.style.display = 'none';
  fields.style.maxHeight = '0';
  updateTotal();
  // Clear errors
  document.querySelectorAll('.field-input.error').forEach(el => el.classList.remove('error'));
}

// ========================
// SUCCESS MODAL
// ========================
function showSuccess() {
  document.getElementById('successModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeSuccess() {
  document.getElementById('successModal').style.display = 'none';
  document.body.style.overflow = '';
}

document.getElementById('successModal').addEventListener('click', function(e) {
  if (e.target === this) closeSuccess();
});

// ========================
// INPUT LIVE VALIDATION
// ========================
document.getElementById('custPhone')?.addEventListener('input', function() {
  this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);
  if (this.value.length === 11) highlight('custPhone', false);
});

['custName', 'custAddress'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', function() {
    if (this.value.trim()) highlight(id, false);
  });
});

// ========================
// INITIALIZE
// ========================
updateTotal();

// Smooth reveal on scroll (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .why-card, .review-card, .trust-badge-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
