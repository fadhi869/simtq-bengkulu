import React from 'react';
import { DAFTAR_KAFILAH } from '../../data/constants';
import { Award, Shield, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-slate-300 border-t-4 border-amber-500 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-serif text-2xl font-bold text-emerald-950">
                م
              </div>
              <div>
                <h4 className="text-white font-extrabold text-lg tracking-tight">
                  SIMTQ PROVINSI BENGKULU
                </h4>
                <p className="text-xs text-amber-300">
                  Lembaga Pengembangan Tilawatil Qur'an (LPTQ)
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Aplikasi terintegrasi untuk pendaftaran delegasi kafilah, verifikasi berkas berjenjang, pengundian nomor urut tampil transparan, serta sistem penilaian real-time Dewan Hakim MTQ Tingkat Provinsi Bengkulu.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] bg-emerald-900/80 text-amber-300 border border-amber-500/20">
                <Shield className="w-3 h-3" /> Transparan & Akuntabel
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] bg-emerald-900/80 text-emerald-200 border border-emerald-700/40">
                <Award className="w-3 h-3" /> Standar LPTQ Nasional
              </span>
            </div>
          </div>

          {/* Col 2: 10 Kafilah Daerah Bengkulu */}
          <div>
            <h5 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">
              10 Kafilah Daerah
            </h5>
            <ul className="text-xs space-y-1.5 text-slate-300">
              {DAFTAR_KAFILAH.map((k) => (
                <li key={k} className="hover:text-amber-200 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                  {k}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Sekretariat & Kontak */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">
              Sekretariat Panitia
            </h5>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Gedung LPTQ / Kanwil Kemenag Provinsi Bengkulu, Jl. Basuki Rahmat No. 10, Kota Bengkulu
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>(0736) 21102 / 0812-7300-8899</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>lptq@bengkuluprov.go.id</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-900 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <p>
            © {new Date().getFullYear()} LPTQ Provinsi Bengkulu. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="text-slate-400">
            "Mewujudkan Masyarakat Bengkulu yang Maju, Religius, dan Berakhlaqul Karimah"
          </p>
        </div>
      </div>
    </footer>
  );
};
