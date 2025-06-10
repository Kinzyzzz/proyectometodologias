import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Plus, Search, Filter, Users, UserCheck } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status: 'programada' | 'completada' | 'cancelada';
  notes?: string;
}

const doctors: Doctor[] = [
  { id: '1', name: 'Dr. María González', specialty: 'Odontología General', available: true },
  { id: '2', name: 'Dr. Carlos Ruiz', specialty: 'Ortodoncista', available: true },
  { id: '3', name: 'Dra. Ana López', specialty: 'Endodoncista', available: true },
  { id: '4', name: 'Dr. Roberto Silva', specialty: 'Cirugía Oral', available: true }
];

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'newAppointment' | 'appointments' | 'patients'>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'programada' | 'completada' | 'cancelada'>('all');

  // Formulario de nueva cita
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    patientDOB: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Cargar datos simulados
  useEffect(() => {
    const samplePatients: Patient[] = [
      { id: '1', name: 'Juan Pérez', email: 'juan@email.com', phone: '555-0101', dateOfBirth: '1985-03-15' },
      { id: '2', name: 'María García', email: 'maria@email.com', phone: '555-0102', dateOfBirth: '1990-07-22' },
      { id: '3', name: 'Carlos López', email: 'carlos@email.com', phone: '555-0103', dateOfBirth: '1978-11-08' }
    ];

    const sampleAppointments: Appointment[] = [
      {
        id: '1',
        patientId: '1',
        doctorId: '1',
        date: '2024-01-20',
        time: '10:00',
        reason: 'Limpieza dental',
        status: 'programada'
      },
      {
        id: '2',
        patientId: '2',
        doctorId: '2',
        date: '2024-01-21',
        time: '14:30',
        reason: 'Consulta ortodóncia',
        status: 'programada'
      }
    ];

    setPatients(samplePatients);
    setAppointments(sampleAppointments);
  }, []);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.patientName.trim()) errors.patientName = 'El nombre es requerido';
    if (!formData.patientEmail.trim()) errors.patientEmail = 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(formData.patientEmail)) errors.patientEmail = 'Email inválido';
    if (!formData.patientPhone.trim()) errors.patientPhone = 'El teléfono es requerido';
    if (!formData.patientDOB) errors.patientDOB = 'La fecha de nacimiento es requerida';
    if (!formData.doctorId) errors.doctorId = 'Debe seleccionar un doctor';
    if (!formData.date) errors.date = 'La fecha es requerida';
    if (!formData.time) errors.time = 'La hora es requerida';
    if (!formData.reason.trim()) errors.reason = 'El motivo de la cita es requerido';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newPatient: Patient = {
      id: Date.now().toString(),
      name: formData.patientName,
      email: formData.patientEmail,
      phone: formData.patientPhone,
      dateOfBirth: formData.patientDOB
    };

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientId: newPatient.id,
      doctorId: formData.doctorId,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      status: 'programada',
      notes: formData.notes
    };

    setPatients(prev => [...prev, newPatient]);
    setAppointments(prev => [...prev, newAppointment]);

    // Reset form
    setFormData({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      patientDOB: '',
      doctorId: '',
      date: '',
      time: '',
      reason: '',
      notes: ''
    });

    alert('Cita programada exitosamente');
    setCurrentView('appointments');
  };

  const getPatientName = (patientId: string): string => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Paciente no encontrado';
  };

  const getDoctorName = (doctorId: string): string => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Doctor no encontrado';
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = getPatientName(apt.patientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getDoctorName(apt.doctorId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Clínica Dental</h1>
                <p className="text-sm text-gray-500">Sistema de Gestión de Citas</p>
              </div>
            </div>
            <nav className="flex space-x-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Calendar },
                { id: 'newAppointment', label: 'Nueva Cita', icon: Plus },
                { id: 'appointments', label: 'Citas', icon: Clock },
                { id: 'patients', label: 'Pacientes', icon: Users }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentView(id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    currentView === id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard */}
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">Resumen general de la clínica</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Citas Hoy', value: todayAppointments.length, icon: Calendar, color: 'blue' },
                { title: 'Total Citas', value: appointments.length, icon: Clock, color: 'green' },
                { title: 'Pacientes', value: patients.length, icon: Users, color: 'purple' },
                { title: 'Doctores', value: doctors.length, icon: UserCheck, color: 'orange' }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Citas Recientes</h3>
              </div>
              <div className="p-6">
                {appointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{getPatientName(apt.patientId)}</p>
                        <p className="text-sm text-gray-500">{apt.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{apt.date}</p>
                      <p className="text-sm text-gray-500">{apt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Nueva Cita */}
        {currentView === 'newAppointment' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Nueva Cita</h2>
                <p className="text-gray-600 mt-1">Programa una nueva cita para un paciente</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Información del Paciente */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Información del Paciente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.patientName}
                        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.patientName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Ej: Juan Pérez"
                      />
                      {formErrors.patientName && <p className="text-red-500 text-sm mt-1">{formErrors.patientName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.patientEmail}
                        onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.patientEmail ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="juan@email.com"
                      />
                      {formErrors.patientEmail && <p className="text-red-500 text-sm mt-1">{formErrors.patientEmail}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={formData.patientPhone}
                        onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.patientPhone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="555-0000"
                      />
                      {formErrors.patientPhone && <p className="text-red-500 text-sm mt-1">{formErrors.patientPhone}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Nacimiento *
                      </label>
                      <input
                        type="date"
                        value={formData.patientDOB}
                        onChange={(e) => setFormData({...formData, patientDOB: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.patientDOB ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.patientDOB && <p className="text-red-500 text-sm mt-1">{formErrors.patientDOB}</p>}
                    </div>
                  </div>
                </div>

                {/* Información de la Cita */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Información de la Cita
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Doctor *
                      </label>
                      <select
                        value={formData.doctorId}
                        onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.doctorId ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Seleccionar doctor</option>
                        {doctors.map(doctor => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                          </option>
                        ))}
                      </select>
                      {formErrors.doctorId && <p className="text-red-500 text-sm mt-1">{formErrors.doctorId}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.date ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.date && <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora *
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.time ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.time && <p className="text-red-500 text-sm mt-1">{formErrors.time}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Motivo de la Cita *
                      </label>
                      <input
                        type="text"
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.reason ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Ej: Limpieza dental, Consulta general..."
                      />
                      {formErrors.reason && <p className="text-red-500 text-sm mt-1">{formErrors.reason}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas Adicionales
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Información adicional sobre la cita..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCurrentView('dashboard')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Programar Cita</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Citas */}
        {currentView === 'appointments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Citas</h2>
                <p className="text-gray-600">Administra todas las citas programadas</p>
              </div>
              <button
                onClick={() => setCurrentView('newAppointment')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Cita</span>
              </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por paciente o doctor..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option value="all">Todas</option>
                      <option value="programada">Programadas</option>
                      <option value="completada">Completadas</option>
                      <option value="cancelada">Canceladas</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Citas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No se encontraron citas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((apt) => (
                      <div key={apt.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{getPatientName(apt.patientId)}</h4>
                              <p className="text-gray-600 mt-1">{apt.reason}</p>
                              <p className="text-sm text-gray-500 mt-1">{getDoctorName(apt.doctorId)}</p>
                              {apt.notes && (
                                <p className="text-sm text-gray-500 mt-2 italic">Notas: {apt.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">{apt.date}</span>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{apt.time}</span>
                            </div>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              apt.status === 'programada' ? 'bg-yellow-100 text-yellow-800' :
                              apt.status === 'completada' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lista de Pacientes */}
        {currentView === 'patients' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h2>
              <p className="text-gray-600">Administra la información de los pacientes</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                {patients.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No hay pacientes registrados</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patients.map((patient) => (
                      <div key={patient.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{patient.email}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{patient.phone}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Fecha de nacimiento</p>
                            <p className="text-sm font-medium text-gray-900">{patient.dateOfBirth}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;