// ===== STATE =====
const S={
  step:1,dest:null,route:null,routeDetails:{},
  days:3,startDate:null,teamSize:10,
  dayPlans:{},
  recipients:[],
  todayDay:1,
  company:JSON.parse(localStorage.getItem('tm_company')||'{}'),
  employees:JSON.parse(localStorage.getItem('tm_employees')||'[]'),
  plans:JSON.parse(localStorage.getItem('tm_plans')||'[]')
};

const LOADER_MSGS=[
  'Booking your seats','Preparing routes','Loading destination data',
  'Checking availability','Curating menus','Scanning locations',
  'Building itinerary','Preparing the map','Almost ready'
];

// ===== BOOT =====
document.addEventListener('DOMContentLoaded',()=>{
  // Initial loader
  const msgs=['Loading WanderWave','Preparing your workspace','Fetching destinations'];
  let mi=0;
  const lmEl=document.getElementById('loader-msg');
  const lInt=setInterval(()=>{if(++mi<msgs.length)lmEl.textContent=msgs[mi];},700);
  setTimeout(()=>{clearInterval(lInt);document.getElementById('loader').classList.add('hidden');},2200);

  buildParticles();
  buildHomeDest();
  buildExplore();
  buildDestGrid();
  buildRouteGrid();
  buildProgressStrip();
  loadProfile();
  loadEmpList();
  setDefaultDate();
  loadPlans();
  updateStats();
  showPage('home');

  // nav shadow + scrolled class
  window.addEventListener('scroll',()=>{
    const nav=document.getElementById('nav');
    if(scrollY>10){
      nav.style.boxShadow='0 4px 20px rgba(11,16,34,0.1)';
      nav.classList.add('scrolled');
    } else {
      nav.style.boxShadow='';
      nav.classList.remove('scrolled');
    }
  });
});

// ===== GEOMETRIC PARTICLES =====
function buildParticles(){
  const el=document.getElementById('hero-particles');
  const colors=['rgba(200,151,58,0.5)','rgba(67,56,202,0.5)','rgba(109,40,217,0.4)','rgba(255,255,255,0.25)','rgba(200,151,58,0.35)'];
  for(let i=0;i<22;i++){
    const p=document.createElement('div');
    p.className='hparticle';
    const size=(2+Math.random()*4)+'px';
    const col=colors[Math.floor(Math.random()*colors.length)];
    p.style.cssText=`
      left:${Math.random()*100}%;
      bottom:${-5+Math.random()*20}%;
      width:${size};height:${size};
      background:${col};
      animation-duration:${10+Math.random()*14}s;
      animation-delay:${Math.random()*12}s;
    `;
    el.appendChild(p);
  }
}

// ===== STEP TRANSITION LOADER =====
let stepLoaderEl=null;
function showStepLoader(emoji,msg,cb){
  if(!stepLoaderEl){
    stepLoaderEl=document.createElement('div');
    stepLoaderEl.id='step-loader';
    stepLoaderEl.innerHTML=`<div class="sl-inner">
      <div class="sl-spinner"><span class="sl-emoji" id="sl-emoji"></span></div>
      <div class="sl-msg" id="sl-msg"></div>
    </div>`;
    document.body.appendChild(stepLoaderEl);
  }
  document.getElementById('sl-emoji').textContent=emoji;
  document.getElementById('sl-msg').textContent=msg;
  stepLoaderEl.classList.add('show');
  setTimeout(()=>{stepLoaderEl.classList.remove('show');if(cb)cb();},800);
}

// ===== PAGE NAV =====
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.npill').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+id)?.classList.add('active');
  document.getElementById('np-'+id)?.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='myplans')loadPlans();
}

// ===== HOME DEST =====
function buildHomeDest(){
  const picks=['goa','manali','jaipur','udaipur','rishikesh','andaman'];
  document.getElementById('home-dest-grid').innerHTML=picks.map(id=>{
    const d=DESTINATIONS.find(x=>x.id===id);
    return `<div class="hd-card" onclick="quickPlan('${id}')">
      <div class="hd-img" style="background:${d.bg}">${d.emoji}</div>
      <div class="hd-body"><h4>${d.name}</h4><small>${d.state}</small><br/><span class="hd-vibe">${d.vibe}</span></div>
    </div>`;
  }).join('');
}
function quickPlan(id){showPage('planner');selectDest(id);}

// ===== EXPLORE =====
function buildExplore(){
  document.getElementById('explore-cards').innerHTML=DESTINATIONS.map(d=>`
    <div class="ec-card" id="ecc-${d.id}" data-tags="${d.tags.join(',')}">
      <div class="ec-img" style="background:${d.bg}">${d.emoji}</div>
      <div class="ec-body">
        <h3>${d.name}</h3>
        <div class="ec-loc">📍 ${d.state}</div>
        <div class="ec-tags">${d.tags.map(t=>`<span class="ec-tag">${t}</span>`).join('')}</div>
        <p style="font-size:0.8rem;color:var(--muted);margin-bottom:0.85rem">${d.desc}</p>
        <button class="ec-btn" onclick="quickPlan('${d.id}')">Plan a Trip Here</button>
      </div>
    </div>`).join('');
}
function filterDest(tag,btn){
  document.querySelectorAll('.fchip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  document.querySelectorAll('.ec-card').forEach(c=>{
    c.classList.toggle('hidden',tag!=='all'&&!c.dataset.tags.includes(tag));
  });
}

// ===== PROGRESS STRIP =====
function buildProgressStrip(){
  const steps=[{n:1,lbl:'Destination',e:'🗺️'},{n:2,lbl:'Route',e:'✈️'},{n:3,lbl:'Duration',e:'📅'},{n:4,lbl:'Day Plans',e:'🏨'},{n:5,lbl:'Finish',e:'🎉'}];
  const el=document.getElementById('pp-steps');
  el.innerHTML=steps.map((s,i)=>`
    ${i>0?`<div class="pp-line" id="ppl${i}"></div>`:''}
    <div class="pp-step" id="pps${s.n}" onclick="safeGoStep(${s.n})">
      <div class="ps-circle">${s.n}</div>
      <div class="ps-label">${s.lbl}</div>
    </div>`).join('');
  updateProgress(1);
}
function updateProgress(n){
  for(let i=1;i<=5;i++){
    const el=document.getElementById('pps'+i);
    if(!el)continue;
    el.classList.remove('active','done');
    if(i<n)el.classList.add('done');
    else if(i===n)el.classList.add('active');
    if(i>1){const line=document.getElementById('ppl'+(i-1));if(line)line.classList.toggle('done',i<=n);}
  }
  document.getElementById('pp-fill').style.width=((n-1)/4*100)+'%';
}
function safeGoStep(n){if(n<=S.step)goStep(n);}

// ===== STEP NAV =====
const STEP_LOADERS=[null,['🗺️','Finding destinations'],['✈️','Preparing travel options'],['📅','Setting the calendar'],['🏨','Loading day planner'],['🎉','Building your journey map']];
function goStep(n){
  if(n>1&&n===2&&!S.dest){showToast('Select a destination first');return;}
  const loader=STEP_LOADERS[n];
  showStepLoader(loader[0],loader[1],()=>{
    document.querySelectorAll('.pstep').forEach(s=>s.classList.remove('active'));
    document.getElementById('step-'+n)?.classList.add('active');
    if(n===4)buildDayPlanner();
    if(n===5){buildJourneyMap();buildReview();buildTodaysPanel();renderEmailPills();buildPaymentSection();}
    updateProgress(n);S.step=n;
    window.scrollTo({top:60,behavior:'smooth'});
  });
}

// ===== DEST =====
function buildDestGrid(){
  document.getElementById('dest-grid').innerHTML=DESTINATIONS.map(d=>`
    <div class="dest-card" id="dc-${d.id}" onclick="selectDest('${d.id}')">
      <div class="dc-img" style="background:${d.bg}">${d.emoji}</div>
      <div class="dc-body"><h4>${d.name}</h4><small>${d.state}</small></div>
    </div>`).join('');
}
function selectDest(id){
  S.dest=id;
  document.querySelectorAll('.dest-card').forEach(c=>c.classList.remove('selected'));
  document.getElementById('dc-'+id)?.classList.add('selected');
  const d=DESTINATIONS.find(x=>x.id===id);
  showToast(`${d.emoji} ${d.name} selected`);
  setTimeout(()=>goStep(2),450);
}

