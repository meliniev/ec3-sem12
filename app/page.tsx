'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';

interface TipoMedic {
  CodTipoMed: number;
  descripcion: string;
}

interface Especialidad {
  CodEspec: number;
  descripcionEsp: string;
}

interface Medicamento {
  CodMedicamento: number;
  descripcionMed: string;
  presentacion: string;
  fechaVencimiento: string;
  stock: number;
  precioVentaUni: number;
  marca: string;
  tipoMedic: TipoMedic;
  especialidad: Especialidad;
}

export default function Home() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [tipoMedics, setTipoMedics] = useState<TipoMedic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    descripcionMed: '',
    presentacion: '',
    stock: '',
    precioVentaUni: '',
    marca: '',
    CodTipoMed: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [medicamentosRes, tipoMedicsRes] = await Promise.all([
        fetch('/api/medicamento'),
        fetch('/api/tipomedic')
      ]);
      
      const medicamentosData = await medicamentosRes.json();
      const tipoMedicsData = await tipoMedicsRes.json();
      
      setMedicamentos(medicamentosData);
      setTipoMedics(tipoMedicsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/medicamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcionMed: form.descripcionMed,
          presentacion: form.presentacion,
          stock: Number(form.stock),
          precioVentaUni: Number(form.precioVentaUni),
          marca: form.marca,
          CodTipoMed: Number(form.CodTipoMed),
          fechaFabricacion: new Date().toISOString(),
          fechaVencimiento: new Date(Date.now() + 31536000000).toISOString(), // +1 año
          precioVentaPres: Number(form.precioVentaUni) * 10,
          CodEspec: 1,
        }),
      });
      
      // Recargar datos
      fetchData();
      
      // Limpiar formulario y cerrar modal
      setForm({
        descripcionMed: '',
        presentacion: '',
        stock: '',
        precioVentaUni: '',
        marca: '',
        CodTipoMed: '',
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error creating medicamento:', error);
    }
  };

  const filteredMedicamentos = medicamentos.filter(med =>
    med.descripcionMed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Medicamentos</h1>
                <p className="text-gray-600 mt-1">Gestión de inventario farmacéutico</p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Nuevo Medicamento</span>
              </button>
            </div>
            
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar medicamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Medicamento
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Especialidad
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMedicamentos.map((medicamento) => (
                    <tr key={medicamento.CodMedicamento} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {medicamento.descripcionMed}
                          </div>
                          <div className="text-sm text-gray-500">
                            {medicamento.marca} • {medicamento.presentacion}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {medicamento.tipoMedic.descripcion}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {medicamento.especialidad.descripcionEsp}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          medicamento.stock > 50 ? 'bg-green-100 text-green-800' :
                          medicamento.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {medicamento.stock} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        S/ {medicamento.precioVentaUni.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear medicamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 fade-in">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Nuevo Medicamento</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del Medicamento
                </label>
                <input
                  type="text"
                  value={form.descripcionMed}
                  onChange={(e) => setForm({...form, descripcionMed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presentación
                </label>
                <input
                  type="text"
                  value={form.presentacion}
                  onChange={(e) => setForm({...form, presentacion: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({...form, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Unitario
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.precioVentaUni}
                    onChange={(e) => setForm({...form, precioVentaUni: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  value={form.marca}
                  onChange={(e) => setForm({...form, marca: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Medicamento
                </label>
                <select
                  value={form.CodTipoMed}
                  onChange={(e) => setForm({...form, CodTipoMed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar tipo...</option>
                  {tipoMedics.map((tipo) => (
                    <option key={tipo.CodTipoMed} value={tipo.CodTipoMed}>
                      {tipo.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}