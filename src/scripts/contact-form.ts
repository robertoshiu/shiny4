/**
 * contact-form.ts
 *
 * Validation, submission logic and form state management for the ContactForm component.
 *
 * CONTACT_ENDPOINT — set this to your real API/webhook URL before launch.
 * If left as an empty string the submit handler falls back to a mailto: compose,
 * pre-populated with all field values, so no enquiry is ever silently dropped.
 */

export const CONTACT_ENDPOINT = '';

const MAILTO_ADDRESS = 'hello@shinylogic.tech';

// ── Types ────────────────────────────────────────────────────────────────────

export interface InquiryFormData {
  name: string;
  company: string;
  email: string;
  inquiryType: string;
  message: string;
  /** Honeypot — must be empty for the submission to proceed. */
  website: string;
}

export interface FieldError {
  field: keyof Omit<InquiryFormData, 'website'>;
  message: string;
}

// ── Validation ───────────────────────────────────────────────────────────────

export function validate(data: InquiryFormData): FieldError[] {
  const errors: FieldError[] = [];

  if (!data.name.trim()) {
    errors.push({ field: 'name', message: '請輸入您的姓名。' });
  }

  if (!data.email.trim()) {
    errors.push({ field: 'email', message: '請輸入您的電子郵件。' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.push({ field: 'email', message: '電子郵件格式不正確，請確認後重試。' });
  }

  if (!data.inquiryType) {
    errors.push({ field: 'inquiryType', message: '請選擇諮詢類型。' });
  }

  if (!data.message.trim()) {
    errors.push({ field: 'message', message: '請輸入您的訊息。' });
  }

  return errors;
}

// ── Submission ───────────────────────────────────────────────────────────────

export async function submitInquiry(data: InquiryFormData): Promise<{ ok: boolean }> {
  if (CONTACT_ENDPOINT) {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        company: data.company,
        email: data.email,
        inquiryType: data.inquiryType,
        message: data.message,
      }),
    });
    return { ok: res.ok };
  }

  // Endpoint not configured — compose a pre-filled mailto: as fallback.
  const subject = encodeURIComponent(`[${data.inquiryType}] 顯藝科技諮詢`);
  const body = encodeURIComponent(
    [
      `姓名：${data.name}`,
      `公司：${data.company || '—'}`,
      `電子郵件：${data.email}`,
      `諮詢類型：${data.inquiryType}`,
      '',
      '訊息：',
      data.message,
    ].join('\n'),
  );
  window.location.href = `mailto:${MAILTO_ADDRESS}?subject=${subject}&body=${body}`;
  return { ok: true };
}

// ── DOM controller ───────────────────────────────────────────────────────────

/**
 * Wire up validation, submission, and ARIA state management on a form element.
 * Call once per form instance after the DOM is ready.
 */
export function initContactForm(formEl: HTMLFormElement): void {
  const statusEl = formEl.querySelector<HTMLElement>('[data-form-status]');
  const submitBtn = formEl.querySelector<HTMLButtonElement>('[type="submit"]');

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getErrorEl = (field: string) =>
    formEl.querySelector<HTMLElement>(`[data-error="${field}"]`);

  function clearErrors(): void {
    formEl.querySelectorAll<HTMLElement>('[data-error]').forEach((el) => {
      el.textContent = '';
    });
    formEl.querySelectorAll<HTMLElement>('[aria-invalid]').forEach((el) => {
      el.removeAttribute('aria-invalid');
    });
  }

  function showErrors(errors: FieldError[]): void {
    errors.forEach(({ field, message }) => {
      const errEl = getErrorEl(field);
      if (errEl) errEl.textContent = message;

      const inputEl = formEl.querySelector<HTMLElement>(`[name="${field}"]`);
      if (inputEl) inputEl.setAttribute('aria-invalid', 'true');
    });

    // Move focus to the first invalid control so keyboard / SR users land on it.
    const firstInvalid = formEl.querySelector<HTMLElement>('[aria-invalid="true"]');
    firstInvalid?.focus();
  }

  function setStatus(kind: 'success' | 'error' | '', message = ''): void {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.status = kind;
  }

  function setLoading(loading: boolean): void {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? '送出中…' : '送出諮詢 →';
  }

  // ── Submit handler ─────────────────────────────────────────────────────────

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(formEl);

    const data: InquiryFormData = {
      name: String(fd.get('name') ?? ''),
      company: String(fd.get('company') ?? ''),
      email: String(fd.get('email') ?? ''),
      inquiryType: String(fd.get('inquiryType') ?? ''),
      message: String(fd.get('message') ?? ''),
      website: String(fd.get('website') ?? ''),
    };

    // Honeypot — a real user never fills the hidden field; bots often do.
    if (data.website) return;

    clearErrors();
    setStatus('');

    const errors = validate(data);
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const result = await submitInquiry(data);
      if (result.ok) {
        setStatus(
          'success',
          '諮詢已送出 — 感謝您的訊息。我們將於兩個工作天內與您聯繫。',
        );
        formEl.reset();
      } else {
        setStatus(
          'error',
          '送出失敗，請稍後再試，或透過本頁的電子郵件直接與我們聯繫。',
        );
      }
    } catch {
      setStatus(
        'error',
        '送出失敗，請稍後再試，或透過本頁的電子郵件直接與我們聯繫。',
      );
    } finally {
      setLoading(false);
    }
  });

  // Inline-clear field error as soon as the user corrects their input.
  formEl.addEventListener('input', (e) => {
    const target = e.target as HTMLElement;
    const name = target.getAttribute('name');
    if (!name) return;
    const errEl = getErrorEl(name);
    if (errEl?.textContent) {
      errEl.textContent = '';
      target.removeAttribute('aria-invalid');
    }
  });
}