// ===== ROUTE =====
const ROUTE_APPS={
  flight:{
    name:'ixigo Flights',icon:'✈️',logo:'🟠',brand:'ixigo',
    color:'#e8524a',bg:'rgba(232,82,74,0.08)',border:'rgba(232,82,74,0.2)',
    note:'Search real flights on ixigo — compare fares & book directly.',
    buildUrl:(from,to,date)=>{
      const d=date||new Date().toISOString().split('T')[0];
      const dd=d.replace(/-/g,'');
      return `https://www.ixigo.com/search/result/flight/${encodeURIComponent(from||'BOM')}/${encodeURIComponent(to||'GOI')}/${dd}/-/1/1/0/0/Economy/0`;
    }
  },
  train:{
    name:'IRCTC Rail Connect',icon:'🚂',logo:'🔵',brand:'IRCTC',
    color:'#1a56db',bg:'rgba(26,86,219,0.08)',border:'rgba(26,86,219,0.2)',
    note:'Book train tickets on IRCTC — India\'s official rail booking portal.',
    buildUrl:(from,to)=>`https://www.irctc.co.in/nget/train-search?fromStation=${encodeURIComponent((from||'PUNE').toUpperCase())}&toStation=${encodeURIComponent((to||'CSMT').toUpperCase())}`
  },
  bus:{
    name:'Abhibus',icon:'🚌',logo:'🟡',brand:'Abhibus',
    color:'#d97706',bg:'rgba(217,119,6,0.08)',border:'rgba(217,119,6,0.2)',
    note:'Find & book bus tickets on Abhibus — top operators, Volvo & sleeper options.',
    buildUrl:(from,to)=>`https://www.abhibus.com/bus/${encodeURIComponent((from||'pune').toLowerCase().replace(/\s+/g,'-'))}/${encodeURIComponent((to||'mumbai').toLowerCase().replace(/\s+/g,'-'))}/`
  },
  car:{
    name:'Uber',icon:'🚗',logo:'⚫',brand:'Uber',
    color:'#000000',bg:'rgba(0,0,0,0.06)',border:'rgba(0,0,0,0.15)',
    note:'Book cabs or schedule rides on Uber — great for team pickups & outstation trips.',
    buildUrl:(from,to)=>`https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(from||'Pune, Maharashtra')}&dropoff[formatted_address]=${encodeURIComponent(to||'Mumbai, Maharashtra')}`
  }
};

function buildRouteGrid(){
  document.getElementById('route-big-grid').innerHTML=ROUTES.map(r=>{
    const app=ROUTE_APPS[r.id];
    return `<div class="route-card" id="rc-${r.id}" onclick="selectRoute('${r.id}')">
      <span class="rc-ico">${r.icon}</span>
      <h4>${r.name}</h4>
      <p>${r.desc}</p>
      <div class="rc-app-tag" style="background:${app.bg};border-color:${app.border};color:${app.color}">
        ${app.logo} ${app.brand}
      </div>
    </div>`;
  }).join('');
}

function selectRoute(id){
  S.route=id;
  document.querySelectorAll('.route-card').forEach(c=>c.classList.remove('selected'));
  document.getElementById('rc-'+id)?.classList.add('selected');
  const route=ROUTES.find(r=>r.id===id);
  const app=ROUTE_APPS[id];
  const dest=DESTINATIONS.find(d=>d.id===S.dest);
  const destName=dest?dest.name:'Destination';
  const box=document.getElementById('route-detail');

  // Native booking form icons per mode
  const modeIcons={flight:'✈️',train:'🚂',bus:'🚌',car:'🚗'};
  const modeTips={
    flight:'Enter your departure city/airport and preferred airline. We\'ll log your flight details for the trip plan.',
    train:'Enter your departure station and train preference. All booking confirmation details are saved here.',
    bus:'Enter your boarding city and operator. Bus details will be saved to your corporate trip plan.',
    car:'Enter your pickup location and vehicle type. Cab/fleet details will be saved to your trip plan.'
  };

  box.innerHTML=`
    <div class="rd-card">
      <!-- Header -->
      <div class="rd-card-header" style="border-color:${app.border}">
        <div class="rd-header-left">
          <div class="rd-app-pill" style="background:${app.bg};border-color:${app.border};color:${app.color}">
            ${modeIcons[id]} <strong>${route.name}</strong>
          </div>
          <div>
            <div class="rd-card-title">${route.icon} ${route.name}</div>
            <div class="rd-card-sub">Fill in your travel details below — everything stays within WanderWave.</div>
          </div>
        </div>
        <div class="rd-ww-badge">🌊 WanderWave Booking</div>
      </div>

      <!-- Journey Row -->
      <div class="rd-journey-row">
        <div class="rd-journey-from">
          <label class="rd-jlabel">📍 Starting From</label>
          <input type="text" id="rd-from-input" class="rd-journey-input"
            placeholder="${id==='flight'?'City or Airport, e.g. Pune / PNQ':id==='train'?'Station name, e.g. Pune Junction':id==='bus'?'City name, e.g. Pune':'Pickup city or address'}"
            oninput="S.routeDetails.from=this.value.trim()"/>
        </div>
        <div class="rd-journey-arrow">
          <div class="rd-arrow-line"></div>
          <div class="rd-arrow-icon">${route.icon}</div>
          <div class="rd-arrow-line"></div>
        </div>
        <div class="rd-journey-to">
          <label class="rd-jlabel">🏁 Going To</label>
          <div class="rd-journey-dest">${dest?dest.emoji:''} ${destName}</div>
        </div>
      </div>

      <!-- Native Booking Form -->
      <div class="rd-native-form">
        <div class="rd-native-header">
          <span class="rd-native-icon">${modeIcons[id]}</span>
          <div>
            <div class="rd-native-title">Travel Details</div>
            <div class="rd-native-tip">${modeTips[id]}</div>
          </div>
        </div>

        <div class="rd-native-grid">
          <!-- Travel Date -->
          <div class="rd-group">
            <label>📅 Travel Date</label>
            <input type="date" id="rf-traveldate" class="rd-native-input"
              value="${(document.getElementById('start-date')?.value)||new Date().toISOString().split('T')[0]}"/>
          </div>
          <!-- Passengers -->
          <div class="rd-group">
            <label>👥 No. of Travellers</label>
            <input type="number" id="rf-passengers" class="rd-native-input" min="1" max="500"
              value="${S.teamSize||10}" placeholder="e.g. 10"/>
          </div>
          ${route.fields.map(f=>`
          <div class="rd-group">
            <label>${f.label}</label>
            ${f.type==='select'
              ?`<select id="rf-${f.id}" class="rd-native-input">${f.options.map(o=>`<option>${o}</option>`).join('')}</select>`
              :`<input type="text" id="rf-${f.id}" class="rd-native-input" placeholder="${f.placeholder||''}"/>`}
          </div>`).join('')}
          <!-- Budget per person -->
          <div class="rd-group">
            <label>💰 Budget per Person (₹)</label>
            <input type="text" id="rf-budget" class="rd-native-input" placeholder="e.g. 2,500"/>
          </div>
          <!-- Notes -->
          <div class="rd-group rd-group-full">
            <label>📝 Special Requirements</label>
            <input type="text" id="rf-notes" class="rd-native-input" placeholder="e.g. wheelchair access, veg meals, luggage limit…"/>
          </div>
        </div>

        <!-- Status badge -->
        <div class="rd-native-status" id="rd-booking-status" style="display:none">
          <span class="rd-status-dot"></span>
          <span id="rd-status-msg">Details saved</span>
        </div>
      </div>

      <!-- Confirm -->
      <div class="rd-confirm-strip">
        <div class="rd-confirm-info">
          <span class="rd-confirm-badge" style="background:${app.bg};border-color:${app.border};color:${app.color}">${modeIcons[id]} ${route.name}</span>
          <span>→ <strong>${destName}</strong></span>
        </div>
        <button class="rd-confirm-btn" onclick="confirmRoute('${id}')">✦ Save & Continue →</button>
      </div>
    </div>
  `;
  box.scrollIntoView({behavior:'smooth',block:'nearest'});
}

// Removed: launchBookingSearch, showIframeLoader, showBookingFallback, openInNewTab, refreshBookingEmbed, updateBookingEmbed
// All booking is now handled natively within WanderWave — no external iframes.

function confirmRoute(id){
  const from=document.getElementById("rd-from-input")?.value.trim()||S.routeDetails.from||"";
  if(!from){showToast("Please enter your starting point");document.getElementById("rd-from-input")?.focus();return;}
  S.routeDetails.from=from;
  const traveldate=document.getElementById("rf-traveldate");
  const passengers=document.getElementById("rf-passengers");
  const budget=document.getElementById("rf-budget");
  const notes=document.getElementById("rf-notes");
  if(traveldate)S.routeDetails.traveldate=traveldate.value||"";
  if(passengers)S.routeDetails.passengers=passengers.value||S.teamSize;
  if(budget)S.routeDetails.budget=budget.value||"";
  if(notes)S.routeDetails.specialNotes=notes.value||"";
  const r=ROUTES.find(x=>x.id===id);
  if(r)r.fields.forEach(f=>{
    const el=document.getElementById("rf-"+f.id);
    if(el)S.routeDetails[f.id]=el.value||"";
  });
  showToast("Route confirmed u2713");
  goStep(3);
}

