(() => {
'use strict';
const $=id=>document.getElementById(id);
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(name,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${(window.DemoIcons[name]||window.DemoIcons.Info).map(([tag,attrs])=>`<${tag} ${Object.entries(attrs).map(([k,v])=>`${k}="${escapeHtml(v)}"`).join(' ')}></${tag}>`).join('')}</svg>`;
function hydrateIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon);});}
const money=n=>Math.round(n).toLocaleString('ja-JP');
const dateTime=()=>new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date());
const step=(id,title,description)=>({id,title,description});
const FLOWS={
 cpm:{name:'CPM 決済',subtitle:'コードを見せて支払う',icon:'QrCode',steps:[step('home','ホーム','お支払いの入口をタップすると、決済コードを表示できます。'),step('cpm-code','決済コードの表示','バーコード・QRコードを提示。デモでは下のボタンで決済の受信を再現します。'),step('pay-processing','支払い処理','お支払いの処理を再現します。実際の決済は発生しません。'),step('pay-success','支払い完了','現地通貨での決済金額と日本円相当額を確認できます。'),step('history','取引履歴','支払いが残高と取引履歴に反映されます。')]},
 mpm:{name:'MPM 決済',subtitle:'コードを読み取って支払う',icon:'ScanLine',steps:[step('home','ホーム','お支払いを開始します。このシナリオではお店のQRコードを読み取ります。'),step('mpm-scan','お店のコードを読み取る','読み取り画面を再現。カメラを使わずにデモ用店舗を認識できます。'),step('mpm-amount','支払い金額を入力','店舗名を確認し、日本円で支払い金額を入力します。'),step('mpm-pin','暗証番号で確認','デモ用の4桁の暗証番号で支払いを確定します。'),step('pay-processing','支払い処理','支払い結果を受け取る操作を再現します。'),step('pay-success','支払い完了','支払い内容を確認できます。残高にも反映されます。'),step('history','取引履歴','今回の支払いと更新後の残高を確認できます。')]},
 charge:{name:'チャージ',subtitle:'銀行口座からチャージ',icon:'CircleYen',steps:[step('home','ホーム','チャージをタップし、銀行口座からのチャージ体験を開始します。'),step('charge-amount','チャージ金額を入力','チャージしたい金額を入力します。デモの初期金額は10,000円です。'),step('charge-bank','金融機関を選択','デモ用の金融機関を選択します。ここから銀行側の画面を再現します。'),step('bank-login','銀行での確認','架空の銀行画面で認証操作を体験します。実際の銀行には接続しません。'),step('bank-confirm','チャージ内容の確認','チャージ金額と出金先口座を確認します。'),step('bank-complete','銀行での手続き完了','ウォレットへ戻り、チャージ結果を受け取ります。'),step('charge-processing','チャージ結果を受信','銀行側からの結果通知を再現します。'),step('charge-success','チャージ完了','チャージ額がウォレット残高へ反映されます。'),step('history','取引履歴','チャージの記録と更新された残高を確認できます。')]},
 signup:{name:'新規登録',subtitle:'ウォレットの利用をはじめる',icon:'UserRound',steps:[step('welcome','Welcome to DEMO','動画と同じ導入から、ウォレットの新規登録を体験できます。'),step('intro','ウォレットの紹介','スマートフォンでのコード決済と安全なアカウント管理を紹介します。'),step('signup-name','お客様情報を入力','架空のお名前と生年月日を入力します。「デモ入力」でサンプルを設定できます。'),step('signup-email','メールアドレスとパスワード','メールアドレス・パスワードを入力します。入力した情報は送信されません。'),step('signup-pin','暗証番号を設定','お支払い時に使うデモ用の4桁の暗証番号を設定します。'),step('signup-biometric','生体認証の設定','生体認証の有効化を再現します。端末の認証機能は使用しません。'),step('signup-confirm','登録内容の確認','入力したお客様情報を確認できます。'),step('signup-otp','メール認証','デモ用メールの確認コードを入力します。実際のメールは送信しません。'),step('signup-success','登録完了','ウォレットの登録体験が完了しました。続けて本人確認もお試しいただけます。')]},
 ekyc:{name:'本人確認（eKYC）',subtitle:'撮影から申請までを体験',icon:'ScanFace',steps:[step('kyc-intro','本人確認で利用限度額アップ','本人確認の前後でのデモ用限度額を確認します。'),step('kyc-document','本人確認書類を選択','撮影する本人確認書類を選択し、撮影の注意事項を確認します。'),step('kyc-front','書類の表面を撮影','サンプルの書類で、枠に合わせて撮影する操作を再現します。'),step('kyc-front-review','表面の画像を確認','撮影したサンプルの画像を確認します。'),step('kyc-back','書類の裏面を撮影','書類の裏面の撮影を再現します。'),step('kyc-back-review','裏面の画像を確認','サンプルの画像が鮮明であることを確認します。'),step('kyc-face','顔写真を撮影','サンプルの人物イラストで顔写真撮影を再現します。'),step('kyc-face-review','顔写真を確認','顔写真の確認項目をチェックします。'),step('kyc-submit','申請内容を確認','書類と顔写真の確認が完了。本人確認の申請を再現します。'),step('kyc-processing','本人確認の処理','デモ用の確認結果を表示する準備をしています。'),step('kyc-success','本人確認の受付完了','デモでは承認状態まで反映し、利用限度額の変更を確認できます。')]}
};
const state={flow:'cpm',index:0,extra:null,playing:false,balance:69591,hiddenBalance:false,session:1,receipt:null,verified:false,registered:false,paymentAmount:30000,chargeAmount:10000,bank:'デモ銀行',document:'在留カード',account:{surname:'デモ',given:'花子',kanaSurname:'デモ',kanaGiven:'ハナコ',birthday:'1990-01-01',gender:'回答しない',email:'hanako@example.test',pin:'1234',biometric:false},transactions:[{id:'DEMO-0003',merchant:'DEMO SHOP · TOKYO',amount:-3000,currency:'JPY',label:'支払い完了',date:'2026/10/17 14:32',balance:69591},{id:'DEMO-0002',merchant:'デモ銀行からのチャージ',amount:10000,currency:'JPY',label:'チャージ完了',date:'2026/10/17 10:15',balance:72591},{id:'DEMO-0001',merchant:'DEMO SHOP · ONLINE',amount:-1200,currency:'JPY',label:'支払い完了',date:'2026/10/16 16:08',balance:62591}]};
let playTimer=null,processTimer=null,toastTimer=null,countdownTimer=null,previousFocus=null;
const current=()=>state.extra?step(state.extra,state.extra==='account'?'アカウント':state.extra==='notices'?'お知らせ':'取引履歴',''):FLOWS[state.flow].steps[state.index];
const button=(label,action='next',style='',attrs='')=>`<button type="button" class="app-btn ${style}" data-action="${action}" ${attrs}>${label}</button>`;
const demoFill=()=>'<div class="demo-input"><button type="button" data-action="fill">デモ入力</button></div>';
const formError=()=>'<div class="form-error" id="form-error" role="alert" hidden></div>';
const input=(id,label,type='text',value='',extra='')=>`<label class="app-label" for="${id}">${label}</label><input class="app-input" id="${id}" name="${id}" type="${type}" value="${escapeHtml(value)}" ${extra}>`;
const nextActions=(label='次へ',extra='')=>`<div class="sticky-actions">${button(label)}${extra}</div>`;
const successMark=()=>`<div class="success-mark">${icon('Check')}</div>`;
const networkLogo=()=>'<img class="network-logo" src="./assets/unionpay-official.svg" alt="UnionPay（銀聯）" width="82" height="57">';
const qr=()=>'<img class="qr-code" src="./assets/demo-qr.svg" alt="デモ用QRコード。支払いはできません。" width="167" height="167">';
function limits(){const cap=state.verified?100000:30000;return `<div class="limits"><div><span>支払可能残高</span><strong>${state.hiddenBalance?'＊＊＊＊＊':money(state.balance)} 円</strong></div><div><span>1回の支払い限度額</span><strong>${money(cap)} 円</strong></div><div><span>月間利用限度額まであと</span><strong>${money(state.verified?300000:150000)} 円</strong></div></div>`;}
function home(){return `<button class="home-pay" data-action="pay">${'<span class="scan-ring">'+icon('ScanBarcode')+'</span>'}${networkLogo()}<strong>お支払いをはじめる</strong></button><div class="balance-panel"><div class="balance-row"><span class="balance-title">${icon('Banknote')}残高</span><strong data-testid="balance">${state.hiddenBalance?'＊＊＊＊＊':money(state.balance)}円</strong></div><div class="balance-row"><button class="balance-toggle" data-action="balance">${icon(state.hiddenBalance?'Eye':'EyeOff')}${state.hiddenBalance?'表示':'非表示'}</button><span class="small">CNY相当額 <b>${state.hiddenBalance?'＊＊＊＊':(state.balance/19.82).toLocaleString('ja-JP',{minimumFractionDigits:2,maximumFractionDigits:2})}</b></span></div></div><div class="home-grid"><button class="home-tile" data-action="charge">${icon('CircleYen')}チャージ</button><button class="home-tile" data-action="history">${icon('ReceiptText')}取引履歴</button><button class="home-tile" data-action="notices">${icon('Bell')}<span class="notification-dot"></span>お知らせ</button><button class="home-tile" data-action="account">${icon('UserRoundCheck')}アカウント</button></div><div class="home-links"><button data-action="signup">新規登録のデモ</button><button data-action="ekyc">本人確認のデモ</button></div>`;}
function barcode(){let x=0,bars='';for(let i=0;i<104;i++){const w=[1,2,1,3,2,1,4,1,2][i%9];if(i%2===0)bars+=`<rect x="${x}" width="${w}" height="64"/>`;x+=w;}return `<div class="barcode" aria-label="デモ用バーコード"><svg viewBox="0 0 ${x} 64" preserveAspectRatio="none" role="img"><title>デモ用バーコード</title>${bars}</svg></div>`;}
function codeScreen(){return `<div class="card pay-code-card">${barcode()}${qr()}<span class="countdown" id="code-countdown">04:59</span></div>${limits()}<div class="segmented"><button class="active" data-action="cpm-tab">バーコード表示</button><button data-action="mpm-tab">バーコードスキャン</button></div>${button('支払いをシミュレーション','next')}<p class="demo-note">デモ用コードです。実際のお支払いはできません。</p>`;}
function receipt(){const r=state.receipt; if(!r)return home();const foreign=r.currency==='MOP';return `<div class="success-page">${successMark()}<h3 class="success-heading">お支払いが完了しました！</h3><div class="card receipt-card"><div class="receipt-date">${escapeHtml(r.date)} (JST)</div><div class="receipt-merchant">${escapeHtml(r.merchant)}</div><div class="receipt-amount">${foreign?'10.00':money(-r.amount)}<span>${foreign?'MOP':'円'}</span></div>${foreign?`<div class="receipt-meta"><span>日本円相当額</span><strong>${money(-r.amount)} 円</strong></div>`:''}<div class="receipt-meta"><span>取引番号</span><strong>${escapeHtml(r.id)}</strong></div><div class="receipt-details"><div class="receipt-meta"><span>内訳詳細</span><strong>支払い完了</strong></div><div class="receipt-meta"><span>Voucher No.</span><strong>${escapeHtml(r.id.replaceAll('-',''))}</strong></div><div class="receipt-meta"><span>支払い金額</span><strong>${foreign?'10.00 MOP':money(-r.amount)+' 円'}</strong></div></div></div>${limits()}${button('取引履歴を確認する')}${button('ホームへ','home','outline')}</div>`;}
function historyScreen(){return `<p class="history-caption">最新の取引 ${state.transactions.length}件</p><div class="history-list">${state.transactions.map(t=>`<div class="history-row"><div><b>${escapeHtml(t.merchant)}</b><small>${escapeHtml(t.date)} (JST)</small><small>残高 ${money(t.balance)}円</small></div><div class="history-amount ${t.amount>0?'charge':''}"><span class="tiny">${escapeHtml(t.label)}</span><strong>${t.amount>0?'+':''}${money(t.amount)}円</strong>${t.currency==='MOP'?'<small>10.00 MOP</small>':''}</div></div>`).join('')}</div>${button('ホームへ戻る','home','outline')}<p class="demo-note">このデモ内での操作が反映されます。</p>`;}
function welcome(intro=false){return `<div class="welcome-hero"><h3>${intro?'安心・安全なお支払い':'Welcome to DEMO'}</h3><div class="hero-illustration"><div class="illustration-disc">${icon(intro?'ShieldCheck':'Smartphone')}</div><div class="hero-badge">${icon(intro?'LockKeyhole':'QrCode')}</div></div><p class="welcome-copy">${intro?'暗証番号・生体認証で<br>スムーズなお支払い':'普段のお買い物を<br>スマートフォンで'}</p><p class="muted small">${intro?'安心してご利用いただける<br>ウォレットを体験できます。':'QR／バーコードを提示・スキャンして<br>お支払いができます。'}</p><div class="welcome-spacer"></div><div class="carousel-dots"><i class="${intro?'':'active'}"></i><i class="${intro?'active':''}"></i><i></i></div>${button(intro?'はじめる':'次へ')}${button('アカウントをお持ちの方','home','quiet')}</div>`;}
function signupName(){const a=state.account;return `${formError()}${demoFill()}<div class="card"><h4>お客様情報</h4><p class="muted tiny">この画面ではデモ用の架空情報をご利用ください。</p><div class="input-row"><div>${input('surname','姓','text',a.surname,'autocomplete="off" maxlength="30"')}</div><div>${input('given','名','text',a.given,'autocomplete="off" maxlength="30"')}</div></div><div class="input-row"><div>${input('kana-surname','セイ','text',a.kanaSurname,'maxlength="40"')}</div><div>${input('kana-given','メイ','text',a.kanaGiven,'maxlength="40"')}</div></div><label class="app-label" for="gender">性別</label><select id="gender" class="app-select"><option>回答しない</option><option>女性</option><option>男性</option></select>${input('birthday','生年月日','date',a.birthday)}</div>${nextActions()}`;}
function signupEmail(){return `${formError()}${demoFill()}<div class="card"><h4>メールアドレス</h4><p class="tiny muted">デモ用のメールアドレスを入力してください。</p>${input('email','メールアドレス（ID）','email',state.account.email,'autocomplete="off" maxlength="120"')}${input('email-confirm','メールアドレス（再入力）','email',state.account.email,'autocomplete="off" maxlength="120"')}</div><div class="card"><h4>パスワード</h4>${input('password','パスワード','password','','autocomplete="new-password" minlength="8" maxlength="64"')}${input('password-confirm','パスワード（再入力）','password','','autocomplete="new-password" maxlength="64"')}<p class="tiny muted">英字と数字を含む8文字以上。入力内容は保存・送信されません。</p></div>${nextActions()}`;}
function signupPin(){return `${formError()}${demoFill()}<div class="card"><h4>暗証番号を設定</h4><p class="muted small">お支払い時に使用する4桁の数字を設定してください。</p>${input('new-pin','暗証番号','password','','inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off"')}${input('new-pin-confirm','暗証番号（再入力）','password','','inputmode="numeric" maxlength="4" autocomplete="off"')}<p class="tiny muted">デモ入力では「1234」を設定します。</p></div>${nextActions()}`;}
function signupBiometric(){return `<div class="card center"><div class="hero-illustration"><div class="illustration-disc">${icon('Fingerprint')}</div></div><h3>指紋認証／顔認証で、<br>お支払いを安全かつ便利に</h3><p class="small muted">生体認証で支払いを承認する体験を再現します。</p><p class="tiny muted">このデモでは端末の生体情報を使用しません。</p></div>${button('生体認証を有効にする','biometric-enable')}${button('あとで設定する','next','outline')}`;}
function signupConfirm(){const a=state.account;return `<p class="small muted">ご登録内容をご確認のうえ、「確認して次へ」を押してください。</p><dl class="card registration-summary"><div><dt>お名前</dt><dd>${escapeHtml(a.surname+' '+a.given)}（${escapeHtml(a.kanaSurname+' '+a.kanaGiven)}）</dd></div><div><dt>生年月日</dt><dd>${escapeHtml(a.birthday)}</dd></div><div><dt>メールアドレス</dt><dd>${escapeHtml(a.email)}</dd></div><div><dt>パスワード</dt><dd>••••••••</dd></div><div><dt>暗証番号</dt><dd>••••</dd></div><div><dt>生体認証</dt><dd>${a.biometric?'デモ設定済み':'あとで設定'}</dd></div></dl>${nextActions('確認して次へ')}`;}
function signupOtp(){return `${formError()}<div class="otp-notification">${icon('Mail')}<div><strong>DEMO メール認証</strong><p>確認コード：<b>123456</b><br>デモ用のお知らせです。</p></div></div><h3 class="center">メール認証番号を入力してください</h3><p class="small muted">${escapeHtml(state.account.email)} 宛てのメール認証を再現しています。</p>${input('otp','確認コード（6桁）','text','','inputmode="numeric" maxlength="6" autocomplete="off"')}${button('OK')}${button('デモの確認コードを入力','fill','quiet')}<div class="notice-box"><h4>メールが届かない場合</h4><p class="tiny muted">実際のメールは送信されません。画面上のデモ用コードを入力すると次へ進めます。</p></div>`;}
function signupSuccess(){return `<div class="success-page">${successMark()}<h3 class="success-heading">登録が完了しました！</h3><div class="card center"><p>${escapeHtml(state.account.surname+' '+state.account.given)} 様</p><p class="muted small">DEMO ウォレットへようこそ。</p><span class="status-pill">アカウント登録済み</span></div>${button('本人確認で限度額アップ','ekyc')}${button('チャージする','charge','outline')}${button('ホームへ','home','quiet')}</div>`;}
function kycIntro(){return `<div class="card"><h3>本人確認で限度額アップ！</h3><p class="small muted">運転免許証、マイナンバーカード、在留カードを用いた本人確認で、利用限度額がアップします。</p><table class="check-table"><thead><tr><th></th><th>本人確認前</th><th>本人確認後</th></tr></thead><tbody><tr><th>1回の支払い<br>限度額</th><td>3万円</td><td>10万円</td></tr><tr><th>月間支払限度額</th><td>15万円</td><td>30万円</td></tr><tr><th>月間チャージ<br>限度額</th><td>15万円</td><td>30万円</td></tr><tr><th>ウォレット残高<br>限度額</th><td>10万円</td><td>100万円</td></tr></tbody></table><p class="tiny danger">各金額は本デモの表示例です。</p>${state.verified?'<p class="center"><span class="status-pill">本人確認済み（デモ）</span></p>':''}</div>${nextActions('本人確認手続きを始める')}`;}
function kycDocument(){return `${formError()}<h3>本人確認書類を選択</h3><p class="muted small">お手元の書類を撮影する操作を、サンプル画像で体験します。</p>${['運転免許証','マイナンバーカード','在留カード','パスポート'].map(name=>`<label class="doc-option"><input type="radio" name="document" value="${name}" ${name===state.document?'checked':''}>${icon('IdCard')}<span>${name}</span></label>`).join('')}<div class="notice-box"><h4>ご注意事項</h4><p class="tiny">デモ用のサンプル書類と人物イラストを使用します。カメラの起動、書類のアップロード、外部への送信はありません。</p></div><label class="app-radio checkbox"><input type="checkbox" id="kyc-consent"><span>注意事項を確認しました</span></label>${nextActions('次へ進む')}`;}
function sampleId(back=false){return `<div class="demo-id"><div class="id-title">${escapeHtml(state.document)} · ${back?'裏面':'表面'}</div><div class="id-body">${back?`<div class="id-lines">住居地変更記録<br>変更年月日　—<br>変更後住所　—<br>この書類は架空のサンプルです</div>`:`<div class="id-avatar">${icon('UserRound')}</div><div class="id-lines">氏名　DEMO HANAKO<br>生年月日　1990年01月01日<br>番号　DEMO 0000 0000<br>有効期限　2030年01月01日</div>`}</div><span class="id-sample">SAMPLE</span></div>`;}
function capture(kind){const face=kind==='face',back=kind==='back';return `<p class="center small">${face?'顔を枠の中に合わせてください。':`カードの${back?'裏面':'表面'}を枠の中に合わせてください。`}</p><div class="capture-viewport"><span class="capture-label">${face?'顔正面':`撮影 ｜ ${back?'裏面':'表面'}`}</span>${face?`<div class="face-preview">${icon('UserRound')}</div>`:sampleId(back)}<span class="capture-caption">サンプル画像による撮影デモ</span></div>${button(icon('Camera')+' 撮影する')}<p class="demo-note">カメラは起動しません。</p>`;}
function captureReview(kind){const face=kind==='face',back=kind==='back';const checks=face?['顔全体が写っている','正面を向いている','本人以外の顔が写り込んでいない']:['枠からはみ出さず全体が写っている','文字が鮮明に読み取れる'];return `${formError()}<div class="capture-status">撮影画像の確認</div><div class="card"><div class="capture-preview">${face?`<div class="face-preview">${icon('UserRound')}</div>`:sampleId(back)}</div><div class="review-checks">${checks.map((text,i)=>`<label class="app-radio checkbox"><input type="checkbox" name="review-check" value="${i}"><span>${text}</span></label>`).join('')}</div></div>${button('OK')}${button('再撮影','retake','quiet')}`;}
function kycSubmit(){return `<div class="card center"><div class="hero-illustration"><div class="illustration-disc">${icon('ShieldCheck')}</div></div><h3>撮影を完了しました</h3><p class="small muted">書類と顔写真の確認が完了しました。<br>「次へ」から申請してください。</p><p class="tiny muted">提出書類：${escapeHtml(state.document)}（サンプル）</p></div>${nextActions('申請する')}`;}
function kycSuccess(){return `<div class="success-page">${successMark()}<h3 class="success-heading">本人確認を受け付けました！</h3><div class="card"><h4>DEMO 本人確認手続き受付のお知らせ</h4><p class="small muted">本人確認の申請が完了しました。デモでは承認済みの状態を表示しています。</p><div class="receipt-meta"><span>ステータス</span><strong>本人確認済み（デモ）</strong></div><div class="receipt-meta"><span>1回の支払い限度額</span><strong>100,000円</strong></div><div class="receipt-meta"><span>ウォレット残高限度額</span><strong>1,000,000円</strong></div></div>${button('お知らせを確認する','notices','outline')}${button('ホームへ','home')}</div>`;}
function chargeAmount(){return `${formError()}<div class="card"><label class="app-label" for="charge-amount">チャージ金額（日本円）</label><div class="money-wrap"><input class="app-input money" id="charge-amount" inputmode="numeric" type="number" min="1000" step="1000" value="${state.chargeAmount}"></div><div class="quick-amounts">${[10000,20000,30000].map(n=>`<button data-add-amount="${n}">+${money(n)}</button>`).join('')}</div></div><div class="balance-panel"><div class="balance-row"><span>チャージ可能残高</span><strong>${money(Math.max(0,(state.verified?1000000:100000)-state.balance))}円</strong></div><div class="balance-row"><span class="small">現在の残高</span><span>${money(state.balance)}円</span></div></div><p class="tiny danger">1,000円単位で入力してください。ウォレット残高の上限は本人確認の状態により変わります。</p>${nextActions('金融機関選択へ')}`;}
function chargeBank(){return `<div class="card"><h4>ご利用の金融機関を選択してください</h4><p class="small muted">チャージ金額：<b>${money(state.chargeAmount)}円</b></p>${['デモ銀行','サンプル銀行','テスト信用金庫'].map(bank=>`<button class="bank-option" data-bank="${bank}">${icon('Landmark')}<span><strong>${bank}</strong><small>デモ用の金融機関</small></span><span class="bank-arrow">${icon('ChevronRight')}</span></button>`).join('')}</div><p class="demo-note">次の画面で銀行手続きを再現します。</p>`;}
function bankHeader(active){return `<div class="bank-sim-label">銀行サイトの操作を再現するデモ画面</div><div class="bank-header">${icon('Landmark')}${escapeHtml(state.bank)}</div><div class="bank-step">${['ログイン','内容確認','手続き完了'].map((s,i)=>`<span class="${i===active?'active':''}">${s}</span>`).join('')}</div>`;}
function bankLogin(){return `${bankHeader(0)}${formError()}${demoFill()}<div class="card"><h4>インターネットバンキング</h4><p class="tiny muted">デモ用IDをご利用ください。実際の認証情報は入力しないでください。</p>${input('bank-id','お客様ID','text','','autocomplete="off" maxlength="40"')}${input('bank-password','ログインパスワード','password','','autocomplete="off" maxlength="64"')}</div>${nextActions('ログイン（デモ）')}`;}
function bankConfirm(){return `${bankHeader(1)}<div class="card"><h4>お申し込み内容の確認</h4><div class="receipt-meta"><span>収納先</span><strong>DEMO ウォレット</strong></div><div class="receipt-meta"><span>お支払い方法</span><strong>口座振替</strong></div><div class="receipt-meta"><span>出金口座</span><strong>デモ支店 普通 0000000</strong></div><div class="receipt-amount">${money(state.chargeAmount)}<span>円</span></div><p class="tiny muted">実際の口座からの引き落としは発生しません。</p></div>${nextActions('内容を確認して実行（デモ）')}`;}
function bankComplete(){return `${bankHeader(2)}<div class="success-page">${successMark()}<h3 class="success-heading">お手続きが完了しました</h3><div class="card center"><p>チャージ金額 <b>${money(state.chargeAmount)}円</b></p><p class="small muted">ウォレットに戻り、結果を確認してください。</p></div>${button('DEMO に戻り結果を確認する')}</div>`;}
function chargeSuccess(){return `<div class="success-page">${successMark()}<h3 class="success-heading">チャージのお手続きが<br>完了しました！</h3><div class="card center"><p class="muted small">今回のチャージ額</p><div class="receipt-amount center">+${money(state.receipt?.amount||state.chargeAmount)}<span>円</span></div><p class="small">チャージ後の残高 <b>${money(state.balance)}円</b></p></div>${button('チャージ結果を確認する')}${button('ホームへ','home','outline')}</div>`;}
function mpmScan(){return `<p class="small center">お店のQRコードを読み取ってください</p><div class="scan-viewfinder">${qr()}</div>${button('デモのQRコードを読み取る')}${button('バーコード表示に切り替え','cpm-tab','outline')}<p class="demo-note">カメラは起動しません。</p>`;}
function mpmAmount(){return `${formError()}<div class="card"><h3>DEMO SHOP · TOKYO</h3><label class="app-label" for="payment-amount">お支払い金額（日本円）</label><div class="money-wrap"><input class="app-input money" id="payment-amount" type="number" inputmode="numeric" min="1" step="1" value="${state.paymentAmount}"></div></div>${limits()}${nextActions()}`;}
function mpmPin(){return `${formError()}<div class="card"><div class="receipt-amount">${money(state.paymentAmount)}<span>JPY</span></div><p class="small muted">4桁の暗証番号</p><input class="app-input pin-input" id="payment-pin" type="password" inputmode="numeric" maxlength="4" aria-label="支払い暗証番号" autocomplete="off"><p class="tiny muted">デモ用暗証番号：${escapeHtml(state.account.pin)}</p></div>${button('支払う')}`;}
function processing(){return `<div class="processing-page" role="status"><span class="spinner" aria-hidden="true"></span><p>${current().id==='kyc-processing'?'本人確認結果を確認しています…':'結果を確認しています…'}</p><p class="demo-note">デモの処理中です</p></div>`;}
function account(){return `<div class="card"><div class="account-row"><span class="account-avatar">${icon('UserRound')}</span><div><h4>${escapeHtml(state.account.surname+' '+state.account.given)}</h4><span class="tiny muted">${escapeHtml(state.account.email)}</span></div></div><div class="account-menu"><button data-action="ekyc">本人確認<span class="status-pill">${state.verified?'確認済み':'未確認'}</span></button><button data-action="signup">新規登録を体験する${icon('ChevronRight')}</button><button data-action="history">取引履歴${icon('ChevronRight')}</button></div></div>${limits()}${button('ホームへ戻る','home','outline')}`;}
function notices(){return `${state.verified?'<div class="notice-row"><strong>DEMO 本人確認手続き受付のお知らせ</strong><small>本人確認済み（デモ）・利用限度額が更新されました</small></div>':''}${state.transactions.slice(0,4).map(t=>`<div class="notice-row"><strong>DEMO ${t.amount>0?'チャージ':'お支払い'}完了のお知らせ</strong><small>${escapeHtml(t.date)} (JST)</small><p class="small">${escapeHtml(t.merchant)}<br>${money(Math.abs(t.amount))}円</p></div>`).join('')}${button('ホームへ戻る','home','outline')}`;}
const RENDERERS={home,'cpm-code':codeScreen,'pay-processing':processing,'charge-processing':processing,'kyc-processing':processing,'pay-success':receipt,history:historyScreen,welcome:()=>welcome(false),intro:()=>welcome(true),'signup-name':signupName,'signup-email':signupEmail,'signup-pin':signupPin,'signup-biometric':signupBiometric,'signup-confirm':signupConfirm,'signup-otp':signupOtp,'signup-success':signupSuccess,'kyc-intro':kycIntro,'kyc-document':kycDocument,'kyc-front':()=>capture('front'),'kyc-front-review':()=>captureReview('front'),'kyc-back':()=>capture('back'),'kyc-back-review':()=>captureReview('back'),'kyc-face':()=>capture('face'),'kyc-face-review':()=>captureReview('face'),'kyc-submit':kycSubmit,'kyc-success':kycSuccess,'charge-amount':chargeAmount,'charge-bank':chargeBank,'bank-login':bankLogin,'bank-confirm':bankConfirm,'bank-complete':bankComplete,'charge-success':chargeSuccess,'mpm-scan':mpmScan,'mpm-amount':mpmAmount,'mpm-pin':mpmPin,account,notices};
function stopTimers(){clearTimeout(playTimer);clearTimeout(processTimer);clearInterval(countdownTimer);}
function showError(message){let box=$('form-error');if(!box){box=document.createElement('div');box.id='form-error';box.className='form-error';box.setAttribute('role','alert');$('app-content').prepend(box);}box.textContent=message;box.hidden=false;$('app-content').scrollTop=0;if(state.playing){state.playing=false;updatePlayControls();}return false;}
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
function value(id){return ($(id)?.value||'').trim();}
function setValue(id,v){if($(id))$(id).value=v;}
function fillDemo(){
 switch(current().id){
 case 'signup-name':setValue('surname','デモ');setValue('given','花子');setValue('kana-surname','デモ');setValue('kana-given','ハナコ');setValue('birthday','1990-01-01');break;
 case 'signup-email':setValue('email','hanako@example.test');setValue('email-confirm','hanako@example.test');setValue('password','Demo2026!');setValue('password-confirm','Demo2026!');break;
 case 'signup-pin':setValue('new-pin','1234');setValue('new-pin-confirm','1234');break;
 case 'signup-otp':setValue('otp','123456');break;
 case 'mpm-pin':setValue('payment-pin',state.account.pin);break;
 case 'mpm-amount':setValue('payment-amount',Math.min(30000,state.balance,state.verified?100000:30000));break;
 case 'charge-amount':setValue('charge-amount',10000);break;
 case 'bank-login':setValue('bank-id','DEMO0001');setValue('bank-password','Demo2026!');break;
 case 'kyc-document':$('kyc-consent').checked=true;break;
 }
 if(current().id.endsWith('-review'))$('app-content').querySelectorAll('[name="review-check"]').forEach(el=>el.checked=true);
 if($('form-error'))$('form-error').hidden=true;
}
function validate(){
 const id=current().id;
 if(id==='signup-name'){
  if(!value('surname')||!value('given')||!value('kana-surname')||!value('kana-given'))return showError('お名前とフリガナを入力してください。');
  if(!value('birthday')||!Number.isFinite(Date.parse(value('birthday')))||new Date(value('birthday'))>new Date())return showError('生年月日を正しく入力してください。');
  Object.assign(state.account,{surname:value('surname'),given:value('given'),kanaSurname:value('kana-surname'),kanaGiven:value('kana-given'),birthday:value('birthday'),gender:value('gender')});
 }
 if(id==='signup-email'){
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email')))return showError('メールアドレスを正しく入力してください。');
  if(value('email')!==value('email-confirm'))return showError('メールアドレスが一致しません。');
  const password=value('password');
  if(password.length<8||!/[a-z]/i.test(password)||!/[0-9]/.test(password))return showError('パスワードは英字と数字を含む8文字以上で入力してください。');
  if(password!==value('password-confirm'))return showError('パスワードが一致しません。');
  state.account.email=value('email'); // Password is intentionally never copied into application state.
 }
 if(id==='signup-pin'){
  if(!/^\d{4}$/.test(value('new-pin')))return showError('暗証番号は4桁の数字で入力してください。');
  if(value('new-pin')!==value('new-pin-confirm'))return showError('暗証番号が一致しません。');
  state.account.pin=value('new-pin');
 }
 if(id==='signup-otp'&&value('otp')!=='123456')return showError('確認コードが違います。デモ用コード「123456」を入力してください。');
 if(id==='kyc-document'){
  if(!$('kyc-consent').checked)return showError('注意事項をご確認のうえ、チェックを入れてください。');
  state.document=$('app-content').querySelector('[name="document"]:checked').value;
 }
 if(id.endsWith('-review')){const boxes=[...$('app-content').querySelectorAll('[name="review-check"]')];if(boxes.some(box=>!box.checked))return showError('画像の確認項目すべてにチェックを入れてください。');}
 if(id==='charge-amount'){
  const amount=Number(value('charge-amount')),cap=state.verified?1000000:100000;
  if(!Number.isSafeInteger(amount)||amount<1000||amount%1000!==0)return showError('チャージ金額は1,000円以上、1,000円単位で入力してください。');
  if(amount+state.balance>cap)return showError(`チャージ後の残高が上限（${money(cap)}円）を超えます。金額を変更するか、本人確認をお試しください。`);
  state.chargeAmount=amount;
 }
 if(id==='bank-login'&&(!value('bank-id')||!value('bank-password')))return showError('デモ用IDとパスワードを入力してください。「デモ入力」もご利用いただけます。');
 if(id==='mpm-amount'){
  const amount=Number(value('payment-amount')),cap=state.verified?100000:30000;
  if(!Number.isSafeInteger(amount)||amount<1)return showError('支払い金額を1円以上の整数で入力してください。');
  if(amount>cap)return showError(`1回の支払い限度額は${money(cap)}円です。金額を変更してください。`);
  if(amount>state.balance)return showError('残高が不足しています。先にチャージしてください。');
  state.paymentAmount=amount;
 }
 if(id==='mpm-pin'&&value('payment-pin')!==state.account.pin)return showError(`暗証番号が違います。デモ用暗証番号は「${state.account.pin}」です。`);
 if(id==='cpm-code'&&state.balance<179)return showError('残高が不足しています。先にチャージしてください。');
 return true;
}
function commitTransaction(kind){
 if(state.receipt?.session===state.session)return;
 const charge=kind==='charge',foreign=state.flow==='cpm';
 const amount=charge?state.chargeAmount:-(foreign?179:state.paymentAmount);
 state.balance+=amount;
 const receipt={id:'DEMO-'+String(1000+state.session).padStart(8,'0'),session:state.session,merchant:charge?state.bank+'からのチャージ':foreign?'DEMO SHOP · MACAU':'DEMO SHOP · TOKYO',amount,currency:foreign&&!charge?'MOP':'JPY',label:charge?'チャージ完了':'支払い完了',date:dateTime(),balance:state.balance};
 state.receipt=receipt;state.transactions.unshift(receipt);
}
function enterStep(){const id=current().id;if(id==='pay-success')commitTransaction('pay');if(id==='charge-success')commitTransaction('charge');if(id==='signup-success')state.registered=true;if(id==='kyc-success')state.verified=true;}
function advance(auto=false){
 if(state.extra){goHome();return;}
 if(current().id.endsWith('-processing'))return;
 if(auto)fillDemo();
 if(!validate())return;
 if(state.index>=FLOWS[state.flow].steps.length-1){startFlow(state.flow);return;}
 state.index++;enterStep();
 if(state.index===FLOWS[state.flow].steps.length-1)state.playing=false;
 render();
}
function startFlow(name){if(!FLOWS[name])return;stopTimers();state.flow=name;state.index=0;state.extra=null;state.playing=false;state.session++;state.receipt=null;state.paymentAmount=30000;state.chargeAmount=10000;closeMenu();try{const url=new URL(location.href);url.searchParams.set('scene',name);history.replaceState(null,'',url.pathname+url.search+url.hash);}catch{}render();}
function goHome(){stopTimers();state.playing=false;state.extra=null;if(FLOWS[state.flow].steps[0].id!=='home')state.flow='cpm';state.index=0;try{const url=new URL(location.href);url.searchParams.set('scene',state.flow);history.replaceState(null,'',url.pathname+url.search+url.hash);}catch{}render();}
function auxiliary(view){stopTimers();state.playing=false;state.extra=view;render();}
function back(){stopTimers();state.playing=false;if(state.extra){state.extra=null;render();return;}if(state.index>0){state.index--;if(current().id.endsWith('-processing'))state.index=Math.max(0,state.index-1);render();}else goHome();}
function updatePlayControls(){
 const label=state.playing?'一時停止':'自動で体験';$('auto-play').innerHTML=icon(state.playing?'Pause':'Play')+label;$('auto-play').setAttribute('aria-pressed',String(state.playing));$('mobile-auto').innerHTML=icon(state.playing?'Pause':'Play');$('mobile-auto').setAttribute('aria-label',state.playing?'自動演示を一時停止':'自動演示を開始');$('device-mode').textContent=state.playing?'AUTO PLAY':'INTERACTIVE';
}
function togglePlay(){
 if(state.playing){state.playing=false;clearTimeout(playTimer);updatePlayControls();return;}
 if(state.extra){state.extra=null;state.index=0;}
 if(state.index===FLOWS[state.flow].steps.length-1){state.session++;state.receipt=null;state.index=0;}
 state.playing=true;render();
}
function renderHeader(){
 const s=current(),brand=s.id==='home',title=s.id==='history'?'取引履歴一覧':s.id.startsWith('signup-')?({'signup-name':'お客様情報登録','signup-email':'アカウント情報登録','signup-pin':'暗証番号登録','signup-biometric':'生体認証登録','signup-confirm':'登録内容の確認','signup-otp':'認証番号の入力','signup-success':'登録完了'}[s.id]||s.title):s.id.startsWith('kyc-')?'本人確認のお手続き':s.id.startsWith('bank-')?'金融機関でのお手続き':s.id==='charge-amount'?'チャージ金額の入力':s.id==='charge-bank'?'金融機関の選択':s.id==='cpm-code'?'お支払い':s.id==='mpm-amount'?'お支払い金額入力':s.id==='mpm-pin'?'お支払いの確認':s.title;
 $('app-header').className='app-header'+(brand?' brand-header':'');
 $('app-header').innerHTML=brand?`<div class="app-wordmark">${icon('Wallet')}<span>DEMO</span></div><button class="help-button" data-header-action="help" aria-label="デモの操作方法">${icon('CircleHelp')}</button>`:`<button class="icon-button ${state.index===0&&!state.extra?'step-back-disabled':''}" data-header-action="back" aria-label="前の画面へ">${icon('ArrowLeft')}</button><h2>${escapeHtml(title)}</h2><button class="header-action" data-header-action="home">${s.id.endsWith('success')?'完了':'中止'}</button>`;
 const light=['welcome','intro'].includes(s.id);$('status-bar')?.classList?.remove('light');const bar=document.querySelector('.status-bar');bar.style.background=light?'var(--surface)':'';bar.style.color=light?'var(--text)':'';
}
function render(){
 stopTimers();const s=current(),flow=FLOWS[state.flow],last=state.index===flow.steps.length-1;
 $('app-content').dataset.screen=s.id;$('phone-screen').dataset.screen=s.id;$('phone-screen').dataset.flow=state.flow;
 renderHeader();$('app-content').innerHTML=(RENDERERS[s.id]||home)();$('app-content').scrollTop=0;
 $('app-content').classList.remove('screen-enter');void $('app-content').offsetWidth;$('app-content').classList.add('screen-enter');
 if($('otp'))$('otp').classList.add('otp-input');if($('new-pin'))$('new-pin').classList.add('pin-input');
 document.querySelectorAll('.scenario-button[data-flow]').forEach(b=>{const selected=b.dataset.flow===state.flow;b.classList.toggle('active',selected);if(selected)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 $('flow-label').textContent=flow.name;$('step-counter').textContent=state.extra?'DETAIL':`${String(state.index+1).padStart(2,'0')} / ${String(flow.steps.length).padStart(2,'0')}`;
 $('guide-title').textContent=s.title;$('guide-description').textContent=state.extra?'ウォレット内の情報を確認できます。ホームへ戻って、演示を続けてください。':s.description;
 $('walkthrough-progress').style.width=((state.index+1)/flow.steps.length*100)+'%';
 $('steps-list').innerHTML=flow.steps.map((x,i)=>`<li class="${i<state.index?'done':i===state.index?'current':''}" ${i===state.index?'aria-current="step"':''}>${escapeHtml(x.title)}</li>`).join('');
 const active=$('steps-list').querySelector('.current');if(active)$('steps-list').scrollTop=Math.max(0,active.offsetTop-$('steps-list').offsetTop-140);
 const processingNow=s.id.endsWith('-processing');$('next-step').disabled=processingNow;$('mobile-next').disabled=processingNow;
 const nextText=state.extra?'ホームへ戻る':last?'もう一度体験':processingNow?'処理中…':'次のステップ';$('next-step').innerHTML=nextText+icon(last?'RotateCcw':'ArrowRight');$('mobile-next').innerHTML=(state.extra?'ホーム':last?'もう一度':'次へ')+icon(last?'RotateCcw':'ArrowRight');updatePlayControls();
 if(s.id==='cpm-code'){let remaining=299;countdownTimer=setInterval(()=>{remaining=Math.max(0,remaining-1);if($('code-countdown'))$('code-countdown').textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');},1000);}
 if(processingNow){const session=state.session;processTimer=setTimeout(()=>{if(state.session!==session||!current().id.endsWith('-processing'))return;state.index++;enterStep();if(state.index===flow.steps.length-1)state.playing=false;render();},1100);}else if(state.playing&&!state.extra){playTimer=setTimeout(()=>advance(true),1900);}
}
function handleAction(action){
 switch(action){
 case 'next':advance();break;
 case 'home':goHome();break;
 case 'pay':state.session++;state.receipt=null;if(state.flow==='mpm'||state.flow==='cpm'){state.index=1;state.extra=null;render();}else{startFlow('cpm');state.index=1;render();}break;
 case 'charge':if(state.flow==='charge'&&current().id==='home'){state.session++;state.receipt=null;state.index=1;render();}else startFlow('charge');break;
 case 'signup':startFlow('signup');break;
 case 'ekyc':startFlow('ekyc');break;
 case 'history':auxiliary('history');break;
 case 'account':auxiliary('account');break;
 case 'notices':auxiliary('notices');break;
 case 'balance':state.hiddenBalance=!state.hiddenBalance;render();break;
 case 'fill':fillDemo();toast('デモ用の入力内容を設定しました。');break;
 case 'biometric-enable':state.account.biometric=true;advance();break;
 case 'retake':state.index=Math.max(0,state.index-1);render();break;
 case 'mpm-tab':startFlow('mpm');state.index=1;render();break;
 case 'cpm-tab':startFlow('cpm');state.index=1;render();break;
 }
}
function openMenu(){previousFocus=document.activeElement;$('scenario-panel').classList.add('open');$('drawer-backdrop').hidden=false;$('mobile-menu').setAttribute('aria-expanded','true');$('scenario-panel').setAttribute('role','dialog');$('scenario-panel').setAttribute('aria-modal','true');$('close-menu').focus();}
function closeMenu(){if(!$('scenario-panel').classList.contains('open'))return;$('scenario-panel').classList.remove('open');$('drawer-backdrop').hidden=true;$('mobile-menu').setAttribute('aria-expanded','false');$('scenario-panel').removeAttribute('role');$('scenario-panel').removeAttribute('aria-modal');if(previousFocus?.isConnected)previousFocus.focus();}
$('scenario-nav').innerHTML=Object.entries(FLOWS).sort(([a],[b])=>['signup','ekyc','charge','cpm','mpm'].indexOf(a)-['signup','ekyc','charge','cpm','mpm'].indexOf(b)).map(([id,f],i)=>`<button class="scenario-button" data-flow="${id}"><span class="scenario-number">0${i+1}</span><span class="scenario-text"><strong>${f.name}</strong><small>${f.subtitle}</small></span>${icon(f.icon)}</button>`).join('');
$('scenario-nav').addEventListener('click',e=>{const b=e.target.closest('[data-flow]');if(b)startFlow(b.dataset.flow);});
$('app-content').addEventListener('click',e=>{
 const bank=e.target.closest('[data-bank]');if(bank){state.bank=bank.dataset.bank;advance();return;}
 const add=e.target.closest('[data-add-amount]');if(add){const n=Number(value('charge-amount'))||0;setValue('charge-amount',Math.min(1000000,n+Number(add.dataset.addAmount)));return;}
 const b=e.target.closest('[data-action]');if(b)handleAction(b.dataset.action);
});
$('app-content').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT'&&!['checkbox','radio'].includes(e.target.type)){e.preventDefault();advance();}});
$('app-header').addEventListener('click',e=>{const b=e.target.closest('[data-header-action]');if(!b)return;const action=b.dataset.headerAction;if(action==='back')back();else if(action==='home')goHome();else toast('画面をタップして操作できます。右側のガイドや「次へ」からも進めます。');});
$('next-step').addEventListener('click',()=>advance());$('mobile-next').addEventListener('click',()=>advance());$('auto-play').addEventListener('click',togglePlay);$('mobile-auto').addEventListener('click',togglePlay);$('restart').addEventListener('click',()=>startFlow(state.flow));$('mobile-menu').innerHTML=icon('Menu');$('close-menu').innerHTML=icon('X');$('mobile-menu').addEventListener('click',openMenu);$('mobile-scenarios').addEventListener('click',openMenu);$('close-menu').addEventListener('click',closeMenu);$('drawer-backdrop').addEventListener('click',closeMenu);
window.addEventListener('keydown',e=>{if(!$('scenario-panel').classList.contains('open'))return;if(e.key==='Escape'){closeMenu();return;}if(e.key==='Tab'){const els=[...$('scenario-panel').querySelectorAll('button,summary,input')].filter(el=>el.getClientRects().length&&!el.disabled);const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
window.addEventListener('pagehide',stopTimers);
window.DemoApp={getState:()=>({flow:state.flow,screen:current().id,index:state.index,balance:state.balance,verified:state.verified,registered:state.registered,transactionCount:state.transactions.length,playing:state.playing}),flows:Object.keys(FLOWS)};
hydrateIcons();const initial=new URLSearchParams(location.search).get('scene');if(initial&&FLOWS[initial])state.flow=initial;render();
})();
