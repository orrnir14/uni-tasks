// My University Tasks — all data is saved in the browser's localStorage.
(() => {
  const COLORS = ['#3d5af1', '#e8452c', '#0f9d8a', '#c2369b', '#e2a400', '#6b4ce6', '#1d8fd1', '#5c6b2f'];
  const TYPES = ['Homework', 'Catch up on lecture', 'Tutorial', 'Reading', 'Project', 'Quiz / Exam', 'Other'];
  const STORAGE_KEY = 'uni-tasks-v1';
  const LANGUAGE_KEY = 'uni-tasks-language';
  const TEXT = {
    en: {
      appName: 'My Tasks', overview: 'Overview', myCourses: 'My courses', newCourse: '+ New course',
      savedInBrowser: 'Saved in this browser', language: 'Language', allTasks: 'All tasks',
      editCourse: 'Edit course', newTask: '+ New task', getStarted: "Let's get started",
      firstCourseHint: 'Add your first course, then add its tasks.', addCourse: '+ Add course',
      nextDeadline: 'Next deadline', nothingDue: 'Nothing due', wellDone: 'Well done!',
      open: 'Open', overdue: 'Overdue', dueNextWeek: 'Due in next 7 days', completed: 'Completed',
      progressByCourse: 'Progress by course', search: 'Search tasks…', showCompleted: 'Show completed',
      noSearchResults: 'No tasks match your search.',
      noOpenTasks: 'No open tasks here. Add one with “New task”.',
      noDueDate: 'No due date', today: 'Today', next7Days: 'Next 7 days', later: 'Later',
      sampleNotice: 'The courses and tasks shown are sample data.', clearSample: 'Clear sample',
      taskDone: 'Marked as done', taskOpen: 'Marked as open', sampleCleared: 'Sample cleared',
      taskUpdated: 'Task updated', taskAdded: 'Task added', taskDeleted: 'Task deleted',
      courseUpdated: 'Course updated', courseAdded: 'Course added', courseDeleted: 'Course deleted',
      markOpen: 'Mark as open', markDone: 'Mark as done', noCourse: 'No course',
      taskNewTitle: 'New task', taskEditTitle: 'Edit task', taskWhat: 'What needs to be done?',
      taskPlaceholder: 'e.g. Problem set 4', course: 'Course', type: 'Type', dueDate: 'Due date',
      notes: 'Notes', notesPlaceholder: 'Questions 1–5, submit on Moodle', delete: 'Delete',
      cancel: 'Cancel', save: 'Save', courseNewTitle: 'New course', courseEditTitle: 'Edit course',
      courseName: 'Course name', coursePlaceholder: 'e.g. Calculus 1',
      courseInfo: 'Lecturer / details (optional)', courseInfoPlaceholder: 'Dr. Cohen · Mon 10:00',
      color: 'Color', deleteCourse: 'Delete course', deleteTasksConfirm: 'Also delete {count} tasks?',
      sure: 'Are you sure?', undo: 'Undo', noCourseTasks: 'No course',
      typeHomework: 'Homework', typeCatchUp: 'Catch up on lecture', typeTutorial: 'Tutorial',
      typeReading: 'Reading', typeProject: 'Project', typeQuiz: 'Quiz / Exam', typeOther: 'Other',
      todayRelative: 'Today', tomorrow: 'Tomorrow', yesterday: 'Yesterday',
      daysAgo: '{count} days ago', inDays: 'In {count} days',
      courseSummary: '{courses} courses · {tasks} open tasks', percentComplete: '{percent}% complete',
      nextDeadlineFor: 'Next deadline · {course}'
    },
    he: {
      appName: 'המשימות שלי', overview: 'סקירה כללית', myCourses: 'הקורסים שלי',
      newCourse: '+ קורס חדש', savedInBrowser: 'נשמר בדפדפן הזה', language: 'שפה',
      allTasks: 'כל המשימות', editCourse: 'עריכת קורס', newTask: '+ משימה חדשה',
      getStarted: 'מתחילים כאן', firstCourseHint: 'הוסיפו קורס ראשון ולאחר מכן משימות.',
      addCourse: '+ הוספת קורס', nextDeadline: 'המשימה הבאה', nothingDue: 'אין משימות להגשה',
      wellDone: 'כל הכבוד!', open: 'פתוחות', overdue: 'באיחור', dueNextWeek: 'להגשה בשבוע הקרוב',
      completed: 'הושלמו', progressByCourse: 'התקדמות לפי קורס', search: 'חיפוש משימות…',
      showCompleted: 'הצגת משימות שהושלמו', noSearchResults: 'לא נמצאו משימות התואמות לחיפוש.',
      noOpenTasks: 'אין כאן משימות פתוחות. אפשר להוסיף משימה חדשה.',
      noDueDate: 'ללא תאריך יעד', today: 'היום', next7Days: 'ב-7 הימים הקרובים',
      later: 'בהמשך', sampleNotice: 'הקורסים והמשימות שמוצגים הם נתונים לדוגמה.',
      clearSample: 'מחיקת נתוני דוגמה', taskDone: 'המשימה סומנה כהושלמה',
      taskOpen: 'המשימה סומנה כפתוחה', sampleCleared: 'נתוני הדוגמה נמחקו',
      taskUpdated: 'המשימה עודכנה', taskAdded: 'המשימה נוספה', taskDeleted: 'המשימה נמחקה',
      courseUpdated: 'הקורס עודכן', courseAdded: 'הקורס נוסף', courseDeleted: 'הקורס נמחק',
      markOpen: 'סימון כפתוחה', markDone: 'סימון כהושלמה', noCourse: 'ללא קורס',
      taskNewTitle: 'משימה חדשה', taskEditTitle: 'עריכת משימה', taskWhat: 'מה צריך לעשות?',
      taskPlaceholder: 'לדוגמה: תרגיל 4', course: 'קורס', type: 'סוג', dueDate: 'תאריך יעד',
      notes: 'הערות', notesPlaceholder: 'שאלות 1–5, הגשה באתר הקורס', delete: 'מחיקה',
      cancel: 'ביטול', save: 'שמירה', courseNewTitle: 'קורס חדש', courseEditTitle: 'עריכת קורס',
      courseName: 'שם הקורס', coursePlaceholder: 'לדוגמה: חשבון דיפרנציאלי',
      courseInfo: 'מרצה / פרטים (לא חובה)', courseInfoPlaceholder: 'ד״ר כהן · יום ב׳ 10:00',
      color: 'צבע', deleteCourse: 'מחיקת קורס', deleteTasksConfirm: 'למחוק גם {count} משימות?',
      sure: 'בטוחים?', undo: 'ביטול פעולה', noCourseTasks: 'ללא קורס',
      typeHomework: 'שיעורי בית', typeCatchUp: 'השלמת הרצאה', typeTutorial: 'תרגול',
      typeReading: 'קריאה', typeProject: 'פרויקט', typeQuiz: 'בוחן / מבחן', typeOther: 'אחר',
      todayRelative: 'היום', tomorrow: 'מחר', yesterday: 'אתמול',
      daysAgo: 'לפני {count} ימים', inDays: 'בעוד {count} ימים',
      courseSummary: '{courses} קורסים · {tasks} משימות פתוחות', percentComplete: '{percent}% הושלמו',
      nextDeadlineFor: 'המשימה הבאה · {course}'
    }
  };
  let language = 'en';
  try { if (localStorage.getItem(LANGUAGE_KEY) === 'he') language = 'he'; } catch (e) { /* ignore */ }

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
  const tr = (key, values = {}) => Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value), TEXT[language][key] || TEXT.en[key] || key
  );
  const typeLabel = type => tr({
    'Homework': 'typeHomework', 'Catch up on lecture': 'typeCatchUp', 'Tutorial': 'typeTutorial',
    'Reading': 'typeReading', 'Project': 'typeProject', 'Quiz / Exam': 'typeQuiz', 'Other': 'typeOther'
  }[type] || 'typeOther');
  function applyLanguage() {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.title = language === 'he' ? 'המשימות שלי באוניברסיטה' : 'My University Tasks';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = tr(el.dataset.i18nPlaceholder);
    });
    if ($('language')) $('language').value = language;
    $('tType').innerHTML = TYPES.map(type => `<option value="${esc(type)}">${esc(typeLabel(type))}</option>`).join('');
  }
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
  const fmtDate = s => new Date(s + 'T00:00').toLocaleDateString(language === 'he' ? 'he-IL' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const relative = n =>
    n === 0 ? tr('todayRelative') : n === 1 ? tr('tomorrow') : n === -1 ? tr('yesterday') :
    n < 0 ? tr('daysAgo', { count: -n }) : tr('inDays', { count: n });
  const courseById = id => state.courses.find(c => c.id === id) || { name: tr('noCourse'), color: '#888', id: '' };

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
      <div class="brand">${tr('appName')}</div>
      <label class="language"><span>${tr('language')}</span>
        <select id="language" aria-label="${tr('language')}">
          <option value="en">English</option><option value="he">עברית</option>
        </select>
      </label>
      <button class="nav ${cur ? '' : 'on'}" data-go="">
        <span class="dot" style="background:conic-gradient(${ring})"></span>${tr('overview')}<span class="n">${openCount()}</span>
      </button>
      <div class="sep">${tr('myCourses')}</div>
      ${state.courses.map(c => `
        <button class="nav ${cur === c.id ? 'on' : ''}" data-go="${c.id}">
          <span class="dot" style="background:${c.color}"></span>${esc(c.name)}<span class="n">${openCount(c.id)}</span>
        </button>`).join('')}
      <button class="ghost" id="addCourse">${tr('newCourse')}</button>
      <div class="sync">${tr('savedInBrowser')}</div>`;
    $('language').value = language;
    $('rail').querySelectorAll('[data-go]').forEach(b =>
      b.onclick = () => { location.hash = b.dataset.go ? 'course-' + b.dataset.go : 'all'; });
    $('addCourse').onclick = () => openCourse(null);
    $('language').onchange = e => {
      language = e.target.value;
      try { localStorage.setItem(LANGUAGE_KEY, language); } catch (e) { /* ignore */ }
      render();
    };
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
      ['late', tr('overdue'), g.late],
      ['today', tr('today'), g.today],
      ['week', tr('next7Days'), g.week],
      ['later', tr('later'), g.later],
      ['none', tr('noDueDate'), g.none],
      ['done', tr('completed'), showDone ? g.done : []]
    ];
  }

  function rowHTML(t, showCourse) {
    const c = courseById(t.course), d = daysUntil(t.due);
    return `
      <div class="row ${t.done ? 'done' : ''}" style="--c:${c.color}">
        <button class="tick" data-tick="${t.id}" aria-label="${t.done ? tr('markOpen') : tr('markDone')}">${t.done ? '✓' : ''}</button>
        <div>
          <button class="tt" data-edit="${t.id}">${esc(t.title)}</button>
          <div class="meta">
            ${showCourse ? `<span class="tag"><span class="dot sm" style="background:${c.color}"></span>${esc(c.name)}</span>` : ''}
            <span>${esc(typeLabel(t.type))}</span>
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
    applyLanguage();
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
          <h1>${c ? esc(c.name) : tr('allTasks')}</h1>
          <div class="sub">${c
            ? (c.info ? esc(c.info) + ' · ' : '') + tr('percentComplete', { percent: pct })
            : tr('courseSummary', { courses: state.courses.length, tasks: st.open })}</div>
        </div>
        <div class="head-actions">
          ${c ? `<button class="btn alt" id="editCourse">${tr('editCourse')}</button>` : ''}
          <button class="btn" id="addTask">${tr('newTask')}</button>
        </div>
      </div>`;

    if (!state.courses.length) {
      h += `<div class="empty"><h2>${tr('getStarted')}</h2>${tr('firstCourseHint')}<br><br>
            <button class="btn" id="firstCourse">${tr('addCourse')}</button></div>`;
      $('main').innerHTML = h;
      $('firstCourse').onclick = () => openCourse(null);
      $('addTask').onclick = () => openCourse(null);
      return;
    }

    h += `
      <div class="hero">
        <div class="next" style="--c:${nc ? nc.color : 'var(--ink)'}">
          ${next
            ? `<div class="lab">${cur ? tr('nextDeadline') : tr('nextDeadlineFor', { course: esc(nc.name) })}</div>
               <div><div class="big">${relative(daysUntil(next.due))}</div><div class="t">${esc(next.title)}</div></div>
               <div class="lab">${fmtDate(next.due)}</div>`
            : `<div class="lab">${tr('nextDeadline')}</div><div class="big calm">${tr('nothingDue')}</div><div class="lab">${tr('wellDone')}</div>`}
        </div>
        <div class="stats">
          <div class="stat"><b>${st.open}</b><span>${tr('open')}</span></div>
          <div class="stat ${st.late ? 'hot' : ''}"><b>${st.late}</b><span>${tr('overdue')}</span></div>
          <div class="stat"><b>${st.week}</b><span>${tr('dueNextWeek')}</span></div>
          <div class="stat"><b>${st.done}</b><span>${tr('completed')}</span></div>
        </div>
      </div>`;

    if (!cur) {
      h += `<h2 class="section-title">${tr('progressByCourse')}</h2><div class="bars">` +
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
        <input type="search" id="q" placeholder="${tr('search')}" aria-label="${tr('search')}" value="${esc(query)}">
        <label class="chk"><input type="checkbox" id="sd" ${showDone ? 'checked' : ''}>${tr('showCompleted')}</label>
      </div>`;

    const gs = groups(list).filter(g => g[2].length);
    h += gs.length
      ? gs.map(([k, name, arr]) =>
          `<section class="grp ${k}"><h3>${name}<small>${arr.length}</small></h3>${arr.map(t => rowHTML(t, !cur)).join('')}</section>`).join('')
      : `<div class="empty">${query ? tr('noSearchResults') : tr('noOpenTasks')}</div>`;

    if (state.sample) {
      h += `<div class="note">${tr('sampleNotice')}
            <button class="btn alt small" id="clearSample">${tr('clearSample')}</button></div>`;
    }

    $('main').innerHTML = h;

    // Bind events
    $('addTask').onclick = () => openTask(null, cur);
    if ($('editCourse')) $('editCourse').onclick = () => openCourse(cur);
    if ($('clearSample')) $('clearSample').onclick = () => {
      snapshot(); state = { courses: [], tasks: [] }; location.hash = 'all'; commit(tr('sampleCleared'));
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
      commit(tr(t.done ? 'taskDone' : 'taskOpen'));
    });
    $('main').querySelectorAll('[data-edit]').forEach(b => b.onclick = () => openTask(b.dataset.edit));
  }

  // ---------- Task dialog ----------
  function openTask(id, courseId) {
    if (!state.courses.length) return openCourse(null);
    editingTask = id;
    const t = id ? state.tasks.find(x => x.id === id) : null;
    $('tCourse').innerHTML = state.courses.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    $('taskTitle').textContent = tr(t ? 'taskEditTitle' : 'taskNewTitle');
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
    commit(tr(editingTask ? 'taskUpdated' : 'taskAdded'));
  };
  $('tCancel').onclick = () => $('taskDlg').close();
  $('tDel').onclick = () => {
    snapshot();
    state.tasks = state.tasks.filter(x => x.id !== editingTask);
    $('taskDlg').close();
    commit(tr('taskDeleted'));
  };

  // ---------- Course dialog ----------
  function openCourse(id) {
    editingCourse = id;
    const c = id ? courseById(id) : null;
    $('courseTitle').textContent = tr(c ? 'courseEditTitle' : 'courseNewTitle');
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
      `<button type="button" class="sw ${c === pickColor ? 'on' : ''}" style="background:${c}" data-c="${c}" aria-label="${tr('color')} ${c}"></button>`).join('');
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
    commit(tr(editingCourse ? 'courseUpdated' : 'courseAdded'));
  };
  $('cCancel').onclick = () => $('courseDlg').close();

  // Delete needs a second click to confirm
  $('cDel').onclick = () => {
    const btn = $('cDel');
    const count = state.tasks.filter(t => t.course === editingCourse).length;
    if (btn.dataset.arm !== editingCourse) {
      btn.dataset.arm = editingCourse;
      btn.textContent = count ? tr('deleteTasksConfirm', { count }) : tr('sure');
      return;
    }
    btn.dataset.arm = ''; btn.textContent = tr('deleteCourse');
    snapshot();
    state.tasks = state.tasks.filter(t => t.course !== editingCourse);
    state.courses = state.courses.filter(c => c.id !== editingCourse);
    $('courseDlg').close();
    location.hash = 'all';
    commit(tr('courseDeleted'));
  };
  $('courseDlg').addEventListener('close', () => { $('cDel').dataset.arm = ''; $('cDel').textContent = tr('deleteCourse'); });

  // ---------- Start ----------
  applyLanguage();
  load();
  render();
})();