// ===== DURATION =====
function chDays(d){
  S.days=Math.max(1,Math.min(14,S.days+d));
  document.getElementById('days-n').textContent=S.days;
  document.getElementById('days-slider').value=S.days;
  updateReturn();
}
function sliderDays(v){
  S.days=parseInt(v);
  document.getElementById('days-n').textContent=S.days;
  updateReturn();
}
function setDays(n){
  S.days=n;document.getElementById('days-n').textContent=n;
  document.getElementById('days-slider').value=n;
  document.querySelectorAll('.dpreset').forEach(b=>b.classList.remove('sel'));
  updateReturn();
}
function chTeam(d){
  S.teamSize=Math.max(1,Math.min(500,S.teamSize+d));
  document.getElementById('team-n').textContent=S.teamSize;
}
function setDefaultDate(){
  const d=new Date();d.setDate(d.getDate()+14);
  document.getElementById('start-date').value=d.toISOString().split('T')[0];
  document.getElementById('start-date').addEventListener('change',updateReturn);
  updateReturn();
}
function updateReturn(){
  const v=document.getElementById('start-date')?.value;
  if(!v)return;
  const end=new Date(v);end.setDate(end.getDate()+S.days-1);
  document.getElementById('return-label').textContent=
    `↩ Return: ${end.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}`;
}

// ===== DAY PLANNER =====
function buildDayPlanner(){
  S.startDate=document.getElementById('start-date').value;
  const dest=DESTINATIONS.find(d=>d.id===S.dest);
  const acts=ACTIVITIES[S.dest]||[];
  const food=FOOD[S.dest]||DEFAULT_FOOD;
  const strip=document.getElementById('day-chips');
  const panels=document.getElementById('day-panels');
  strip.innerHTML='';panels.innerHTML='';
  for(let i=1;i<=S.days;i++){
    if(!S.dayPlans[i])S.dayPlans[i]={stay:null,tier:'midrange',acts:[],breakfast:null,lunch:null,dinner:null,notes:''};
    const chip=document.createElement('button');
    chip.className='day-chip'+(i===1?' active':'');
    chip.innerHTML=`Day ${i}`;chip.onclick=()=>switchDay(i);
    strip.appendChild(chip);
    const panel=document.createElement('div');
    panel.id='day-panel-'+i;panel.className='day-panel'+(i===1?' active':'');
    panel.innerHTML=buildDayHTML(i,dest,acts,food);
    panels.appendChild(panel);
  }
}
function buildDayHTML(i,dest,acts,food){
  const p=S.dayPlans[i];
  return `<div class="dp-card">
    <div class="dp-top">
      <div class="dp-daynum">${i}</div>
      <div><h3>${dest?dest.emoji+' '+dest.name:'Day'} — Day ${i}</h3><small>${getDateStr(i)}</small></div>
    </div>
    <div class="dp-sec">🏨 Accommodation</div>
    <div class="tier-row">
      ${['budget','midrange','luxury'].map(t=>`<button class="tier-btn${p.tier===t?' sel':''}" onclick="setTier(${i},'${t}',this)">${t==='budget'?'Budget 💰':t==='midrange'?'Mid-Range 🌟':'Luxury 👑'}</button>`).join('')}
    </div>
    <div class="opts-grid" id="stay-grid-${i}">${buildStayOpts(i,p.tier)}</div>
    <div class="dp-sec">🎯 Activities</div>
    <div class="acts-grid">${acts.map((a,idx)=>`
      <div class="act-card${p.acts.includes(idx)?' sel':''}" id="ac-${i}-${idx}" onclick="toggleAct(${i},${idx})">
        <div class="ai">${a.icon}</div><h5>${a.name}</h5><p>${a.desc}</p>
      </div>`).join('')}
    </div>
    <div class="dp-sec">🍽️ Food Menu</div>
    <div class="meal-lbl">🌅 Breakfast</div>
    <div class="food-grid">${food.breakfast.map((f,idx)=>`
      <div class="food-card${p.breakfast===idx?' sel':''}" id="fb-${i}-${idx}" onclick="pickFood(${i},'breakfast',${idx})">
        <div class="fi">${f.icon}</div><div class="fn">${f.name}</div><div class="fd">${f.desc}</div>
      </div>`).join('')}</div>
    <div class="meal-lbl">☀️ Lunch</div>
    <div class="food-grid">${food.lunch.map((f,idx)=>`
      <div class="food-card${p.lunch===idx?' sel':''}" id="fl-${i}-${idx}" onclick="pickFood(${i},'lunch',${idx})">
        <div class="fi">${f.icon}</div><div class="fn">${f.name}</div><div class="fd">${f.desc}</div>
      </div>`).join('')}</div>
    <div class="meal-lbl">🌙 Dinner</div>
    <div class="food-grid">${food.dinner.map((f,idx)=>`
      <div class="food-card${p.dinner===idx?' sel':''}" id="fd-${i}-${idx}" onclick="pickFood(${i},'dinner',${idx})">
        <div class="fi">${f.icon}</div><div class="fn">${f.name}</div><div class="fd">${f.desc}</div>
      </div>`).join('')}</div>
    <div class="dp-sec">📝 Notes</div>
    <textarea class="notes-ta" id="nt-${i}" placeholder="Any special instructions for this day..." onchange="S.dayPlans[${i}].notes=this.value">${p.notes}</textarea>
  </div>`;
}
function buildStayOpts(day,tier){
  return (STAY[tier]||STAY.midrange).map(s=>`
    <div class="opt-card${S.dayPlans[day].stay===s.id?' sel':''}" id="so-${day}-${s.id}" onclick="pickStay(${day},'${s.id}')">
      <div class="oi">${s.icon}</div><h5>${s.name}</h5><p>${s.desc}</p><div class="op">${s.price}</div>
    </div>`).join('');
}
function setTier(day,tier,btn){
  S.dayPlans[day].tier=tier;S.dayPlans[day].stay=null;
  btn.closest('.dp-card').querySelectorAll('.tier-btn').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  document.getElementById('stay-grid-'+day).innerHTML=buildStayOpts(day,tier);
}
function pickStay(day,id){
  S.dayPlans[day].stay=id;
  document.querySelectorAll(`[id^="so-${day}-"]`).forEach(e=>e.classList.remove('sel'));
  document.getElementById(`so-${day}-${id}`)?.classList.add('sel');
  document.querySelectorAll('.day-chip')[day-1]?.classList.add('done');
}
function toggleAct(day,idx){
  const a=S.dayPlans[day].acts,p=a.indexOf(idx);
  if(p===-1)a.push(idx);else a.splice(p,1);
  document.getElementById(`ac-${day}-${idx}`)?.classList.toggle('sel',a.includes(idx));
}
function pickFood(day,meal,idx){
  S.dayPlans[day][meal]=idx;
  const pre=meal==='breakfast'?'fb':meal==='lunch'?'fl':'fd';
  document.querySelectorAll(`[id^="${pre}-${day}-"]`).forEach(e=>e.classList.remove('sel'));
  document.getElementById(`${pre}-${day}-${idx}`)?.classList.add('sel');
}
function switchDay(i){
  document.querySelectorAll('.day-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.day-chip').forEach(c=>c.classList.remove('active'));
  document.getElementById('day-panel-'+i)?.classList.add('active');
  document.querySelectorAll('.day-chip')[i-1]?.classList.add('active');
}
function getDateStr(day){
  if(!S.startDate)return '';
  const d=new Date(S.startDate);d.setDate(d.getDate()+day-1);
  return d.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
}

