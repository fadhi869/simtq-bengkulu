import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { BankDataPeserta } from '../../types';
import { EditBankDataModal } from './EditBankDataModal';
import {
  Edit3,
  UserCheck,
  FileText,
  Eye,
  ArrowRight,
  Search,
  CheckSquare,
  Square,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const BankDataPage: React.FC = () => {
  const {
    bankDataList,
    setSelectedBankDataForEdit,
    setIsEditModalOpen,
    daftarkanPesertaDariBankData,
    setRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>(['BANK-003', 'BANK-010']);

  // Modal Detail / Berkas View State
  const [viewingDetail, setViewingDetail] = useState<BankDataPeserta | null>(null);
  const [viewingBerkas, setViewingBerkas] = useState<BankDataPeserta | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter
  const filteredList = bankDataList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.namaPeserta.toLowerCase().includes(q) ||
      item.nik.includes(q) ||
      item.cabang.toLowerCase().includes(q) ||
      item.tempatLahir.toLowerCase().includes(q)
    );
  });

  const totalEntries = 164; // matching screenshot display count "164 entri"
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map((item) => item.id));
    }
  };

  const handleEdit = (item: BankDataPeserta) => {
    setSelectedBankDataForEdit(item);
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBankDataForEdit(null);
    setIsEditModalOpen(true);
  };

  const handleDaftarkanSingle = (id: string) => {
    const res = daftarkanPesertaDariBankData(id);
    setNotification({ type: 'success', message: res.message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDaftarkanSelected = () => {
    if (selectedIds.length === 0) {
      setNotification({ type: 'error', message: 'Pilih minimal satu peserta yang akan didaftarkan.' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    selectedIds.forEach((id) => daftarkanPesertaDariBankData(id));
    setNotification({
      type: 'success',
      message: `Berhasil mendaftarkan ${selectedIds.length} peserta terpilih ke dalam penetapan resmi event!`,
    });
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-mono mb-1">
            <span
              onClick={() => setRole('admin')}
              className="cursor-pointer hover:text-emerald-600 dark:hover:text-[#00FF87] transition-colors"
            >
              Beranda
            </span>
            <span>/</span>
            <span className="text-slate-800 dark:text-zinc-200 font-semibold">Bank Data</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bank Data
          </h1>
        </div>

        {/* Status Pills Matching Screenshot Header */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            MTQ XXXI TINGKAT NASIONAL (Persiapan)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Dewan Hakim (Persiapan)
          </span>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between border ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Table Card (Exact Recreation of Gambar 2) */}
      <div className="ag-card p-5 sm:p-6 space-y-5">
        {/* Card Header: Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-zinc-200 tracking-tight">
            Bank Data Peserta
          </h2>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Tambah Bank Data</span>
            </button>

            <button
              onClick={handleDaftarkanSelected}
              className="px-4 py-2 rounded-lg bg-[#f43f5e] hover:bg-[#e11d48] text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Daftarkan Peserta</span>
            </button>
          </div>
        </div>

        {/* Table Controls: Entries count & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Tampilkan</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#161922] text-slate-800 dark:text-zinc-200 text-xs outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entri</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Cari:</span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nama / NIK..."
                className="pl-3 pr-8 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#161922] text-slate-800 dark:text-zinc-200 text-xs outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-white/[0.04] text-slate-700 dark:text-zinc-300 border-b border-slate-200 dark:border-white/10 font-semibold select-none">
              <tr>
                <th className="py-3 px-3 text-center w-12">
                  <button onClick={toggleSelectAll} className="p-1 hover:text-emerald-500">
                    {selectedIds.length === filteredList.length ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <span className="ml-1">No</span>
                </th>
                <th className="py-3 px-4">Nama Peserta ⇅</th>
                <th className="py-3 px-4">NIK Peserta (Jenis Kelamin) ⇅</th>
                <th className="py-3 px-4">TGL Lahir (Umur) ⇅</th>
                <th className="py-3 px-4 text-center">Kelengkapan Lampiran ⇅</th>
                <th className="py-3 px-3 text-center">Status ⇅</th>
                <th className="py-3 px-4 text-center">Aksi ⇅</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06] font-sans">
              {filteredList.slice(0, entriesPerPage).map((item, index) => {
                const isSelected = selectedIds.includes(item.id);
                const hasWarning = Boolean(item.catatanValidasi);

                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={`transition-colors ${
                        hasWarning
                          ? 'bg-amber-500/[0.08] dark:bg-amber-500/[0.12] border-l-4 border-l-amber-500'
                          : 'hover:bg-slate-50/80 dark:hover:bg-white/[0.02]'
                      }`}
                    >
                      {/* Checkbox & No */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => toggleSelect(item.id)}
                            className="text-slate-400 hover:text-emerald-500"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                          <span
                            className={`font-mono text-xs ${
                              hasWarning
                                ? 'bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded font-bold'
                                : 'text-slate-600 dark:text-zinc-400'
                            }`}
                          >
                            {index + 1}
                          </span>
                        </div>
                      </td>

                      {/* Nama Peserta */}
                      <td className="py-3 px-4 font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                        <div>{item.namaPeserta}</div>
                        <div className="text-[10px] font-normal text-slate-500 dark:text-zinc-400">
                          {item.cabang} - {item.golongan}
                        </div>
                      </td>

                      {/* NIK (Jenis Kelamin) */}
                      <td className="py-3 px-4 text-slate-700 dark:text-zinc-300">
                        <div className="font-mono text-xs tracking-wider">{item.nik}</div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                          ({item.jenisKelamin})
                        </div>
                      </td>

                      {/* TGL Lahir (Umur) */}
                      <td className="py-3 px-4 text-slate-700 dark:text-zinc-300">
                        <div className="font-medium">
                          {new Date(item.tanggalLahir).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                          ({item.umurString})
                        </div>
                      </td>

                      {/* Kelengkapan Lampiran (% bar) */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1 w-24">
                          <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-4 overflow-hidden relative shadow-inner">
                            <div
                              className={`h-full transition-all rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                                item.kelengkapanLampiran === 100
                                  ? 'bg-[#ef4444]'
                                  : item.kelengkapanLampiran >= 80
                                  ? 'bg-[#ef4444]'
                                  : 'bg-[#ef4444]'
                              }`}
                              style={{ width: `${item.kelengkapanLampiran}%` }}
                            >
                              {item.kelengkapanLampiran}%
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            item.status === 'Aktif' || item.status === 'Diterima'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-400 text-white'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* 4 Action Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          {/* 1. Edit (Purple/Blue pencil) */}
                          <button
                            onClick={() => handleEdit(item)}
                            title="Edit Bank Data"
                            className="w-7 h-7 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. Lampiran / Berkas (Orange document) */}
                          <button
                            onClick={() => setViewingBerkas(item)}
                            title="Kelengkapan Berkas Lampiran"
                            className="w-7 h-7 rounded bg-[#f59e0b] hover:bg-[#d97706] text-white flex items-center justify-center transition-colors shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. Detail / Lihat (Green eye) */}
                          <button
                            onClick={() => setViewingDetail(item)}
                            title="Lihat Detail Peserta"
                            className="w-7 h-7 rounded bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 4. Daftarkan / Kirim (Cyan arrow) */}
                          <button
                            onClick={() => handleDaftarkanSingle(item.id)}
                            title="Daftarkan Resmi ke Event"
                            className="w-7 h-7 rounded bg-[#06b6d4] hover:bg-[#0891b2] text-white flex items-center justify-center transition-colors shadow-sm"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Warning note matching screenshot */}
                    {hasWarning && (
                      <tr className="bg-amber-500/[0.05] dark:bg-amber-500/[0.08]">
                        <td colSpan={7} className="py-1.5 px-4 text-xs font-mono text-amber-700 dark:text-amber-300">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>* Catatan: {item.catatanValidasi}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Matching Screenshot */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 text-xs text-slate-600 dark:text-zinc-400">
          <div>
            Menampilkan 1 sampai {Math.min(entriesPerPage, filteredList.length)} dari {totalEntries} entri
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.05] disabled:opacity-40 transition-colors"
              disabled={currentPage === 1}
            >
              Sebelumnya
            </button>

            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-[#4f46e5] text-white font-bold shadow-sm'
                    : 'hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-zinc-300'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <span className="px-1 text-slate-400">...</span>

            <button
              onClick={() => setCurrentPage(17)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                currentPage === 17
                  ? 'bg-[#4f46e5] text-white font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-zinc-300'
              }`}
            >
              17
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Edit / Tambah Modal Component */}
      <EditBankDataModal />

      {/* Detail Modal */}
      {viewingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0e1017] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4 text-slate-800 dark:text-zinc-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="font-bold text-base">Detail Bank Data Peserta</h3>
              <button onClick={() => setViewingDetail(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-3 py-1 border-b border-slate-100 dark:border-white/[0.04]">
                <span className="text-slate-500 dark:text-zinc-400">Nama Lengkap</span>
                <span className="col-span-2 font-bold">{viewingDetail.namaPeserta}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100 dark:border-white/[0.04]">
                <span className="text-slate-500 dark:text-zinc-400">NIK</span>
                <span className="col-span-2 font-mono font-medium">{viewingDetail.nik}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100 dark:border-white/[0.04]">
                <span className="text-slate-500 dark:text-zinc-400">Tempat, Tgl Lahir</span>
                <span className="col-span-2">
                  {viewingDetail.tempatLahir}, {viewingDetail.tanggalLahir} ({viewingDetail.umurString})
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100 dark:border-white/[0.04]">
                <span className="text-slate-500 dark:text-zinc-400">Cabang & Golongan</span>
                <span className="col-span-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  {viewingDetail.cabang} - {viewingDetail.golongan}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100 dark:border-white/[0.04]">
                <span className="text-slate-500 dark:text-zinc-400">Kategori</span>
                <span className="col-span-2 font-medium">{viewingDetail.kategori}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100 dark:border-white/[0.04]">
                <span className="text-slate-500 dark:text-zinc-400">Alamat Domisili</span>
                <span className="col-span-2">
                  {viewingDetail.alamatLengkap}, {viewingDetail.kecamatan}, {viewingDetail.kabKota}, {viewingDetail.provinsi}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1">
                <span className="text-slate-500 dark:text-zinc-400">Rekening</span>
                <span className="col-span-2 font-mono">
                  {viewingDetail.bank} - {viewingDetail.nomorRekening} (a.n {viewingDetail.atasNama})
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setViewingDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Berkas Modal */}
      {viewingBerkas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0e1017] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4 text-slate-800 dark:text-zinc-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base">Kelengkapan Berkas Lampiran</h3>
              </div>
              <button onClick={() => setViewingBerkas(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-500 dark:text-zinc-400">
              Peserta: <strong className="text-slate-800 dark:text-zinc-100">{viewingBerkas.namaPeserta}</strong>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>KTP Peserta (Terbit: {viewingBerkas.tanggalTerbitKTP})</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                  Terlampir
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>Kartu Keluarga (Terbit: {viewingBerkas.tanggalTerbitKK})</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                  Terlampir
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Ijazah / Syahadah Terakhir</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                  Terlampir
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>Surat Rekomendasi Mandat Kafilah</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-zinc-400 font-semibold text-[10px]">
                  Belum Lengkap
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setViewingBerkas(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
