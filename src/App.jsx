import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const supabase = createClient(
  "https://vpgwymteoyavmragtirj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZ3d5bXRlb3lhdm1yYWd0aXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTM2ODMsImV4cCI6MjA4ODc4OTY4M30.-IxaiVae32JzM1vBBw5Uycn9kzaePH6ZuOrppIyRUQM"
);
const MAPS_KEY = "AIzaSyCZ3Y4q6cOUKyo4A51VdemFbE5N4h6CULA";
const C = ["#3b82f6","#10b981","#f59e0b","#ef4444","#a855f7","#06b6d4","#f97316","#8b5cf6"];
const MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

const SC = {
  "Müsait":    {bg:"#d1fae5",text:"#065f46",dot:"#10b981"},
  "Görevde":   {bg:"#dbeafe",text:"#1e40af",dot:"#3b82f6"},
  "Bakımda":   {bg:"#fef3c7",text:"#92400e",dot:"#f59e0b"},
  "İzinli":    {bg:"#f3e8ff",text:"#6b21a8",dot:"#a855f7"},
  "Onaylandı": {bg:"#d1fae5",text:"#065f46",dot:"#10b981"},
  "Beklemede": {bg:"#fef3c7",text:"#92400e",dot:"#f59e0b"},
  "Reddedildi":{bg:"#fee2e2",text:"#991b1b",dot:"#ef4444"},
  "Tamamlandı":{bg:"#d1fae5",text:"#065f46",dot:"#10b981"},
  "Devam Ediyor":{bg:"#dbeafe",text:"#1e40af",dot:"#3b82f6"},
  "Açık":      {bg:"#fee2e2",text:"#991b1b",dot:"#ef4444"},
  "Kapalı":    {bg:"#f1f5f9",text:"#64748b",dot:"#94a3b8"},
};
const PC = {
  "Acil":  {bg:"#fee2e2",text:"#991b1b"},
  "Yüksek":{bg:"#fef3c7",text:"#92400e"},
  "Normal":{bg:"#dbeafe",text:"#1e40af"},
  "Düşük": {bg:"#f0fdf4",text:"#166534"},
};

function tr(t){if(!t)return"-";return String(t).replace(/ş/g,"s").replace(/Ş/g,"S").replace(/ğ/g,"g").replace(/Ğ/g,"G").replace(/ı/g,"i").replace(/İ/g,"I").replace(/ç/g,"c").replace(/Ç/g,"C").replace(/ö/g,"o").replace(/Ö/g,"O").replace(/ü/g,"u").replace(/Ü/g,"U");}
function calcFuel(v){const m=(parseFloat(v.donus_km)||0)-(parseFloat(v.cikis_km)||0);const f=parseFloat(v.yakit_fiyat)||0;const t=parseFloat(v.tuketim)||0;const l=m>0?m*t/100:(parseFloat(v.yakit_litre)||0);return{mesafe:m,litre:parseFloat(l.toFixed(1)),toplam:parseFloat((l*f).toFixed(2))};}
function timeAgo(ts){const d=Math.floor((Date.now()-new Date(ts).getTime())/1000);if(d<60)return`${d}s`;if(d<3600)return`${Math.floor(d/60)}dk`;if(d<86400)return`${Math.floor(d/3600)}sa`;return`${Math.floor(d/86400)}g`;}
async function audit(username,islem,detay){await supabase.from("audit_logs").insert({username,islem,detay});}
async function notif(username,mesaj,tip="bilgi"){await supabase.from("notifications").insert({username,mesaj,tip,okundu:false});}

function Badge({s}){const c=SC[s]||{bg:"#f3f4f6",text:"#374151",dot:"#9ca3af"};return <span style={{background:c.bg,color:c.text,borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}><span style={{width:5,height:5,borderRadius:"50%",background:c.dot,display:"inline-block"}}/>{s}</span>;}
function PBadge({p}){const c=PC[p]||{bg:"#f3f4f6",text:"#374151"};return <span style={{background:c.bg,color:c.text,borderRadius:4,padding:"1px 7px",fontSize:10,fontWeight:700,textTransform:"uppercase"}}>{p}</span>;}

function Modal({title,onClose,children,wide}){
  return <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)",padding:16}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:"#fff",borderRadius:16,padding:28,width:"100%",maxWidth:wide?820:560,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.2)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{margin:0,fontSize:17,fontWeight:700,color:"#0f172a",fontFamily:"'Syne',sans-serif"}}>{title}</h3>
        <button onClick={onClose} style={{background:"#f1f5f9",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:14,color:"#64748b"}}>✕</button>
      </div>
      {children}
    </div>
  </div>;
}

function Field({label,value,onChange,type="text",options,placeholder}){
  const s={width:"100%",padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:13,color:"#0f172a",background:"#f8fafc",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  return <div style={{marginBottom:12}}>
    <label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</label>
    {options?<select value={value} onChange={e=>onChange(e.target.value)} style={s}>{options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}</select>
    :type==="textarea"?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={{...s,resize:"vertical"}}/>
    :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s}/>}
  </div>;
}

function SecT({children}){return <div style={{fontSize:10,fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,marginTop:4,paddingBottom:4,borderBottom:"1px solid #f1f5f9"}}>{children}</div>;}
function Empty({icon,text}){return <div style={{padding:"44px 20px",textAlign:"center",color:"#94a3b8"}}><div style={{fontSize:32,marginBottom:8}}>{icon}</div><div style={{fontSize:13}}>{text}</div></div>;}
function Card({children,style}){return <div style={{background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)",...style}}>{children}</div>;}
function CardH({title,action}){return <div style={{padding:"16px 20px 12px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}><h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#0f172a"}}>{title}</h3>{action}</div>;}
const cbtn={flex:1,padding:"10px",border:"1.5px solid #e2e8f0",borderRadius:10,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:500,color:"#64748b"};
const pbtn={padding:"9px 18px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",border:"none",fontFamily:"inherit",background:"#0f172a",color:"#fff",display:"inline-flex",alignItems:"center",gap:7};


// ── Harita ────────────────────────────────────────────────────────────────────
function MapView({vehicles}){
  const mapRef=useRef(null),mapInst=useRef(null),markers=useRef([]);
  const cities={"34":{lat:41.008,lng:28.978,city:"Istanbul"},"06":{lat:39.933,lng:32.859,city:"Ankara"},"35":{lat:38.419,lng:27.128,city:"Izmir"},"16":{lat:40.188,lng:29.061,city:"Bursa"},"07":{lat:36.896,lng:30.713,city:"Antalya"},"01":{lat:37.0,lng:35.321,city:"Adana"},"55":{lat:41.292,lng:36.331,city:"Samsun"},"41":{lat:40.765,lng:29.940,city:"Kocaeli"}};
  const gc=p=>{if(!p)return cities["06"];const c=p.trim().replace(/\D/g,"").substring(0,2);return cities[c]||{lat:39+(Math.random()-0.5)*4,lng:35+(Math.random()-0.5)*6,city:"Turkiye"};};
  useEffect(()=>{if(window.google?.maps){init();return;}const ex=document.getElementById("gmap");if(ex){ex.addEventListener("load",init);return;}const sc=document.createElement("script");sc.id="gmap";sc.src=`https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}`;sc.async=true;sc.onload=init;document.head.appendChild(sc);},[]);
  useEffect(()=>{if(mapInst.current)updateM();},[vehicles]);
  function init(){if(!mapRef.current)return;mapInst.current=new window.google.maps.Map(mapRef.current,{center:{lat:39,lng:35},zoom:6,styles:[{featureType:"all",elementType:"geometry",stylers:[{color:"#f1f5f9"}]},{featureType:"water",stylers:[{color:"#bfdbfe"}]},{featureType:"road",elementType:"geometry",stylers:[{color:"#fff"}]},{featureType:"poi",stylers:[{visibility:"off"}]}]});updateM();}
  function updateM(){markers.current.forEach(m=>m.setMap(null));markers.current=[];vehicles.forEach(v=>{const c=gc(v.plaka);const col=v.durum==="Müsait"?"#10b981":v.durum==="Görevde"?"#3b82f6":"#f59e0b";const m=new window.google.maps.Marker({position:{lat:c.lat+(Math.random()-0.5)*0.15,lng:c.lng+(Math.random()-0.5)*0.15},map:mapInst.current,title:v.plaka,icon:{path:window.google.maps.SymbolPath.CIRCLE,scale:10,fillColor:col,fillOpacity:1,strokeColor:"#fff",strokeWeight:2}});const iw=new window.google.maps.InfoWindow({content:`<div style="font-family:sans-serif;padding:8px;min-width:140px"><b>${v.plaka}</b><br/><span style="color:#64748b;font-size:12px">${v.marka||""}</span><br/><span style="background:${col};color:#fff;padding:2px 8px;border-radius:10px;font-size:11px">${v.durum}</span>${v.sofor?`<br/><span style="font-size:11px;color:#64748b">👤 ${v.sofor}</span>`:""}<br/><span style="font-size:10px;color:#94a3b8">📍 ${c.city}</span></div>`});m.addListener("click",()=>iw.open(mapInst.current,m));markers.current.push(m);});}
  return <div>
    <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:21,color:"#0f172a",marginBottom:16}}>🗺️ Araç Konum Takibi</h2>
    <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
      {[{l:"Müsait",c:"#10b981",bg:"#d1fae5"},{l:"Görevde",c:"#3b82f6",bg:"#dbeafe"},{l:"Bakımda",c:"#f59e0b",bg:"#fef3c7"}].map(s=>(
        <div key={s.l} style={{background:s.bg,borderRadius:9,padding:"6px 13px",display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:s.c,display:"inline-block"}}/>
          <span style={{fontWeight:700,color:s.c,fontSize:12}}>{s.l}: {vehicles.filter(v=>v.durum===s.l).length}</span>
        </div>
      ))}
    </div>
    <Card><div ref={mapRef} style={{width:"100%",height:460}}/></Card>
  </div>;
}