// ===== JOURNEY MAP =====
function buildJourneyMap(){
  const dest=DESTINATIONS.find(d=>d.id===S.dest);
  const route=ROUTES.find(r=>r.id===S.route);
  const food=FOOD[S.dest]||DEFAULT_FOOD;
  const acts=ACTIVITIES[S.dest]||[];
  const dayW=100;const pad=40;const totalW=Math.max(600,S.days*dayW+pad*2);
  const H=280;
  let nodes=[];
  for(let i=1;i<=S.days;i++){
    const p=S.dayPlans[i]||{};
    const stayOpts=STAY[p.tier||'midrange']||STAY.midrange;
    const stay=stayOpts.find(s=>s.id===p.stay);
    const actList=(p.acts||[]).map(idx=>acts[idx]?.name).filter(Boolean);
    const bf=p.breakfast!=null?food.breakfast[p.breakfast]:null;
    nodes.push({day:i,x:pad+(i-1)*dayW+dayW/2,stay,acts:actList,bf,date:getDateStr(i),p});
  }
  // Use refined colours
  const palette=['#4338ca','#c8973a','#0c8c7a','#2563eb','#6d28d9','#0891b2','#7c3aed'];
  const svgLines=nodes.slice(1).map((n,i)=>{
    const prev=nodes[i];
    return `<line x1="${prev.x}" y1="90" x2="${n.x}" y2="90" stroke="#dde3ed" stroke-width="1.5" stroke-dasharray="5 4"/>`;
  }).join('');
  const svgNodes=nodes.map(n=>{
    const col=palette[(n.day-1)%palette.length];
    const stayTxt=n.stay?n.stay.name.split('/')[0].trim():'No stay';
    const actsTxt=n.acts.length?n.acts.slice(0,2).join(', ')+(n.acts.length>2?'…':''):'Free day';
    const bfTxt=n.bf?n.bf.name:'—';
    return `<g>
      <circle cx="${n.x}" cy="90" r="22" fill="${col}" opacity="0.1" stroke="${col}" stroke-width="1.5"/>
      <circle cx="${n.x}" cy="90" r="13" fill="${col}"/>
      <text x="${n.x}" y="94" text-anchor="middle" fill="white" font-size="10" font-weight="700" font-family="Outfit,sans-serif">D${n.day}</text>
      <text x="${n.x}" y="132" text-anchor="middle" fill="#364156" font-size="9" font-weight="600" font-family="Outfit,sans-serif">${stayTxt.length>12?stayTxt.slice(0,12)+'…':stayTxt}</text>
      <text x="${n.x}" y="148" text-anchor="middle" fill="#718096" font-size="8" font-family="Outfit,sans-serif">${actsTxt.length>16?actsTxt.slice(0,16)+'…':actsTxt}</text>
      <text x="${n.x}" y="164" text-anchor="middle" fill="${col}" font-size="8" font-family="Outfit,sans-serif">${bfTxt.length>14?bfTxt.slice(0,14)+'…':bfTxt}</text>
      <line x1="${n.x}" y1="112" x2="${n.x}" y2="120" stroke="${col}" stroke-width="1" stroke-dasharray="2 2"/>
    </g>`;
  }).join('');
  const startX=20;const endX=totalW-20;
  const routeIcon=route?route.icon:'🚗';
  const destEmoji=dest?dest.emoji:'📍';
  const svg=`<svg class="jm-svg" viewBox="0 0 ${totalW} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${totalW}" height="${H}" fill="#f5f4f1" rx="10"/>
    <rect x="0" y="18" width="${totalW}" height="32" fill="#4338ca" opacity="0.05"/>
    <text x="${totalW/2}" y="40" text-anchor="middle" fill="#4338ca" font-size="11" font-weight="700" font-family="Outfit,sans-serif" letter-spacing="1">
      ${destEmoji} ${dest?dest.name:''}, ${dest?dest.state:''} — ${S.days} Day Trip ${routeIcon}
    </text>
    <text x="${startX+8}" y="95" font-size="16" text-anchor="middle">🏠</text>
    <line x1="${startX+18}" y1="90" x2="${nodes[0]?.x-22}" y2="90" stroke="#dde3ed" stroke-width="1.5" stroke-dasharray="5 4"/>
    ${svgLines}
    <line x1="${nodes[nodes.length-1]?.x+22}" y1="90" x2="${endX-18}" y2="90" stroke="#dde3ed" stroke-width="1.5" stroke-dasharray="5 4"/>
    ${svgNodes}
    <text x="${endX-8}" y="95" font-size="16" text-anchor="middle">🏠</text>
    <rect x="10" y="${H-36}" width="${totalW-20}" height="26" fill="white" rx="6" opacity="0.8"/>
    <text x="22" y="${H-19}" fill="#718096" font-size="8.5" font-family="Outfit,sans-serif">
      ● Node = Day  |  Label = Stay  |  Bottom = Breakfast  |  ${route?route.icon+' '+route.name:'Travel mode'}
    </text>
  </svg>`;
  document.getElementById('journey-map').innerHTML=svg;
}

// ===== REVIEW =====
function buildReview(){
  const dest=DESTINATIONS.find(d=>d.id===S.dest);
  const route=ROUTES.find(r=>r.id===S.route);
  const food=FOOD[S.dest]||DEFAULT_FOOD;
  const acts=ACTIVITIES[S.dest]||[];
  document.getElementById('review-header').innerHTML=`
    <div class="rhc-dest">${dest?dest.emoji+' '+dest.name:'Trip'}</div>
    <div class="rhc-meta">
      <div class="rhc-item"><small>Destination</small><span>${dest?dest.name+', '+dest.state:'—'}</span></div>
      <div class="rhc-item"><small>Start Date</small><span>${S.startDate?new Date(S.startDate).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}):'—'}</span></div>
      <div class="rhc-item"><small>Duration</small><span>${S.days} Days</span></div>
      <div class="rhc-item"><small>Travel</small><span>${route?route.icon+' '+route.name:'—'}</span></div>
    </div>`;
  let html='';
  const borderColors=['#4338ca','#c8973a','#0c8c7a','#2563eb','#6d28d9','#0891b2'];
  for(let i=1;i<=S.days;i++){
    const p=S.dayPlans[i]||{};
    const stayOpts=STAY[p.tier||'midrange']||STAY.midrange;
    const stay=stayOpts.find(s=>s.id===p.stay);
    const actNms=(p.acts||[]).map(idx=>acts[idx]?.name).filter(Boolean);
    const bf=p.breakfast!=null?food.breakfast[p.breakfast]:null;
    const ln=p.lunch!=null?food.lunch[p.lunch]:null;
    const dn=p.dinner!=null?food.dinner[p.dinner]:null;
    html+=`<div class="review-day-card" style="border-left-color:${borderColors[(i-1)%borderColors.length]}">
      <div class="rdc-head"><h4>Day ${i}</h4><span class="rdc-date">${getDateStr(i)}</span></div>
      <div class="tags">${stay?`<span class="rtag">${stay.icon} ${stay.name}</span>`:''}
        ${actNms.map(a=>`<span class="rtag">🎯 ${a}</span>`).join('')}
      </div>
      <div class="tags">
        ${bf?`<span class="rtag">🌅 ${bf.name}</span>`:''}
        ${ln?`<span class="rtag">☀️ ${ln.name}</span>`:''}
        ${dn?`<span class="rtag">🌙 ${dn.name}</span>`:''}
      </div>
      ${p.notes?`<div style="font-size:0.78rem;color:var(--muted);margin-top:0.4rem;font-style:italic">📝 ${p.notes}</div>`:''}
    </div>`;
  }
  document.getElementById('review-days').innerHTML=html;
}

// ===== TODAY'S UPDATE PANEL =====
function buildTodaysPanel(){
  const sel=document.getElementById('todays-day-select');
  sel.innerHTML=Array.from({length:S.days},(_,i)=>`
    <button class="tday-btn${i===0?' sel':''}" onclick="switchTodayDay(${i+1},this)">Day ${i+1}</button>`).join('');
  S.todayDay=1;
  renderTodaysMiniPanel(1);
}
function switchTodayDay(day,btn){
  S.todayDay=day;
  document.querySelectorAll('.tday-btn').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel');
  renderTodaysMiniPanel(day);
}
function renderTodaysMiniPanel(day){
  if(!S.dayPlans[day])S.dayPlans[day]={stay:null,tier:'midrange',acts:[],breakfast:null,lunch:null,dinner:null,notes:''};
  const p=S.dayPlans[day];
  const dest=DESTINATIONS.find(d=>d.id===S.dest);
  const acts=ACTIVITIES[S.dest]||[];
  const food=FOOD[S.dest]||DEFAULT_FOOD;
  const stayOpts=STAY[p.tier||'midrange']||STAY.midrange;
  const currentStay=stayOpts.find(s=>s.id===p.stay);
  const currentActs=(p.acts||[]).map(i=>acts[i]?.name).filter(Boolean);
  const bf=p.breakfast!=null?food.breakfast[p.breakfast]:null;
  const ln=p.lunch!=null?food.lunch[p.lunch]:null;
  const dn=p.dinner!=null?food.dinner[p.dinner]:null;
  document.getElementById('todays-panel').innerHTML=`
    <div style="background:var(--bg);border-radius:12px;padding:1rem;font-size:0.85rem;">
      <div style="font-weight:700;color:var(--ink);margin-bottom:0.5rem">${dest?dest.emoji:''} Day ${day} — ${getDateStr(day)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">
        <div><span style="color:var(--muted);font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">🏨 Stay</span><br/>${currentStay?currentStay.name:'Not set'}</div>
        <div><span style="color:var(--muted);font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">🎯 Activities</span><br/>${currentActs.length?currentActs.join(', '):'None'}</div>
        <div><span style="color:var(--muted);font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">🍽️ Food</span><br/>${[bf?.name,ln?.name,dn?.name].filter(Boolean).join(' · ')||'Not set'}</div>
        <div><span style="color:var(--muted);font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">📝 Notes</span><br/>${p.notes||'—'}</div>
      </div>
      <div style="margin-top:0.85rem;font-size:0.72rem;color:var(--muted)">Modify today's plan in Step 4 — Day Plans, then return here to notify your team.</div>
    </div>`;
}

