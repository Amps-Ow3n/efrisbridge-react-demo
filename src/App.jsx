
import React, { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const today = () => new Date().toISOString().slice(0, 10);
const defaults = () => ({ seller:"Owen Trading Demo Ltd", customer:"Kampala Builders Ltd", tin:"1000123456", date:today(), item:"50 Bags Tororo Cement", qty:50, price:32000 });
const rules = [
  { terms:["cement","tororo"], code:"30101603", label:"Cement / construction material", confidence:96 },
  { terms:["maize flour","posho","flour"], code:"10059000", label:"Maize / cereal product (demo mapping)", confidence:89 },
  { terms:["cooking oil","sunflower oil"], code:"15079000", label:"Edible vegetable oil (demo mapping)", confidence:91 },
  { terms:["sugar"], code:"17019900", label:"Sugar (demo mapping)", confidence:94 },
  { terms:["soap","detergent"], code:"34012000", label:"Soap / cleaning product (demo mapping)", confidence:86 }
];
const steps = [
  ["Reading invoice payload","Collecting customer, item, quantity and value fields."],
  ["Mapping commodity code","Matching the item description against local demo rules."],
  ["Connecting to URA gateway","Simulating gateway validation and digital-signature checks."],
  ["Demo fiscal response received","Preparing sample FDN, verification code and QR output."]
];
function mapItem(s) {
  const m = rules.find(r => r.terms.some(t => s.toLowerCase().includes(t)));
  return m ? {...m, review:m.confidence < 90} : {code:"REVIEW_REQUIRED",label:"No confident demo mapping found",confidence:42,review:true};
}
const money = n => new Intl.NumberFormat("en-UG",{style:"currency",currency:"UGX",maximumFractionDigits:0}).format(Number(n)||0);
function Icon({name,size=18}) {
 const p={
  shield:<><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
  invoice:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></>,
  spark:<><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z"/></>,
  check:<path d="m5 12 4 4L19 6"/>, print:<><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2"/><path d="M6 14h12v8H6z"/></>,
  reset:<><path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M3 21v-5h5"/></>,
  bolt:<path d="m13 2-3 8h7l-7 12 2-9H5l8-11Z"/>, info:<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></>
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p[name]}</svg>;
}
export default function App() {
 const [form,setForm]=useState(defaults);
 const [status,setStatus]=useState("idle");
 const [active,setActive]=useState(-1);
 const [result,setResult]=useState(null);
 const [error,setError]=useState("");
 const mapping=useMemo(()=>mapItem(form.item),[form.item]);
 const total=(Number(form.qty)||0)*(Number(form.price)||0);
 function update(k,v){setForm(f=>({...f,[k]:v}));setResult(null);if(status!=="processing")setStatus("idle");setError("");}
 async function submit(e){
  e.preventDefault();
  if(!form.customer.trim()||!form.tin.trim()||!form.item.trim()){setError("Enter the customer name, TIN and item description.");return;}
  if(Number(form.qty)<=0||Number(form.price)<0){setError("Quantity must be greater than zero and price cannot be negative.");return;}
  setError("");setResult(null);setStatus("processing");
  for(let i=0;i<steps.length;i++){setActive(i);await new Promise(r=>setTimeout(r,480));}
  const fdn=`DEMO-${Date.now().toString(36).slice(-4).toUpperCase()}-${Math.random().toString(16).slice(2,10).toUpperCase()}`;
  const anti=`SAMPLE-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  setResult({fdn,anti,issued:new Date().toLocaleString("en-UG"),qr:`https://example.com/demo-efris-verification?fdn=${encodeURIComponent(fdn)}&status=DEMO`,form:{...form},mapping,total});
  setStatus("complete");setActive(4);
 }
 function reset(){setForm(defaults());setStatus("idle");setActive(-1);setResult(null);setError("");}
 return <div className="app-shell">
  <div className="demo-banner"><span className="demo-dot"/><b>DEMO MODE</b><span>Local prototype · No live URA connection · All fiscal details are sample data</span></div>
  <header className="topbar"><div className="brand-lockup"><div className="brand-mark"><Icon name="shield" size={23}/></div><div><div className="brand-name">EFRIS<span>Bridge</span></div><div className="brand-caption">Invoice automation prototype</div></div></div><div className="topbar-right"><span className="connection-pill"><span className="status-dot"/> Local demo environment</span><button className="btn btn-sm btn-outline-light reset-top" onClick={reset}><Icon name="reset" size={14}/> Reset demo</button></div></header>
  <main className="container-fluid main-wrap">
   <section className="page-intro"><div><div className="eyebrow">INTERACTIVE PRODUCT DEMO</div><h1>From invoice entry to <span>fiscal-ready output.</span></h1><p>Show how a middleware workflow could reduce duplicate entry between an accounting system and EFRIS.</p></div><div className="intro-chip"><Icon name="bolt" size={17}/> Simulated 2-second magic moment</div></section>
   <div className="workspace-grid">
    <section className="panel">
     <div className="panel-heading"><div className="heading-icon erp-icon"><Icon name="invoice" size={20}/></div><div className="heading-copy"><div className="panel-kicker">01 / INPUT</div><h2>Accounting invoice</h2><p>Simulated ERP screen</p></div><span className="app-tag">ERP</span></div>
     <form onSubmit={submit}>
      <div className="form-section-label">SELLER & CUSTOMER</div>
      <div className="mb-3"><label className="form-label" htmlFor="seller">Company / seller name</label><input id="seller" className="form-control" value={form.seller} onChange={e=>update("seller",e.target.value)}/></div>
      <div className="row g-3"><div className="col-7"><label className="form-label" htmlFor="customer">Customer name</label><input id="customer" className="form-control" value={form.customer} onChange={e=>update("customer",e.target.value)}/></div><div className="col-5"><label className="form-label" htmlFor="tin">Customer TIN</label><input id="tin" className="form-control" value={form.tin} onChange={e=>update("tin",e.target.value)} inputMode="numeric"/></div></div>
      <div className="mt-3 mb-4"><label className="form-label" htmlFor="date">Invoice date</label><input id="date" type="date" className="form-control" value={form.date} onChange={e=>update("date",e.target.value)}/></div>
      <div className="form-section-label item-label">INVOICE LINE ITEM</div>
      <div className="mb-3"><label className="form-label" htmlFor="item">Item description</label><input id="item" className="form-control" value={form.item} onChange={e=>update("item",e.target.value)}/><div className="form-hint">Try “maize flour”, “cooking oil”, “sugar” or an unknown item.</div></div>
      <div className="row g-3"><div className="col-5"><label className="form-label" htmlFor="qty">Quantity</label><input id="qty" type="number" min="1" step="1" className="form-control" value={form.qty} onChange={e=>update("qty",e.target.value)}/></div><div className="col-7"><label className="form-label" htmlFor="price">Unit price (UGX)</label><input id="price" type="number" min="0" step="100" className="form-control" value={form.price} onChange={e=>update("price",e.target.value)}/></div></div>
      <div className="invoice-total"><div><span>Invoice total</span><small>Quantity × unit price</small></div><strong>{money(total)}</strong></div>
      <div className={`mapping-preview ${mapping.review?"mapping-review":""}`}><div className="mapping-symbol"><Icon name="spark" size={17}/></div><div className="mapping-text"><div className="mapping-topline">COMMODITY MAPPING PREVIEW <span>{mapping.confidence}% match</span></div><strong>{mapping.code}</strong><p>{mapping.label}{mapping.review?" · Review recommended":""}</p></div></div>
      {error&&<div className="alert alert-danger py-2 small mt-3 mb-0">{error}</div>}
      <button className="btn submit-btn w-100 mt-4" disabled={status==="processing"} type="submit">{status==="processing"?<><span className="spinner-border spinner-border-sm me-2"/>Processing invoice…</>:<><Icon name="bolt" size={18}/> Save &amp; Submit Invoice</>}</button>
      <div className="button-footnote"><Icon name="shield" size={13}/> Demo only — no tax data is submitted to URA.</div>
     </form>
    </section>
    <section className="panel">
     <div className="panel-heading"><div className="heading-icon engine-icon"><Icon name="spark" size={20}/></div><div className="heading-copy"><div className="panel-kicker">02 / PROCESSING</div><h2>Middleware engine</h2><p>Visible explanation of background work</p></div><span className={`engine-state ${status==="complete"?"state-done":status==="processing"?"state-live":""}`}><span className="status-dot"/>{status==="complete"?"Complete":status==="processing"?"Working":"Standby"}</span></div>
     <div className="engine-summary"><div className="engine-orb"><Icon name="bolt" size={26}/></div><div><strong>{status==="complete"?"Demo response prepared":status==="processing"?"Processing invoice payload":"Waiting for an invoice"}</strong><p>{status==="complete"?"The simulated workflow has finished.":status==="processing"?"Showing each stage so the workflow is easy to understand.":"Submit the invoice to watch the workflow."}</p></div></div>
     <div className="process-track">{steps.map((s,i)=>{const done=status==="complete"||active>i;const current=status==="processing"&&active===i;return <div className={`process-step ${done?"step-done":""} ${current?"step-current":""}`} key={s[0]}><div className="step-marker">{done?<Icon name="check" size={15}/>:current?<span className="step-pulse"/>:String(i+1).padStart(2,"0")}</div><div className="step-content"><strong>{s[0]}</strong><p>{s[1]}</p>{i===1&&status!=="idle"&&<div className="code-chip">Demo commodity code: <b>{mapping.code}</b><span>{mapping.confidence}%</span></div>}{i===2&&status!=="idle"&&<div className="code-chip"><span className="mini-dot"/> Gateway status: <b>{status==="complete"?"SIMULATED RESPONSE":current?"Connecting…":"Pending"}</b></div>}</div><div className="step-status">{done?"DONE":current?"RUNNING":"WAITING"}</div></div>})}</div>
     <div className="engine-bottom"><div><Icon name="info" size={16}/></div><p><b>Prototype transparency:</b> the steps and response are simulated in your browser. No live URA gateway, signature authentication or official FDN is involved.</p></div>
     <div className={`result-teaser ${status==="complete"?"teaser-active":""}`}><div className="result-teaser-icon"><Icon name="check" size={18}/></div><div><strong>{status==="complete"?"Invoice output is ready":"Fiscal output preview"}</strong><p>{status==="complete"?"View the demo FDN, sample QR and print preview below.":"A sample fiscal-style invoice will appear here after processing."}</p></div>{status==="complete"&&<span className="ready-tag">READY</span>}</div>
    </section>
   </div>
   {result&&<section className="receipt-section" id="receipt"><div className="receipt-section-heading"><div><div className="eyebrow">03 / OUTPUT</div><h2>Fiscal invoice preview <span className="sample-pill">SAMPLE ONLY</span></h2><p>This is a visual demonstration, not an official URA fiscal document.</p></div><div className="receipt-actions"><button className="btn btn-outline-secondary" onClick={()=>window.print()}><Icon name="print" size={16}/> Print preview</button><button className="btn btn-dark" onClick={reset}><Icon name="reset" size={16}/> New invoice</button></div></div>
    <div className="receipt-paper"><div className="receipt-watermark">DEMO ONLY</div><div className="receipt-header"><div><div className="receipt-brand"><span className="receipt-brand-icon"><Icon name="shield" size={19}/></span>{result.form.seller||"Demo Company"}</div><div className="receipt-subtitle">SAMPLE FISCAL INVOICE · NOT VALID FOR TAX PURPOSES</div></div><div className="receipt-doc-type"><span>DOCUMENT TYPE</span><strong>SALES INVOICE</strong><small>Demo reference</small></div></div><div className="receipt-rule"/>
     <div className="receipt-meta-grid"><div><span>BILL TO</span><strong>{result.form.customer}</strong><small>Customer TIN: {result.form.tin}</small></div><div><span>INVOICE DATE</span><strong>{result.form.date}</strong><small>Generated: {result.issued}</small></div></div>
     <table className="table receipt-table"><thead><tr><th>DESCRIPTION</th><th>QTY</th><th>UNIT PRICE</th><th className="text-end">AMOUNT</th></tr></thead><tbody><tr><td><strong>{result.form.item}</strong><small>Demo code: {result.mapping.code}</small></td><td>{result.form.qty}</td><td>{money(result.form.price)}</td><td className="text-end">{money(result.total)}</td></tr></tbody></table>
     <div className="receipt-total-row"><div><span>Subtotal</span><strong>{money(result.total)}</strong></div><div><span>Tax treatment</span><strong>Not calculated in this demo</strong></div><div className="grand-total"><span>TOTAL (DEMO)</span><strong>{money(result.total)}</strong></div></div>
     <div className="fiscal-details"><div className="fiscal-code-block"><div className="fiscal-label"><Icon name="shield" size={15}/> DEMO FISCAL DOCUMENT NUMBER</div><strong className="fdn-value">{result.fdn}</strong><div className="fiscal-label mt-3">SAMPLE ANTI-FAKE / VERIFICATION CODE</div><strong className="anti-fake">{result.anti}</strong><p>These identifiers are randomly generated for this local prototype and are not issued by URA.</p></div><div className="qr-block"><div className="qr-frame"><QRCodeSVG value={result.qr} size={116} level="M" includeMargin/></div><strong>Demo QR code</strong><span>Encodes a sample URL only</span><small>Not a live URA verification link</small></div></div>
     <div className="receipt-footer"><span>EFRISBridge interactive prototype</span><span>Printed from local browser demo</span></div>
    </div></section>}
   <footer className="app-footer"><div><span className="footer-mark"><Icon name="shield" size={15}/></span><b>EFRISBridge</b><span>Interactive concept prototype</span></div><p>For product demonstration only. No official URA submission, FDN or tax verification is performed.</p></footer>
  </main>
 </div>;
}