// ── Yakıt ─────────────────────────────────────────────────────────────────────
function FuelTab({vehicles}){
  const [kayitlar,setKayitlar]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [filPlaka,setFilPlaka]=useState("");
  const [form,setForm]=useState({plaka:"",lt:"",birim_fiyat:"",fis_no:"",tarih:"",firma:"",toplam_tutar:""});
  const [loading,setLoading]=useState(false);

  useEffect(()=>{fetchKayitlar();},[]);

  const fetchKayitlar=async()=>{
    const {data}=await supabase.from("yakit_kayitlari").select("*").order("tarih",{ascending:false});
    if(data)setKayitlar(data);
  };

  const handleLtOrFiyat=(field,val)=>{
    const updated={...form,[field]:val};
    const lt=parseFloat(field==="lt"?val:updated.lt)||0;
    const fiyat=parseFloat(field==="birim_fiyat"?val:updated.birim_fiyat)||0;
    updated.toplam_tutar=lt&&fiyat?(lt*fiyat).toFixed(2):"";
    setForm(updated);
  };

  const save=async()=>{
    if(!form.plaka||!form.lt||!form.birim_fiyat||!form.tarih){alert("Plaka, litre, birim fiyat ve tarih zorunludur.");return;}
    setLoading(true);
    const lt=parseFloat(form.lt)||0;
    const fiyat=parseFloat(form.birim_fiyat)||0;
    const toplam=(lt*fiyat).toFixed(2);
    const {error}=await supabase.from("yakit_kayitlari").insert({
      plaka:form.plaka,lt:String(lt),birim_fiyat:String(fiyat),
      fis_no:form.fis_no||null,tarih:form.tarih,
      firma:form.firma||null,toplam_tutar:toplam
    });
    if(error){alert("Hata: "+error.message);setLoading(false);return;}
    setForm({plaka:"",lt:"",birim_fiyat:"",fis_no:"",tarih:"",firma:"",toplam_tutar:""});
    setShowForm(false);setLoading(false);fetchKayitlar();
  };

  const del=async(id)=>{if(!window.confirm("Kayıt silinsin mi?"))return;await supabase.from("yakit_kayitlari").delete().eq("id",id);fetchKayitlar();};

  const filtered=filPlaka?kayitlar.filter(k=>k.plaka===filPlaka):kayitlar;
  const toplamTutar=filtered.reduce((a,k)=>a+(parseFloat(k.toplam_tutar)||0),0);
  const toplamLt=filtered.reduce((a,k)=>a+(parseFloat(k.lt)||0),0);

  const inpS={width:"100%",padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const lbS={display:"block",fontSize:10,fontWeight:700,color:"#64748b",marginBottom:4,textTransform:"uppercase"};

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"#0f172a"}}>⛽ Yakıt Kayıtları</h2>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <select value={filPlaka} onChange={e=>setFilPlaka(e.target.value)}
          style={{padding:"8px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:12,fontFamily:"inherit",background:"#fff",outline:"none"}}>
          <option value="">Tüm Araçlar</option>
          {vehicles.map(v=><option key={v.id} value={v.plaka}>{v.plaka}</option>)}
        </select>
        <button onClick={()=>setShowForm(!showForm)}
          style={{padding:"9px 18px",borderRadius:9,background:"#0f172a",color:"#fff",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit"}}>
          + Yakıt Ekle
        </button>
      </div>
    </div>

    {/* Özet kartlar */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:18}}>
      {[{l:"Toplam Kayıt",v:filtered.length,i:"📋",c:"#3b82f6"},
        {l:"Toplam Litre",v:`${toplamLt.toFixed(1)} lt`,i:"⛽",c:"#f59e0b"},
        {l:"Toplam Tutar",v:`₺${toplamTutar.toLocaleString("tr-TR",{minimumFractionDigits:2})}`,i:"💰",c:"#ef4444"}
      ].map((s,i)=><div key={i} style={{background:"#fff",borderRadius:12,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
        <div style={{fontSize:18,marginBottom:4}}>{s.i}</div>
        <div style={{fontSize:18,fontWeight:800,fontFamily:"'Syne',sans-serif",color:s.c}}>{s.v}</div>
        <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{s.l}</div>
      </div>)}
    </div>

    {/* Form */}
    {showForm&&<div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 2px 8px rgba(0,0,0,0.08)",marginBottom:18,border:"1.5px solid #e2e8f0"}}>
      <div style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:14}}>⛽ Yeni Yakıt Kaydı</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
        <div>
          <label style={lbS}>Plaka</label>
          <select value={form.plaka} onChange={e=>setForm({...form,plaka:e.target.value})} style={inpS}>
            <option value="">— Araç Seç —</option>
            {vehicles.map(v=><option key={v.id} value={v.plaka}>{v.plaka} {v.marka?`- ${v.marka}`:""}</option>)}
          </select>
        </div>
        <div>
          <label style={lbS}>Litre</label>
          <input type="number" step="0.1" placeholder="0.0" value={form.lt} onChange={e=>handleLtOrFiyat("lt",e.target.value)} style={inpS}/>
        </div>
        <div>
          <label style={lbS}>Birim Fiyat (₺)</label>
          <input type="number" step="0.01" placeholder="0.00" value={form.birim_fiyat} onChange={e=>handleLtOrFiyat("birim_fiyat",e.target.value)} style={inpS}/>
        </div>
        <div>
          <label style={lbS}>Fiş No</label>
          <input type="text" placeholder="Fiş numarası" value={form.fis_no} onChange={e=>setForm({...form,fis_no:e.target.value})} style={inpS}/>
        </div>
        <div>
          <label style={lbS}>Tarih</label>
          <input type="date" value={form.tarih} onChange={e=>setForm({...form,tarih:e.target.value})} style={inpS}/>
        </div>
        <div>
          <label style={lbS}>Firma</label>
          <input type="text" placeholder="Akaryakıt firması" value={form.firma} onChange={e=>setForm({...form,firma:e.target.value})} style={inpS}/>
        </div>
        <div>
          <label style={lbS}>Toplam Tutar (₺)</label>
          <input type="number" step="0.01" placeholder="Otomatik" value={form.toplam_tutar} onChange={e=>setForm({...form,toplam_tutar:e.target.value})} style={{...inpS,background:"#f0fdf4",fontWeight:700,color:"#166534"}}/>
        </div>
      </div>
      <div style={{display:"flex",gap:9,marginTop:14}}>
        <button onClick={()=>setShowForm(false)} style={{padding:"9px 18px",borderRadius:9,background:"#f1f5f9",color:"#334155",border:"none",cursor:"pointer",fontWeight:600,fontFamily:"inherit"}}>İptal</button>
        <button onClick={save} disabled={loading} style={{padding:"9px 24px",borderRadius:9,background:"#10b981",color:"#fff",border:"none",cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>
          {loading?"Kaydediliyor...":"✓ Kaydet"}
        </button>
      </div>
    </div>}

    {/* Tablo */}
    <div style={{background:"#fff",borderRadius:14,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",overflow:"hidden"}}>
      {filtered.length===0
        ?<div style={{padding:"44px 20px",textAlign:"center",color:"#94a3b8"}}>
          <div style={{fontSize:36,marginBottom:8}}>⛽</div>
          <div>Henüz yakıt kaydı yok</div>
        </div>
        :<table className="dt">
          <thead>
            <tr>
              <th>Plaka</th><th>Litre</th><th>Birim Fiyat</th>
              <th>Fiş No</th><th>Tarih</th><th>Firma</th><th>Toplam Tutar</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(k=><tr key={k.id}>
              <td><span style={{fontFamily:"monospace",fontWeight:700,background:"#f1f5f9",padding:"2px 8px",borderRadius:5,fontSize:12}}>{k.plaka}</span></td>
              <td>{parseFloat(k.lt||0).toFixed(1)} lt</td>
              <td>₺{parseFloat(k.birim_fiyat||0).toFixed(2)}</td>
              <td style={{color:"#64748b"}}>{k.fis_no||"—"}</td>
              <td style={{color:"#64748b"}}>{k.tarih||"—"}</td>
              <td style={{color:"#64748b"}}>{k.firma||"—"}</td>
              <td><span style={{fontWeight:700,color:"#ef4444"}}>₺{parseFloat(k.toplam_tutar||0).toLocaleString("tr-TR",{minimumFractionDigits:2})}</span></td>
              <td><button className="ab" style={{background:"#fee2e2",color:"#991b1b"}} onClick={()=>del(k.id)}>🗑</button></td>
            </tr>)}
            <tr style={{background:"#f8fafc",fontWeight:700}}>
              <td colSpan={1}>TOPLAM</td>
              <td>{toplamLt.toFixed(1)} lt</td>
              <td colSpan={4}></td>
              <td style={{color:"#ef4444"}}>₺{toplamTutar.toLocaleString("tr-TR",{minimumFractionDigits:2})}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      }
    </div>
  </div>;
}

// ── Raporlar ──────────────────────────────────────────────────────────────────
function ReportsTab({vehicles,drivers,staff,logs}){
  const [rt,setRt]=useState("vehicle");
  const [period,setPeriod]=useState("monthly");
  const [yr,setYr]=useState(new Date().getFullYear());
  const [mo,setMo]=useState(new Date().getMonth()+1);
  const [sid,setSid]=useState("");

  const fl=ls=>ls.filter(l=>{if(!l.tarih)return false;const d=new Date(l.tarih);if(isNaN(d))return false;if(period==="monthly")return d.getFullYear()===yr&&d.getMonth()+1===mo;return d.getFullYear()===yr;});
  const sum=ls=>({g:ls.length,km:ls.reduce((a,b)=>a+(parseFloat(b.mesafe)||0),0),lt:ls.reduce((a,b)=>a+(parseFloat(b.yakit_litre)||0),0),tl:ls.reduce((a,b)=>a+(parseFloat(b.toplam_maliyet)||0),0)});

  const items=rt==="vehicle"?vehicles:rt==="driver"?drivers:staff;
  const lk=rt==="vehicle"?"plaka":"ad";
  const forItem=item=>{
    if(rt==="vehicle")return fl(logs.filter(l=>l.vehicle_plaka===item.plaka));
    if(rt==="driver")return fl(logs.filter(l=>l.driver===item.ad));
    return fl(logs.filter(l=>{try{return JSON.parse(l.staff_ids||"[]").includes(item.ad);}catch{return false;}}));
  };
  const sel=sid?items.find(i=>String(i.id)===sid):null;
  const curLogs=sel?forItem(sel):fl(logs);
  const s=sum(curLogs);

  // Önceki dönem
  const prevLogs=logs.filter(l=>{if(!l.tarih)return false;const d=new Date(l.tarih);if(isNaN(d))return false;if(period==="monthly"){let pm=mo-1,py=yr;if(pm===0){pm=12;py--;}return d.getFullYear()===py&&d.getMonth()+1===pm;}return d.getFullYear()===yr-1;});
  const ps=sum(sel?prevLogs.filter(l=>rt==="vehicle"?l.vehicle_plaka===sel.plaka:l.driver===sel.ad):prevLogs);
  const diff=(c,p)=>{if(!p)return null;const pct=((c-p)/Math.max(p,1)*100).toFixed(1);return{pct,up:c>=p};};

  const chartData=items.map(it=>{const sm=sum(forItem(it));return{name:it[lk],km:sm.km,tl:sm.tl,g:sm.g};}).filter(d=>d.g>0);

  const pdfExport=()=>{
    const doc=new jsPDF();
    doc.setFillColor(15,23,42);doc.rect(0,0,210,40,"F");
    doc.setTextColor(255,255,255);doc.setFontSize(18);doc.setFont("helvetica","bold");doc.text("FleetTrack - Rapor",20,17);
    doc.setFontSize(10);doc.setFont("helvetica","normal");
    doc.text(tr(sel?sel[lk]:"Tum Kayitlar"),20,28);
    doc.text(period==="monthly"?`${MONTHS[mo-1]} ${yr}`:String(yr),160,28);
    autoTable(doc,{startY:48,head:[["Tarih","Gorev","Arac","Sofor","KM","Yakit(lt)","TL"]],body:curLogs.map(l=>[l.tarih||"-",tr(l.gorev_adi||"-"),tr(l.vehicle_plaka||"-"),tr(l.driver||"-"),`${parseFloat(l.mesafe||0).toLocaleString()}`,l.yakit_litre||"0",`${parseFloat(l.toplam_maliyet||0).toLocaleString("tr-TR")}`]),headStyles:{fillColor:[15,23,42]},alternateRowStyles:{fillColor:[248,250,252]},styles:{font:"helvetica",fontSize:9}});
    autoTable(doc,{startY:doc.lastAutoTable.finalY+8,head:[["Toplam Gorev","Toplam KM","Toplam Yakit","Toplam TL"]],body:[[s.g,`${s.km.toLocaleString()} km`,`${s.lt.toFixed(1)} lt`,`${s.tl.toLocaleString("tr-TR")} TL`]],headStyles:{fillColor:[59,130,246]},styles:{font:"helvetica",fontSize:10,fontStyle:"bold"}});
    doc.setFillColor(15,23,42);doc.rect(0,280,210,17,"F");doc.setTextColor(255,255,255);doc.setFontSize(9);doc.text("FleetTrack Arac & Talep Yonetim Sistemi",20,290);
    doc.save(`rapor-${Date.now()}.pdf`);
  };
  const csvExport=()=>{
    const BOM="\uFEFF";
    const h=["Tarih","Görev","Araç","Şoför","KM","Yakıt(lt)","Maliyet(₺)"];
    const b=curLogs.map(l=>[l.tarih||"-",l.gorev_adi||"-",l.vehicle_plaka||"-",l.driver||"-",l.mesafe||"0",l.yakit_litre||"0",l.toplam_maliyet||"0"]);
    b.push([],[" TOPLAM","","","",s.km,s.lt.toFixed(1),s.tl]);
    const csv=[h,...b].map(r=>r.map(c=>`"${(c||"").toString().replace(/"/g,'""')}"`).join(",")).join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([BOM+csv],{type:"text/csv;charset=utf-8;"}));a.download=`rapor-${Date.now()}.csv`;a.click();
  };

  const sel2={padding:"8px 11px",borderRadius:8,border:"1.5px solid #e2e8f0",fontSize:12,fontFamily:"inherit",background:"#f8fafc",outline:"none"};
  return <div>
    <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:21,color:"#0f172a",marginBottom:18}}>📈 Raporlar</h2>
    <div style={{display:"flex",gap:9,marginBottom:18,flexWrap:"wrap",alignItems:"flex-end"}}>
      {[
        {l:"Tür",el:<select value={rt} onChange={e=>{setRt(e.target.value);setSid("");}} style={sel2}><option value="vehicle">🚗 Araç</option><option value="driver">🧑 Şoför</option><option value="staff">👥 Personel</option></select>},
        {l:"Dönem",el:<select value={period} onChange={e=>setPeriod(e.target.value)} style={sel2}><option value="monthly">Aylık</option><option value="yearly">Yıllık</option></select>},
        {l:"Yıl",el:<select value={yr} onChange={e=>setYr(Number(e.target.value))} style={sel2}>{[2023,2024,2025,2026].map(y=><option key={y} value={y}>{y}</option>)}</select>},
        ...(period==="monthly"?[{l:"Ay",el:<select value={mo} onChange={e=>setMo(Number(e.target.value))} style={sel2}>{MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select>}]:[]),
        {l:rt==="vehicle"?"Araç":"Kişi",el:<select value={sid} onChange={e=>setSid(e.target.value)} style={sel2}><option value="">Tümü</option>{items.map(i=><option key={i.id} value={String(i.id)}>{i[lk]}</option>)}</select>},
      ].map(({l,el},i)=><div key={i}><div style={{fontSize:9,fontWeight:700,color:"#64748b",marginBottom:3,textTransform:"uppercase"}}>{l}</div>{el}</div>)}
      <button onClick={pdfExport} style={{padding:"8px 14px",borderRadius:8,background:"#ef4444",color:"#fff",border:"none",cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"inherit"}}>📄 PDF</button>
      <button onClick={csvExport} style={{padding:"8px 14px",borderRadius:8,background:"#10b981",color:"#fff",border:"none",cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"inherit"}}>📊 Excel</button>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13,marginBottom:18}}>
      {[{l:"Toplam Görev",c:s.g,p:ps.g,i:"📋",clr:"#3b82f6"},{l:"Toplam KM",c:s.km,p:ps.km,i:"🛣️",clr:"#0f172a",fmt:v=>`${v.toLocaleString()} km`},{l:"Toplam Yakıt",c:s.lt,p:ps.lt,i:"⛽",clr:"#f59e0b",fmt:v=>`${v.toFixed(1)} lt`},{l:"Toplam Maliyet",c:s.tl,p:ps.tl,i:"💰",clr:"#ef4444",fmt:v=>`₺${v.toLocaleString("tr-TR")}`}].map((x,i)=>{
        const d=diff(x.c,x.p);
        return <div key={i} style={{background:"#fff",borderRadius:13,padding:15,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:17,marginBottom:4}}>{x.i}</div>
          <div style={{fontSize:16,fontWeight:800,fontFamily:"'Syne',sans-serif",color:x.clr}}>{x.fmt?x.fmt(x.c):x.c}</div>
          <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{x.l}</div>
          {d&&<div style={{fontSize:10,fontWeight:600,color:d.up?"#10b981":"#ef4444",marginTop:3}}>{d.up?"↑":"↓"} %{Math.abs(d.pct)} önceki döneme göre</div>}
        </div>;
      })}
    </div>

    {chartData.length>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
      <Card><CardH title="KM Dağılımı"/>
        <div style={{padding:13,height:220}}><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}}/><Tooltip formatter={v=>[`${v} km`,"KM"]}/><Bar dataKey="km" fill="#3b82f6" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></div>
      </Card>
      <Card><CardH title="Maliyet Dağılımı (₺)"/>
        <div style={{padding:13,height:220}}><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}}/><Tooltip formatter={v=>[`₺${v}`,"Maliyet"]}/><Bar dataKey="tl" fill="#ef4444" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></div>
      </Card>
    </div>}

    <Card>
      <CardH title={`Görev Listesi (${curLogs.length})`}/>
      {curLogs.length===0?<Empty icon="📋" text="Bu dönemde görev kaydı yok"/>:(
        <div style={{overflowX:"auto"}}>
          <table className="data-table">
            <thead><tr><th>Tarih</th><th>Görev</th><th>Araç</th><th>Şoför</th><th>Birim</th><th>KM</th><th>Yakıt</th><th>Maliyet</th></tr></thead>
            <tbody>{curLogs.map(l=><tr key={l.id}>
              <td style={{color:"#64748b",fontSize:11}}>{l.tarih}</td>
              <td style={{fontWeight:600,fontSize:12}}>{l.gorev_adi||"-"}</td>
              <td><span style={{fontFamily:"monospace",fontWeight:700,background:"#f1f5f9",padding:"2px 6px",borderRadius:4,fontSize:11}}>{l.vehicle_plaka||"-"}</span></td>
              <td style={{color:"#64748b",fontSize:11}}>{l.driver||"-"}</td>
              <td style={{fontSize:11,color:"#64748b"}}>{l.birim||"-"}</td>
              <td style={{fontWeight:600}}>{parseFloat(l.mesafe||0).toLocaleString()} km</td>
              <td style={{color:"#64748b"}}>{l.yakit_litre||"-"} lt</td>
              <td><span style={{fontWeight:700,color:"#ef4444"}}>₺{parseFloat(l.toplam_maliyet||0).toLocaleString("tr-TR")}</span></td>
            </tr>)}</tbody>
          </table>
        </div>
      )}
    </Card>
  </div>;
}


