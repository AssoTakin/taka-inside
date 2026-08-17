(function() {
  const requiredFields = window.__BENEVOLE_CONFIG__ ? window.__BENEVOLE_CONFIG__.requiredFields : ["lastName", "firstName", "email", "city", "skills", "motivation"];
  const successMessage = window.__BENEVOLE_CONFIG__ ? window.__BENEVOLE_CONFIG__.successMessage : "Votre candidature a bien été envoyée. Un email de confirmation vous a été envoyé.";
  const errorMessage = window.__BENEVOLE_CONFIG__ ? window.__BENEVOLE_CONFIG__.errorMessage : "Une erreur est survenue. Veuillez réessayer.";
  const submitLabel = window.__BENEVOLE_CONFIG__ ? window.__BENEVOLE_CONFIG__.submitButton : "Envoyer ma candidature";

  const selected = { skills: new Set(), availabilities: new Set() };

  function updateHiddenInput(group) {
    const input = document.getElementById(group === 'skills' ? 'skills-input' : 'avail-input');
    if (input) input.value = Array.from(selected[group]).join(',');
  }

  function updateButtonStyle(btn, group) {
    const value = btn.dataset.value;
    const isSelected = selected[group].has(value);
    if (group === 'skills') {
      btn.className = isSelected
        ? 'skill-btn px-4 py-2 rounded-lg border text-sm transition-all bg-taka-green text-white border-taka-green'
        : 'skill-btn px-4 py-2 rounded-lg border text-sm transition-all border-taka-gray-light hover:border-taka-green hover:text-taka-green';
    } else {
      btn.className = isSelected
        ? 'avail-btn px-4 py-2 rounded-lg border text-sm transition-all bg-taka-yellow text-taka-black border-taka-yellow'
        : 'avail-btn px-4 py-2 rounded-lg border text-sm transition-all border-taka-gray-light hover:border-taka-yellow hover:text-taka-yellow';
    }
  }

  function toggle(group, value, btn) {
    if (selected[group].has(value)) selected[group].delete(value);
    else selected[group].add(value);
    updateButtonStyle(btn, group);
    updateHiddenInput(group);
    if (group === 'skills') {
      const otherContainer = document.getElementById('other-skill-container');
      const otherInput = document.getElementById('otherSkill');
      if (selected.skills.has('Autre')) {
        otherContainer.classList.remove('hidden');
        otherInput.setAttribute('required', 'required');
      } else {
        otherContainer.classList.add('hidden');
        otherInput.removeAttribute('required');
        otherInput.value = '';
      }
    }
  }

  document.querySelectorAll('[data-group="skills"]').forEach(function(btn) {
    btn.addEventListener('click', function() { toggle('skills', btn.dataset.value, btn); });
  });

  document.querySelectorAll('[data-group="availabilities"]').forEach(function(btn) {
    btn.addEventListener('click', function() { toggle('availabilities', btn.dataset.value, btn); });
  });

  function showStatus(type, text) {
    const box = document.getElementById('benevole-status');
    const txt = document.getElementById('benevole-status-text');
    const icon = document.getElementById('benevole-status-icon');
    box.classList.remove('hidden', 'bg-taka-green/10', 'border-taka-green/30', 'text-taka-green-dark', 'bg-red-50', 'border-red-200', 'text-red-700');
    if (type === 'success') {
      box.classList.add('bg-taka-green/10', 'border-taka-green/30', 'text-taka-green-dark');
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />';
    } else {
      box.classList.add('bg-red-50', 'border-red-200', 'text-red-700');
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    }
    txt.textContent = text;
  }

  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  const form = document.getElementById('benevole-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('submit-btn');
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';

      const data = {
        lastName: getValue('lastName'),
        firstName: getValue('firstName'),
        email: getValue('email'),
        phone: getValue('phone'),
        city: getValue('city'),
        country: getValue('country'),
        skills: Array.from(selected.skills),
        otherSkill: getValue('otherSkill'),
        availabilities: Array.from(selected.availabilities),
        motivation: getValue('motivation'),
      };

      const errors = [];
      if (requiredFields.includes('lastName') && !data.lastName) errors.push('Le nom est requis.');
      if (requiredFields.includes('firstName') && !data.firstName) errors.push('Le prénom est requis.');
      if (requiredFields.includes('email') && !data.email) errors.push("L'email est requis.");
      else if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Email invalide.');
      if (requiredFields.includes('city') && !data.city) errors.push('La ville est requise.');
      if (requiredFields.includes('skills') && data.skills.length === 0) errors.push('Sélectionnez au moins une compétence.');
      if (data.skills.includes('Autre') && !data.otherSkill) errors.push('Précisez votre compétence.');
      if (requiredFields.includes('motivation') && !data.motivation) errors.push('La motivation est requise.');

      if (errors.length > 0) {
        showStatus('error', errors.join(' '));
        btn.disabled = false;
        btn.textContent = submitLabel;
        return;
      }

      try {
        const res = await fetch('/api/benevole', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const json = await res.json();
        if (res.ok && json.success) {
          showStatus('success', successMessage);
          form.reset();
          selected.skills.clear();
          selected.availabilities.clear();
          document.querySelectorAll('[data-group]').forEach(function(btn) { updateButtonStyle(btn, btn.dataset.group); });
          document.getElementById('other-skill-container').classList.add('hidden');
          document.getElementById('otherSkill').removeAttribute('required');
        } else {
          showStatus('error', json.error || errorMessage);
        }
      } catch (err) {
        showStatus('error', errorMessage);
      } finally {
        btn.disabled = false;
        btn.textContent = submitLabel;
      }
    });
  }
})();