// ===== SEND TODAY'S UPDATE =====
async function sendTodaysUpdate(){
  const note=document.getElementById('todays-note').value.trim();
  const recipients=getAllRecipients();
  const status=document.getElementById('update-status');

  if(!recipients.length){
    status.className='update-status err';
    status.textContent='⚠️ No recipients. Add email addresses in the Send Panel or add employees in your Profile.';
    return;
  }

  const day=S.todayDay;
  const p=S.dayPlans[day]||{};
  const dest=DESTINATIONS.find(d=>d.id===S.dest);
  const food=FOOD[S.dest]||DEFAULT_FOOD;
  const acts=ACTIVITIES[S.dest]||[];
  const stayOpts=STAY[p.tier||'midrange']||STAY.midrange;
  const stay=stayOpts.find(s=>s.id===p.stay);
  const actNms=(p.acts||[]).map(i=>acts[i]?.name).filter(Boolean);
  const bf=p.breakfast!=null?food.breakfast[p.breakfast]:null;
  const ln=p.lunch!=null?food.lunch[p.lunch]:null;
  const dn=p.dinner!=null?food.dinner[p.dinner]:null;

  const update=`📅 TODAY'S UPDATE — Day ${day} (${getDateStr(day)})\n`+
    `Destination: ${dest?dest.name:''}\n`+
    `━━━━━━━━━━━━━━━━━━━━━━━━\n`+
    `🏨 Stay: ${stay?stay.name:'Not set'}\n`+
    `🎯 Activities: ${actNms.length?actNms.join(', '):'None planned'}\n`+
    `🌅 Breakfast: ${bf?bf.name:'—'}\n`+
    `☀️ Lunch: ${ln?ln.name:'—'}\n`+
    `🌙 Dinner: ${dn?dn.name:'—'}\n`+
    (note?`\n📝 What changed: ${note}`:'');

  status.className='update-status sending';status.textContent=`Preparing update for ${recipients.length} recipient${recipients.length>1?'s':''}…`;

  const subject=`Daily Update - Day ${day} - ${dest?dest.name:'Your Trip'}`;
  const recipientEmails=recipients.map(r=>r.email).join(', ');
  
  const modal=document.createElement('div');
  modal.className='email-preview-modal';
  modal.innerHTML=`
    <div class="email-preview-content">
      <div class="email-preview-head">
        <h3>📧 Daily Update Ready</h3>
        <button class="modal-close" onclick="this.closest('.email-preview-modal').remove()">✕</button>
      </div>
      <div class="email-preview-body">
        <div class="email-preview-section">
          <div class="email-preview-label">TO:</div>
          <div class="email-preview-value">${recipientEmails}</div>
        </div>
        <div class="email-preview-section">
          <div class="email-preview-label">SUBJECT:</div>
          <div class="email-preview-value">${subject}</div>
        </div>
        <div class="email-preview-section">
          <div class="email-preview-label">MESSAGE:</div>
          <textarea readonly class="email-preview-text" id="update-text">${update}</textarea>
        </div>
        <div class="email-preview-actions">
          <button class="btn-copy-plan" onclick="copyUpdateText()">📋 Copy Update to Clipboard</button>
          <button class="btn-open-email" onclick="openUpdateEmailClient('${recipientEmails.split(', ').join(';')}','${subject.replace(/"/g, '\\"')}')">✉️ Open Email Client</button>
        </div>
        <div class="email-preview-note">Copy the update and paste into your email client, or click "Open Email Client" to send from your browser.</div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  status.className='update-status ok';
  status.textContent='✓ Update ready! Copy it below or open your email client.';
}

function copyUpdateText(){
  const updateText=document.getElementById('update-text');
  updateText.select();
  document.execCommand('copy');
  showToast('Update copied to clipboard!');
}

function openUpdateEmailClient(recipients,subject){
  const updateText=document.getElementById('update-text').value;
  const body=encodeURIComponent(updateText);
  const recipientList=recipients.split(';').map(e=>e.trim()).join(',');
  window.location.href=`mailto:${recipientList}?subject=${encodeURIComponent(subject)}&body=${body}`;
}

// ===== EMAIL PILLS =====
function addEmail(){
  const input=document.getElementById('new-email');
  const email=input.value.trim();
  if(!email||!email.includes('@')){showToast('Enter a valid email');return;}
  if(S.recipients.find(r=>r.email===email)){showToast('Already added');return;}
  const emp=S.employees.find(e=>e.email===email);
  const name=emp?emp.name:email.split('@')[0];
  S.recipients.push({email,name});
  input.value='';
  renderEmailPills();
  showToast(`${name} added`);
}
function removeRecipient(email){
  S.recipients=S.recipients.filter(r=>r.email!==email);
  renderEmailPills();
}
function renderEmailPills(){
  const el=document.getElementById('email-pills');
  if(!S.recipients.length){el.innerHTML=`<span style="font-size:0.8rem;color:var(--muted);padding:0.3rem 0">No recipients yet. Add emails above.</span>`;return;}
  el.innerHTML=S.recipients.map(r=>`
    <span class="epill">✉️ ${r.name} <button onclick="removeRecipient('${r.email}')" title="Remove">✕</button></span>`).join('');
}
function getAllRecipients(){
  const all=[...S.recipients];
  S.employees.forEach(e=>{if(!all.find(r=>r.email===e.email))all.push(e);});
  return all;
}

// ===== SIMPLE EMAIL SENDING =====
async function sendEmails(){
  const recipients=getAllRecipients();
  const fb=document.getElementById('send-status');

  if(!recipients.length){
    fb.className='send-status err';
    fb.textContent='⚠️ No recipients. Add email addresses above or add employees in your Profile.';
    return;
  }

  const dest=DESTINATIONS.find(d=>d.id===S.dest);
  const route=ROUTES.find(r=>r.id===S.route);
  const food=FOOD[S.dest]||DEFAULT_FOOD;
  const acts=ACTIVITIES[S.dest]||[];
  
  let plan=`WANDERWAVE — CORPORATE TRIP PLAN\n${'═'.repeat(40)}\n`;
  plan+=`Company: ${S.company.name||'Your Company'}\n`;
  plan+=`📍 Destination: ${dest?dest.name+', '+dest.state:'—'}\n`;
  plan+=`✈️ Travel: ${route?route.name:'—'}\n`;
  plan+=`📅 Start: ${S.startDate?new Date(S.startDate).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}):'—'}\n`;
  plan+=`⏱️ Duration: ${S.days} Days\n\n`;
  
  for(let i=1;i<=S.days;i++){
    const p=S.dayPlans[i]||{};
    const stayOpts=STAY[p.tier||'midrange']||STAY.midrange;
    const stay=stayOpts.find(s=>s.id===p.stay);
    const actNms=(p.acts||[]).map(idx=>acts[idx]?.name).filter(Boolean);
    const bf=p.breakfast!=null?food.breakfast[p.breakfast]:null;
    const ln=p.lunch!=null?food.lunch[p.lunch]:null;
    const dn=p.dinner!=null?food.dinner[p.dinner]:null;
    plan+=`── Day ${i}: ${getDateStr(i)} ──\n`;
    plan+=`🏨 Stay: ${stay?stay.name+' ('+stay.price+')':'Not selected'}\n`;
    plan+=`🎯 Activities: ${actNms.length?actNms.join(', '):'None'}\n`;
    plan+=`🌅 Breakfast: ${bf?bf.name:'—'} | ☀️ Lunch: ${ln?ln.name:'—'} | 🌙 Dinner: ${dn?dn.name:'—'}\n`;
    if(p.notes)plan+=`📝 ${p.notes}\n`;
    plan+='\n';
  }

  fb.className='send-status sending';
  fb.textContent=`Preparing email for ${recipients.length} recipient${recipients.length>1?'s':''}…`;
  
  // Show copyable plan
  const subject=`${S.company.name||'WanderWave'} Trip Plan - ${dest?dest.name:'Your Trip'}`;
  const recipientEmails=recipients.map(r=>r.email).join(', ');
  
  // Create a modal or overlay to show the plan
  const modal=document.createElement('div');
  modal.className='email-preview-modal';
  modal.innerHTML=`
    <div class="email-preview-content">
      <div class="email-preview-head">
        <h3>✉️ Ready to Send</h3>
        <button class="modal-close" onclick="this.closest('.email-preview-modal').remove()">✕</button>
      </div>
      <div class="email-preview-body">
        <div class="email-preview-section">
          <div class="email-preview-label">TO:</div>
          <div class="email-preview-value">${recipientEmails}</div>
        </div>
        <div class="email-preview-section">
          <div class="email-preview-label">SUBJECT:</div>
          <div class="email-preview-value">${subject}</div>
        </div>
        <div class="email-preview-section">
          <div class="email-preview-label">MESSAGE:</div>
          <textarea readonly class="email-preview-text" id="plan-text">${plan}</textarea>
        </div>
        <div class="email-preview-actions">
          <button class="btn-copy-plan" onclick="copyPlan()">📋 Copy Plan to Clipboard</button>
          <button class="btn-open-email" onclick="openEmailClient('${recipientEmails.split(', ').join(';')}','${subject.replace(/"/g, '\\"')}')">✉️ Open Email Client</button>
        </div>
        <div class="email-preview-note">Copy the plan text and paste it into your email client, or click "Open Email Client" to send directly from your browser's default email app.</div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  fb.className='send-status ok';
  fb.textContent='✓ Plan ready! Copy it below or open your email client.';
  launchConfetti();
  S.stats.sent=(S.stats.sent||0)+1;
  updateStats();
  saveState();
}

