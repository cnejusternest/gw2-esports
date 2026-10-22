(() => {
  const tabs = [...document.querySelectorAll('[data-platform]')];
  const rows = document.getElementById('ranking-rows');
  const empty = document.getElementById('empty-state');
  const panel = document.getElementById('standings-panel');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  function render(platform) {
    const data = Array.isArray(window.GW2_DATA?.[platform]) ? window.GW2_DATA[platform] : [];
    const sorted = [...data].sort((a, b) => Number(b.rating) - Number(a.rating));
    rows.replaceChildren();
    sorted.forEach((player, index) => {
      const tr = document.createElement('tr');
      const cells = [index + 1, player.name, player.region, player.wins, player.losses, player.rating];
      cells.forEach((value, i) => {
        const td = document.createElement('td');
        td.textContent = String(value ?? '—'); // textContent avoids interpreting player names as HTML.
        if (i >= 3) td.classList.add('num');
        tr.appendChild(td);
      });
      rows.appendChild(tr);
    });
    empty.hidden = sorted.length > 0;
    tabs.forEach(tab => {
      const selected = tab.dataset.platform === platform;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) panel.setAttribute('aria-labelledby', tab.id);
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => render(tab.dataset.platform));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (next !== undefined) {
        event.preventDefault();
        tabs[next].focus();
        render(tabs[next].dataset.platform);
      }
    });
  });
  render('pc');
})();
