class Popover {
  constructor() {
    this.current = null;
    this._onDocumentClick = this._onDocumentClick.bind(this);
    document.addEventListener('click', this._onDocumentClick);
  }

  _onDocumentClick(e) {
    const trigger = e.target.closest('[data-toggle="popover"]');
    if (trigger) {
      e.preventDefault();
      // toggle
      if (this.current && this.current.trigger === trigger) {
        this.hide();
      } else {
        this.show(trigger);
      }
      return;
    }

    // click outside -> hide
    if (this.current) {
      const pop = this.current.pop;
      if (!pop.contains(e.target)) {
        this.hide();
      }
    }
  }

  show(trigger) {
    this.hide();
    const title = trigger.getAttribute('data-title') || '';
    const content = trigger.getAttribute('data-content') || '';

    const pop = document.createElement('div');
    pop.className = 'popover';

    const t = document.createElement('h3');
    t.className = 'popover-title';
    t.textContent = title;

    const body = document.createElement('div');
    body.className = 'popover-body';
    body.textContent = content;

    const arrow = document.createElement('div');
    arrow.className = 'arrow';

    pop.appendChild(t);
    pop.appendChild(body);
    pop.appendChild(arrow);

    document.body.appendChild(pop);

    // Position: show above trigger, horizontally centered
    const rect = trigger.getBoundingClientRect();
    const popRect = pop.getBoundingClientRect();

    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const scrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;

    let top = rect.top + scrollY - popRect.height - 8; // 8px gap
    let left = rect.left + scrollX + rect.width / 2 - popRect.width / 2;

    // Clamp to viewport (8px padding)
    const minLeft = 8 + scrollX;
    const maxLeft = (document.documentElement.clientWidth + scrollX) - popRect.width - 8;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    pop.style.top = Math.round(top) + 'px';
    pop.style.left = Math.round(left) + 'px';

    // Position arrow so its tip is centered to trigger center
    const arrowWidth = 22; // full width used in CSS (11px each side)
    const triggerCenterX = rect.left + scrollX + rect.width / 2;
    const arrowLeft = triggerCenterX - left - (arrowWidth / 2);
    // clamp arrow inside popover
    const minArrow = 6; // small offset from edge
    const maxArrow = popRect.width - 6 - arrowWidth;
    let arrowPos = arrowLeft;
    if (arrowPos < minArrow) arrowPos = minArrow;
    if (arrowPos > maxArrow) arrowPos = maxArrow;
    arrow.style.left = Math.round(arrowPos) + 'px';
    arrow.style.bottom = '-11px';

    this.current = { trigger, pop };
  }

  hide() {
    if (!this.current) return;
    const { pop } = this.current;
    if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
    this.current = null;
  }
}

// Export singleton for demo & tests
module.exports = Popover;
