import React, { useMemo, useState } from 'react';
import { Edit, Plus, Trash2, UserRound, X, CheckCircle2, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeamMember } from '../types';

const emptyMember: Omit<TeamMember, 'id'> = {
  fullName: '', role: '', phone: '', email: '', photoUrl: '',
  bioAr: '', bioFr: '', bioEn: '', skills: [], wilaya: '12',
  joinedAt: new Date().toISOString().slice(0, 10),
  instagram: '', facebook: '', active: true, order: 1
};

export const TeamManagement: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useApp();
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<Omit<TeamMember, 'id'>>(emptyMember);
  const [skillsText, setSkillsText] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => teamMembers.filter(m =>
    [m.fullName, m.role, m.phone, m.email].join(' ').toLowerCase().includes(search.toLowerCase())
  ), [teamMembers, search]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyMember, order: teamMembers.length + 1 });
    setSkillsText('');
    setModalOpen(true);
  };
  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({ ...m });
    setSkillsText((m.skills || []).join(', '));
    setModalOpen(true);
  };
  const close = () => { setEditing(null); setForm({ ...emptyMember }); setSkillsText(''); setModalOpen(false); };

  const save = async () => {
    if (!form.fullName.trim() || !form.role.trim() || !form.phone.trim()) {
      alert('الاسم الكامل، الوظيفة ورقم الهاتف مطلوبة.'); return;
    }
    const payload = { ...form, fullName: form.fullName.trim(), role: form.role.trim(), phone: form.phone.trim(),
      skills: skillsText.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editing) await updateTeamMember(editing.id, payload);
      else await addTeamMember(payload);
      close();
    } catch (e) { alert(e instanceof Error ? e.message : 'تعذر حفظ عضو الفريق.'); }
  };

  return <div className="space-y-7">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div><h2 className="text-2xl font-bold text-white">فريق IBRA PRODUCTION</h2><p className="text-sm text-neutral-400 mt-1">إضافة وتعديل وإدارة ملف كامل لكل عضو.</p></div>
      <button onClick={openNew} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400"><Plus className="w-5 h-5" />إضافة عضو جديد</button>
    </div>

    <div className="relative"><Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث باسم العضو أو الوظيفة أو الهاتف..." className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3.5 pr-12 pl-4 text-white outline-none focus:border-amber-500"/></div>

    {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center text-neutral-500"><UserRound className="w-10 h-10 mx-auto mb-3"/>{teamMembers.length ? 'لا توجد نتائج.' : 'لا يوجد أعضاء بعد. أضف أول عضو للفريق.'}</div> :
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{filtered.map(member => <article key={member.id} className="rounded-3xl bg-neutral-900/80 border border-neutral-800 overflow-hidden hover:border-amber-500/40 transition-all">
      <div className="h-48 bg-neutral-950 relative">{member.photoUrl ? <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><UserRound className="w-16 h-16 text-neutral-700"/></div>}
        <span className={'absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold '+(member.active?'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20':'bg-red-500/15 text-red-300 border border-red-500/20')}>{member.active?'نشط':'غير نشط'}</span>
      </div>
      <div className="p-5"><div className="flex justify-between gap-3"><div><h3 className="text-lg font-bold text-white">{member.fullName}</h3><p className="text-amber-400 text-sm mt-1">{member.role}</p></div><span className="text-xs text-neutral-500">#{member.order}</span></div>
        <p className="text-sm text-neutral-400 mt-4 line-clamp-2">{member.bioAr || 'لا توجد نبذة بعد.'}</p>
        <div className="flex flex-wrap gap-2 mt-4">{(member.skills||[]).slice(0,4).map(s=><span key={s} className="text-xs px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300">{s}</span>)}</div>
        <div className="grid grid-cols-2 gap-2 mt-5"><button onClick={()=>openEdit(member)} className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center gap-2"><Edit className="w-4 h-4"/>تعديل</button><button onClick={()=>{if(confirm('حذف ملف هذا العضو نهائياً؟')) deleteTeamMember(member.id)}} className="py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 flex items-center justify-center gap-2"><Trash2 className="w-4 h-4"/>حذف</button></div>
      </div>
    </article>)}</div>}

    {modalOpen ? <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-neutral-950 border border-amber-500/20 shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6"><div><h3 className="text-2xl font-bold text-white">{editing?'تعديل ملف عضو':'إضافة عضو للفريق'}</h3><p className="text-sm text-neutral-500 mt-1">الملف الكامل للعضو</p></div><button onClick={close} className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white"><X/></button></div>
        <div className="grid md:grid-cols-2 gap-4">
          {([['fullName','الاسم الكامل'],['role','الوظيفة / الاختصاص'],['phone','رقم الهاتف'],['email','البريد الإلكتروني'],['photoUrl','رابط الصورة'],['wilaya','الولاية'],['joinedAt','تاريخ الانضمام'],['order','الترتيب'],['instagram','Instagram'],['facebook','Facebook']] as const).map(([key,label])=><label key={key} className="space-y-2"><span className="text-sm text-neutral-300">{label}</span><input type={key==='joinedAt'?'date':key==='order'?'number':'text'} value={String(form[key] ?? '')} onChange={e=>setForm({...form,[key]:key==='order'?Number(e.target.value):e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"/></label>)}
          <label className="md:col-span-2 space-y-2"><span className="text-sm text-neutral-300">المهارات (افصل بينها بفاصلة)</span><input value={skillsText} onChange={e=>setSkillsText(e.target.value)} placeholder="Photographie, Montage, Drone..." className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"/></label>
          {([['bioAr','النبذة بالعربية'],['bioFr','Bio en français'],['bioEn','Bio in English']] as const).map(([key,label])=><label key={key} className="md:col-span-2 space-y-2"><span className="text-sm text-neutral-300">{label}</span><textarea rows={3} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"/></label>)}
          <label className="md:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-neutral-900 border border-neutral-800"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} className="w-5 h-5 accent-amber-500"/><span className="text-white">العضو نشط ويظهر ضمن الفريق</span></label>
        </div>
        <div className="flex gap-3 mt-7"><button onClick={save} className="flex-1 py-3.5 rounded-xl bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5"/>حفظ الملف</button><button onClick={close} className="px-6 rounded-xl bg-neutral-900 border border-neutral-800 text-white">إلغاء</button></div>
      </div>
    </div> : null}
  </div>;
};
