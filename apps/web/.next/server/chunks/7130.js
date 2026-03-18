"use strict";exports.id=7130,exports.ids=[7130],exports.modules={96885:(e,t,i)=>{i.d(t,{Z:()=>a});/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,i(69224).Z)("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]])},42739:(e,t,i)=>{i.d(t,{Z:()=>a});/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,i(69224).Z)("Loader2",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},51838:(e,t,i)=>{i.d(t,{Z:()=>a});/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,i(69224).Z)("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]])},70793:(e,t,i)=>{i.d(t,{Ct:()=>r,dR:()=>o});var a=i(95344),s=i(11453);let n={success:"bg-success/15 text-success",warning:"bg-warning/15 text-warning",danger:"bg-danger/15 text-danger",muted:"bg-muted/15 text-muted",primary:"bg-primary/10 text-primary",secondary:"bg-secondary/15 text-secondary"};function r({variant:e="muted",children:t,className:i}){return a.jsx("span",{className:(0,s.cn)("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide",n[e],i),children:t})}function o({status:e}){return a.jsx(r,{variant:{PAID:"success",PENDING:"warning",OVERDUE:"danger",CANCELLED:"muted"}[e]??"muted",children:{PAID:"Paid",PENDING:"Pending",OVERDUE:"Overdue",CANCELLED:"Cancelled"}[e]??e})}},34034:(e,t,i)=>{i.d(t,{z:()=>c});var a=i(95344),s=i(3729),n=i(11453),r=i(42739);let o={primary:"bg-accent text-white font-semibold hover:bg-[#00a891] hover:shadow-md active:scale-95 focus:ring-2 focus:ring-accent/40",secondary:"bg-secondary text-white font-semibold hover:bg-[#345080] active:scale-95 focus:ring-2 focus:ring-secondary/40",ghost:"bg-transparent text-app-text font-medium border border-border hover:bg-surface active:scale-95 focus:ring-2 focus:ring-border",danger:"bg-danger text-white font-semibold hover:bg-[#d44433] active:scale-95 focus:ring-2 focus:ring-danger/40"},d={sm:"px-3 py-1.5 text-sm rounded-md",md:"px-5 py-2.5 text-sm rounded-input",lg:"px-6 py-3 text-base rounded-input"},c=(0,s.forwardRef)(({variant:e="primary",size:t="md",isLoading:i=!1,leftIcon:s,rightIcon:c,children:l,className:m,disabled:p,...f},u)=>(0,a.jsxs)("button",{ref:u,disabled:p||i,className:(0,n.cn)("inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",o[e],d[t],m),...f,children:[i?a.jsx(r.Z,{className:"w-4 h-4 animate-spin"}):s?a.jsx("span",{className:"shrink-0",children:s}):null,l,!i&&c&&a.jsx("span",{className:"shrink-0",children:c})]}));c.displayName="Button"},72522:(e,t,i)=>{i.d(t,{u:()=>d});var a=i(95344),s=i(3729),n=i(14513),r=i(11453);let o={sm:"max-w-sm",md:"max-w-md",lg:"max-w-lg",xl:"max-w-2xl"};function d({isOpen:e,onClose:t,title:i,children:d,size:c="md"}){return((0,s.useEffect)(()=>(e?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[e]),e)?(0,a.jsxs)("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[a.jsx("div",{className:"absolute inset-0 bg-primary/50 backdrop-blur-sm",onClick:t}),(0,a.jsxs)("div",{className:(0,r.cn)("relative w-full bg-card rounded-card shadow-2xl animate-fade-in",o[c]),children:[(0,a.jsxs)("div",{className:"flex items-center justify-between px-6 py-4 border-b border-border",children:[a.jsx("h2",{className:"font-heading font-bold text-primary text-lg",children:i}),a.jsx("button",{onClick:t,className:"p-1.5 rounded-md hover:bg-surface text-muted hover:text-primary transition-colors",children:a.jsx(n.Z,{className:"w-5 h-5"})})]}),a.jsx("div",{className:"p-6",children:d})]})]}):null}},89552:(e,t,i)=>{i.d(t,{j:()=>s});let a={English:{title:e=>e,certify:"This is to certify that",student:"Student",code:"Student Code",class:"Class",academicYear:"Academic Year",issued:"Issue Date",attendance:"Attendance Rate",grade:"Academic Average",footer:"This document is officially issued by",signature:"School Principal",seal:"OFFICIAL SEAL"},Arabic:{title:e=>({"Registration Certificate":"شهادة تسجيل","Attendance Certificate":"شهادة حضور","Completion Certificate":"شهادة إتمام الدراسة","Grade Report":"كشف الدرجات","Good Conduct Certificate":"شهادة حسن السير والسلوك"})[e]??e,certify:"يُشهد بأن",student:"الطالب",code:"رقم الطالب",class:"الفصل الدراسي",academicYear:"العام الدراسي",issued:"تاريخ الإصدار",attendance:"نسبة الحضور",grade:"المعدل الأكاديمي",footer:"هذه الوثيقة صادرة رسمياً من",signature:"مدير المدرسة",seal:"الختم الرسمي"},French:{title:e=>({"Registration Certificate":"Certificat d'Inscription","Attendance Certificate":"Certificat de Pr\xe9sence","Completion Certificate":"Certificat d'Ach\xe8vement","Grade Report":"Relev\xe9 de Notes","Good Conduct Certificate":"Certificat de Bonne Conduite"})[e]??e,certify:"Il est certifi\xe9 que",student:"\xc9l\xe8ve",code:"Code d'\xc9tudiant",class:"Classe",academicYear:"Ann\xe9e Scolaire",issued:"Date d'\xc9mission",attendance:"Taux de Pr\xe9sence",grade:"Moyenne Acad\xe9mique",footer:"Ce document est officiellement d\xe9livr\xe9 par",signature:"Directeur de l'\xc9cole",seal:"CACHET OFFICIEL"}};function s(e){let t=a[e.language],i="Arabic"===e.language,s=`<!DOCTYPE html>
<html dir="${i?"rtl":"ltr"}" lang="${i?"ar":"French"===e.language?"fr":"en"}">
<head>
  <meta charset="UTF-8" />
  <title>${t.title(e.type)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: ${i?"'Segoe UI', Tahoma, Arial":"'Plus Jakarta Sans', sans-serif"};
      background: #fff;
      color: #1e293b;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 20mm 18mm;
      display: flex;
      flex-direction: column;
      position: relative;
      background: #fff;
    }

    /* Border frame */
    .border-outer {
      position: absolute;
      inset: 8mm;
      border: 3px solid #4361ee;
      border-radius: 4px;
    }
    .border-inner {
      position: absolute;
      inset: 10mm;
      border: 1px solid #c7d2fe;
      border-radius: 3px;
    }

    /* Corner ornaments */
    .corner {
      position: absolute;
      width: 12mm;
      height: 12mm;
      border-color: #4361ee;
      border-style: solid;
    }
    .corner-tl { top: 6mm; left: 6mm; border-width: 3px 0 0 3px; }
    .corner-tr { top: 6mm; right: 6mm; border-width: 3px 3px 0 0; }
    .corner-bl { bottom: 6mm; left: 6mm; border-width: 0 0 3px 3px; }
    .corner-br { bottom: 6mm; right: 6mm; border-width: 0 3px 3px 0; }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 8mm;
    }
    .school-logo {
      width: 16mm;
      height: 16mm;
      background: #4361ee;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 3mm;
    }
    .school-logo-text {
      color: #fff;
      font-size: 18px;
      font-weight: 800;
    }
    .school-name {
      font-size: 13pt;
      font-weight: 800;
      color: #1e293b;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .school-sub {
      font-size: 8pt;
      color: #64748b;
      margin-top: 1mm;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    /* Divider */
    .divider {
      display: flex;
      align-items: center;
      gap: 4mm;
      margin: 5mm 0;
    }
    .divider-line { flex: 1; height: 1px; background: #e2e8f0; }
    .divider-diamond {
      width: 5mm; height: 5mm;
      background: #4361ee;
      transform: rotate(45deg);
    }

    /* Certificate title */
    .cert-title {
      text-align: center;
      font-size: 22pt;
      font-weight: 800;
      color: #4361ee;
      letter-spacing: 0.02em;
      margin-bottom: 2mm;
      text-transform: uppercase;
    }
    .cert-subtitle {
      text-align: center;
      font-size: 8pt;
      color: #94a3b8;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 8mm;
    }

    /* Certify text */
    .certify-text {
      text-align: center;
      font-size: 10pt;
      color: #475569;
      margin-bottom: 4mm;
    }
    .student-name {
      text-align: center;
      font-size: 22pt;
      font-weight: 800;
      color: #1e293b;
      border-bottom: 2px solid #4361ee;
      padding-bottom: 2mm;
      margin: 0 15mm 6mm;
    }

    /* Info grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3mm 8mm;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 3mm;
      padding: 5mm 8mm;
      margin-bottom: 8mm;
    }
    .info-item { display: flex; flex-direction: column; gap: 0.5mm; }
    .info-label { font-size: 7pt; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
    .info-value { font-size: 10pt; font-weight: 700; color: #1e293b; }

    /* Body text */
    .body-text {
      font-size: 10pt;
      color: #475569;
      line-height: 1.8;
      text-align: ${i?"right":"justify"};
      margin-bottom: 8mm;
    }

    /* Signature row */
    .signature-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
      padding-top: 8mm;
    }
    .sig-block { text-align: center; width: 45mm; }
    .sig-line { border-top: 1.5px solid #1e293b; padding-top: 2mm; margin-top: 12mm; }
    .sig-name { font-size: 9pt; font-weight: 700; color: #1e293b; }
    .sig-title { font-size: 7pt; color: #64748b; margin-top: 0.5mm; }

    .seal-block {
      width: 30mm; height: 30mm;
      border: 3px solid #4361ee;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 1mm;
    }
    .seal-text { font-size: 6pt; font-weight: 700; color: #4361ee; text-align: center; letter-spacing: 0.05em; text-transform: uppercase; }

    /* Footer */
    .footer {
      text-align: center;
      font-size: 7pt;
      color: #94a3b8;
      margin-top: 6mm;
      padding-top: 3mm;
      border-top: 1px solid #e2e8f0;
    }

    @media print {
      body { padding: 0; }
      .page { margin: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Border frame -->
    <div class="border-outer"></div>
    <div class="border-inner"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <!-- Header -->
    <div class="header">
      <div class="school-logo"><span class="school-logo-text">S</span></div>
      <p class="school-name">${e.schoolName}</p>
      <p class="school-sub">Excellence in Education</p>
    </div>

    <div class="divider">
      <div class="divider-line"></div>
      <div class="divider-diamond"></div>
      <div class="divider-line"></div>
    </div>

    <!-- Title -->
    <p class="cert-title">${t.title(e.type)}</p>
    <p class="cert-subtitle">Official Document \xb7 ${e.issueDate}</p>

    <!-- Certify -->
    <p class="certify-text">${t.certify}</p>
    <p class="student-name">${e.studentName}</p>

    <!-- Info grid -->
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">${t.code}</span>
        <span class="info-value">${e.studentCode}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t.class}</span>
        <span class="info-value">${e.class}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t.academicYear}</span>
        <span class="info-value">${e.academicYear}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t.issued}</span>
        <span class="info-value">${e.issueDate}</span>
      </div>
      ${e.attendanceRate?`<div class="info-item"><span class="info-label">${t.attendance}</span><span class="info-value">${e.attendanceRate}</span></div>`:""}
      ${e.averageGrade?`<div class="info-item"><span class="info-label">${t.grade}</span><span class="info-value">${e.averageGrade}</span></div>`:""}
    </div>

    <!-- Body -->
    <p class="body-text">
      ${function(e,t){let{type:i,studentName:a,class:s,academicYear:n,schoolName:r}=e;return"Registration Certificate"===i?`${a} is duly enrolled as a student at ${r} in Class ${s} for the Academic Year ${n}. This certificate is issued upon request to serve its intended purpose.`:"Attendance Certificate"===i?`${a}, a student in Class ${s} at ${r}, has maintained an attendance rate of ${e.attendanceRate??"above 90%"} during the Academic Year ${n}. This certificate is issued upon request.`:"Grade Report"===i?`${a}, enrolled in Class ${s} at ${r} for the Academic Year ${n}, has achieved an academic average of ${e.averageGrade??"—"} during this period. This report is issued upon official request.`:"Good Conduct Certificate"===i?`${a}, a student in Class ${s} at ${r}, has demonstrated exemplary behavior and good conduct throughout the Academic Year ${n}. This certificate is issued in recognition of their character.`:`${a} is a registered student in Class ${s} at ${r} for the Academic Year ${n}. This document is issued upon official request to serve its intended purpose.`}(e,0)}
    </p>

    <!-- Signatures -->
    <div class="signature-row">
      <div class="sig-block">
        <div class="sig-line">
          <p class="sig-name">${t.signature}</p>
          <p class="sig-title">${e.schoolName}</p>
        </div>
      </div>
      <div class="seal-block">
        <span class="seal-text">${t.seal}</span>
        <span class="seal-text">${e.schoolName.split(" ")[0]}</span>
      </div>
      <div class="sig-block">
        <div class="sig-line">
          <p class="sig-name">Date</p>
          <p class="sig-title">${e.issueDate}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <p class="footer">${t.footer} ${e.schoolName} \xb7 ${e.issueDate} \xb7 Document No: ${function(){let e=new Date;return`${e.getFullYear()}${String(e.getMonth()+1).padStart(2,"0")}${String(e.getDate()).padStart(2,"0")}-${Math.floor(1e3+9e3*Math.random())}`}()}</p>
  </div>
</body>
</html>`,n=document.createElement("iframe");n.style.cssText="position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:0",document.body.appendChild(n);let r=n.contentDocument??n.contentWindow?.document;r&&(r.open(),r.write(s),r.close(),setTimeout(()=>{n.contentWindow?.focus(),n.contentWindow?.print(),setTimeout(()=>document.body.removeChild(n),2e3)},800))}}};