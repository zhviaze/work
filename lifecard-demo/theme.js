/* Edit DEFAULT_THEME to permanently change the published palette.
   Preview overrides stay in the current visitor's browser only. */
(() => {
  'use strict';
  const DEFAULT_THEME = Object.freeze({"primary":"#212644","accent":"#0099ff","brand-red":"#ed1c2e","background":"#f0f3f8","surface":"#ffffff","text":"#202e3c","muted":"#617082","success":"#20a680","danger":"#c84260","capture":"#0099ff","shell":"#f8f9fc","shell-ink":"#212644","shell-muted":"#687587","code-ink":"#16151a","code-paper":"#ffffff"});
  const PRESETS = {original:{...DEFAULT_THEME},navy:{...DEFAULT_THEME,primary:'#254b72',accent:'#3983ce',background:'#edf1f5',success:'#26886e'},teal:{...DEFAULT_THEME,primary:'#237c79',accent:'#237c79',background:'#edf3f1',success:'#268268'}};
  const STORAGE_KEY = 'coshine-lifecard-theme-v1';
  let palette = {...DEFAULT_THEME};
  try { const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'); if(saved?.base===JSON.stringify(DEFAULT_THEME)&&saved.colors)for(const key of Object.keys(DEFAULT_THEME))if(/^#[\da-f]{6}$/i.test(saved.colors[key]||''))palette[key]=saved.colors[key]; } catch {}
  function luminance(hex) { const c=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4); return c[0]*.2126+c[1]*.7152+c[2]*.0722; }
  function foreground(hex) { return luminance(hex)>.179?'#17202a':'#ffffff'; }
  function apply(save=true) {
    for(const [key,value] of Object.entries(palette))document.documentElement.style.setProperty('--'+key,value);
    document.documentElement.style.setProperty('--on-primary',foreground(palette.primary));
    document.documentElement.style.setProperty('--on-accent',foreground(palette.accent));
    for(const [key,value] of Object.entries(PRESETS)){document.documentElement.style.setProperty('--preset-'+key,value.primary);document.documentElement.style.setProperty('--preset-'+key+'-ink',foreground(value.primary));}
    document.querySelector('meta[name="theme-color"]').content=palette.primary;
    document.querySelector('link[rel="icon"]').href='data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${palette.primary}"/><path d="M16 19h28v28H16zM16 19l23-7v7M36 31h12v10H36z" fill="none" stroke="${foreground(palette.primary)}" stroke-width="3" stroke-linejoin="round"/></svg>`);
    if(save)try{localStorage.setItem(STORAGE_KEY,JSON.stringify({base:JSON.stringify(DEFAULT_THEME),colors:palette}));}catch{}
    syncFields();
  }
  function syncFields(){document.querySelectorAll('[data-theme-color]').forEach(input=>{input.value=palette[input.dataset.themeColor];const code=input.closest('label').querySelector('code');if(code)code.textContent=input.value.toUpperCase();});}
  const fields={primary:'メインカラー',accent:'アクセント（ブルー）','brand-red':'アクセント（レッド）',background:'アプリ背景',surface:'カード背景',text:'文字',success:'完了・成功'};
  const container=document.getElementById('theme-fields');
  container.innerHTML=Object.entries(fields).map(([key,label])=>`<label class="theme-field">${label}<span><code>${palette[key].toUpperCase()}</code><input type="color" data-theme-color="${key}" value="${palette[key]}" aria-label="${label}"></span></label>`).join('');
  container.addEventListener('input',e=>{if(!e.target.dataset.themeColor)return;palette[e.target.dataset.themeColor]=e.target.value;apply();});
  document.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>{palette={...PRESETS[button.dataset.preset]};apply();}));
  document.getElementById('theme-reset').addEventListener('click',()=>{palette={...DEFAULT_THEME};apply();});
  document.getElementById('theme-export').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({name:'Life Card demo theme',colors:palette},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='lifecard-demo-theme.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  window.DemoTheme={get:()=>({...palette}),defaults:DEFAULT_THEME,set(colors){for(const key in colors)if(key in DEFAULT_THEME&&/^#[\da-f]{6}$/i.test(colors[key]))palette[key]=colors[key];apply();}};
  apply(false);
})();