function copyPlan(){
  const planText=document.getElementById('plan-text');
  planText.select();
  document.execCommand('copy');
  showToast('Plan copied to clipboard!');
}

function openEmailClient(recipients,subject){
  const planText=document.getElementById('plan-text').value;
  const body=encodeURIComponent(planText);
  const recipientList=recipients.split(';').map(e=>e.trim()).join(',');
  window.location.href=`mailto:${recipientList}?subject=${encodeURIComponent(subject)}&body=${body}`;
}

// ===== SAVE PLAN =====
function savePlan(){
  const btn=document.getElementById('save-plan-btn');
  const status=document.getElementById('save-plan-status');
  const dest=DESTINATIONS.find(d=>d.id===S.dest);
  const route=ROUTES.find(r=>r.id===S.route);
  if(!dest){showToast('No destination selected');return;}

  const plan={
    id:Date.now(),
    dest:dest?dest.name:'—',
    destId:S.dest,
    destEmoji:dest?dest.emoji:'✈️',
    route:route?route.name:'—',
    days:S.days,
    startDate:S.startDate||'',
    teamSize:S.teamSize||10,
    sentTo:S.recipients?S.recipients.length:0,
    dayPlans:JSON.parse(JSON.stringify(S.dayPlans||{})),
    routeDetails:JSON.parse(JSON.stringify(S.routeDetails||{})),
    company:S.company?.name||'',
    date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})
  };

  // Avoid exact duplicates (same dest + startDate saved in last 5s)
  const isDupe=S.plans.some(p=>p.dest===plan.dest&&p.startDate===plan.startDate&&(Date.now()-p.id)<10000);
  if(isDupe){
    status.className='save-plan-status warn';
    status.textContent='⚠️ This plan was just saved.';
    setTimeout(()=>status.textContent='',3000);
    return;
  }

  S.plans.push(plan);
  localStorage.setItem('tm_plans',JSON.stringify(S.plans));
  updateStats();

  btn.textContent='✓ Saved!';
  btn.classList.add('saved');
  status.className='save-plan-status ok';
  status.textContent=`✓ "${dest.name}" trip saved — view it in My Plans`;
  setTimeout(()=>{btn.textContent='💾 Save Plan';btn.classList.remove('saved');status.textContent='';},4000);
  showToast('Plan saved to My Plans 🗺️');
}

function saveState(){
  localStorage.setItem('tm_plans',JSON.stringify(S.plans));
}

// ===== PROFILE =====
function saveProfile(){
  S.company={name:document.getElementById('comp-name').value,industry:document.getElementById('comp-industry').value,email:document.getElementById('comp-email').value,city:document.getElementById('comp-city').value};
  localStorage.setItem('tm_company',JSON.stringify(S.company));
  const init=(S.company.name||'TC').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('co-ava').textContent=init;
  showToast('Profile saved');
}
function loadProfile(){
  const c=S.company;
  if(c.name)document.getElementById('comp-name').value=c.name;
  if(c.industry)document.getElementById('comp-industry').value=c.industry;
  if(c.email)document.getElementById('comp-email').value=c.email;
  if(c.city)document.getElementById('comp-city').value=c.city;
  const init=(c.name||'TC').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('co-ava').textContent=init;
}
function addEmployee(){
  const name=document.getElementById('emp-name').value.trim();
  const email=document.getElementById('emp-email').value.trim();
  if(!name||!email){showToast('Enter name and email');return;}
  if(!email.includes('@')){showToast('Invalid email');return;}
  S.employees.push({name,email});
  localStorage.setItem('tm_employees',JSON.stringify(S.employees));
  document.getElementById('emp-name').value='';document.getElementById('emp-email').value='';
  loadEmpList();updateStats();
  showToast(`${name} added`);
}
function removeEmployee(i){
  S.employees.splice(i,1);
  localStorage.setItem('tm_employees',JSON.stringify(S.employees));
  loadEmpList();updateStats();
}
function loadEmpList(){
  const el=document.getElementById('emp-list');
  if(!S.employees.length){el.innerHTML=`<p style="font-size:0.82rem;color:var(--muted);text-align:center;padding:1.5rem">No employees yet. Add some above.</p>`;return;}
  el.innerHTML=S.employees.map((e,i)=>`
    <div class="emp-item">
      <div class="emp-info"><strong>${e.name}</strong><span>${e.email}</span></div>
      <button class="emp-del" onclick="removeEmployee(${i})">✕</button>
    </div>`).join('');
}
function updateStats(){
  document.getElementById('ps-emp').textContent=S.employees.length;
  document.getElementById('ps-plans').textContent=S.plans.length;
}

