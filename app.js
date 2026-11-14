// My University Tasks — all data is saved in the browser's localStorage.
(() => {
  const COLORS = ['#3d5af1', '#e8452c', '#0f9d8a', '#c2369b', '#e2a400', '#6b4ce6', '#1d8fd1', '#5c6b2f'];
  const TYPES = ['Homework', 'Catch up on lecture', 'Tutorial', 'Reading', 'Project', 'Quiz / Exam', 'Other'];
  const STORAGE_KEY = 'uni-tasks-v1';

  let state = { courses: [], tasks: [] };
  let showDone = false;
  let query = '';
  let editingTask = null;
  let editingCourse = null;
  let pickColor = COLORS[0];
  let undoSnapshot = null;
  let toastTimer = null;

  // ---------- Helpers ----------
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const toISO = d => { const z = new Date(d); z.setMinutes(z.getMinutes() - z.getTimezoneOffset()); return z.toISOString().slice(0, 10); };
  const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return toISO(d); };
  const today = () => toISO(new Date());
  const daysUntil = s => {
    if (!s) return null;
    const a = new Date(s + 'T00:00'), b = new Date(today() + 'T00:00');
    return Math.round((a - b) / 864e5);
  };
  const fmtDate = s => new Date(s + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const relative = n =>
    n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n === -1 ? 'Yesterday' :
    n < 0 ? `${-n} days ago` : `In ${n} days`;
  const courseById = id => state.courses.find(c => c.id === id) || { name: 'No course', color: '#888', id: '' };

  // ---------- Sample data ----------
  function seed() {
    const c1 = { id: uid(), name: 'Intro to Computer Science', info: 'Lecture Mon 10:00', color: COLORS[0] };
    const c2 = { id: uid(), name: 'Linear Algebra', info: 'Tutorial Wed 14:00', color: COLORS[2] };
    const c3 = { id: uid(), name: 'Probability', info: '', color: COLORS[1] };
    state.courses = [c1, c2, c3];
    state.tasks = [
      { id: uid(), title: 'Homework 3 – Recursion', course: c1.id, type: TYPES[0], due: addDays(2), notes: 'Submit in pairs', done: false },
      { id: uid(), title: 'Catch up on lecture 5 (recording)', course: c1.id, type: TYPES[1], due: addDays(0), notes: '', done: false },
      { id: uid(), title: 'Problem set 4 – Bases and dimension', course: c2.id, type: TYPES[0], due: addDays(5), notes: '', done: false },
      { id: uid(), title: 'Review tutorial 3', course: c2.id, type: TYPES[2], due: addDays(-1), notes: '', done: false },
      { id: uid(), title: 'Midterm exam', course: c3.id, type: TYPES[5], due: addDays(12), notes: 'Chapters 1–4', done: false },
      { id: uid(), title: 'Reading: chapter 2', course: c3.id, type: TYPES[3], due: '', notes: '', done: true }
    ];
    state.sample = true;
  }

  // ---------- Storage ----------
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { state = JSON.parse(raw); return; }
    } catch (e) { /* ignore */ }
    seed();
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function commit(msg) { save(); render(); if (msg) toast(msg); }
  function snapshot() { undoSnapshot = JSON.stringify(state); }

  // ---------- Toast with undo ----------
  function toast(msg) {
    $('toastMsg').textContent = msg;
    $('toast').classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('toast').classList.remove('on'), 5000);
  }
  $('toastUndo').onclick = () => {
    if (undoSnapshot) { state = JSON.parse(undoSnapshot); undoSnapshot = null; save(); render(); }
    $('toast').classList.remove('on');
  };

  // ---------- Routing (#all or #course-<id>) ----------
  function currentCourse() {
    const h = location.hash.slice(1);
    if (h.startsWith('course-')) {
      const id = h.slice(7);
      if (state.courses.some(c => c.id === id)) return id;
    }
    return null;
  }
  window.addEventListener('hashchange', render);

  // ---------- Stats ----------
  function stats(list) {
    const open = list.filter(t => !t.done);
    return {
      open: open.length,
      late: open.filter(t => t.due && daysUntil(t.due) < 0).length,
      week: open.filter(t => t.due && daysUntil(t.due) >= 0 && daysUntil(t.due) <= 7).length,
      done: list.filter(t => t.done).length,
      total: list.length
    };
  }

  // ---------- Sidebar ----------
  function renderRail(cur) {
    const openCount = id => state.tasks.filter(t => !t.done && (!id || t.course === id)).length;
    const n = state.courses.length;
    const ring = state.courses.map((c, i) => `${c.color} ${i / n * 100}% ${(i + 1) / n * 100}%`).join(',') || '#888 0 100%';
    $('rail').innerHTML = `
      <div class="brand">My Tasks</div>
      <button class="nav ${cur ? '' : 'on'}" data-go="">
        <span class="dot" style="background:conic-gradient(${ring})"></span>Overview<span class="n">${openCount()}</span>
      </button>
      <div class="sep">My courses</div>
      ${state.courses.map(c => `
        <button class="nav ${cur === c.id ? 'on' : ''}" data-go="${c.id}">
          <span class="dot" style="background:${c.color}"></span>${esc(c.name)}<span class="n">${openCount(c.id)}</span>
        </button>`).join('')}
      <button class="ghost" id="addCourse">+ New course</button>
      <div class="sync">Saved in this browser</div>`;
    $('rail').querySelectorAll('[data-go]').forEach(b =>
      b.onclick = () => { location.hash = b.dataset.go ? 'course-' + b.dataset.go : 'all'; });
    $('addCourse').onclick = () => openCourse(null);
  }

  // ---------- Task grouping ----------
  function groups(list) {
    const g = { late: [], today: [], week: [], later: [], none: [], done: [] };
    list.forEach(t => {
      if (t.done) return g.done.push(t);
      const d = daysUntil(t.due);
      if (d === null) g.none.push(t);
      else if (d < 0) g.late.push(t);
      else if (d === 0) g.today.push(t);
      else if (d <= 7) g.week.push(t);
      else g.later.push(t);
    });
    Object.values(g).forEach(a => a.sort((x, y) => (x.due || '9').localeCompare(y.due || '9')));
    return [
      ['late', 'Overdue', g.late],
      ['today', 'Today', g.today],
      ['week', 'Next 7 days', g.week],
      ['later', 'Later', g.later],
      ['none', 'No due date', g.none],
      ['done', 'Completed', showDone ? g.done : []]
    ];
  }

  function rowHTML(t, showCourse) {
    const c = courseById(t.course), d = daysUntil(t.due);
    return `
      <div class="row ${t.done ? 'done' : ''}" style="--c:${c.color}">
        <button class="tick" data-tick="${t.id}" aria-label="${t.done ? 'Mark as open' : 'Mark as done'}">${t.done ? '✓' : ''}</button>
        <div>
          <button class="tt" data-edit="${t.id}">${esc(t.title)}</button>
          <div class="meta">
            ${showCourse ? `<span class="tag"><span class="dot sm" style="background:${c.color}"></span>${esc(c.name)}</span>` : ''}
            <span>${esc(t.type)}</span>
            ${t.notes ? `<span>${esc(t.notes)}</span>` : ''}
          </div>
        </div>
        <div class="when ${!t.done && d !== null && d < 0 ? 'late' : ''}">
          ${t.due ? fmtDate(t.due) : '—'}
          ${t.due && !t.done ? `<small>${relative(d)}</small>` : ''}
        </div>
      </div>`;
  }

  // ---------- Main view ----------
  function render() {
    const cur = currentCourse();
    renderRail(cur);

    const scope = state.tasks.filter(t => !cur || t.course === cur);
    const list = scope.filter(t => !query ||
      (t.title + ' ' + t.notes + ' ' + t.type + ' ' + courseById(t.course).name).toLowerCase().includes(query.toLowerCase()));
    const st = stats(scope);
    const c = cur ? courseById(cur) : null;
    const next = scope.filter(t => !t.done && t.due && daysUntil(t.due) >= 0).sort((a, b) => a.due.localeCompare(b.due))[0];
    const nc = next ? courseById(next.course) : null;
    const pct = st.total ? Math.round(st.done / st.total * 100) : 0;

    let h = `
      <div class="head">
        <div>
          <h1>${c ? esc(c.name) : 'All tasks'}</h1>
          <div class="sub">${c
            ? (c.info ? esc(c.info) + ' · ' : '') + `${pct}% complete`
            : `${state.courses.length} courses · ${st.open} open tasks`}</div>
        </div>
        <div class="head-actions">
          ${c ? `<button class="btn alt" id="editCourse">Edit course</button>` : ''}
          <button class="btn" id="addTask">+ New task</button>
        </div>
      </div>`;

    if (!state.courses.length) {
      h += `<div class="empty"><h2>Let's get started</h2>Add your first course, then add its tasks.<br><br>
            <button class="btn" id="firstCourse">+ Add course</button></div>`;
      $('main').innerHTML = h;
      $('firstCourse').onclick = () => openCourse(null);
      $('addTask').onclick = () => openCourse(null);
      return;
    }

    h += `
      <div class="hero">
        <div class="next" style="--c:${nc ? nc.color : 'var(--ink)'}">
          ${next
            ? `<div class="lab">Next deadline${cur ? '' : ' · ' + esc(nc.name)}</div>
               <div><div class="big">${relative(daysUntil(next.due))}</div><div class="t">${esc(next.title)}</div></div>
               <div class="lab">${fmtDate(next.due)}</div>`
            : `<div class="lab">Next deadline</div><div class="big calm">Nothing due</div><div class="lab">Well done!</div>`}
        </div>
        <div class="stats">
          <div class="stat"><b>${st.open}</b><span>Open</span></div>
          <div class="stat ${st.late ? 'hot' : ''}"><b>${st.late}</b><span>Overdue</span></div>
          <div class="stat"><b>${st.week}</b><span>Due in next 7 days</span></div>
          <div class="stat"><b>${st.done}</b><span>Completed</span></div>
        </div>
      </div>`;

    if (!cur) {
      h += `<h2 class="section-title">Progress by course</h2><div class="bars">` +
        state.courses.map(k => {
          const s = stats(state.tasks.filter(t => t.course === k.id));
          const p = s.total ? Math.round(s.done / s.total * 100) : 0;
          return `<button class="bar" data-go="${k.id}">
              <span class="tag"><span class="dot" style="background:${k.color}"></span>${esc(k.name)}</span>
              <span class="tr"><span class="fl" style="width:${p}%;background:${k.color}"></span></span>
              <span class="pc">${s.done}/${s.total}</span>
            </button>`;
        }).join('') + `</div>`;
    }

    h += `
      <div class="tools">
        <input type="search" id="q" placeholder="Search tasks…" value="${esc(query)}">
        <label class="chk"><input type="checkbox" id="sd" ${showDone ? 'checked' : ''}>Show completed</label>
      </div>`;

    const gs = groups(list).filter(g => g[2].length);
    h += gs.length
      ? gs.map(([k, name, arr]) =>
          `<section class="grp ${k}"><h3>${name}<small>${arr.length}</small></h3>${arr.map(t => rowHTML(t, !cur)).join('')}</section>`).join('')
      : `<div class="empty">${query ? 'No tasks match your search.' : 'No open tasks here. Add one with “New task”.'}</div>`;

    if (state.sample) {
      h += `<div class="note">The courses and tasks shown are sample data.
            <button class="btn alt small" id="clearSample">Clear sample</button></div>`;
    }

    $('main').innerHTML = h;

    // Bind events
    $('addTask').onclick = () => openTask(null, cur);
    if ($('editCourse')) $('editCourse').onclick = () => openCourse(cur);
    if ($('clearSample')) $('clearSample').onclick = () => {
      snapshot(); state = { courses: [], tasks: [] }; location.hash = 'all'; commit('Sample cleared');
    };
    $('q').oninput = e => {
      query = e.target.value;
      const pos = e.target.selectionStart;
      render();
      const n = $('q'); n.focus(); n.setSelectionRange(pos, pos);
    };
    $('sd').onchange = e => { showDone = e.target.checked; render(); };
    $('main').querySelectorAll('[data-go]').forEach(b => b.onclick = () => { location.hash = 'course-' + b.dataset.go; });
    $('main').querySelectorAll('[data-tick]').forEach(b => b.onclick = () => {
      const t = state.tasks.find(x => x.id === b.dataset.tick);
      snapshot(); t.done = !t.done; delete state.sample;
      commit(t.done ? 'Marked as done' : 'Marked as open');
    });
    $('main').querySelectorAll('[data-edit]').forEach(b => b.onclick = () => openTask(b.dataset.edit));
  }

  // ---------- Task dialog ----------
  $('tType').innerHTML = TYPES.map(t => `<option>${t}</option>`).join('');

  function openTask(id, courseId) {
    if (!state.courses.length) return openCourse(null);
    editingTask = id;
    const t = id ? state.tasks.find(x => x.id === id) : null;
    $('tCourse').innerHTML = state.courses.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    $('taskTitle').textContent = t ? 'Edit task' : 'New task';
    $('tTitle').value = t ? t.title : '';
    $('tCourse').value = t ? t.course : (courseId || state.courses[0].id);
    $('tType').value = t ? t.type : TYPES[0];
    $('tDue').value = t ? t.due : '';
    $('tNotes').value = t ? t.notes : '';
    $('tDel').style.visibility = t ? 'visible' : 'hidden';
    $('taskDlg').showModal();
    $('tTitle').focus();
  }

  $('taskForm').onsubmit = e => {
    e.preventDefault();
    const v = {
      title: $('tTitle').value.trim(),
      course: $('tCourse').value,
      type: $('tType').value,
      due: $('tDue').value,
      notes: $('tNotes').value.trim()
    };
    if (!v.title) return;
    snapshot(); delete state.sample;
    if (editingTask) Object.assign(state.tasks.find(x => x.id === editingTask), v);
    else state.tasks.push({ id: uid(), done: false, ...v });
    $('taskDlg').close();
    commit(editingTask ? 'Task updated' : 'Task added');
  };
  $('tCancel').onclick = () => $('taskDlg').close();
  $('tDel').onclick = () => {
    snapshot();
    state.tasks = state.tasks.filter(x => x.id !== editingTask);
    $('taskDlg').close();
    commit('Task deleted');
  };

  // ---------- Course dialog ----------
  function openCourse(id) {
    editingCourse = id;
    const c = id ? courseById(id) : null;
    $('courseTitle').textContent = c ? 'Edit course' : 'New course';
    $('cName').value = c ? c.name : '';
    $('cInfo').value = c ? c.info || '' : '';
    pickColor = c ? c.color : COLORS[state.courses.length % COLORS.length];
    drawSwatches();
    $('cDel').style.visibility = c ? 'visible' : 'hidden';
    $('courseDlg').showModal();
    $('cName').focus();
  }

  function drawSwatches() {
    $('cColors').innerHTML = COLORS.map(c =>
      `<button type="button" class="sw ${c === pickColor ? 'on' : ''}" style="background:${c}" data-c="${c}" aria-label="Color ${c}"></button>`).join('');
    $('cColors').querySelectorAll('.sw').forEach(b => b.onclick = () => { pickColor = b.dataset.c; drawSwatches(); });
  }

  $('courseForm').onsubmit = e => {
    e.preventDefault();
    const name = $('cName').value.trim();
    if (!name) return;
    snapshot(); delete state.sample;
    const v = { name, info: $('cInfo').value.trim(), color: pickColor };
    let id = editingCourse;
    if (id) Object.assign(state.courses.find(x => x.id === id), v);
    else { id = uid(); state.courses.push({ id, ...v }); }
    $('courseDlg').close();
    location.hash = 'course-' + id;
    commit(editingCourse ? 'Course updated' : 'Course added');
  };
  $('cCancel').onclick = () => $('courseDlg').close();

  // Delete needs a second click to confirm
  $('cDel').onclick = () => {
    const btn = $('cDel');
    const count = state.tasks.filter(t => t.course === editingCourse).length;
    if (btn.dataset.arm !== editingCourse) {
      btn.dataset.arm = editingCourse;
      btn.textContent = count ? `Also delete ${count} tasks?` : 'Are you sure?';
      return;
    }
    btn.dataset.arm = ''; btn.textContent = 'Delete course';
    snapshot();
    state.tasks = state.tasks.filter(t => t.course !== editingCourse);
    state.courses = state.courses.filter(c => c.id !== editingCourse);
    $('courseDlg').close();
    location.hash = 'all';
    commit('Course deleted');
  };
  $('courseDlg').addEventListener('close', () => { $('cDel').dataset.arm = ''; $('cDel').textContent = 'Delete course'; });

  // ---------- Start ----------
  load();
  render();
})();
