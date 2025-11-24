const Popover = require('../src/popover');

describe('Popover', () => {
  let originalGetBoundingClientRect;

  beforeEach(() => {
    // reset DOM
    document.body.innerHTML = '';
    originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

    // add a trigger button
    const btn = document.createElement('button');
    btn.id = 'btn';
    btn.setAttribute('data-toggle', 'popover');
    btn.setAttribute('data-title', 'Тестовый заголовок');
    btn.setAttribute('data-content', 'Тестовый текст');
    document.body.appendChild(btn);

    // Mock getBoundingClientRect for layout-dependent logic
    Element.prototype.getBoundingClientRect = function() {
      if (this.classList && this.classList.contains('popover')) {
        return { width: 180, height: 60, top: 0, left: 0, bottom: 60, right: 180 };
      }
      if (this.id === 'btn') {
        return { top: 200, left: 120, width: 80, height: 32, bottom:232, right:200 };
      }
      return { top: 0, left: 0, width: 0, height: 0, bottom:0, right:0 };
    };
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  test('shows popover with title and content when trigger clicked', () => {
    const pop = new Popover();
    const btn = document.getElementById('btn');

    // simulate click
    btn.click();

    const p = document.querySelector('.popover');
    expect(p).not.toBeNull();
    expect(p.querySelector('.popover-title').textContent).toBe('Тестовый заголовок');
    expect(p.querySelector('.popover-body').textContent).toBe('Тестовый текст');
  });

  test('hides popover on outside click', () => {
    const pop = new Popover();
    const btn = document.getElementById('btn');
    btn.click();
    expect(document.querySelector('.popover')).not.toBeNull();

    // click outside
    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.click();

    expect(document.querySelector('.popover')).toBeNull();
  });
});