// ===== MY PLANS =====
function loadPlans(){
  const el=document.getElementById('plans-list');if(!el)return;
  // Re-read from localStorage to stay fresh
  S.plans=JSON.parse(localStorage.getItem('tm_plans')||'[]');
  if(!S.plans.length){
    el.innerHTML=`<div class="empty-wrap"><span class="em-ico">🗺️</span><p>No plans yet. Start planning your first corporate trip.</p></div>`;
    return;
  }
  el.innerHTML=S.plans.map((p,i)=>{
    const dest=DESTINATIONS.find(d=>d.name===p.dest);
    const startStr=p.startDate?new Date(p.startDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'—';
    const endDate=p.startDate?new Date(new Date(p.startDate).getTime()+(p.days-1)*86400000):null;
    const endStr=endDate?endDate.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'—';
    return `
    <div class="plan-card" onclick="openPlanModal(${i})">
      <div class="plan-card-glow" style="background:${dest?.bg||'linear-gradient(135deg,#667eea,#764ba2)'}"></div>
      <div class="plan-card-emoji">${dest?.emoji||'✈️'}</div>
      <div class="plan-card-dest">${p.dest}</div>
      <div class="plan-card-meta">
        <span>📅 ${startStr} → ${endStr}</span><br/>
        <span>⏱️ ${p.days} day${p.days>1?'s':''}</span> &nbsp;·&nbsp; <span>👥 ${p.teamSize||'—'} people</span>
      </div>
      <div class="plan-card-footer">
        <span class="plan-card-badge">Saved ${p.date}</span>
        <span class="plan-card-open">View →</span>
      </div>
    </div>`;
  }).join('');
}

function openPlanModal(idx){
  const p=S.plans[idx];
  if(!p)return;
  const dest=DESTINATIONS.find(d=>d.name===p.dest);
  const route=ROUTES.find(r=>r.name===p.route);
  const food=FOOD[p.destId]||DEFAULT_FOOD;
  const acts=ACTIVITIES[p.destId]||[];
  const startStr=p.startDate?new Date(p.startDate).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'long',year:'numeric'}):'—';
  const borderColors=['#4338ca','#c8973a','#0c8c7a','#2563eb','#6d28d9','#0891b2'];

  // Build day-by-day breakdown
  let daysHtml='';
  for(let i=1;i<=p.days;i++){
    const dp=p.dayPlans?.[i]||{};
    const tier=dp.tier||'midrange';
    const stayOpts=STAY[tier]||STAY.midrange;
    const stay=stayOpts.find(s=>s.id===dp.stay);
    const actNms=(dp.acts||[]).map(idx=>acts[idx]?.name).filter(Boolean);
    const bf=dp.breakfast!=null?food.breakfast?.[dp.breakfast]:null;
    const ln=dp.lunch!=null?food.lunch?.[dp.lunch]:null;
    const dn=dp.dinner!=null?food.dinner?.[dp.dinner]:null;
    // Date label
    const dayDate=p.startDate?new Date(new Date(p.startDate).getTime()+(i-1)*86400000):null;
    const dateLabel=dayDate?dayDate.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}):'';
    daysHtml+=`
      <div class="pm-day-card" style="border-left-color:${borderColors[(i-1)%borderColors.length]}">
        <div class="pm-day-head">
          <div class="pm-day-num">Day ${i}</div>
          <div class="pm-day-date">${dateLabel}</div>
        </div>
        <div class="pm-day-rows">
          <div class="pm-row"><span class="pm-row-icon">🏨</span><span class="pm-row-label">Stay</span><span class="pm-row-val">${stay?stay.name+' <em>('+stay.price+')</em>':'<span class="pm-none">Not set</span>'}</span></div>
          <div class="pm-row"><span class="pm-row-icon">🎯</span><span class="pm-row-label">Activities</span><span class="pm-row-val">${actNms.length?actNms.map(a=>`<span class="pm-tag">${a}</span>`).join(''):'<span class="pm-none">None</span>'}</span></div>
          <div class="pm-row"><span class="pm-row-icon">🍽️</span><span class="pm-row-label">Meals</span><span class="pm-row-val">${[bf&&`🌅 ${bf.name}`,ln&&`☀️ ${ln.name}`,dn&&`🌙 ${dn.name}`].filter(Boolean).map(m=>`<span class="pm-tag">${m}</span>`).join('')||'<span class="pm-none">Not set</span>'}</span></div>
          ${dp.notes?`<div class="pm-row"><span class="pm-row-icon">📝</span><span class="pm-row-label">Notes</span><span class="pm-row-val pm-notes">${dp.notes}</span></div>`:''}
        </div>
      </div>`;
  }

  // Route details
  const rdKeys={from:'📍 From',traveldate:'📅 Date',passengers:'👥 Travellers',budget:'💰 Budget',airline:'✈️ Airline',fclass:'🪑 Class',airport:'🛫 Airport',tclass:'🎫 Class',station:'🚉 Station',tname:'🚂 Train',btype:'🚌 Bus Type',bop:'🏢 Operator',ctype:'🚗 Vehicle',cop:'🏢 Provider',specialNotes:'📝 Notes'};
  const rd=p.routeDetails||{};
  const rdRows=Object.entries(rdKeys).filter(([k])=>rd[k]).map(([k,label])=>`<div class="pm-rd-row"><span>${label}</span><strong>${rd[k]}</strong></div>`).join('');

  const modal=document.createElement('div');
  modal.className='plan-modal-overlay';
  modal.id='plan-modal';
  modal.innerHTML=`
    <div class="plan-modal">
      <div class="pm-hero" style="background:${dest?.bg||'linear-gradient(135deg,#667eea,#764ba2)'}">
        <div class="pm-hero-emoji">${dest?.emoji||'✈️'}</div>
        <div class="pm-hero-body">
          <h2>${p.dest}</h2>
          <p>${dest?.state||''} &nbsp;·&nbsp; ${dest?.vibe||''}</p>
        </div>
        <button class="pm-close" onclick="closePlanModal()">✕</button>
      </div>

      <div class="pm-body">
        <!-- Summary strip -->
        <div class="pm-summary">
          <div class="pm-sum-item"><div class="pm-sum-val">${p.days}</div><div class="pm-sum-lbl">Days</div></div>
          <div class="pm-sum-div"></div>
          <div class="pm-sum-item"><div class="pm-sum-val">${p.teamSize||'—'}</div><div class="pm-sum-lbl">People</div></div>
          <div class="pm-sum-div"></div>
          <div class="pm-sum-item"><div class="pm-sum-val" style="font-size:0.9rem">${startStr}</div><div class="pm-sum-lbl">Start Date</div></div>
          <div class="pm-sum-div"></div>
          <div class="pm-sum-item"><div class="pm-sum-val" style="font-size:0.85rem">${p.route||'—'}</div><div class="pm-sum-lbl">Travel Mode</div></div>
        </div>

        <!-- Route Details -->
        ${rdRows?`<div class="pm-section">
          <div class="pm-section-title">🛣️ Route Details</div>
          <div class="pm-rd-grid">${rdRows}</div>
        </div>`:''}

        <!-- Day by Day -->
        <div class="pm-section">
          <div class="pm-section-title">📅 Day-by-Day Plan</div>
          <div class="pm-days">${daysHtml}</div>
        </div>

        <!-- Actions -->
        <div class="pm-actions">
          <button class="pm-action-btn pm-btn-resume" onclick="resumePlan(${idx})">✏️ Resume & Edit</button>
          <button class="pm-action-btn pm-btn-delete" onclick="deletePlan(${idx})">🗑️ Delete Plan</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  requestAnimationFrame(()=>modal.classList.add('visible'));
  document.body.style.overflow='hidden';
  // Close on overlay click
  modal.addEventListener('click',e=>{if(e.target===modal)closePlanModal();});
}

function closePlanModal(){
  const m=document.getElementById('plan-modal');
  if(!m)return;
  m.classList.remove('visible');
  setTimeout(()=>{m.remove();document.body.style.overflow='';},320);
}

function deletePlan(idx){
  if(!confirm('Delete this plan? This cannot be undone.'))return;
  S.plans.splice(idx,1);
  localStorage.setItem('tm_plans',JSON.stringify(S.plans));
  closePlanModal();
  loadPlans();
  updateStats();
  showToast('Plan deleted');
}

function resumePlan(idx){
  const p=S.plans[idx];
  if(!p)return;
  // Restore state from saved plan
  S.dest=p.destId;
  S.route=ROUTES.find(r=>r.name===p.route)?.id||null;
  S.days=p.days;
  S.startDate=p.startDate||'';
  S.teamSize=p.teamSize||10;
  S.dayPlans=JSON.parse(JSON.stringify(p.dayPlans||{}));
  S.routeDetails=JSON.parse(JSON.stringify(p.routeDetails||{}));
  closePlanModal();
  showPage('planner');
  // Rebuild UI
  buildDestGrid();
  if(S.dest){
    document.querySelectorAll('.dest-card').forEach(c=>c.classList.remove('selected'));
    document.getElementById('dc-'+S.dest)?.classList.add('selected');
  }
  if(S.startDate){
    const sd=document.getElementById('start-date');
    if(sd){sd.value=S.startDate;updateReturn();}
  }
  document.getElementById('days-n').textContent=S.days;
  const sl=document.getElementById('days-slider');if(sl)sl.value=S.days;
  document.getElementById('team-n').textContent=S.teamSize;
  goStep(4);
  showToast('Plan loaded — continue editing 🗺️');
}

// ===== PAYMENT SYSTEM =====
const UPI_ID='9579114962@ibl';
const UPI_NAME='WanderWave Trips';

// Price midpoints per tier (per room per night)
const STAY_COST={budget:{oyo:1150,zostel:700,guesthouse:900},midrange:{ibis:2750,treebo:2400,resort:3500},luxury:{taj:14000,marriott:10500,boutique:8500}};
// Activity cost estimates per person
const ACT_COST={goa:[800,1200,600,3500,400,300],shimla:[600,500,1800,200,400,700],manali:[800,2500,1500,300,400,3000],jaipur:[800,700,1500,600,700,900],kerala:[1200,600,500,2000,3000,500],ooty:[400,300,800,400,500,2000],udaipur:[1200,900,600,300,500,700],rishikesh:[2500,3500,1500,200,800,600],coorg:[800,400,600,300,1200,2500],andaman:[4000,500,800,300,400,1200],agra:[700,500,300,400,300,800],darjeeling:[300,400,600,300,200,2500]};
// Food cost estimates per person per meal
const FOOD_COST=350; // average per meal

function calcTripCost(){
  const dest=DESTINATIONS.find(d=>d.id===S.dest);
  const team=S.teamSize||1;
  let stayTotal=0,actTotal=0,foodTotal=0;
  const breakdown=[];

  for(let i=1;i<=S.days;i++){
    const p=S.dayPlans[i]||{};
    const tier=p.tier||'midrange';
    // Stay cost (per room, assume 2 per room)
    const rooms=Math.ceil(team/2);
    const stayC=STAY_COST[tier]?.[p.stay]||STAY_COST[tier]?.[Object.keys(STAY_COST[tier])[0]]||2000;
    stayTotal+=stayC*rooms;
    // Activity cost per person
    const actCosts=ACT_COST[S.dest]||[];
    const dayActCost=(p.acts||[]).reduce((s,idx)=>{const c=actCosts[idx]||500;return s+c;},0);
    actTotal+=dayActCost*team;
    // Food (3 meals per person)
    const meals=[p.breakfast,p.lunch,p.dinner].filter(x=>x!=null).length;
    foodTotal+=meals*FOOD_COST*team;
  }

  // Travel cost estimate based on route
  const routeCosts={flight:4500,train:800,bus:400,car:1200};
  const travelCostPP=routeCosts[S.route]||600;
  const travelTotal=travelCostPP*team;

  const grandTotal=stayTotal+actTotal+foodTotal+travelTotal;
  const perPerson=Math.round(grandTotal/team);

  return {stayTotal,actTotal,foodTotal,travelTotal,grandTotal,perPerson,team};
}

function buildPaymentSection(){
  const c=calcTripCost();
  const dest=DESTINATIONS.find(d=>d.id===S.dest);
  const route=ROUTES.find(r=>r.id===S.route);

  // Breakdown rows
  document.getElementById('pmt-breakdown').innerHTML=`
    <div class="pmt-row"><span class="pmt-row-icon">🏨</span><span class="pmt-row-name">Accommodation (${S.days} night${S.days>1?'s':''})</span><span class="pmt-row-amt">₹${c.stayTotal.toLocaleString('en-IN')}</span></div>
    <div class="pmt-row"><span class="pmt-row-icon">${route?.icon||'🚗'}</span><span class="pmt-row-name">Travel (${route?.name||'Transport'} × ${c.team} people)</span><span class="pmt-row-amt">₹${c.travelTotal.toLocaleString('en-IN')}</span></div>
    <div class="pmt-row"><span class="pmt-row-icon">🎯</span><span class="pmt-row-name">Activities & Experiences</span><span class="pmt-row-amt">₹${c.actTotal.toLocaleString('en-IN')}</span></div>
    <div class="pmt-row"><span class="pmt-row-icon">🍽️</span><span class="pmt-row-name">Meals & Food</span><span class="pmt-row-amt">₹${c.foodTotal.toLocaleString('en-IN')}</span></div>
  `;
  document.getElementById('pmt-total').textContent=`₹${c.grandTotal.toLocaleString('en-IN')}`;
  document.getElementById('pmt-perperson').textContent=`≈ ₹${c.perPerson.toLocaleString('en-IN')} per person · ${c.team} travellers`;

  // Generate QR
  generateUpiQR(c.grandTotal, dest?.name||'Trip');

  // Load payment status from storage
  const key=`pmt_${S.dest}_${S.startDate}`;
  const saved=JSON.parse(localStorage.getItem(key)||'{}');
  if(saved.paid){
    setPaidStatus(saved.paid,saved.paidAt,saved.ref);
  } else {
    document.getElementById('pmt-dot').className='pmt-dot pending';
    document.getElementById('pmt-status-text').textContent='Awaiting payment';
  }
  renderPaymentLog(key);
}

// ── QR CODE GENERATOR (pure JS, no library) ──
function generateUpiQR(amount,destName){
  const upiUrl=`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('WanderWave: '+destName+' Trip')}`;
  document.getElementById('pmt-qr-sub').textContent=`₹${amount.toLocaleString('en-IN')}`;
  // Draw QR using qrious loaded from CDN (injected below)
  if(window.QRious){
    new QRious({element:document.getElementById('pmt-qr-canvas'),value:upiUrl,size:160,background:'#ffffff',foreground:'#0f0f1e',level:'H'});
  } else {
    // Load QRious dynamically
    const sc=document.createElement('script');
    sc.src='https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
    sc.onload=()=>{
      new QRious({element:document.getElementById('pmt-qr-canvas'),value:upiUrl,size:160,background:'#ffffff',foreground:'#0f0f1e',level:'H'});
    };
    document.head.appendChild(sc);
  }
}

function payWithApp(app){
  const c=calcTripCost();
  const dest=DESTINATIONS.find(d=>d.id===S.dest);
  const tn=encodeURIComponent('WanderWave: '+(dest?.name||'Trip')+' Trip');
  const upiBase=`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${c.grandTotal}&cu=INR&tn=${tn}`;
  const urls={
    gpay:`gpay://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${c.grandTotal}&cu=INR&tn=${tn}`,
    phonepe:`phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${c.grandTotal}&cu=INR&tn=${tn}`,
    paytm:`paytmmp://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${c.grandTotal}&cu=INR&tn=${tn}`,
    bhim:`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${c.grandTotal}&cu=INR&tn=${tn}`,
    upi:upiBase
  };
  window.location.href=urls[app]||upiBase;
  // Auto show "confirm payment" after 4s (user returns from app)
  setTimeout(()=>{
    if(confirm('Did you complete the payment?')){markPaid();}
  },4000);
}

