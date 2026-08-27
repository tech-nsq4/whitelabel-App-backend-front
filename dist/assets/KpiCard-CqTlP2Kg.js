import{c as o,j as s}from"./index-BqdDOU_E.js";/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]],x=o("trending-down",p);/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]],k=o("trending-up",h);function u({label:i,value:t,unit:r,note:c,delta:n,deltaType:d,icon:l,tint:e}){return s.jsxs("div",{className:"kpi-card",style:{background:e.cardBg,border:"none"},onMouseEnter:a=>{a.currentTarget.style.transform="translateY(-3px)",a.currentTarget.style.boxShadow="0 12px 28px rgba(10,31,27,.09)"},onMouseLeave:a=>{a.currentTarget.style.transform="none",a.currentTarget.style.boxShadow="var(--shadow-xs)"},children:[s.jsx("div",{className:"kpi-card-accent",style:{background:e.iconColor}}),s.jsxs("div",{className:"kpi-card-head",children:[s.jsx("span",{className:"kpi-card-label",children:i}),s.jsx("div",{className:"kpi-card-icon",style:{background:e.iconBg,color:e.iconColor},children:l})]}),s.jsxs("div",{className:"kpi-card-value",children:[t,r&&s.jsx("span",{className:"kpi-card-unit",children:r})]}),s.jsxs("div",{className:"kpi-card-foot",children:[n&&s.jsxs("span",{className:`kpi-card-delta ${d}`,children:[d==="up"?s.jsx(k,{size:11,strokeWidth:2.2}):s.jsx(x,{size:11,strokeWidth:2.2}),n]}),c&&s.jsx("span",{className:"kpi-card-note",children:c})]})]})}export{u as K};
