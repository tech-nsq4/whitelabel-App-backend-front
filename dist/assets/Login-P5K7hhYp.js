import{c as i,u as z,a as S,b as C,r as t,j as e,L as p,R as _,C as W,S as E,d as L}from"./index-BSDNFDL6.js";import{L as M}from"./loader-circle-CzPS2qfS.js";/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],A=i("circle-alert",$);/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],R=i("eye-off",D);/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],F=i("eye",q);/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],P=i("lock",O);/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"m10 17 5-5-5-5",key:"1bsop3"}],["path",{d:"M15 12H3",key:"6jk70r"}],["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}]],H=i("log-in",B);/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],T=i("mail",I),U=[{icon:e.jsx(p,{size:18,strokeWidth:1.6}),text:"إدارة متكاملة للمجمع الطبي"},{icon:e.jsx(W,{size:18,strokeWidth:1.6}),text:"تحليلات وتقارير فورية"},{icon:e.jsx(E,{size:18,strokeWidth:1.6}),text:"نظام صلاحيات متعدد الأدوار"},{icon:e.jsx(L,{size:18,strokeWidth:1.6}),text:"إدارة المواعيد والطوابير"}];function J(){const{login:u}=z(),{nameAr:g,nameEn:j,logo:d}=S(),y=C(),[n,N]=t.useState(""),[o,k]=t.useState(""),[r,f]=t.useState(!1),[l,a]=t.useState(""),[c,h]=t.useState(!1);async function v(s){var m,x;if(s.preventDefault(),a(""),!n.trim())return a("من فضلك أدخل البريد الإلكتروني");if(!o.trim())return a("من فضلك أدخل كلمة المرور");h(!0);try{await u(n,o),y(_.DASHBOARD,{replace:!0})}catch(b){const w=(x=(m=b.response)==null?void 0:m.data)==null?void 0:x.message;a(w||"البريد الإلكتروني أو كلمة المرور غير صحيحة")}finally{h(!1)}}return e.jsxs("div",{className:"login-page",children:[e.jsxs("div",{className:"login-side",children:[e.jsxs("div",{className:"login-side-content",children:[e.jsx("div",{className:"login-side-logo",children:d?e.jsx("img",{src:d,alt:"logo"}):e.jsx(p,{size:28,strokeWidth:1.5,color:"#fff"})}),e.jsx("h1",{className:"login-side-name",children:g}),e.jsx("p",{className:"login-side-sub",children:j}),e.jsx("div",{className:"login-side-features",children:U.map(s=>e.jsxs("div",{className:"login-feature",children:[e.jsx("span",{className:"login-feature-icon",children:s.icon}),e.jsx("span",{children:s.text})]},s.text))})]}),e.jsx("div",{className:"login-side-footer",children:"نظام إدارة المجمعات الطبية © 2026"})]}),e.jsx("div",{className:"login-main",children:e.jsxs("div",{className:"login-card",children:[e.jsxs("div",{className:"login-card-head",children:[e.jsx("h2",{children:"مرحباً بك"}),e.jsx("p",{children:"أدخل بياناتك للدخول إلى لوحة التحكم"})]}),e.jsxs("form",{className:"login-form",onSubmit:v,noValidate:!0,children:[e.jsxs("div",{className:"field",children:[e.jsx("label",{className:"field-label",htmlFor:"email",children:"البريد الإلكتروني"}),e.jsxs("div",{className:"login-input-wrap",children:[e.jsx(T,{size:15,strokeWidth:1.7,className:"login-input-icon"}),e.jsx("input",{id:"email",className:`inp login-inp${l?" has-error":""}`,type:"email",placeholder:"example@alshifa.sa",value:n,onChange:s=>{N(s.target.value),a("")},autoComplete:"email",dir:"ltr"})]})]}),e.jsxs("div",{className:"field",children:[e.jsx("label",{className:"field-label",htmlFor:"password",children:"كلمة المرور"}),e.jsxs("div",{className:"login-input-wrap",children:[e.jsx(P,{size:15,strokeWidth:1.7,className:"login-input-icon"}),e.jsx("input",{id:"password",className:`inp login-inp${l?" has-error":""}`,type:r?"text":"password",placeholder:"••••••••",value:o,onChange:s=>{k(s.target.value),a("")},autoComplete:"current-password",dir:"ltr"}),e.jsx("button",{type:"button",className:"login-show-pass",onClick:()=>f(s=>!s),"aria-label":r?"إخفاء كلمة المرور":"إظهار كلمة المرور",children:r?e.jsx(R,{size:15,strokeWidth:1.7}):e.jsx(F,{size:15,strokeWidth:1.7})})]})]}),l&&e.jsxs("div",{className:"login-error",role:"alert",children:[e.jsx(A,{size:14,strokeWidth:2}),l]}),e.jsxs("button",{className:"btn btn-p login-btn",type:"submit",disabled:c,children:[c?e.jsx(M,{size:16,className:"login-spinner-icon"}):e.jsx(H,{size:16,strokeWidth:1.8}),c?"جاري الدخول...":"دخول"]})]})]})})]})}export{J as default};
