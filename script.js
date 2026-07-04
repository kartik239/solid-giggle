// Replace these values before deployment.
const CONFIG = {
  appsScriptUrl: 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE',
  whatsappPhone: '91XXXXXXXXXX'
};

const form = document.getElementById('applicationForm');
const submitButton = document.getElementById('submitButton');
const buttonText = submitButton.querySelector('.button-text');
const successMessage = document.getElementById('successMessage');
const formAlert = document.getElementById('formAlert');
const whatsappLink = document.getElementById('whatsappLink');
const numericFields = ['aadhaar', 'mobile', 'alternateMobile', 'pinCode', 'zipCode'];

whatsappLink.href = `https://wa.me/${CONFIG.whatsappPhone}`;

numericFields.forEach((id) => {
  document.getElementById(id).addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/\D/g, '');
  });
});

document.getElementById('pan').addEventListener('input', (event) => {
  event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
});

['maleWorkers', 'femaleWorkers'].forEach((id) => {
  document.getElementById(id).addEventListener('input', calculateTotalWorkers);
});

function calculateTotalWorkers() {
  const male = Math.max(0, Number(document.getElementById('maleWorkers').value || 0));
  const female = Math.max(0, Number(document.getElementById('femaleWorkers').value || 0));
  document.getElementById('totalWorkers').value = male + female;
}

function setError(fieldName, message) {
  const error = document.getElementById(`${fieldName}Error`);
  const field = form.elements[fieldName];
  if (error) error.textContent = message || '';
  if (!field) return;
  if (field instanceof RadioNodeList) {
    [...field].forEach((input) => input.classList.toggle('invalid', Boolean(message)));
  } else {
    field.classList.toggle('invalid', Boolean(message));
  }
}

function value(name) {
  const field = form.elements[name];
  return field instanceof RadioNodeList ? field.value : String(field.value || '').trim();
}

function validateForm() {
  let valid = true;
  const requiredFields = ['applicationType','businessName','businessAddress','businessCity','pinCode','businessStartDate','natureOfBusiness','organizationType','ownership','employerName','residentialAddress','residentialCity','zipCode','residentSince','aadhaar','email','mobile'];
  requiredFields.forEach((name) => {
    const missing = !value(name);
    setError(name, missing ? 'This field is required.' : '');
    if (missing) valid = false;
  });

  const rules = [
    ['pinCode', /^\d{6}$/, 'PIN code must be exactly 6 digits.'],
    ['zipCode', /^\d{5,6}$/, 'ZIP / Postal code must be 5 or 6 digits.'],
    ['aadhaar', /^\d{12}$/, 'Aadhaar number must be exactly 12 digits.'],
    ['mobile', /^\d{10}$/, 'Mobile number must be exactly 10 digits.'],
    ['email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address.']
  ];

  rules.forEach(([name, regex, message]) => {
    if (value(name) && !regex.test(value(name))) {
      setError(name, message);
      valid = false;
    }
  });

  if (value('alternateMobile') && !/^\d{10}$/.test(value('alternateMobile'))) {
    setError('alternateMobile', 'Alternate mobile number must be exactly 10 digits.');
    valid = false;
  } else setError('alternateMobile', '');

  if (value('pan') && !/^[A-Z]{5}\d{4}[A-Z]$/.test(value('pan'))) {
    setError('pan', 'PAN must match the format ABCDE1234F.');
    valid = false;
  } else setError('pan', '');

  const year = Number(value('residentSince'));
  const currentYear = new Date().getFullYear();
  if (value('residentSince') && (!Number.isInteger(year) || year < 1900 || year > currentYear)) {
    setError('residentSince', `Enter a valid year between 1900 and ${currentYear}.`);
    valid = false;
  }

  ['maleWorkers', 'femaleWorkers'].forEach((name) => {
    if (Number(value(name)) < 0) {
      setError(name, 'Workers cannot be negative.');
      valid = false;
    } else setError(name, '');
  });

  if (!document.getElementById('consent').checked) {
    setError('consent', 'You must accept the declaration to continue.');
    valid = false;
  } else setError('consent', '');

  return valid;
}

function collectPayload() {
  calculateTotalWorkers();
  return {
    applicationType: value('applicationType'), businessName: value('businessName'), businessAddress: value('businessAddress'), businessCity: value('businessCity'), pinCode: value('pinCode'), businessStartDate: value('businessStartDate'), natureOfBusiness: value('natureOfBusiness'), organizationType: value('organizationType'), ownership: value('ownership'), maleWorkers: value('maleWorkers') || '0', femaleWorkers: value('femaleWorkers') || '0', totalWorkers: value('totalWorkers') || '0', employerName: value('employerName'), residentialAddress: value('residentialAddress'), residentialCity: value('residentialCity'), zipCode: value('zipCode'), residentSince: value('residentSince'), aadhaar: value('aadhaar'), pan: value('pan'), email: value('email'), mobile: value('mobile'), alternateMobile: value('alternateMobile'), consent: document.getElementById('consent').checked ? 'Yes' : 'No', browser: navigator.userAgent
  };
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.classList.toggle('is-loading', isLoading);
  buttonText.textContent = isLoading ? 'Submitting...' : 'Submit Application';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formAlert.textContent = '';
  successMessage.hidden = true;
  if (submitButton.disabled) return;
  if (!validateForm()) {
    formAlert.textContent = 'Please correct the highlighted errors before submitting.';
    return;
  }
  if (CONFIG.appsScriptUrl.includes('PASTE_YOUR')) {
    formAlert.textContent = 'Please configure your Google Apps Script Web App URL in script.js.';
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(CONFIG.appsScriptUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(collectPayload())
    });
    const result = await response.json();
    if (!response.ok || result.status !== 'success') throw new Error(result.message || 'Submission failed.');
    form.reset();
    calculateTotalWorkers();
    successMessage.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    formAlert.textContent = error.message || 'Unable to submit right now. Please try again.';
    alert(formAlert.textContent);
  } finally {
    setLoading(false);
  }
});
