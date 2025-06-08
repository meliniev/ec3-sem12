'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

interface Medicamento {
  CodMedicamento: number;
  descripcionMed: string;
  stock: number;
  precioVentaUni: number;
}

interface TipoMedic {
  CodTipoMed: number;
  descripcion: string;
  medicamentos: Medicamento[];
}

export default function TiposPage() {
  const [tipoMedics, setTipoMedics] = useState<TipoMedic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTipoMedics();
  }, []);

  const fetchTipoMedics = async () => {
    try {
      const response = await fetch('/api/tipomedic');
      const data = await response.json();
      setTipoMedics(data);
    } catch (error) {
      console.error('Error fetching tipo medics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTipos = tipoMedics.filter(tipo =>
    tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h1 className="text-3xl font-bold text-gray-900">Tipos de Medicamento</h1>
                <p className="text-gray-600 mt-1">Clasificación y gestión de categorías</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
                + Nuevo Tipo
              </button>
            </div>
            
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar tipos de medicamento..."
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
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Medicamentos Asociados
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Stock Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTipos.map((tipo) => (
                    <tr key={tipo.CodTipoMed} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          #{tipo.CodTipoMed}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tipo.descripcion}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          {tipo.medicamentos.length > 0 ? (
                            <div className="space-y-1">
                              {tipo.medicamentos.slice(0, 3).map((med) => (
                                <div key={med.CodMedicamento} className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                                  • {med.descripcionMed}
                                </div>
                              ))}
                              {tipo.medicamentos.length > 3 && (
                                <div className="text-xs text-gray-500 font-medium">
                                  +{tipo.medicamentos.length - 3} más...
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Sin medicamentos asociados</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                          {tipo.medicamentos.reduce((total, med) => total + med.stock, 0)} unidades
                        </span>
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
    </>
  );
}