export function showAlert(title: string, message: string, onOk?: () => void): void {
  const overlay = document.createElement('div');
  overlay.className = 'alert-overlay';
  overlay.innerHTML = `
    <div class="alert-card">
      <div class="alert-title">${escapeHtml(title)}</div>
      <div class="alert-message">${escapeHtml(message)}</div>
      <button class="alert-btn" id="alert-ok-btn">OK</button>
    </div>
  `;

  document.body.appendChild(overlay);

  const dismiss = () => {
    overlay.remove();
    onOk?.();
  };

  overlay.querySelector('#alert-ok-btn')!.addEventListener('click', dismiss);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) dismiss();
  });
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