// ── Login ──────────────────────────────────────────────────────────────────────
function Login({setUser}){
  const [tab,setTab]=useState("login");
  const [l,setL]=useState({user:"",pass:""});
  const [r,setR]=useState({user:"",pass:"",pass2:""});
  const [err,setErr]=useState("");const [loading,setLoading]=useState(false);

  const doLogin=async()=>{
    if(!l.user||!l.pass){setErr("Tüm alanları doldurun");return;}
    setLoading(true);
    const {data,error}=await supabase.rpc("verify_user",{p_username:l.user,p_password:l.pass});
    setLoading(false);
    if(error||!data?.length){setErr("Hatalı kullanıcı adı veya şifre");return;}
    const u=data[0];
    await audit(u.username,"Giriş","Sisteme giriş yapıldı");
    setErr("");setUser({userId:u.id,username:u.username,role:u.role});
  };
  const doReg=async()=>{
    if(!r.user||!r.pass||!r.pass2){setErr("Tüm alanları doldurun");return;}
    if(r.pass.length<6){setErr("Şifre en az 6 karakter olmalı");return;}
    if(r.pass!==r.pass2){setErr("Şifreler eşleşmiyor");return;}
    if(r.user.length<3){setErr("Kullanıcı adı en az 3 karakter");return;}
    setLoading(true);
    const {data:ex}=await supabase.from("users").select("id").eq("username",r.user);
    if(ex?.length){setErr("Bu kullanıcı adı alınmış");setLoading(false);return;}
    const {data:all}=await supabase.from("users").select("id");
    const role=(!all||all.length===0)?"admin":"user";
    await supabase.rpc("register_user",{p_username:r.user,p_password:r.pass,p_role:role});
    await audit(r.user,"Kayıt",`Yeni kullanıcı (${role})`);
    setLoading(false);setErr("");setTab("login");
    alert(`✅ Kayıt başarılı! Rol: ${role==="admin"?"👑 Admin":"👤 Kullanıcı"}`);
  };

  return <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif}`}</style>
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1e3a5f)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"#fff",borderRadius:20,padding:38,width:"100%",maxWidth:420,boxShadow:"0 32px 80px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:26}}>
          <div style={{width:50,height:50,background:"#0f172a",borderRadius:13,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:10}}>🚐</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:21,color:"#0f172a"}}>FleetTrack</div>
          <div style={{fontSize:11,color:"#94a3b8",marginTop:3}}>Araç & Talep Yönetim Sistemi</div>
        </div>
        <div style={{display:"flex",background:"#f1f5f9",borderRadius:10,padding:4,marginBottom:20}}>
          {["login","register"].map(t=><button key={t} onClick={()=>{setTab(t);setErr("");}} style={{flex:1,padding:"8px",border:"none",borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,background:tab===t?"#0f172a":"transparent",color:tab===t?"#fff":"#64748b",transition:"all 0.2s"}}>{t==="login"?"Giriş Yap":"Kayıt Ol"}</button>)}
        </div>
        {err&&<div style={{background:"#fee2e2",color:"#991b1b",padding:"9px 13px",borderRadius:8,fontSize:12,marginBottom:13}}>{err}</div>}
        {tab==="login"?<>
          <Field label="Kullanıcı Adı" value={l.user} onChange={v=>setL({...l,user:v})} placeholder="kullanici_adi"/>
          <Field label="Şifre" value={l.pass} onChange={v=>setL({...l,pass:v})} type="password" placeholder="••••••••"/>
          <button onClick={doLogin} disabled={loading} style={{width:"100%",padding:"12px",background:"#0f172a",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>{loading?"Giriş yapılıyor...":"Giriş Yap"}</button>
        </>:<>
          <Field label="Kullanıcı Adı" value={r.user} onChange={v=>setR({...r,user:v})} placeholder="en az 3 karakter"/>
          <Field label="Şifre" value={r.pass} onChange={v=>setR({...r,pass:v})} type="password" placeholder="en az 6 karakter"/>
          <Field label="Şifre Tekrar" value={r.pass2} onChange={v=>setR({...r,pass2:v})} type="password" placeholder="••••••••"/>
          <button onClick={doReg} disabled={loading} style={{width:"100%",padding:"12px",background:"#0f172a",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>{loading?"Kaydediliyor...":"Kayıt Ol"}</button>
          <div style={{marginTop:12,padding:"9px 13px",background:"#f8fafc",borderRadius:8,fontSize:11,color:"#64748b"}}>💡 İlk kayıt <b>admin</b> yetkisi alır.</div>
        </>}
      </div>
    </div>
  </>;
}

export default function App(){
  const [user,setUser]=useState(()=>{try{const s=localStorage.getItem("ft_user");return s?JSON.parse(s):null;}catch{return null;}});
  const handle=u=>{if(u)localStorage.setItem("ft_user",JSON.stringify(u));else localStorage.removeItem("ft_user");setUser(u);};
  if(!user)return <Login setUser={handle}/>;
  return <Dashboard user={user} setUser={handle}/>;
}


function Dashboard({user,setUser}){
  const [tab,setTab]=useState("dashboard");
  const [vehicles,setVehicles]=useState([]);
  const [drivers,setDrivers]=useState([]);
  const [staff,setStaff]=useState([]);
  const [units,setUnits]=useState([]);
  const [requests,setRequests]=useState([]);
  const [reservations,setReservations]=useState([]);
  const [mLogs,setMLogs]=useState([]);
  const [notifs,setNotifs]=useState([]);
  const [arizalar,setArizalar]=useState([]);
  const [auditLogs,setAuditLogs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState(null);

  const [showVeh,setShowVeh]=useState(false);
  const [showDrv,setShowDrv]=useState(false);
  const [showStf,setShowStf]=useState(false);
  const [showUnit,setShowUnit]=useState(false);
  const [showReq,setShowReq]=useState(false);
  const [showRes,setShowRes]=useState(false);
  const [showApp,setShowApp]=useState(false);
  const [showKm,setShowKm]=useState(false);
  const [showArz,setShowArz]=useState(false);
  const [showBkm,setShowBkm]=useState(false);
  const [selReq,setSelReq]=useState(null);
  const [selVeh,setSelVeh]=useState(null);
  const [selLog,setSelLog]=useState(null);
  const [showGDurum,setShowGDurum]=useState(false);

  const [fVeh,setFVeh]=useState({plaka:"",marka:"",yil:"",km:""});
  const [fDrv,setFDrv]=useState({ad:"",telefon:""});
  const [fStf,setFStf]=useState({ad:"",birim:"",telefon:"",unvan:""});
  const [fUnit,setFUnit]=useState({ad:""});
  const [fReq,setFReq]=useState({talep:"",talep_konusu:"",talep_tanimi:"",gorev_aciklama:"",talep_eden:"",tarih:"",saat:"",gorev_yeri:"",durum:"Beklemede",oncelik:"Normal"});
  const [fRes,setFRes]=useState({plaka:"",personel:"",tarih:"",saat:"",aciklama:"",durum:"Beklemede"});
  const [fApp,setFApp]=useState({arac:"",sofor:""});
  const [fKm,setFKm]=useState({cikis_km:"",donus_km:"",yakit_litre:"",yakit_fiyat:"",tuketim:""});
  const [fArz,setFArz]=useState({vehicle_plaka:"",bildiren:"",aciklama:"",oncelik:"Normal"});
  const [fBkm,setFBkm]=useState({bakim_km:"",bakim_tarih:""});
  const [rqBirim,setRqBirim]=useState("");
  const [rqStaff,setRqStaff]=useState([]);
  const [vSearch,setVSearch]=useState("");
  const [vFilt,setVFilt]=useState("all");
  const [reqExp,setReqExp]=useState({});
  const [reqAtama,setReqAtama]=useState({});
  const [reqKm,setReqKm]=useState({});

  const isAdmin=user.role==="admin";
  useEffect(()=>{if(!isAdmin)setTab("requests");},[isAdmin]);

  const tst=(msg,c="green")=>{setToast({msg,c});setTimeout(()=>setToast(null),4000);};

  // Tarayıcı geri tuşunu engelle
  useEffect(()=>{
    window.history.pushState(null,"",window.location.href);
    const handler=()=>{window.history.pushState(null,"",window.location.href);};
    window.addEventListener("popstate",handler);
    return()=>window.removeEventListener("popstate",handler);
  },[]);


  const load=useCallback(async()=>{
    setLoading(true);
    const fetchOne=async(table,order="id",asc=true)=>{
      try{const {data,error}=await supabase.from(table).select("*").order(order,{ascending:asc});
      if(error)console.error(table,error.message);return data||[];}catch(e){console.error(table,e);return [];}
    };
    // Tüm tabloları paralel çek - çok daha hızlı
    const [v,d,s,u,r,ml,n,ar,al]=await Promise.all([
      fetchOne("vehicles"),
      fetchOne("drivers"),
      fetchOne("staff"),
      fetchOne("units"),
      fetchOne("requests","created_at",false),
      fetchOne("mission_logs","created_at",false),
      fetchOne("notifications","created_at",false),
      fetchOne("arizalar","created_at",false),
      fetchOne("audit_logs","created_at",false),
    ]);
    setVehicles(v);setDrivers(d);setStaff(s);setUnits(u);setRequests(r);
    setMLogs(ml);setNotifs(n);setArizalar(ar);setAuditLogs(al);
    setLoading(false);
  },[]);

  useEffect(()=>{load();},[load]);

  // Arka planda otomatik yenileme (30 saniyede bir)
  useEffect(()=>{
    const iv=setInterval(()=>{load();},30000);
    return()=>clearInterval(iv);
  },[load]);

  // Realtime (Paket D)
  useEffect(()=>{
    const ch=supabase.channel("rt")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"requests"},p=>{
        if(isAdmin)tst(`📋 Yeni talep: ${p.new.talep} — ${p.new.talep_eden}`,"blue");
        load();
      })
      .on("postgres_changes",{event:"*",schema:"public",table:"notifications"},()=>load())
      .on("postgres_changes",{event:"*",schema:"public",table:"vehicles"},()=>load())
      .subscribe();
    return()=>{supabase.removeChannel(ch);};
  },[isAdmin]);

  // CRUD
  const addVeh=async()=>{
    if(!fVeh.plaka||!fVeh.marka)return;
    const{error}=await supabase.from("vehicles").insert({...fVeh,durum:"Müsait",sofor:null,cikis_km:"",donus_km:"",yakit_litre:"",yakit_fiyat:"",tuketim:"",bakim_km:"",bakim_tarih:"",sigorta_bitis:"",muayene_bitis:""});
    if(error){tst("❌ Plaka zaten kayıtlı!","red");return;}
    await audit(user.username,"Araç Eklendi",fVeh.plaka);
    setFVeh({plaka:"",marka:"",yil:"",km:""});setShowVeh(false);load();
    tst(`✅ ${fVeh.plaka} eklendi`);
  };
  const delVeh=async(id,p)=>{if(!window.confirm("Araç silinsin mi?"))return;await supabase.from("vehicles").delete().eq("id",id);await audit(user.username,"Araç Silindi",p);load();};

  const addDrv=async()=>{if(!fDrv.ad)return;await supabase.from("drivers").insert({...fDrv,durum:"Müsait",arac:null});await audit(user.username,"Şoför Eklendi",fDrv.ad);setFDrv({ad:"",telefon:""});setShowDrv(false);load();};
  const delDrv=async(id,a)=>{if(!window.confirm("Şoför silinsin mi?"))return;await supabase.from("drivers").delete().eq("id",id);await audit(user.username,"Şoför Silindi",a);load();};

  const addStf=async()=>{if(!fStf.ad)return;await supabase.from("staff").insert(fStf);setFStf({ad:"",birim:"",telefon:"",unvan:""});setShowStf(false);load();};
  const delStf=async(id,a)=>{if(!window.confirm("Personel silinsin mi?"))return;await supabase.from("staff").delete().eq("id",id);await audit(user.username,"Personel Silindi",a);load();};

  const addUnit=async()=>{if(!fUnit.ad)return;await supabase.from("units").insert(fUnit);setFUnit({ad:""});setShowUnit(false);load();};
  const delUnit=async(id,a)=>{if(!window.confirm("Birim silinsin mi?"))return;await supabase.from("units").delete().eq("id",id);await audit(user.username,"Birim Silindi",a);load();};

  const addReq=async()=>{
    if(!fReq.talep||!fReq.talep_eden){tst("Talep konusu ve talep eden zorunludur","yellow");return;}
    const yolcular=rqBirim?JSON.stringify(staff.filter(s=>s.birim===rqBirim).map(s=>s.ad)):JSON.stringify(rqStaff);
    // Sadece DB'de kesin olan sütunlar - önce mevcut kayıt yapısını test et
    // Sadece kesin olan sütunlar — eksik sütunlar için Supabase'e ALTER TABLE çalıştırın
    const payload={
      talep:fReq.talep,
      talep_eden:fReq.talep_eden,
      tarih:fReq.tarih||null,
      saat:fReq.saat||null,
      durum:"Beklemede",
      oncelik:fReq.oncelik||"Normal",
      yolcular,
      birim:rqBirim||null,
      arac:null,
      sofor:null
    };
    // Opsiyonel sütunlar — DB'de varsa ekle
    if(fReq.gorev_yeri) payload.gorev_yeri=fReq.gorev_yeri;
    if(fReq.gorev_aciklama) payload.gorev_aciklama=fReq.gorev_aciklama;
    const {data:inserted,error}=await supabase.from("requests").insert(payload).select();
    if(error){
      tst("Kayıt hatası: "+error.message,"red");
      console.error("INSERT ERROR:",JSON.stringify(error,null,2));
      return;
    }
    await audit(user.username,"Talep Oluşturuldu",fReq.talep);
    // Tüm adminlere bildirim gönder
    const {data:adminUsers}=await supabase.from("users").select("username").eq("role","admin");
    if(adminUsers){for(const au of adminUsers){await notif(au.username,"Yeni talep: "+fReq.talep+" — "+fReq.talep_eden,"talep");}}
    // Talep eden kişiye de bildirim
    if(!isAdmin){await notif(user.username,"Talebiniz alındı: "+fReq.talep,"bilgi");}
    setFReq({talep:"",talep_konusu:"",talep_tanimi:"",gorev_aciklama:"",talep_eden:"",tarih:"",saat:"",gorev_yeri:"",durum:"Beklemede",oncelik:"Normal"});
    setRqBirim("");setRqStaff([]);setShowReq(false);load();
    tst("✅ Talep oluşturuldu");
  };
  const delReq=async(id,t)=>{if(!window.confirm("Talep silinsin mi?"))return;await supabase.from("requests").delete().eq("id",id);await audit(user.username,"Talep Silindi",t);load();};

  const openApp=req=>{setSelReq(req);setFApp({arac:"",sofor:""});setShowApp(true);};
  const confirmApp=async()=>{
    if(!selReq)return;
    await supabase.from("requests").update({durum:"Onaylandı",arac:fApp.arac,sofor:fApp.sofor}).eq("id",selReq.id);
    if(fApp.arac)await supabase.from("vehicles").update({durum:"Görevde",sofor:fApp.sofor}).eq("plaka",fApp.arac);
    if(fApp.sofor)await supabase.from("drivers").update({durum:"Görevde"}).eq("ad",fApp.sofor);
    await supabase.from("mission_logs").insert({request_id:selReq.id,vehicle_plaka:fApp.arac,driver:fApp.sofor,staff_ids:selReq.yolcular||"[]",birim:selReq.birim||"",gorev_adi:selReq.talep,tarih:selReq.tarih,cikis_km:"",donus_km:"",mesafe:"0",yakit_litre:"0",yakit_fiyat:"0",tuketim:"0",toplam_maliyet:"0",gorev_durumu:"Devam Ediyor"});
    await audit(user.username,"Talep Onaylandı",`${selReq.talep} → ${fApp.arac}/${fApp.sofor}`);
    await notif(selReq.talep_eden,`Talebiniz onaylandı: ${selReq.talep}. Araç: ${fApp.arac}`,"onay");
    setShowApp(false);setSelReq(null);load();
    tst("✅ Talep onaylandı, araç atandı");
  };
  const rejectReq=async(id,t,te)=>{
    await supabase.from("requests").update({durum:"Reddedildi"}).eq("id",id);
    await notif(te,`Talebiniz reddedildi: ${t}`,"red");
    await audit(user.username,"Talep Reddedildi",t);
    load();
  };

  const openKm=v=>{setSelVeh(v);setFKm({cikis_km:v.cikis_km||"",donus_km:v.donus_km||"",yakit_litre:v.yakit_litre||"",yakit_fiyat:v.yakit_fiyat||"",tuketim:v.tuketim||""});setShowKm(true);};
  const saveKm=async()=>{
    if(!selVeh)return;
    const don=parseFloat(fKm.donus_km)||0,cik=parseFloat(fKm.cikis_km)||0;
    const mes=Math.max(0,don-cik);
    const lt=mes>0?mes*(parseFloat(fKm.tuketim)||0)/100:(parseFloat(fKm.yakit_litre)||0);
    const mal=lt*(parseFloat(fKm.yakit_fiyat)||0);
    await supabase.from("vehicles").update({...fKm,km:don>0?String(don):selVeh.km,durum:"Müsait",sofor:null}).eq("id",selVeh.id);
    const lg=mLogs.find(l=>l.vehicle_plaka===selVeh.plaka&&l.toplam_maliyet==="0");
    if(lg)await supabase.from("mission_logs").update({cikis_km:fKm.cikis_km,donus_km:fKm.donus_km,mesafe:String(mes),yakit_litre:String(lt.toFixed(1)),yakit_fiyat:fKm.yakit_fiyat,tuketim:fKm.tuketim,toplam_maliyet:mal.toFixed(2),gorev_durumu:"Tamamlandı"}).eq("id",lg.id);
    if(selVeh.sofor)await supabase.from("drivers").update({durum:"Müsait"}).eq("ad",selVeh.sofor);
    await audit(user.username,"KM Güncellendi",`${selVeh.plaka}: ${cik}→${don} (${mes}km, ₺${mal.toFixed(0)})`);
    setShowKm(false);setSelVeh(null);load();
    tst(`✅ ${selVeh.plaka} görevi bitti. ${mes}km, ₺${mal.toFixed(0)}`);
  };

  const addArz=async()=>{
    if(!fArz.vehicle_plaka||!fArz.aciklama)return;
    await supabase.from("arizalar").insert({...fArz,durum:"Açık"});
    await supabase.from("vehicles").update({durum:"Bakımda"}).eq("plaka",fArz.vehicle_plaka);
    await audit(user.username,"Arıza Bildirimi",`${fArz.vehicle_plaka}: ${fArz.aciklama}`);
    if(isAdmin)await notif(user.username,`Arıza: ${fArz.vehicle_plaka} — ${fArz.aciklama}`,"ariza");
    setFArz({vehicle_plaka:"",bildiren:"",aciklama:"",oncelik:"Normal"});setShowArz(false);load();
    tst("⚠ Arıza bildirildi, araç bakıma alındı","yellow");
  };
  const closeArz=async(id,p)=>{await supabase.from("arizalar").update({durum:"Kapalı"}).eq("id",id);await supabase.from("vehicles").update({durum:"Müsait"}).eq("plaka",p);await audit(user.username,"Arıza Kapatıldı",p);load();};

  const saveBkm=async()=>{
    if(!selVeh)return;
    await supabase.from("vehicles").update({bakim_km:fBkm.bakim_km,bakim_tarih:fBkm.bakim_tarih,sigorta_bitis:fBkm.sigorta_bitis||null,muayene_bitis:fBkm.muayene_bitis||null}).eq("id",selVeh.id);
    await audit(user.username,"Araç Bilgileri Güncellendi",`${selVeh.plaka}`);
    setShowBkm(false);setSelVeh(null);load();tst("✅ Araç bilgileri kaydedildi");
  };

  const assignDrv=async(vid,s)=>{await supabase.from("vehicles").update({sofor:s}).eq("id",vid);load();};
  const updateRes=async(id,d)=>{await supabase.from("reservations").update({durum:d}).eq("id",id);load();};
  const markRead=async()=>{await supabase.from("notifications").update({okundu:true}).eq("username",user.username).eq("okundu",false);load();};

  const reqPDF=(r)=>{
    let yolcular=[];try{yolcular=JSON.parse(r.yolcular||"[]");}catch{}
    const doc=new jsPDF();
    doc.setFillColor(15,23,42);doc.rect(0,0,210,40,"F");
    doc.setTextColor(255,255,255);doc.setFontSize(18);doc.setFont("helvetica","bold");doc.text("FleetTrack - Gorev Fisi",20,17);
    doc.setFontSize(10);doc.setFont("helvetica","normal");doc.text(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`,20,28);
    autoTable(doc,{startY:48,head:[["Alan","Bilgi"]],body:[["Talep",tr(r.talep)],["Aciklama",tr(r.gorev_aciklama)],["Talep Eden",tr(r.talep_eden)],["Tarih",r.tarih||"-"],["Saat",r.saat||"-"],["Gorev Yeri",tr(r.gorev_yeri)],["Birim",tr(r.birim)],["Oncelik",tr(r.oncelik)],["Durum",tr(r.durum)],["Arac",tr(r.arac)],["Sofor",tr(r.sofor)],["Yolcular",tr(yolcular.join(", "))]],headStyles:{fillColor:[15,23,42]},alternateRowStyles:{fillColor:[248,250,252]},styles:{font:"helvetica",fontSize:10}});
    doc.setFillColor(15,23,42);doc.rect(0,280,210,17,"F");doc.setTextColor(255,255,255);doc.setFontSize(9);doc.text("FleetTrack Arac & Talep Yonetim Sistemi",20,290);
    doc.save(`gorev-${r.id}.pdf`);
  };

  const exportVeh=()=>{
    const BOM="\uFEFF";
    const rows=[["Plaka","Marka","Yil","Durum","KM","Sofor","Bakim KM","Bakim Tarih","Sigorta Bitis","Muayene Bitis"]];
    vehicles.forEach(v=>rows.push([v.plaka,v.marka,v.yil,v.durum,v.km,v.sofor||"",v.bakim_km||"",v.bakim_tarih||"",v.sigorta_bitis||"",v.muayene_bitis||""]));
    const csv=rows.map(r=>r.map(c=>`"${(c||"").toString().replace(/"/g,'""')}"`).join(",")).join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([BOM+csv],{type:"text/csv;charset=utf-8;"}));a.download="araclar.csv";a.click();
  };

  const ST={totalVeh:vehicles.length,avail:vehicles.filter(v=>v.durum==="Müsait").length,duty:vehicles.filter(v=>v.durum==="Görevde").length,maint:vehicles.filter(v=>v.durum==="Bakımda").length,pendReq:(isAdmin?requests:requests.filter(r=>r.talep_eden===user.username)).filter(r=>r.durum==="Beklemede").length,appReq:(isAdmin?requests:requests.filter(r=>r.talep_eden===user.username)).filter(r=>r.durum==="Onaylandı").length,fuel:vehicles.reduce((a,v)=>a+calcFuel(v).toplam,0),openArz:arizalar.filter(a=>a.durum==="Açık").length,bakimW:vehicles.filter(v=>v.bakim_km&&v.km&&parseFloat(v.km)>=parseFloat(v.bakim_km)).length,sigortaW:vehicles.filter(v=>{if(!v.sigorta_bitis)return false;const d=Math.ceil((new Date(v.sigorta_bitis)-new Date())/(1000*60*60*24));return d<=30;}).length,muayeneW:vehicles.filter(v=>{if(!v.muayene_bitis)return false;const d=Math.ceil((new Date(v.muayene_bitis)-new Date())/(1000*60*60*24));return d<=30;}).length};

  const tabs=isAdmin
    ?[{id:"dashboard",label:"📊 Özet"},{id:"vehicles",label:"🚗 Araçlar"},{id:"drivers",label:"🧑 Şoförler"},{id:"staff",label:"👥 Personel"},{id:"requests",label:"📋 Talepler"},{id:"fuel",label:"⛽ Yakıt"},{id:"reports",label:"📈 Raporlar"},{id:"map",label:"🗺️ Harita"},{id:"admin",label:"🛡️ Admin"}]
    :[{id:"requests",label:"📋 Talepler"}];

  if(loading)return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f1f5f9"}}><div style={{textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>🚐</div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:"#0f172a"}}>Yükleniyor...</div></div></div>;


  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}body{background:#f1f5f9;font-family:'DM Sans',sans-serif}
      .tb{background:none;border:none;cursor:pointer;padding:6px 11px;border-radius:8px;font-size:11.5px;font-weight:500;color:#64748b;transition:all 0.2s;font-family:'DM Sans',sans-serif;white-space:nowrap}
      .tb:hover{background:#f1f5f9;color:#0f172a}.tb.act{background:#0f172a;color:#fff}
      .dt{width:100%;border-collapse:collapse}
      .dt th{text-align:left;padding:9px 13px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid #f1f5f9;background:#fafafa}
      .dt td{padding:10px 13px;font-size:12.5px;color:#334155;border-bottom:1px solid #f8fafc;vertical-align:top}
      .dt tr:hover td{background:#f8fafc}.dt tr:last-child td{border-bottom:none}
      .ab{padding:4px 9px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:'DM Sans',sans-serif}
      ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
    `}</style>

    {/* Toast */}
    {toast&&<div style={{position:"fixed",top:18,right:18,zIndex:9999,background:toast.c==="red"?"#ef4444":toast.c==="yellow"?"#f59e0b":toast.c==="blue"?"#3b82f6":"#10b981",color:"#fff",borderRadius:10,padding:"11px 18px",fontSize:13,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",maxWidth:360}}>{toast.msg}</div>}

    <div style={{minHeight:"100vh",background:"#f1f5f9"}}>
      {/* HEADER */}
      <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1700,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
          <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
            <div style={{width:30,height:30,background:"#0f172a",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🚐</div>
            <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:"#0f172a",lineHeight:1}}>FleetTrack</div><div style={{fontSize:9,color:"#94a3b8"}}>Araç & Talep Yönetimi</div></div>
          </div>
          <div style={{display:"flex",gap:2,background:"#f8fafc",padding:3,borderRadius:10,overflowX:"auto",maxWidth:"calc(100vw - 300px)"}}>
            {tabs.map(t=><button key={t.id} className={`tb ${tab===t.id?"act":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
            <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{user.username}</div><div style={{fontSize:9,color:isAdmin?"#1e40af":"#94a3b8",fontWeight:600}}>{isAdmin?"👑 Admin":"👤 Kullanıcı"}</div></div>
            <button onClick={async()=>{await audit(user.username,"Çıkış","");setUser(null);}} style={{background:"#fee2e2",color:"#991b1b",border:"none",borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Çıkış</button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1700,margin:"0 auto",padding:16}}>


        {/* ÖZET */}
        {tab==="dashboard"&&<div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"#0f172a",marginBottom:16}}>Genel Durum</h2>
          {(ST.openArz>0||ST.bakimW>0||ST.sigortaW>0||ST.muayeneW>0)&&<div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
            {ST.openArz>0&&<div style={{background:"#fff5f5",border:"1.5px solid #fecaca",borderRadius:10,padding:"9px 14px",fontSize:12,color:"#991b1b",fontWeight:600}}>🔧 {ST.openArz} açık arıza var</div>}
            {ST.bakimW>0&&<div style={{background:"#fffbeb",border:"1.5px solid #fde68a",borderRadius:10,padding:"9px 14px",fontSize:12,color:"#92400e",fontWeight:600}}>⚠ {ST.bakimW} araç bakım zamanı geldi</div>}
            {ST.sigortaW>0&&<div style={{background:"#fff5f5",border:"1.5px solid #fecaca",borderRadius:10,padding:"9px 14px",fontSize:12,color:"#991b1b",fontWeight:600}}>🛡 {ST.sigortaW} araç sigortası bitiyor/bitti</div>}
            {ST.muayeneW>0&&<div style={{background:"#fff5f5",border:"1.5px solid #fecaca",borderRadius:10,padding:"9px 14px",fontSize:12,color:"#991b1b",fontWeight:600}}>🔍 {ST.muayeneW} araç muayenesi bitiyor/bitti</div>}
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:20}}>
            {[{l:"Toplam Araç",v:ST.totalVeh,i:"🚗",c:"#0f172a"},{l:"Müsait",v:ST.avail,i:"✅",c:"#10b981"},{l:"Görevde",v:ST.duty,i:"🔵",c:"#3b82f6"},{l:"Bakımda",v:ST.maint,i:"🔧",c:"#f59e0b"},{l:"Bekleyen Talep",v:ST.pendReq,i:"⏳",c:"#f59e0b"},{l:"Onaylı Talep",v:ST.appReq,i:"📌",c:"#10b981"},{l:"Açık Arıza",v:ST.openArz,i:"🚨",c:"#ef4444"},{l:"Şoför",v:drivers.length,i:"🧑",c:"#a855f7"},{l:"Personel",v:staff.length,i:"👥",c:"#06b6d4"},{l:"Toplam Yakıt",v:`₺${ST.fuel.toLocaleString("tr-TR",{maximumFractionDigits:0})}`,i:"⛽",c:"#ef4444"}].map((s,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:12,padding:15,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:17,marginBottom:4}}>{s.i}</div>
                <div style={{fontSize:i===9?13:21,fontWeight:800,fontFamily:"'Syne',sans-serif",color:s.c}}>{s.v}</div>
                <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:16}}>
            <Card><CardH title="Araç Dağılımı"/>
              <div style={{padding:13,height:185,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {vehicles.length===0?<Empty icon="🚗" text="Veri yok"/>:<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{name:"Müsait",value:ST.avail},{name:"Görevde",value:ST.duty},{name:"Bakımda",value:ST.maint}].filter(d=>d.value>0)} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({name,value})=>`${name}:${value}`} labelLine={false} fontSize={10}>{[0,1,2].map(i=><Cell key={i} fill={C[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer>}
              </div>
            </Card>
            <Card><CardH title="Talep Dağılımı"/>
              <div style={{padding:13,height:185,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {requests.length===0?<Empty icon="📋" text="Veri yok"/>:<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{name:"Beklemede",value:ST.pendReq},{name:"Onaylandı",value:ST.appReq},{name:"Reddedildi",value:(isAdmin?requests:requests.filter(r=>r.talep_eden===user.username)).filter(r=>r.durum==="Reddedildi").length}].filter(d=>d.value>0)} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({name,value})=>`${name}:${value}`} labelLine={false} fontSize={10}>{[0,1,2].map(i=><Cell key={i} fill={C[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer>}
              </div>
            </Card>
            <Card><CardH title="Aylık Görev Sayısı"/>
              <div style={{padding:13,height:185}}>
                {mLogs.length===0?<Empty icon="📊" text="Veri yok"/>:(()=>{
                  const now=new Date();
                  const md=MONTHS.slice(0,now.getMonth()+1).map((m,i)=>({ay:m.substring(0,3),sayi:mLogs.filter(l=>{const d=new Date(l.created_at||l.tarih||"");return d.getFullYear()===now.getFullYear()&&d.getMonth()===i;}).length}));
                  return <ResponsiveContainer width="100%" height="100%"><BarChart data={md}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="ay" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}}/><Tooltip/><Bar dataKey="sayi" fill="#3b82f6" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer>;
                })()}
              </div>
            </Card>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card><CardH title="Son Talepler" action={<button onClick={()=>setTab("requests")} style={{background:"none",border:"none",color:"#3b82f6",fontSize:12,cursor:"pointer",fontWeight:600}}>Tümü →</button>}/>
              {requests.length===0?<Empty icon="📋" text="Talep yok"/>:requests.slice(0,5).map(r=>(
                <div key={r.id} style={{padding:"9px 18px",borderBottom:"1px solid #f8fafc"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><div style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{r.talep}</div><Badge s={r.durum}/></div>
                  <div style={{fontSize:10,color:"#94a3b8"}}>{r.talep_eden} · {r.tarih}</div>
                </div>
              ))}
            </Card>
            <Card><CardH title="Açık Arızalar" action={<button onClick={()=>setTab("arizalar")} style={{background:"none",border:"none",color:"#3b82f6",fontSize:12,cursor:"pointer",fontWeight:600}}>Tümü →</button>}/>
              {arizalar.filter(a=>a.durum==="Açık").length===0?<Empty icon="✅" text="Açık arıza yok"/>:arizalar.filter(a=>a.durum==="Açık").slice(0,5).map(a=>(
                <div key={a.id} style={{padding:"9px 18px",borderBottom:"1px solid #f8fafc"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontFamily:"monospace",fontWeight:700,fontSize:11,background:"#fee2e2",color:"#991b1b",padding:"1px 6px",borderRadius:4}}>{a.vehicle_plaka}</span><PBadge p={a.oncelik}/></div>
                  <div style={{fontSize:11,color:"#64748b"}}>{a.aciklama}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>}

        {/* ARAÇLAR */}
        {tab==="vehicles"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"#0f172a"}}>Araç Plakaları</h2>
            {isAdmin&&<div style={{display:"flex",gap:7}}><button style={pbtn} onClick={()=>setShowArz(true)}>🔧 Arıza Bildir</button><button style={pbtn} onClick={()=>{setSelVeh(null);setFBkm({bakim_km:"",bakim_tarih:"",sigorta_bitis:"",muayene_bitis:""});setShowBkm(true);}}>🗓 Bakım/Sigorta/Muayene</button><button style={pbtn} onClick={()=>setShowVeh(true)}>+ Araç Ekle</button></div>}
          </div>
          <div style={{display:"flex",gap:9,marginBottom:13,flexWrap:"wrap"}}>
            <input placeholder="Plaka ara..." value={vSearch} onChange={e=>setVSearch(e.target.value)} style={{padding:"7px 11px",borderRadius:8,border:"1.5px solid #e2e8f0",fontSize:12,fontFamily:"inherit",background:"#f8fafc",outline:"none"}}/>
            <select value={vFilt} onChange={e=>setVFilt(e.target.value)} style={{padding:"7px 11px",borderRadius:8,border:"1.5px solid #e2e8f0",fontSize:12,fontFamily:"inherit",background:"#f8fafc",outline:"none"}}>
              <option value="all">Tüm Durumlar</option><option value="Müsait">Müsait</option><option value="Görevde">Görevde</option><option value="Bakımda">Bakımda</option>
            </select>
            {isAdmin&&<button onClick={exportVeh} style={{padding:"7px 12px",borderRadius:8,border:"1.5px solid #e2e8f0",fontSize:12,fontFamily:"inherit",background:"#fff",cursor:"pointer",fontWeight:600,color:"#334155"}}>⬇ Excel</button>}
          </div>
          <Card>
            {vehicles.length===0?<Empty icon="🚗" text="Henüz araç eklenmedi"/>:<div style={{overflowX:"auto"}}>
              <table className="dt">
                <thead><tr><th>Plaka</th><th>Marka</th><th>Yıl</th><th>KM</th><th>Son Görev KM</th><th>Mesafe</th><th>Maliyet</th><th>Bakım</th><th>Sigorta</th><th>Muayene</th><th>Durum</th><th>Şoför</th>{isAdmin&&<th>İşlem</th>}</tr></thead>
                <tbody>
                  {vehicles.filter(v=>vFilt==="all"||v.durum===vFilt).filter(v=>(v.plaka||"").toLowerCase().includes(vSearch.toLowerCase())).map(v=>{
                    const f=calcFuel(v);
                    const bw=v.bakim_km&&v.km&&parseFloat(v.km)>=parseFloat(v.bakim_km);
                    const by=v.bakim_km&&v.km&&parseFloat(v.bakim_km)-parseFloat(v.km)<1000&&parseFloat(v.bakim_km)-parseFloat(v.km)>0;
                    return <tr key={v.id}>
                      <td>
                        <span style={{fontWeight:700,background:"#f1f5f9",padding:"2px 7px",borderRadius:5,fontFamily:"monospace",fontSize:11}}>{v.plaka}</span>
                        {bw&&<div style={{color:"#ef4444",fontSize:9,fontWeight:600,marginTop:2}}>⛔ Bakım gerekli</div>}
                        {by&&!bw&&<div style={{color:"#f59e0b",fontSize:9,fontWeight:600,marginTop:2}}>⚠ Bakım yaklaşıyor</div>}
                      </td>
                      <td>{v.marka}</td>
                      <td style={{color:"#64748b"}}>{v.yil}</td>
                      <td style={{fontFamily:"monospace",fontWeight:600,fontSize:11}}>{v.km?`${parseFloat(v.km).toLocaleString()} km`:"—"}</td>
                      <td style={{fontSize:11,color:"#64748b"}}>{v.cikis_km&&<div>Çıkış: {parseFloat(v.cikis_km).toLocaleString()}</div>}{v.donus_km&&<div>Dönüş: {parseFloat(v.donus_km).toLocaleString()}</div>}</td>
                      <td style={{fontWeight:600}}>{f.mesafe>0?`${f.mesafe.toLocaleString()} km`:"—"}</td>
                      <td>{f.toplam>0?<span style={{fontWeight:700,color:"#ef4444",fontSize:11}}>₺{f.toplam.toLocaleString("tr-TR")}</span>:<span style={{color:"#cbd5e1"}}>—</span>}</td>
                      <td style={{fontSize:11}}>{v.bakim_tarih&&<div style={{color:"#64748b"}}>📅 {v.bakim_tarih}</div>}{v.bakim_km&&<div style={{color:"#64748b"}}>🔧 {parseFloat(v.bakim_km).toLocaleString()} km</div>}{!v.bakim_km&&!v.bakim_tarih&&<span style={{color:"#cbd5e1"}}>—</span>}</td>
                      <td style={{fontSize:11}}>{(()=>{if(!v.sigorta_bitis)return <span style={{color:"#cbd5e1"}}>—</span>;const d=new Date(v.sigorta_bitis),now=new Date(),diff=Math.ceil((d-now)/(1000*60*60*24));const expired=diff<0,soon=diff>=0&&diff<=30;return <div style={{color:expired?"#ef4444":soon?"#f59e0b":"#10b981",fontWeight:600}}>{expired?"⛔":soon?"⚠":"✅"} {v.sigorta_bitis}{expired&&" (Bitti)"}{soon&&` (${diff}g kaldı)`}</div>;})()}</td>
                      <td style={{fontSize:11}}>{(()=>{if(!v.muayene_bitis)return <span style={{color:"#cbd5e1"}}>—</span>;const d=new Date(v.muayene_bitis),now=new Date(),diff=Math.ceil((d-now)/(1000*60*60*24));const expired=diff<0,soon=diff>=0&&diff<=30;return <div style={{color:expired?"#ef4444":soon?"#f59e0b":"#10b981",fontWeight:600}}>{expired?"⛔":soon?"⚠":"✅"} {v.muayene_bitis}{expired&&" (Bitti)"}{soon&&` (${diff}g kaldı)`}</div>;})()}</td>
                      <td><Badge s={v.durum}/></td>
                      <td>{isAdmin?<select value={v.sofor||""} onChange={e=>assignDrv(v.id,e.target.value)} style={{padding:"4px 7px",borderRadius:6,border:"1.5px solid #e2e8f0",fontSize:11,fontFamily:"inherit",background:"#f8fafc",outline:"none"}}><option value="">— Seç —</option>{drivers.map(d=><option key={d.id} value={d.ad}>{d.ad} [{d.durum}]</option>)}</select>:<span style={{color:v.sofor?"#0f172a":"#cbd5e1",fontSize:12}}>{v.sofor||"—"}</span>}</td>
                      {isAdmin&&<td><div style={{display:"flex",gap:4}}>
                        <button className="ab" style={{background:"#dbeafe",color:"#1e40af"}} onClick={()=>openKm(v)}>📍 KM</button>
                        <button className="ab" style={{background:"#f3e8ff",color:"#6b21a8"}} onClick={()=>{setSelVeh(v);setFBkm({bakim_km:v.bakim_km||"",bakim_tarih:v.bakim_tarih||"",sigorta_bitis:v.sigorta_bitis||"",muayene_bitis:v.muayene_bitis||""});setShowBkm(true);}}>🗓</button>
                        <button className="ab" style={{background:"#fee2e2",color:"#991b1b"}} onClick={()=>delVeh(v.id,v.plaka)}>🗑</button>
                      </div></td>}
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>}
          </Card>
        </div>}

        {/* ŞOFÖRLER */}
        {tab==="drivers"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"#0f172a"}}>Şoför Listesi</h2>
            {isAdmin&&<button style={pbtn} onClick={()=>setShowDrv(true)}>+ Şoför Ekle</button>}
          </div>
          <Card>{drivers.length===0?<Empty icon="🧑" text="Şoför eklenmedi"/>:
            <table className="dt">
              <thead><tr><th>Ad Soyad</th><th>Telefon</th><th>Durum</th><th>Araç</th>{isAdmin&&<th>İşlem</th>}</tr></thead>
              <tbody>{drivers.map(d=><tr key={d.id}>
                <td><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:30,height:30,borderRadius:"50%",background:`hsl(${d.id*47%360},60%,88%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:`hsl(${d.id*47%360},50%,35%)`,flexShrink:0}}>{(d.ad||"?").split(" ").map(n=>n[0]).join("")}</div><span style={{fontWeight:600}}>{d.ad}</span></div></td>
                <td style={{color:"#64748b",fontFamily:"monospace",fontSize:11}}>{d.telefon||"—"}</td>
                <td><Badge s={d.durum}/></td>
                <td>{d.arac?<span style={{fontWeight:700,background:"#f1f5f9",padding:"2px 7px",borderRadius:4,fontFamily:"monospace",fontSize:11}}>{d.arac}</span>:<span style={{color:"#cbd5e1"}}>—</span>}</td>
                {isAdmin&&<td><button className="ab" style={{background:"#fee2e2",color:"#991b1b"}} onClick={()=>delDrv(d.id,d.ad)}>🗑 Sil</button></td>}
              </tr>)}</tbody>
            </table>}
          </Card>
        </div>}

        {/* PERSONEL */}
        {tab==="staff"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"#0f172a"}}>Kurum Personeli</h2>
            {isAdmin&&<div style={{display:"flex",gap:7}}><button style={{...pbtn,background:"#64748b"}} onClick={()=>setShowUnit(true)}>+ Birim Ekle</button><button style={pbtn} onClick={()=>setShowStf(true)}>+ Personel Ekle</button></div>}
          </div>
          {units.map(u=>{
            const us=staff.filter(s=>s.birim===u.ad);
            return <div key={u.id} style={{marginBottom:18}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#0f172a"}}>🏢 {u.ad}</div>
                <span style={{background:"#f1f5f9",color:"#64748b",borderRadius:11,padding:"1px 9px",fontSize:11,fontWeight:600}}>{us.length} kişi</span>
                {isAdmin&&<button className="ab" style={{background:"#fee2e2",color:"#991b1b"}} onClick={()=>delUnit(u.id,u.ad)}>🗑</button>}
              </div>
              <Card>{us.length===0?<div style={{padding:"16px 20px",color:"#94a3b8",fontSize:12}}>Bu birimde personel yok</div>:
                <table className="dt">
                  <thead><tr><th>Ad Soyad</th><th>Ünvan</th><th>Telefon</th>{isAdmin&&<th>İşlem</th>}</tr></thead>
                  <tbody>{us.map(s=><tr key={s.id}>
                    <td><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:"50%",background:`hsl(${s.id*53%360},55%,88%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:`hsl(${s.id*53%360},45%,35%)`}}>{(s.ad||"?").split(" ").map(n=>n[0]).join("")}</div><span style={{fontWeight:600,fontSize:12}}>{s.ad}</span></div></td>
                    <td style={{color:"#64748b",fontSize:12}}>{s.unvan||"—"}</td>
                    <td style={{color:"#64748b",fontFamily:"monospace",fontSize:11}}>{s.telefon||"—"}</td>
                    {isAdmin&&<td><button className="ab" style={{background:"#fee2e2",color:"#991b1b"}} onClick={()=>delStf(s.id,s.ad)}>🗑</button></td>}
                  </tr>)}</tbody>
                </table>}
              </Card>
            </div>;
          })}
          {staff.filter(s=>!units.find(u=>u.ad===s.birim)).length>0&&<div>
            <div style={{fontWeight:700,fontSize:14,color:"#94a3b8",marginBottom:8}}>Birimsiz Personel</div>
            <Card><table className="dt"><thead><tr><th>Ad Soyad</th><th>Birim</th><th>Ünvan</th>{isAdmin&&<th>İşlem</th>}</tr></thead>
              <tbody>{staff.filter(s=>!units.find(u=>u.ad===s.birim)).map(s=><tr key={s.id}><td style={{fontWeight:600,fontSize:12}}>{s.ad}</td><td style={{color:"#64748b",fontSize:12}}>{s.birim||"—"}</td><td style={{color:"#64748b",fontSize:12}}>{s.unvan||"—"}</td>{isAdmin&&<td><button className="ab" style={{background:"#fee2e2",color:"#991b1b"}} onClick={()=>delStf(s.id,s.ad)}>🗑</button></td>}</tr>)}</tbody>
            </table></Card>
          </div>}
          {units.length===0&&staff.length===0&&<Empty icon="👥" text="Henüz personel eklenmedi"/>}
        </div>}


        {/* TALEPLER */}
        {tab==="requests"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16}}>
            <div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"#0f172a",marginBottom:8}}>
                {isAdmin?"Araç Talepleri":"Taleplerim"}
              </h2>
              <div style={{display:"flex",gap:8}}>
                <span style={{background:"#fef3c7",color:"#92400e",borderRadius:20,padding:"3px 14px",fontSize:12,fontWeight:700}}>⏳ Bekleyen: {(isAdmin?requests:requests.filter(r=>r.talep_eden===user.username)).filter(r=>r.durum==="Beklemede").length}</span>
                <span style={{background:"#d1fae5",color:"#065f46",borderRadius:20,padding:"3px 14px",fontSize:12,fontWeight:700}}>✅ Onaylı: {(isAdmin?requests:requests.filter(r=>r.talep_eden===user.username)).filter(r=>r.durum==="Onaylandı").length}</span>
                <span style={{background:"#fee2e2",color:"#991b1b",borderRadius:20,padding:"3px 14px",fontSize:12,fontWeight:700}}>✕ Reddedilen: {(isAdmin?requests:requests.filter(r=>r.talep_eden===user.username)).filter(r=>r.durum==="Reddedildi").length}</span>
                <span style={{background:"#dbeafe",color:"#1e40af",borderRadius:20,padding:"3px 14px",fontSize:12,fontWeight:700}}>🏁 Tamamlanan: {(isAdmin?requests:requests.filter(r=>r.talep_eden===user.username)).filter(r=>r.durum==="Tamamlandı").length}</span>
              </div>
            </div>
            <button onClick={()=>{if(!isAdmin)setFReq(p=>({...p,talep_eden:user.username}));setShowReq(true);}} style={{padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",border:"none",fontFamily:"inherit",background:"#0f172a",color:"#fff"}}>+ Talep Oluştur</button>
          </div>
          {requests.length===0
            ?<div style={{background:"#fff",borderRadius:14,padding:"44px 20px",textAlign:"center",color:"#94a3b8",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:36,marginBottom:8}}>📋</div><div>Henüz talep oluşturulmadı</div>
            </div>
            :<div style={{display:"flex",flexDirection:"column",gap:12}}>
              {(isAdmin?[...requests]:[...requests].filter(r=>r.talep_eden===user.username)).sort((a,b)=>{
                const ds={"Beklemede":0,"Onaylandı":1,"Reddedildi":2};
                const dp={"Acil":0,"Yüksek":1,"Normal":2,"Düşük":3};
                const d=(ds[a.durum]??9)-(ds[b.durum]??9);
                return d!==0?d:(dp[a.oncelik]??9)-(dp[b.oncelik]??9);
              }).map(r=>{
                let yl=[];try{yl=JSON.parse(r.yolcular||"[]");}catch{}
                const isBek=r.durum==="Beklemede",isOna=r.durum==="Onaylandı",isRed=r.durum==="Reddedildi",isTam=r.durum==="Tamamlandı";
                const ca=reqAtama[r.id]||{arac:"",sofor:""};
                const ie=!!reqExp[r.id];
                const mv=vehicles.filter(v=>v.durum==="Müsait").length;
                const md=drivers.filter(d=>d.durum==="Müsait").length;
                return <div key={r.id} style={{borderRadius:14,border:"2px solid "+(isBek?"#f59e0b":isOna?"#10b981":isRed?"#ef4444":"#e2e8f0"),overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                  <div style={{background:isBek?"#fffbeb":isOna?"#f0fdf4":isRed?"#fff5f5":"#fff",padding:"14px 18px",display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
                    <div style={{flex:2,minWidth:200}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                        {r.oncelik&&<span style={{background:r.oncelik==="Acil"?"#fee2e2":r.oncelik==="Yüksek"?"#fef3c7":"#dbeafe",color:r.oncelik==="Acil"?"#991b1b":r.oncelik==="Yüksek"?"#92400e":"#1e40af",borderRadius:5,padding:"1px 8px",fontSize:10,fontWeight:700}}>{r.oncelik}</span>}
                        <span style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>{r.talep||"—"}</span>
                      </div>
                      <div style={{display:"flex",gap:12,flexWrap:"wrap",fontSize:12,color:"#64748b"}}>
                        <span>👤 <b style={{color:"#334155"}}>{r.talep_eden||"—"}</b></span>
                        {r.tarih&&<span>📅 {r.tarih}{r.saat?" "+r.saat:""}</span>}
                        {r.gorev_yeri&&<span>📍 {r.gorev_yeri}</span>}
                        {r.birim&&<span style={{background:"#dbeafe",color:"#1e40af",borderRadius:5,padding:"1px 8px",fontWeight:700}}>🏢 {r.birim}</span>}
                        {yl.length>0&&<span style={{color:"#7c3aed"}}>👥 {yl.length} yolcu</span>}
                      </div>
                    </div>
                    <div style={{minWidth:140}}>
                      {r.arac?<div>
                        <div style={{fontFamily:"monospace",fontWeight:700,background:"#f1f5f9",padding:"2px 9px",borderRadius:6,fontSize:12,marginBottom:3,display:"inline-block"}}>{r.arac}</div>
                        {r.sofor&&<div style={{fontSize:11,color:"#64748b"}}>Şoför: {r.sofor}</div>}
                      </div>:<span style={{fontSize:11,color:"#cbd5e1"}}>Araç atanmadı</span>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end",minWidth:150}}>
                      <span style={{background:isBek?"#fef3c7":isOna?"#d1fae5":isRed?"#fee2e2":isTam?"#dbeafe":"#f1f5f9",color:isBek?"#92400e":isOna?"#065f46":isRed?"#991b1b":isTam?"#1e40af":"#64748b",borderRadius:20,padding:"3px 11px",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:isBek?"#f59e0b":isOna?"#10b981":isRed?"#ef4444":isTam?"#3b82f6":"#94a3b8",display:"inline-block"}}/>
                        {r.durum}
                      </span>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
                        <button className="ab" style={{background:"#f0fdf4",color:"#166534"}} onClick={()=>reqPDF(r)}>📄 PDF</button>
                        {isAdmin&&isBek&&<button className="ab" style={{background:ie?"#fde68a":"#fef3c7",color:"#92400e",fontWeight:700,border:"1px solid #f59e0b"}} onClick={()=>setReqExp(p=>({...p,[r.id]:!p[r.id]}))}>
                          {ie?"▲ Kapat":"🚗 Araç Tahsis Et"}
                        </button>}
                        {isAdmin&&isOna&&<button className="ab" style={{background:"#f1f5f9",color:"#64748b"}} onClick={async()=>{
  await supabase.from("requests").update({durum:"Beklemede",arac:null,sofor:null}).eq("id",r.id);
  if(r.arac)await supabase.from("vehicles").update({durum:"Müsait",sofor:null}).eq("plaka",r.arac);
  if(r.sofor)await supabase.from("drivers").update({durum:"Müsait",arac:null}).eq("ad",r.sofor);
  await audit(user.username,"Talep Geri Alındı",r.talep);
  load();tst("↩ Talep geri alındı, araç ve şoför müsaite çekildi");
}}>↩ Geri Al</button>}
                        {isOna&&r.arac&&<button className="ab" style={{background:"#0f172a",color:"#fff",fontWeight:700,border:"none"}} onClick={()=>setReqKm(p=>({...p,[r.id]:p[r.id]===undefined?"":undefined}))}>
                          {reqKm[r.id]!==undefined?"▲ Kapat":"🏁 Görevi Tamamla"}
                        </button>}
                        {isAdmin&&<button className="ab" style={{background:"#fee2e2",color:"#991b1b"}} onClick={()=>delReq(r.id,r.talep)}>🗑 Sil</button>}
                      </div>
                    </div>
                  </div>
                  {isAdmin&&isBek&&ie&&<div style={{borderTop:"2px dashed #f59e0b",background:"#fffbeb",padding:"16px 18px"}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#78350f",marginBottom:12}}>🚗 Araç ve Şoför Tahsisi</div>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
                      <div>
                        <div style={{fontSize:10,fontWeight:700,color:"#64748b",marginBottom:4,textTransform:"uppercase"}}>Araç Seç ({mv} müsait)</div>
                        <select value={ca.arac} onChange={e=>setReqAtama(p=>({...p,[r.id]:{...(p[r.id]||{arac:"",sofor:""}),arac:e.target.value}}))}
                          style={{padding:"8px 10px",borderRadius:8,border:"1.5px solid "+(ca.arac?"#10b981":"#e2e8f0"),fontSize:12,fontFamily:"inherit",background:"#fff",outline:"none",minWidth:200,cursor:"pointer"}}>
                          <option value="">-- Araç Seç --</option>
                          {vehicles.map(v=><option key={v.id} value={v.plaka} disabled={v.durum!=="Müsait"}>
                            {v.durum==="Müsait"?"✅":v.durum==="Görevde"?"🔵":"🔧"} {v.plaka} — {v.marka||""}
                          </option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{fontSize:10,fontWeight:700,color:"#64748b",marginBottom:4,textTransform:"uppercase"}}>Şoför Seç ({md} müsait)</div>
                        <select value={ca.sofor} onChange={e=>setReqAtama(p=>({...p,[r.id]:{...(p[r.id]||{arac:"",sofor:""}),sofor:e.target.value}}))}
                          style={{padding:"8px 10px",borderRadius:8,border:"1.5px solid "+(ca.sofor?"#10b981":"#e2e8f0"),fontSize:12,fontFamily:"inherit",background:"#fff",outline:"none",minWidth:200,cursor:"pointer"}}>
                          <option value="">-- Şoför Seç (İsteğe Bağlı) --</option>
                          {drivers.map(d=><option key={d.id} value={d.ad} disabled={d.durum!=="Müsait"}>
                            {d.durum==="Müsait"?"✅":d.durum==="Görevde"?"🔵":"🔧"} {d.ad}
                          </option>)}
                        </select>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={async()=>{
                          if(!ca.arac){tst("Lütfen araç seçin","yellow");return;}
                          // Aracın mevcut km'sini çekip çıkış km'si olarak kullan
                          const seciliArac=vehicles.find(v=>v.plaka===ca.arac);
                          const cikisKm=seciliArac?.km||seciliArac?.donus_km||0;
                          await supabase.from("requests").update({durum:"Onaylandı",arac:ca.arac,sofor:ca.sofor||null}).eq("id",r.id);
                          if(ca.arac)await supabase.from("vehicles").update({durum:"Görevde",sofor:ca.sofor||null}).eq("plaka",ca.arac);
                          if(ca.sofor)await supabase.from("drivers").update({durum:"Görevde"}).eq("ad",ca.sofor);
                          await supabase.from("mission_logs").insert({request_id:r.id,vehicle_plaka:ca.arac,driver:ca.sofor||null,staff_ids:r.yolcular||"[]",birim:r.birim||"",gorev_adi:r.talep,tarih:r.tarih||null,cikis_km:String(cikisKm),donus_km:"",mesafe:"0",yakit_litre:"0",yakit_fiyat:"0",tuketim:"0",toplam_maliyet:"0",gorev_durumu:"Devam Ediyor"});
                          await notif(r.talep_eden,"Talebiniz onaylandı: "+r.talep+". Araç: "+ca.arac,"onay");
                          await audit(user.username,"Talep Onaylandı",r.talep+" çıkış km:"+cikisKm);
                          setReqAtama(p=>{const n={...p};delete n[r.id];return n;});
                          setReqExp(p=>{const n={...p};delete n[r.id];return n;});
                          load();tst("✅ Onaylandı: "+ca.arac+" (çıkış km: "+cikisKm+")");
                        }} style={{padding:"10px 18px",borderRadius:9,background:"#10b981",color:"#fff",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit"}}>
                          ✓ Onayla ve Ata
                        </button>
                        <button onClick={()=>rejectReq(r.id,r.talep,r.talep_eden)} style={{padding:"10px 14px",borderRadius:9,background:"#ef4444",color:"#fff",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit"}}>
                          ✕ Reddet
                        </button>
                      </div>
                    </div>
                    {(ca.arac||ca.sofor)&&<div style={{marginTop:12,padding:"9px 13px",background:"#fff",borderRadius:9,border:"1.5px solid #fde68a",fontSize:12,color:"#78350f",display:"flex",gap:16,flexWrap:"wrap"}}>
                      {ca.arac&&<span>🚗 <b>{ca.arac}</b> → Görevde olacak</span>}
                      {ca.sofor&&<span>👤 <b>{ca.sofor}</b> → Görevde olacak</span>}
                    </div>}
                  </div>}
                  {yl.length>0&&ie&&<div style={{borderTop:"1px solid #f1f5f9",padding:"9px 18px",background:"#f8fafc",fontSize:12}}>
                    <span style={{color:"#64748b",fontWeight:600}}>Yolcular: </span><span style={{color:"#334155"}}>{yl.join(", ")}</span>
                  </div>}
                  {isOna&&r.arac&&reqKm[r.id]!==undefined&&<div style={{borderTop:"2px dashed #0f172a",background:"#f8fafc",padding:"16px 18px"}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#0f172a",marginBottom:12}}>🏁 Görev Tamamlama</div>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
                      <div>
                        <div style={{fontSize:10,fontWeight:700,color:"#64748b",marginBottom:4,textTransform:"uppercase"}}>Dönüş KM'si</div>
                        <input
                          type="number"
                          placeholder="Örn: 125400"
                          value={reqKm[r.id]||""}
                          onChange={e=>setReqKm(p=>({...p,[r.id]:e.target.value}))}
                          style={{padding:"9px 12px",borderRadius:8,border:"1.5px solid #cbd5e1",fontSize:13,fontFamily:"inherit",outline:"none",width:180}}
                        />
                      </div>
                      <button onClick={async()=>{
                        const km=reqKm[r.id];
                        if(!km||isNaN(km)){tst("Geçerli bir KM değeri girin","yellow");return;}
                        const kmNum=parseInt(km);
                        // Araç güncelle: müsait + yeni km
                        await supabase.from("vehicles").update({durum:"Müsait",km:kmNum,donus_km:kmNum,sofor:null}).eq("plaka",r.arac);
                        // Şoför güncelle: müsait
                        if(r.sofor)await supabase.from("drivers").update({durum:"Müsait",arac:null}).eq("ad",r.sofor);
                        // Talebi tamamlandı yap
                        await supabase.from("requests").update({durum:"Tamamlandı"}).eq("id",r.id);
                        // Mission log güncelle
                        await supabase.from("mission_logs").update({donus_km:String(kmNum),gorev_durumu:"Tamamlandı"}).eq("request_id",r.id);
                        await audit(user.username,"Görev Tamamlandı",r.talep+" → "+r.arac+" dönüş km:"+kmNum);
                        await notif(r.talep_eden,"Göreviniz tamamlandı: "+r.talep,"bilgi");
                        setReqKm(p=>{const n={...p};delete n[r.id];return n;});
                        load();tst("✅ Görev tamamlandı — "+r.arac+" müsaite alındı");
                      }} style={{padding:"10px 20px",borderRadius:9,background:"#0f172a",color:"#fff",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit"}}>
                        ✓ Tamamla
                      </button>
                    </div>
                  </div>}
                </div>;
              })}
            </div>
          }
        </div>}

        {/* REZERVASYON KALDIRILDI */}

        {/* ARIZALAR */}

        {/* GÖREVLER */}

        {tab==="fuel"&&<FuelTab vehicles={vehicles}/>}
        {tab==="reports"&&<ReportsTab vehicles={vehicles} drivers={drivers} staff={staff} logs={mLogs}/>}
        {tab==="map"&&<MapView vehicles={vehicles}/>}

        {/* ADMIN */}
        {tab==="admin"&&isAdmin&&<div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"#0f172a",marginBottom:18}}>🛡️ Admin Paneli</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
            <AdminUsers auditFn={audit} userName={user.username}/>
            <Card><CardH title="📋 İşlem Geçmişi"/>
              {auditLogs.length===0?<Empty icon="📋" text="Kayıt yok"/>:<div style={{maxHeight:380,overflowY:"auto"}}>
                {auditLogs.slice(0,60).map(l=><div key={l.id} style={{padding:"9px 16px",borderBottom:"1px solid #f8fafc"}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontWeight:700,fontSize:12}}>{l.islem}</span>
                    <span style={{fontSize:10,color:"#94a3b8"}}>{timeAgo(l.created_at)} önce</span>
                  </div>
                  <div style={{fontSize:11,color:"#64748b"}}>{l.detay} · 👤 {l.username}</div>
                </div>)}
              </div>}
            </Card>
          </div>
        </div>}

      </div>
    </div>


    {/* MODALLER */}

    {showVeh&&<Modal title="Yeni Araç Ekle" onClose={()=>setShowVeh(false)}>
      <SecT>Araç Bilgileri</SecT>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Field label="Plaka" value={fVeh.plaka} onChange={v=>setFVeh({...fVeh,plaka:v})} placeholder="34 ABC 123"/>
        <Field label="Marka / Model" value={fVeh.marka} onChange={v=>setFVeh({...fVeh,marka:v})} placeholder="Ford Transit"/>
        <Field label="Yıl" value={fVeh.yil} onChange={v=>setFVeh({...fVeh,yil:v})} type="number"/>
        <Field label="Güncel KM" value={fVeh.km} onChange={v=>setFVeh({...fVeh,km:v})} type="number"/>
        <Field label="Sigorta Bitiş Tarihi" value={fVeh.sigorta_bitis||""} onChange={v=>setFVeh({...fVeh,sigorta_bitis:v})} type="date"/>
        <Field label="Muayene Bitiş Tarihi" value={fVeh.muayene_bitis||""} onChange={v=>setFVeh({...fVeh,muayene_bitis:v})} type="date"/>
      </div>
      <div style={{background:"#f0fdf4",borderRadius:8,padding:"9px 13px",fontSize:11,color:"#166534",marginBottom:14}}>✅ Araç sisteme <b>Müsait</b> olarak eklenir. Durum, görev atamalarıyla otomatik güncellenir.</div>
      <div style={{display:"flex",gap:11}}><button onClick={()=>setShowVeh(false)} style={cbtn}>İptal</button><button onClick={addVeh} style={{...pbtn,flex:1,justifyContent:"center"}}>Ekle</button></div>
    </Modal>}

    {showDrv&&<Modal title="Şoför Ekle" onClose={()=>setShowDrv(false)}>
      <Field label="Ad Soyad" value={fDrv.ad} onChange={v=>setFDrv({...fDrv,ad:v})}/>
      <Field label="Telefon" value={fDrv.telefon} onChange={v=>setFDrv({...fDrv,telefon:v})}/>
      <div style={{background:"#f0fdf4",borderRadius:8,padding:"9px 13px",fontSize:11,color:"#166534",marginBottom:14}}>✅ Şoför sisteme <b>Müsait</b> olarak eklenir.</div>
      <div style={{display:"flex",gap:11}}><button onClick={()=>setShowDrv(false)} style={cbtn}>İptal</button><button onClick={addDrv} style={{...pbtn,flex:1,justifyContent:"center"}}>Ekle</button></div>
    </Modal>}

    {showUnit&&<Modal title="Birim Ekle" onClose={()=>setShowUnit(false)}>
      <Field label="Birim Adı" value={fUnit.ad} onChange={v=>setFUnit({...fUnit,ad:v})} placeholder="ör: İdari İşler, Teknik Birim"/>
      <div style={{display:"flex",gap:11}}><button onClick={()=>setShowUnit(false)} style={cbtn}>İptal</button><button onClick={addUnit} style={{...pbtn,flex:1,justifyContent:"center"}}>Ekle</button></div>
    </Modal>}

    {showStf&&<Modal title="Personel Ekle" onClose={()=>setShowStf(false)}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Field label="Ad Soyad" value={fStf.ad} onChange={v=>setFStf({...fStf,ad:v})}/>
        <Field label="Ünvan" value={fStf.unvan} onChange={v=>setFStf({...fStf,unvan:v})} placeholder="Müdür, Uzman..."/>
      </div>
      <Field label="Birim" value={fStf.birim} onChange={v=>setFStf({...fStf,birim:v})} options={[{value:"",label:"— Birim Seç —"},...units.map(u=>({value:u.ad,label:u.ad}))]}/>
      <Field label="Telefon" value={fStf.telefon} onChange={v=>setFStf({...fStf,telefon:v})}/>
      <div style={{display:"flex",gap:11}}><button onClick={()=>setShowStf(false)} style={cbtn}>İptal</button><button onClick={addStf} style={{...pbtn,flex:1,justifyContent:"center"}}>Ekle</button></div>
    </Modal>}

    {showReq&&<Modal title="Araç Talebi Oluştur" onClose={()=>setShowReq(false)} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          <SecT>Talep Bilgileri</SecT>
          {(()=>{
            const KONULAR=["Gıda Denetim","Bayii Denetimi","İşletme Denetim ve Kontrol"];
            return <>
              <Field label="Talep Konusu" value={fReq.talep_konusu||""} onChange={v=>setFReq({...fReq,talep_konusu:v,talep:fReq.talep_tanimi?v+" — "+fReq.talep_tanimi:v})}
                options={[{value:"",label:"— Konu Seçin —"},...KONULAR.map(k=>({value:k,label:k}))]}/>
              {fReq.talep_konusu&&<div style={{marginBottom:8}}>
                <label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",marginBottom:4,textTransform:"uppercase"}}>Talep Tanımı</label>
                <input value={fReq.talep_tanimi||""} onChange={e=>{const v=e.target.value;setFReq({...fReq,talep_tanimi:v,talep:fReq.talep_konusu+(v?" — "+v:"")});}}
                  placeholder="Talep tanımını yazın..." style={{width:"100%",padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
              </div>}
            </>;
          })()}
          {isAdmin
            ?<Field label="Talep Eden" value={fReq.talep_eden} onChange={v=>setFReq({...fReq,talep_eden:v})}/>
            :<div style={{marginBottom:8}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",marginBottom:4,textTransform:"uppercase"}}>Talep Eden</label>
              <div style={{padding:"9px 12px",background:"#f1f5f9",borderRadius:8,fontSize:13,fontWeight:600,color:"#334155"}}>{user.username}</div>
            </div>
          }
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            <Field label="Tarih" value={fReq.tarih} onChange={v=>setFReq({...fReq,tarih:v})} type="date"/>
            <Field label="Saat" value={fReq.saat} onChange={v=>setFReq({...fReq,saat:v})} type="time"/>
          </div>
          <SecT>Görev Bilgileri</SecT>
          <Field label="Görev Yeri" value={fReq.gorev_yeri} onChange={v=>setFReq({...fReq,gorev_yeri:v})} placeholder="Görevin yapılacağı yer"/>
          <Field label="Öncelik" value={fReq.oncelik} onChange={v=>setFReq({...fReq,oncelik:v})} options={["Acil","Yüksek","Normal","Düşük"]}/>
          {fReq.talep&&<div style={{marginTop:8,padding:"9px 12px",background:"#f0fdf4",borderRadius:8,fontSize:11,color:"#166534",fontWeight:600}}>✅ Talep: <b>{fReq.talep}</b></div>}
        </div>
        <div>
          <SecT>Yolcu Seçimi</SecT>
          <div style={{marginBottom:12}}>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",marginBottom:4,textTransform:"uppercase"}}>Birim Seç (tüm birim)</label>
            <select value={rqBirim} onChange={e=>{setRqBirim(e.target.value);setRqStaff([]);}} style={{width:"100%",padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:13,fontFamily:"inherit",background:"#f8fafc",outline:"none"}}>
              <option value="">— Tek tek seç —</option>
              {units.map(u=><option key={u.id} value={u.ad}>{u.ad} ({staff.filter(s=>s.birim===u.ad).length} kişi)</option>)}
            </select>
          </div>
          {!rqBirim&&<div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",marginBottom:6,textTransform:"uppercase"}}>Veya Tek Tek Seç</label>
            <div style={{maxHeight:270,overflowY:"auto",border:"1.5px solid #e2e8f0",borderRadius:8,background:"#f8fafc"}}>
              {units.map(u=><div key={u.id}>
                <div style={{padding:"6px 11px",background:"#f1f5f9",fontWeight:700,fontSize:11,color:"#475569",borderBottom:"1px solid #e2e8f0"}}>🏢 {u.ad}</div>
                {staff.filter(s=>s.birim===u.ad).map(s=><label key={s.id} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 13px",cursor:"pointer",borderBottom:"1px solid #f8fafc"}}>
                  <input type="checkbox" checked={rqStaff.includes(s.ad)} onChange={e=>{if(e.target.checked)setRqStaff([...rqStaff,s.ad]);else setRqStaff(rqStaff.filter(x=>x!==s.ad));}} style={{width:14,height:14}}/>
                  <span style={{fontSize:12,fontWeight:500}}>{s.ad}</span>
                  {s.unvan&&<span style={{fontSize:10,color:"#94a3b8"}}>{s.unvan}</span>}
                </label>)}
              </div>)}
              {staff.filter(s=>!units.find(u=>u.ad===s.birim)).map(s=><label key={s.id} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 13px",cursor:"pointer",borderBottom:"1px solid #f8fafc"}}>
                <input type="checkbox" checked={rqStaff.includes(s.ad)} onChange={e=>{if(e.target.checked)setRqStaff([...rqStaff,s.ad]);else setRqStaff(rqStaff.filter(x=>x!==s.ad));}} style={{width:14,height:14}}/>
                <span style={{fontSize:12,fontWeight:500}}>{s.ad}</span>
              </label>)}
            </div>
            {rqStaff.length>0&&<div style={{marginTop:6,padding:"6px 11px",background:"#dbeafe",borderRadius:7,fontSize:11,color:"#1e40af",fontWeight:600}}>✓ {rqStaff.length} kişi seçildi</div>}
          </div>}
          {rqBirim&&<div style={{padding:"11px 13px",background:"#d1fae5",borderRadius:8,fontSize:12,color:"#065f46",fontWeight:600}}>✓ {staff.filter(s=>s.birim===rqBirim).length} kişilik <b>{rqBirim}</b> birimi seçildi</div>}
        </div>
      </div>
      <div style={{display:"flex",gap:11,marginTop:14}}><button onClick={()=>setShowReq(false)} style={cbtn}>İptal</button><button onClick={addReq} style={{...pbtn,flex:1,justifyContent:"center"}}>Talep Oluştur</button></div>
    </Modal>}

    {/* Rezervasyon modalı kaldırıldı */}

    {/* Onay modalı kaldırıldı — inline tahsis paneli kullanılıyor */}

    {showKm&&selVeh&&<Modal title={`KM Güncelle — ${selVeh.plaka}`} onClose={()=>setShowKm(false)}>
      <div style={{background:"#f8fafc",borderRadius:10,padding:"11px 15px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontWeight:700,fontSize:14}}>{selVeh.plaka} — {selVeh.marka}</div><div style={{fontSize:11,color:"#64748b",marginTop:2}}>Mevcut KM: <b>{selVeh.km?`${parseFloat(selVeh.km).toLocaleString()} km`:"—"}</b></div></div>
        <Badge s={selVeh.durum}/>
      </div>
      <SecT>Görev KM</SecT>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Field label="Çıkış KM" value={fKm.cikis_km} onChange={v=>setFKm({...fKm,cikis_km:v})} type="number" placeholder="Görev başı"/>
        <Field label="Dönüş KM" value={fKm.donus_km} onChange={v=>setFKm({...fKm,donus_km:v})} type="number" placeholder="Görev sonu"/>
      </div>
      {fKm.cikis_km&&fKm.donus_km&&<div style={{background:"#dbeafe",borderRadius:7,padding:"9px 13px",fontSize:12,color:"#1e40af",fontWeight:600,marginBottom:12}}>📍 Mesafe: {(parseFloat(fKm.donus_km)-parseFloat(fKm.cikis_km)).toLocaleString()} km</div>}
      <SecT>Yakıt</SecT>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        <Field label="Yakıt (lt)" value={fKm.yakit_litre} onChange={v=>setFKm({...fKm,yakit_litre:v})} type="number"/>
        <Field label="Lt Fiyatı (₺)" value={fKm.yakit_fiyat} onChange={v=>setFKm({...fKm,yakit_fiyat:v})} type="number"/>
        <Field label="Tüketim (lt/100)" value={fKm.tuketim} onChange={v=>setFKm({...fKm,tuketim:v})} type="number"/>
      </div>
      <div style={{display:"flex",gap:11,marginTop:8}}><button onClick={()=>setShowKm(false)} style={cbtn}>İptal</button><button onClick={saveKm} style={{...pbtn,flex:1,justifyContent:"center"}}>💾 Kaydet & Tamamla</button></div>
    </Modal>}

    {showArz&&<Modal title="Arıza Bildirimi" onClose={()=>setShowArz(false)}>
      <Field label="Araç" value={fArz.vehicle_plaka} onChange={v=>setFArz({...fArz,vehicle_plaka:v})} options={[{value:"",label:"— Araç Seç —"},...vehicles.map(v=>({value:v.plaka,label:`${v.plaka} — ${v.marka}`}))]}/>
      <Field label="Bildiren" value={fArz.bildiren} onChange={v=>setFArz({...fArz,bildiren:v})} placeholder="Ad Soyad"/>
      <Field label="Arıza Açıklaması" value={fArz.aciklama} onChange={v=>setFArz({...fArz,aciklama:v})} type="textarea" placeholder="Detaylı açıklama..."/>
      <Field label="Öncelik" value={fArz.oncelik} onChange={v=>setFArz({...fArz,oncelik:v})} options={["Acil","Yüksek","Normal","Düşük"]}/>
      <div style={{background:"#fef3c7",borderRadius:8,padding:"9px 13px",fontSize:11,color:"#92400e",marginBottom:13}}>⚠ Arıza bildirilen araç otomatik <b>Bakımda</b> durumuna alınır.</div>
      <div style={{display:"flex",gap:11}}><button onClick={()=>setShowArz(false)} style={cbtn}>İptal</button><button onClick={addArz} style={{...pbtn,flex:1,justifyContent:"center",background:"#ef4444"}}>Arıza Bildir</button></div>
    </Modal>}

    {showBkm&&<Modal title={selVeh?`Araç Bilgileri — ${selVeh.plaka}`:"Araç Bilgileri Güncelle"} onClose={()=>{setShowBkm(false);setSelVeh(null);}}>
      {!selVeh&&<Field label="Araç" value={fBkm.plaka||""} onChange={v=>{const vv=vehicles.find(x=>x.plaka===v);setSelVeh(vv||null);setFBkm({...fBkm,plaka:v,bakim_km:vv?.bakim_km||"",bakim_tarih:vv?.bakim_tarih||"",sigorta_bitis:vv?.sigorta_bitis||"",muayene_bitis:vv?.muayene_bitis||""});}} options={[{value:"",label:"— Araç Seç —"},...vehicles.map(v=>({value:v.plaka,label:`${v.plaka} — ${v.marka}`}))]}/>}
      <SecT>Bakım</SecT>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Field label="Bir Sonraki Bakım Tarihi" value={fBkm.bakim_tarih} onChange={v=>setFBkm({...fBkm,bakim_tarih:v})} type="date"/>
        <Field label="Bir Sonraki Bakım KM" value={fBkm.bakim_km} onChange={v=>setFBkm({...fBkm,bakim_km:v})} type="number" placeholder="ör: 150000"/>
      </div>
      <SecT>Sigorta & Muayene</SecT>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Field label="Sigorta Bitiş Tarihi" value={fBkm.sigorta_bitis||""} onChange={v=>setFBkm({...fBkm,sigorta_bitis:v})} type="date"/>
        <Field label="Muayene Bitiş Tarihi" value={fBkm.muayene_bitis||""} onChange={v=>setFBkm({...fBkm,muayene_bitis:v})} type="date"/>
      </div>
      <div style={{background:"#eff6ff",borderRadius:8,padding:"9px 13px",fontSize:11,color:"#1e40af",marginBottom:13}}>📅 Belirlenen km veya tarihe ulaşıldığında uyarı gösterilir. Sigorta/muayene bitiş tarihi geçince ⛔, 30 gün kala ⚠ görünür.</div>
      <div style={{display:"flex",gap:11}}><button onClick={()=>{setShowBkm(false);setSelVeh(null);}} style={cbtn}>İptal</button><button onClick={saveBkm} style={{...pbtn,flex:1,justifyContent:"center"}}>💾 Kaydet</button></div>
    </Modal>}

    {showGDurum&&selLog&&<Modal title="Görev Durumu Güncelle" onClose={()=>{setShowGDurum(false);setSelLog(null);}}>
      <div style={{background:"#f8fafc",borderRadius:10,padding:"11px 15px",marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:14}}>{selLog.gorev_adi||"—"}</div>
        <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{selLog.vehicle_plaka} · {selLog.driver}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {["Devam Ediyor","Yolda","Hedefe Ulaştı","Tamamlandı"].map(d=>(
          <button key={d} onClick={async()=>{await supabase.from("mission_logs").update({gorev_durumu:d}).eq("id",selLog.id);await audit(user.username,"Görev Durumu",d);load();setShowGDurum(false);setSelLog(null);tst(`Görev durumu: ${d}`,"blue");}} style={{padding:"12px",borderRadius:10,border:`2px solid ${selLog.gorev_durumu===d?"#3b82f6":"#e2e8f0"}`,background:selLog.gorev_durumu===d?"#eff6ff":"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,color:selLog.gorev_durumu===d?"#1e40af":"#334155"}}>
            {d==="Devam Ediyor"?"🔵":d==="Yolda"?"🚗":d==="Hedefe Ulaştı"?"📍":"✅"} {d}
          </button>
        ))}
      </div>
    </Modal>}

  </>;
}

function AdminUsers({auditFn,userName}){
  const [users,setUsers]=useState([]);
  useEffect(()=>{supabase.from("users").select("*").order("id").then(({data})=>{if(data)setUsers(data);});},[]);
  const chRole=async(id,role,un)=>{await supabase.from("users").update({role}).eq("id",id);await auditFn(userName,"Rol Değişikliği",`${un} → ${role}`);supabase.from("users").select("*").order("id").then(({data})=>{if(data)setUsers(data);});};
  const delUser=async(id,un)=>{if(!window.confirm("Silinsin mi?"))return;await supabase.from("users").delete().eq("id",id);await auditFn(userName,"Kullanıcı Silme",un);supabase.from("users").select("*").order("id").then(({data})=>{if(data)setUsers(data);});};
  return <Card><CardH title="Kullanıcı Yönetimi"/>
    {users.length===0?<Empty icon="👤" text="Kullanıcı yok"/>:<table className="dt">
      <thead><tr><th>Kullanıcı</th><th>Rol</th><th>Kayıt</th><th>İşlem</th></tr></thead>
      <tbody>{users.map(u=><tr key={u.id}>
        <td><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:26,height:26,borderRadius:"50%",background:u.role==="admin"?"#dbeafe":"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:u.role==="admin"?"#1e40af":"#64748b"}}>{u.username?.[0]?.toUpperCase()}</div><span style={{fontWeight:600,fontSize:12}}>{u.username}</span></div></td>
        <td><span style={{background:u.role==="admin"?"#dbeafe":"#f1f5f9",color:u.role==="admin"?"#1e40af":"#64748b",padding:"1px 8px",borderRadius:20,fontSize:11,fontWeight:700}}>{u.role==="admin"?"👑 Admin":"👤 User"}</span></td>
        <td style={{color:"#94a3b8",fontSize:11}}>{u.created_at?new Date(u.created_at).toLocaleDateString("tr-TR"):"-"}</td>
        <td><div style={{display:"flex",gap:4}}><button className="ab" style={{background:u.role==="admin"?"#f1f5f9":"#dbeafe",color:u.role==="admin"?"#64748b":"#1e40af",fontSize:10}} onClick={()=>chRole(u.id,u.role==="admin"?"user":"admin",u.username)}>{u.role==="admin"?"User Yap":"Admin Yap"}</button><button className="ab" style={{background:"#fee2e2",color:"#991b1b",fontSize:10}} onClick={()=>delUser(u.id,u.username)}>Sil</button></div></td>
      </tr>)}</tbody>
    </table>}
  </Card>;
}