function copyUPI(){
  navigator.clipboard.writeText(UPI_ID).then(()=>showToast('UPI ID copied!')).catch(()=>{
    const t=document.createElement('textarea');t.value=UPI_ID;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();showToast('UPI ID copied!');
  });
}

function markPaid(){
  const ref='WW'+Date.now().toString(36).toUpperCase();
  const now=new Date().toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  const key=`pmt_${S.dest}_${S.startDate}`;
  const c=calcTripCost();
  const entry={paid:true,paidAt:now,ref,amount:c.grandTotal};
  localStorage.setItem(key,JSON.stringify(entry));
  // Add to log
  const log=JSON.parse(localStorage.getItem(key+'_log')||'[]');
  log.push(entry);
  localStorage.setItem(key+'_log',JSON.stringify(log));
  setPaidStatus(true,now,ref);
  renderPaymentLog(key);
  launchConfetti();
  showToast('Payment marked as paid! 🎉');
}

function setPaidStatus(paid,paidAt,ref){
  const dot=document.getElementById('pmt-dot');
  const txt=document.getElementById('pmt-status-text');
  if(paid){
    dot.className='pmt-dot paid';
    txt.innerHTML=`<strong style="color:var(--green)">✓ Paid</strong> &nbsp;·&nbsp; ${paidAt} &nbsp;·&nbsp; <span style="font-family:monospace;font-size:0.78rem;color:var(--muted)">Ref: ${ref}</span>`;
  } else {
    dot.className='pmt-dot pending';
    txt.textContent='Awaiting payment';
  }
}

function renderPaymentLog(key){
  const log=JSON.parse(localStorage.getItem(key+'_log')||'[]');
  const wrap=document.getElementById('pmt-history-wrap');
  const list=document.getElementById('pmt-history-list');
  if(!log.length){wrap.style.display='none';return;}
  wrap.style.display='block';
  list.innerHTML=log.map(e=>`
    <div class="pmt-log-row">
      <span class="pmt-log-dot">✓</span>
      <span>₹${(e.amount||0).toLocaleString('en-IN')}</span>
      <span style="color:var(--muted)">${e.paidAt}</span>
      <span class="pmt-log-ref">Ref: ${e.ref}</span>
    </div>`).join('');
}

function showSplitModal(){
  const c=calcTripCost();
  const team=S.teamSize||1;
  const employees=S.employees||[];
  const perPerson=c.perPerson;

  // Build person list: employees + fill with "Person N"
  const people=[];
  employees.forEach(e=>people.push({name:e.name,email:e.email}));
  while(people.length<team)people.push({name:`Traveller ${people.length+1}`,email:''});
  const shown=people.slice(0,team);

  document.getElementById('split-body').innerHTML=`
    <div class="split-summary">
      <div>Total: <strong>₹${c.grandTotal.toLocaleString('en-IN')}</strong></div>
      <div>÷ ${team} people = <strong class="split-pp">₹${perPerson.toLocaleString('en-IN')} each</strong></div>
    </div>
    <div class="split-list">
      ${shown.map((p,i)=>`
        <div class="split-row">
          <div class="split-avatar">${p.name[0].toUpperCase()}</div>
          <div class="split-info"><strong>${p.name}</strong>${p.email?`<span>${p.email}</span>`:''}</div>
          <div class="split-amt">₹${perPerson.toLocaleString('en-IN')}</div>
          <button class="split-pay-btn" onclick="splitPayPerson('${p.name}',${perPerson})">Pay →</button>
        </div>`).join('')}
    </div>
    <div class="split-note">Each person can pay ₹${perPerson.toLocaleString('en-IN')} directly to UPI ID: <strong>${UPI_ID}</strong></div>
    <button class="split-close-btn" onclick="closeSplitModal()">Done</button>
  `;
  document.getElementById('split-modal').style.display='flex';
}

function splitPayPerson(name,amount){
  const tn=encodeURIComponent('WanderWave Split: '+name);
  window.location.href=`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${tn}`;
}

function closeSplitModal(){
  document.getElementById('split-modal').style.display='none';
}

// Hook into step 5 build

function launchConfetti(){
  const canvas=document.getElementById('confetti-canvas');
  canvas.style.display='block';
  const ctx=canvas.getContext('2d');
  canvas.width=innerWidth;canvas.height=innerHeight;
  // Refined colour palette
  const colors=['#4338ca','#c8973a','#0c8c7a','#2563eb','#6d28d9','#e8b86d','#a5b4fc'];
  const pieces=Array.from({length:160},()=>({
    x:Math.random()*canvas.width,y:-20,
    w:4+Math.random()*6,h:6+Math.random()*9,
    rot:Math.random()*360,
    color:colors[Math.floor(Math.random()*colors.length)],
    vx:(Math.random()-0.5)*3.5,vy:1.8+Math.random()*2.5,
    vr:1.5+Math.random()*3,life:1
  }));
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive=false;
    pieces.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.life-=0.006;
      if(p.life>0&&p.y<canvas.height){
        alive=true;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);
        ctx.globalAlpha=p.life;ctx.fillStyle=p.color;
        ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
      }
    });
    if(alive)requestAnimationFrame(draw);
    else{ctx.clearRect(0,0,canvas.width,canvas.height);canvas.style.display='none';}
  }
  draw();
  showToast('Plan sent successfully');
}

// ===== TOAST =====
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove('show'),3000);
}
