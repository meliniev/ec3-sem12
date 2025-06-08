'use client';

import MedicamentosTable from './components/MedicamentosTable';

export default function Home() {
  return (
    <>
      <div className="header-bar">
        <span className="header-title">Stack</span>
        <div className="header-nav">
          <a href="/" className="active">Medicamentos</a>
          <a href="/tipos">Tipos de Medicamento</a>
        </div>
      </div>
      <MedicamentosTable />
    </>
  );
}