import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { Save, Send, Plus, Trash2, FileText, Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface Participant {
  id: string;
  tipo: string;
  nacionalidad: string;
  horasProgramadas: string;
  fechaInicio: string;
  fechaFin: string;
  tipoDoc: string;
  numeroDoc: string;
  nombres: string;
  carrera: string;
}

interface BudgetItem {
  id: string;
  codigoPartida: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  costoUnitario: number;
}

interface BudgetCategory {
  id: string;
  nombre: string;
  abierto: boolean;
  items: BudgetItem[];
}

interface Counterparty {
  id: string;
  nombre: string;
  tipo: string;
  contacto: string;
}

interface StudentEntry {
  id: string;
  semestre: string;
  hombres: number;
  mujeres: number;
}

interface TerritoryEntry {
  id: string;
  contraparte: string;
  territorio: string;
  poblacionTotal: number;
  familiasBeneficiarias: number;
  diagnostico: number;
  estimado: number;
  real: number;
}

interface UploadedFile {
  id: string;
  nombre: string;
  tipo: string;
  tamano: string;
  fecha: string;
}

interface FollowUpReportProps {
  onBack?: () => void;
}

export default function FollowUpReport({ onBack }: FollowUpReportProps) {
  const [activeSection, setActiveSection] = useState('datos');
  const [projectMode, setProjectMode] = useState<'select' | 'manual'>('select');
  const [selectedProject, setSelectedProject] = useState('');
  const [manualProject, setManualProject] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', tipo: '', nacionalidad: '', horasProgramadas: '', fechaInicio: '', fechaFin: '', tipoDoc: '', numeroDoc: '', nombres: '', carrera: '' }
  ]);

  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
    {
      id: 'personal',
      nombre: '1. Gastos de personal',
      abierto: true,
      items: [{ id: 'p1', codigoPartida: '', descripcion: '', unidad: '', cantidad: 0, costoUnitario: 0 }]
    },
    {
      id: 'movilizacion',
      nombre: '2. Prácticas y movilización',
      abierto: true,
      items: [{ id: 'p2', codigoPartida: '5201010003', descripcion: 'TRANSPORTE MOVILIZACIÓN PAÍS', unidad: '', cantidad: 0, costoUnitario: 0 }]
    },
    {
      id: 'bienes',
      nombre: '3. Bienes, suministros y materiales',
      abierto: true,
      items: [
        { id: 'p3', codigoPartida: '5203010003', descripcion: 'ÚTILES DE OFICINA', unidad: '', cantidad: 0, costoUnitario: 0 },
        { id: 'p4', codigoPartida: '5202090002', descripcion: 'MATERIAL PUBLICITARIO', unidad: '', cantidad: 0, costoUnitario: 0 },
        { id: 'p5', codigoPartida: '5203010001', descripcion: 'MATERIALES DE LABORATORIO', unidad: '', cantidad: 0, costoUnitario: 0 },
        { id: 'p6', codigoPartida: '5203010002', descripcion: 'MEDICINAS', unidad: '', cantidad: 0, costoUnitario: 0 },
        { id: 'p7', codigoPartida: '5299990099', descripcion: 'OTROS', unidad: '', cantidad: 0, costoUnitario: 0 },
        { id: 'p8', codigoPartida: '1201020001', descripcion: 'MAQUINARIA Y EQUIPO', unidad: '', cantidad: 0, costoUnitario: 0 },
        { id: 'p9', codigoPartida: '5203010010', descripcion: 'MATERIAL DIDÁCTICO', unidad: '', cantidad: 0, costoUnitario: 0 }
      ]
    },
    {
      id: 'servicios',
      nombre: '5. Servicios',
      abierto: true,
      items: [
        { id: 'p10', codigoPartida: '5202990006', descripcion: 'FOTOCOPIAS (PROVEEDORES EXTERNOS)', unidad: '', cantidad: 0, costoUnitario: 0 },
        { id: 'p11', codigoPartida: '5202990007', descripcion: 'CUPOS FOTOC, IMP, ESC (XEROX)', unidad: '', cantidad: 0, costoUnitario: 0 }
      ]
    },
    {
      id: 'otros',
      nombre: '6. Otros gastos',
      abierto: true,
      items: [{ id: 'p12', codigoPartida: '', descripcion: '', unidad: '', cantidad: 0, costoUnitario: 0 }]
    }
  ]);

  const [counterparties, setCounterparties] = useState<Counterparty[]>([
    { id: '1', nombre: '', tipo: '', contacto: '' }
  ]);

  const [studentEntries, setStudentEntries] = useState<StudentEntry[]>([
    { id: '1', semestre: 'Semestre 1', hombres: 0, mujeres: 0 },
    { id: '2', semestre: 'Semestre 2', hombres: 0, mujeres: 0 }
  ]);

  const [territoryEntries, setTerritoryEntries] = useState<TerritoryEntry[]>([
    { id: '1', contraparte: '', territorio: '', poblacionTotal: 0, familiasBeneficiarias: 0, diagnostico: 0, estimado: 0, real: 0 }
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const [notification, setNotification] = useState({
    fechaRecordatorio: '',
    fechaLimite: '',
    correoConfirmacion: '',
    activarNotificacion: false
  });

  const [budgetData, setBudgetData] = useState({
    partidaPresupuestaria: '',
    directa: { estimado: 0, periodo1: 0, periodo2: 0 },
    indirecta: { estimado: 0, periodo1: 0, periodo2: 0 },
    detalleEscrito: ''
  });

  const [convenio, setConvenio] = useState({
    tipo: 'nacional',
    pais: '',
    organismo: ''
  });

  const [resumen, setResumen] = useState('');

  const sections = [
    { id: 'datos', icon: '📋', label: 'Datos' },
    { id: 'alcance', icon: '🎯', label: 'Alcance' },
    { id: 'cuantitativas', icon: '📈', label: 'Cuant.' },
    { id: 'componentes', icon: '🔗', label: 'Comp.' },
    { id: 'estudiantes', icon: '👥', label: 'Est.' },
    { id: 'resultados', icon: '📊', label: 'Result.' },
    { id: 'participantes', icon: '👤', label: 'Particip.' },
    { id: 'contrapartes', icon: '🤝', label: 'Contrap.' },
    { id: 'firmas', icon: '✍️', label: 'Firmas' },
    { id: 'anexos', icon: '📎', label: 'Anexos' },
    { id: 'notificaciones', icon: '🔔', label: 'Notif.' },
    { id: 'presupuesto', icon: '💰', label: 'Ppto.' }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const addParticipant = () => {
    setParticipants([...participants, {
      id: Date.now().toString(),
      tipo: '',
      nacionalidad: '',
      horasProgramadas: '',
      fechaInicio: '',
      fechaFin: '',
      tipoDoc: '',
      numeroDoc: '',
      nombres: '',
      carrera: ''
    }]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };
  
  const updateParticipant = (id: string, field: keyof Participant, value: string) => {
    setParticipants(prev =>
      prev.map(participant =>
        participant.id === id ? { ...participant, [field]: value } : participant
      )
    );
  };

  const addBudgetItem = (catId: string) => {
    setBudgetCategories(cats =>
      cats.map(cat =>
        cat.id === catId
          ? { ...cat, items: [...cat.items, { id: Date.now().toString(), codigoPartida: '', descripcion: '', unidad: '', cantidad: 0, costoUnitario: 0 }] }
          : cat
      )
    );
  };

  const removeBudgetItem = (catId: string, itemId: string) => {
    setBudgetCategories(cats =>
      cats.map(cat =>
        cat.id === catId
          ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
          : cat
      )
    );
  };

  const updateBudgetItem = (catId: string, itemId: string, field: keyof BudgetItem, value: string | number) => {
    setBudgetCategories(cats =>
      cats.map(cat =>
        cat.id === catId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, [field]: value } : item
              )
            }
          : cat
      )
    );
  };

  const toggleBudgetCategory = (catId: string) => {
    setBudgetCategories(cats =>
      cats.map(cat =>
        cat.id === catId ? { ...cat, abierto: !cat.abierto } : cat
      )
    );
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Contrapartes
  const addCounterparty = () => {
    setCounterparties([...counterparties, { id: Date.now().toString(), nombre: '', tipo: '', contacto: '' }]);
  };
  const removeCounterparty = (id: string) => {
    setCounterparties(counterparties.filter(c => c.id !== id));
  };
  const updateCounterparty = (id: string, field: keyof Counterparty, value: string) => {
    setCounterparties(counterparties.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const selectedFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      nombre: file.name,
      tipo: file.type || 'Archivo',
      tamano: formatFileSize(file.size),
      fecha: new Date().toLocaleDateString('es-ES')
    }));
    setUploadedFiles(prev => [...prev, ...selectedFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event.target.files);
  };
  
  const handleDropFiles = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileSelection(event.dataTransfer.files);
  };
  
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };
  
  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  // Estudiantes
  const updateStudentEntry = (id: string, field: keyof StudentEntry, value: number) => {
    setStudentEntries(studentEntries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const addStudentEntry = () => {
    setStudentEntries([...studentEntries, { id: Date.now().toString(), semestre: '', hombres: 0, mujeres: 0 }]);
  };
  const removeStudentEntry = (id: string) => {
    setStudentEntries(studentEntries.filter(e => e.id !== id));
  };

  const totalHombres = studentEntries.reduce((sum, e) => sum + e.hombres, 0);
  const totalMujeres = studentEntries.reduce((sum, e) => sum + e.mujeres, 0);

  // Territorio
  const addTerritoryEntry = () => {
    setTerritoryEntries([...territoryEntries, { id: Date.now().toString(), contraparte: '', territorio: '', poblacionTotal: 0, familiasBeneficiarias: 0, diagnostico: 0, estimado: 0, real: 0 }]);
  };
  const removeTerritoryEntry = (id: string) => {
    setTerritoryEntries(territoryEntries.filter(t => t.id !== id));
  };
  const updateTerritoryEntry = (id: string, field: keyof TerritoryEntry, value: number | string) => {
    setTerritoryEntries(territoryEntries.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  // Budget periodo data
  const updateBudgetData = (field: string, value: number | string) => {
    if (field === 'partidaPresupuestaria' || field === 'detalleEscrito') {
      setBudgetData(prev => ({ ...prev, [field]: value }));
    } else {
      const [type, period] = field.split('.') as [string, string];
      setBudgetData(prev => ({
        ...prev,
        [type]: { ...prev[type as keyof typeof prev] as { estimado: number; periodo1: number; periodo2: number }, [period]: Number(value) || 0 }
      }));
    }
  };

  const calcTotal = (type: 'directa' | 'indirecta') => {
    const d = budgetData[type];
    return (d.estimado || 0) + (d.periodo1 || 0) + (d.periodo2 || 0);
  };
  const calcColTotal = (col: 'estimado' | 'periodo1' | 'periodo2') => {
    return (budgetData.directa[col] || 0) + (budgetData.indirecta[col] || 0);
  };

  // Validate form
  const [errors, setErrors] = useState<string[]>([]);
  const validateForm = () => {
    const errs: string[] = [];
    if (projectMode === 'select' && !selectedProject) errs.push('Proyecto');
    if (projectMode === 'manual' && !manualProject) errs.push('Proyecto');
    if (counterparties.length === 0) errs.push('Contrapartes');
    setErrors(errs);
    return errs.length === 0;
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col">
      {/* Header Fijo */}
      <header className="bg-[#003366] px-6 py-6 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center font-bold text-[#003366] text-xl">
                PUCE
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">
                  INFORMACIÓN PARCIAL DE SEGUIMIENTO
                </h1>
                <p className="text-white/90 text-lg">Proyectos de Servicio Comunitario</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <label className="text-white/80 text-sm mb-1">Código:</label>
              <input
                type="text"
                placeholder="XXXX-XXX"
                className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/50 w-40"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navegación por Secciones */}
      <nav className="bg-white border-b border-[#E1E4E8] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#003366] text-white'
                    : 'bg-[#F5F7FA] text-[#344054] hover:bg-[#E1E4E8]'
                }`}
              >
                <span>{section.icon}</span>
                <span className="text-sm">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenedor Central Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

          {/* SECCIÓN 1 - Datos Generales */}
          <section id="datos" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              📋 DATOS GENERALES
            </h2>
            <div className="space-y-6">
              {/* Proyecto - Selector + Manual */}
              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Proyecto <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setProjectMode('select')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${projectMode === 'select' ? 'bg-[#003366] text-white' : 'bg-[#F5F7FA] text-[#344054] border border-[#D0D5DD]'}`}
                  >
                    Seleccionar
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectMode('manual')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${projectMode === 'manual' ? 'bg-[#003366] text-white' : 'bg-[#F5F7FA] text-[#344054] border border-[#D0D5DD]'}`}
                  >
                    Escribir manualmente
                  </button>
                </div>
                {projectMode === 'select' ? (
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white"
                  >
                    <option value="">Seleccionar proyecto</option>
                    <option value="PROY-001">PROY-001 - Proyecto de Salud Comunitaria</option>
                    <option value="PROY-002">PROY-002 - Alfabetización Digital</option>
                    <option value="PROY-003">PROY-003 - Desarrollo Sostenible</option>
                    <option value="manual">Otro...</option>
                  </select>
                ) : (
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={manualProject}
                      onChange={(e) => setManualProject(e.target.value)}
                      placeholder="Nombre del proyecto"
                      className="flex-1 px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    />
                    <input
                      type="text"
                      placeholder="Código"
                      className="w-40 px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Línea de investigación <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white">
                    <option value="">Seleccionar línea</option>
                    <option>Salud y Bienestar</option>
                    <option>Educación y Cultura</option>
                    <option>Desarrollo Social</option>
                    <option>Ambiente y Sostenibilidad</option>
                    <option>Derechos Humanos</option>
                    <option>Otra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Red
                  </label>
                  <select className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white">
                    <option value="">Seleccionar red</option>
                    <option>No aplica</option>
                    <option>Red de Salud</option>
                    <option>Red de Educación</option>
                    <option>Red de Desarrollo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Grupo
                  </label>
                  <select className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white">
                    <option value="">Seleccionar grupo</option>
                    <option>No aplica</option>
                    <option>Grupo de Investigación A</option>
                    <option>Grupo de Investigación B</option>
                    <option>Grupo de Investigación C</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white">
                    <option>Seleccionar estado</option>
                    <option>En ejecución</option>
                    <option>Finalizado</option>
                    <option>Suspendido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Unidad responsable <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>

                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Carrera <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>

                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Docente responsable <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>

                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Correo <span className="text-red-500">*</span>
                  </label>
                  <input type="email" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>

                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>

                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Año de ejecución <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>

                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Fecha de inicio <span className="text-red-500">*</span>
                  </label>
                  <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>

                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Fecha de cierre <span className="text-red-500">*</span>
                  </label>
                  <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>

                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Fecha del informe <span className="text-red-500">*</span>
                  </label>
                  <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Programa
                  </label>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#344054] font-medium mb-3 text-sm">
                    ¿Articulación con investigación PUCE? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="articulacion" value="si" className="w-4 h-4 text-[#003366] focus:ring-[#003366]" />
                      <span className="text-[#344054]">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="articulacion" value="no" className="w-4 h-4 text-[#003366] focus:ring-[#003366]" />
                      <span className="text-[#344054]">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2 - Alcance y Presupuesto */}
          <section id="alcance" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              🎯 ALCANCE Y PRESUPUESTO
            </h2>
            <div className="space-y-6">
              {/* PRESUPUESTO - al inicio */}
              <div className="bg-[#F5F7FA] rounded-lg p-6 border border-[#D0D5DD]">
                <h3 className="text-[#003366] font-semibold mb-4 flex items-center gap-2">
                  💰 PRESUPUESTO
                </h3>
                <div className="mb-4">
                  <label className="block text-[#344054] font-medium mb-2 text-sm">Partida presupuestaria</label>
                  <input
                    type="text"
                    value={budgetData.partidaPresupuestaria}
                    onChange={(e) => updateBudgetData('partidaPresupuestaria', e.target.value)}
                    placeholder="Código de partida"
                    className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white"
                  />
                </div>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#003366] text-white">
                        <th className="border border-[#D0D5DD] px-3 py-2 text-left">Afectación</th>
                        <th className="border border-[#D0D5DD] px-3 py-2 text-right">Estimado</th>
                        <th className="border border-[#D0D5DD] px-3 py-2 text-right">Período 1</th>
                        <th className="border border-[#D0D5DD] px-3 py-2 text-right">Período 2</th>
                        <th className="border border-[#D0D5DD] px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="border border-[#D0D5DD] px-3 py-2 font-medium">Afectación Directa</td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="number" min="0" step="0.01" value={budgetData.directa.estimado || ''} onChange={(e) => updateBudgetData('directa.estimado', e.target.value)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="number" min="0" step="0.01" value={budgetData.directa.periodo1 || ''} onChange={(e) => updateBudgetData('directa.periodo1', e.target.value)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="number" min="0" step="0.01" value={budgetData.directa.periodo2 || ''} onChange={(e) => updateBudgetData('directa.periodo2', e.target.value)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2 text-right font-semibold text-[#003366]">${formatCurrency(calcTotal('directa'))}</td>
                      </tr>
                      <tr className="bg-[#F5F7FA]">
                        <td className="border border-[#D0D5DD] px-3 py-2 font-medium">Afectación Indirecta</td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="number" min="0" step="0.01" value={budgetData.indirecta.estimado || ''} onChange={(e) => updateBudgetData('indirecta.estimado', e.target.value)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="number" min="0" step="0.01" value={budgetData.indirecta.periodo1 || ''} onChange={(e) => updateBudgetData('indirecta.periodo1', e.target.value)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="number" min="0" step="0.01" value={budgetData.indirecta.periodo2 || ''} onChange={(e) => updateBudgetData('indirecta.periodo2', e.target.value)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2 text-right font-semibold text-[#003366]">${formatCurrency(calcTotal('indirecta'))}</td>
                      </tr>
                      <tr className="bg-[#003366] text-white">
                        <td className="border border-[#D0D5DD] px-3 py-2 font-bold">TOTAL</td>
                        <td className="border border-[#D0D5DD] px-3 py-2 text-right font-bold">${formatCurrency(calcColTotal('estimado'))}</td>
                        <td className="border border-[#D0D5DD] px-3 py-2 text-right font-bold">${formatCurrency(calcColTotal('periodo1'))}</td>
                        <td className="border border-[#D0D5DD] px-3 py-2 text-right font-bold">${formatCurrency(calcColTotal('periodo2'))}</td>
                        <td className="border border-[#D0D5DD] px-3 py-2 text-right font-bold">${formatCurrency(calcTotal('directa') + calcTotal('indirecta'))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">Detalle escrito del presupuesto</label>
                  <textarea
                    rows={3}
                    value={budgetData.detalleEscrito}
                    onChange={(e) => updateBudgetData('detalleEscrito', e.target.value)}
                    className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] resize-none"
                    placeholder="Describa detalles del presupuesto..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Comunidad alcanzada <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Tipo de actores <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Beneficiarios <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  N° de personas alcanzadas <span className="text-red-500">*</span>
                </label>
                <input type="number" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              {/* Nota de categorías */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-medium mb-1">📌 Categorías incluidas:</p>
                <p>Niños, niñas, adolescentes, jóvenes, adultos, adultos mayores, personas con discapacidad, familias, comunidades, grupos prioritarios.</p>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3 - Variables Cuantitativas */}
          <section id="cuantitativas" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              📈 VARIABLES CUANTITATIVAS
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#003366] text-white">
                    <th className="border border-[#D0D5DD] px-3 py-2 text-left">Contraparte</th>
                    <th className="border border-[#D0D5DD] px-3 py-2 text-left">Territorio</th>
                    <th className="border border-[#D0D5DD] px-3 py-2 text-right">Población Total</th>
                    <th className="border border-[#D0D5DD] px-3 py-2 text-right">N° Familias Beneficiarias</th>
                    <th className="border border-[#D0D5DD] px-3 py-2 text-right">Diagnóstico</th>
                    <th className="border border-[#D0D5DD] px-3 py-2 text-right">Estimado</th>
                    <th className="border border-[#D0D5DD] px-3 py-2 text-right">Real</th>
                    <th className="border border-[#D0D5DD] px-3 py-2 text-right">Variación %</th>
                    <th className="border border-[#D0D5DD] px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {territoryEntries.map((entry, idx) => {
                    const variacion = entry.estimado > 0 ? ((entry.real - entry.estimado) / entry.estimado * 100) : 0;
                    return (
                      <tr key={entry.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'}>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="text" value={entry.contraparte} onChange={(e) => updateTerritoryEntry(entry.id, 'contraparte', e.target.value)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-sm" placeholder="Contraparte" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="text" value={entry.territorio} onChange={(e) => updateTerritoryEntry(entry.id, 'territorio', e.target.value)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-sm" placeholder="Territorio" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="number" min="0" value={entry.poblacionTotal || ''} onChange={(e) => updateTerritoryEntry(entry.id, 'poblacionTotal', parseInt(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="number" min="0" value={entry.familiasBeneficiarias || ''} onChange={(e) => updateTerritoryEntry(entry.id, 'familiasBeneficiarias', parseInt(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="number" min="0" value={entry.diagnostico || ''} onChange={(e) => updateTerritoryEntry(entry.id, 'diagnostico', parseInt(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="number" min="0" value={entry.estimado || ''} onChange={(e) => updateTerritoryEntry(entry.id, 'estimado', parseInt(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2">
                          <input type="number" min="0" value={entry.real || ''} onChange={(e) => updateTerritoryEntry(entry.id, 'real', parseInt(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2 text-right font-medium">
                          <span className={variacion < 0 ? 'text-red-600' : variacion > 0 ? 'text-green-600' : 'text-[#344054]'}>
                            {variacion.toFixed(1)}%
                          </span>
                        </td>
                        <td className="border border-[#D0D5DD] px-3 py-2 text-center">
                          <button onClick={() => removeTerritoryEntry(entry.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#003366] text-white font-semibold">
                    <td colSpan={2} className="border border-[#D0D5DD] px-3 py-2">TOTALES</td>
                    <td className="border border-[#D0D5DD] px-3 py-2 text-right">{territoryEntries.reduce((s, t) => s + t.poblacionTotal, 0)}</td>
                    <td className="border border-[#D0D5DD] px-3 py-2 text-right">{territoryEntries.reduce((s, t) => s + t.familiasBeneficiarias, 0)}</td>
                    <td className="border border-[#D0D5DD] px-3 py-2 text-right">{territoryEntries.reduce((s, t) => s + t.diagnostico, 0)}</td>
                    <td className="border border-[#D0D5DD] px-3 py-2 text-right">{territoryEntries.reduce((s, t) => s + t.estimado, 0)}</td>
                    <td className="border border-[#D0D5DD] px-3 py-2 text-right">{territoryEntries.reduce((s, t) => s + t.real, 0)}</td>
                    <td className="border border-[#D0D5DD] px-3 py-2 text-right"></td>
                    <td className="border border-[#D0D5DD] px-3 py-2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button onClick={addTerritoryEntry} className="flex items-center gap-2 px-4 py-2 text-sm text-[#003366] font-medium hover:bg-[#E6F0FF] rounded-lg transition-colors">
              <Plus size={16} /> Agregar fila
            </button>
          </section>

          {/* SECCIÓN 4 - Componentes */}
          <section id="componentes" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              🔗 COMPONENTES
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054] font-medium">Componente intersedes</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054] font-medium">Componente de interculturalidad</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054] font-medium">Componente de interdisciplinariedad</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054] font-medium">Componente de posgrados</span>
              </label>
            </div>
          </section>

          {/* SECCIÓN 5 - Estudiantes Vinculados */}
          <section id="estudiantes" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              👥 ESTUDIANTES VINCULADOS AL PROYECTO
            </h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#003366] text-white">
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left">Semestre</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-right">Hombres</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-right">Mujeres</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-right">Total</th>
                    <th className="border border-[#D0D5DD] px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {studentEntries.map((entry, idx) => (
                    <tr key={entry.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'}>
                      <td className="border border-[#D0D5DD] px-4 py-3">
                        <input type="text" value={entry.semestre} onChange={(e) => {
                          const newEntries = [...studentEntries];
                          newEntries[idx] = { ...newEntries[idx], semestre: e.target.value };
                          setStudentEntries(newEntries);
                        }} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-sm" placeholder="Semestre" />
                      </td>
                      <td className="border border-[#D0D5DD] px-4 py-3">
                        <input type="number" min="0" value={entry.hombres || ''} onChange={(e) => updateStudentEntry(entry.id, 'hombres', parseInt(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                      </td>
                      <td className="border border-[#D0D5DD] px-4 py-3">
                        <input type="number" min="0" value={entry.mujeres || ''} onChange={(e) => updateStudentEntry(entry.id, 'mujeres', parseInt(e.target.value) || 0)} className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-right text-sm" />
                      </td>
                      <td className="border border-[#D0D5DD] px-4 py-3 text-right font-semibold text-[#003366]">{entry.hombres + entry.mujeres}</td>
                      <td className="border border-[#D0D5DD] px-4 py-3 text-center">
                        <button onClick={() => removeStudentEntry(entry.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#003366] text-white font-semibold">
                    <td className="border border-[#D0D5DD] px-4 py-3">TOTAL GENERAL</td>
                    <td className="border border-[#D0D5DD] px-4 py-3 text-right">{totalHombres}</td>
                    <td className="border border-[#D0D5DD] px-4 py-3 text-right">{totalMujeres}</td>
                    <td className="border border-[#D0D5DD] px-4 py-3 text-right">{totalHombres + totalMujeres}</td>
                    <td className="border border-[#D0D5DD] px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex gap-2 mb-6">
              <button onClick={addStudentEntry} className="flex items-center gap-2 px-4 py-2 text-sm text-[#003366] font-medium hover:bg-[#E6F0FF] rounded-lg transition-colors">
                <Plus size={16} /> Agregar semestre
              </button>
            </div>

            {/* Resumen de la problematización */}
            <div className="border-t border-[#D0D5DD] pt-6">
              <h3 className="text-[#003366] font-semibold mb-2 flex items-center gap-2">📝 RESUMEN DE LA PROBLEMATIZACIÓN</h3>
              <p className="text-xs text-[#667085] mb-3">
                Incluya enlaces a las fuentes consultadas. Máximo 1000 caracteres.
              </p>
              <div className="relative">
                <textarea
                  rows={5}
                  maxLength={1000}
                  value={resumen}
                  onChange={(e) => setResumen(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] resize-none"
                  placeholder="Describa el resumen de la problematización del proyecto..."
                />
                <div className="absolute bottom-3 right-3 text-xs text-[#667085]">
                  {resumen.length}/1000
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 6 - Matriz de Resultados */}
          <section id="resultados" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              📊 RESULTADOS DEL PROYECTO
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#003366] text-white">
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Cadena de Resultados</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Indicadores</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Fuentes y Medios de Verificación</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Avance de la Actividad y Actores Participantes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-[#F5F7FA]">
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <div className="font-semibold text-[#003366] mb-2">OBJETIVO GENERAL</div>
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <div className="font-semibold text-[#003366] mb-2">OBJETIVO ESPECÍFICO</div>
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                  </tr>
                  <tr className="bg-[#F5F7FA]">
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <div className="font-semibold text-[#003366] mb-2">RESULTADOS</div>
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <div className="font-semibold text-[#003366] mb-2">ACTIVIDADES</div>
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <div className="font-medium text-[#344054] mb-2 text-sm">Ejecución</div>
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECCIÓN 7 - Participantes */}
          <section id="participantes" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#003366] text-xl font-semibold flex items-center gap-2">
                👤 LISTA DE PARTICIPANTES
              </h2>
              <button
                onClick={addParticipant}
                className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002952] transition-colors"
              >
                <Plus size={18} />
                Agregar participante
              </button>
            </div>
            <p className="text-sm text-[#344054] mb-4">Docentes, Administrativos, Alumni</p>

            {/* Nota de no duplicar */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800">
              <p>⚠️ <strong>Importante:</strong> No registrar nuevamente personas que ya fueron atendidas en períodos anteriores. Verifique antes de añadir un nuevo participante.</p>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-max">
                <div className="grid grid-cols-10 gap-2 mb-2 bg-[#003366] text-white p-3 rounded-t-lg">
                  <div className="text-sm font-semibold">Tipo</div>
                  <div className="text-sm font-semibold">Nacionalidad</div>
                  <div className="text-sm font-semibold">Horas programadas</div>
                  <div className="text-sm font-semibold">Fecha inicio</div>
                  <div className="text-sm font-semibold">Fecha fin</div>
                  <div className="text-sm font-semibold">Tipo doc.</div>
                  <div className="text-sm font-semibold">N° doc.</div>
                  <div className="text-sm font-semibold col-span-2">Apellidos y nombres</div>
                  <div className="text-sm font-semibold">Acciones</div>
                </div>

                {participants.map((participant, index) => (
                  <div key={participant.id} className={`grid grid-cols-10 gap-2 p-3 border-b border-[#E1E4E8] ${index % 2 === 0 ? 'bg-[#F5F7FA]' : 'bg-white'}`}>
                    <input
                      type="text"
                      value={participant.tipo}
                      onChange={(e) => updateParticipant(participant.id, 'tipo', e.target.value)}
                      className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      placeholder="Tipo"
                    />
                    <input
                      type="text"
                      value={participant.nacionalidad}
                      onChange={(e) => updateParticipant(participant.id, 'nacionalidad', e.target.value)}
                      className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      placeholder="País"
                    />
                    <input
                      type="number"
                      min="0"
                      value={participant.horasProgramadas}
                      onChange={(e) => updateParticipant(participant.id, 'horasProgramadas', e.target.value)}
                      className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      placeholder="0"
                    />
                    <input
                      type="date"
                      value={participant.fechaInicio}
                      onChange={(e) => updateParticipant(participant.id, 'fechaInicio', e.target.value)}
                      className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    />
                    <input
                      type="date"
                      value={participant.fechaFin}
                      onChange={(e) => updateParticipant(participant.id, 'fechaFin', e.target.value)}
                      className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    />
                    <input
                      type="text"
                      value={participant.tipoDoc}
                      onChange={(e) => updateParticipant(participant.id, 'tipoDoc', e.target.value)}
                      className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      placeholder="CI/Pasap."
                    />
                    <input
                      type="text"
                      value={participant.numeroDoc}
                      onChange={(e) => updateParticipant(participant.id, 'numeroDoc', e.target.value)}
                      className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      placeholder="Número"
                    />
                    <input
                      type="text"
                      value={participant.nombres}
                      onChange={(e) => updateParticipant(participant.id, 'nombres', e.target.value)}
                      className="col-span-2 px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      placeholder="Nombre completo"
                    />
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-[#344054] mt-3 flex items-center gap-1">
              💡 Deslizar horizontalmente para ver más columnas
            </p>
          </section>

          {/* SECCIÓN 8 - Contrapartes */}
          <section id="contrapartes" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#003366] text-xl font-semibold flex items-center gap-2">
                🤝 CONTRAPARTES
              </h2>
              <button
                onClick={addCounterparty}
                className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002952] transition-colors"
              >
                <Plus size={18} />
                Agregar contraparte
              </button>
            </div>

            {counterparties.map((cp, idx) => (
              <div key={cp.id} className={`p-4 rounded-lg mb-3 border border-[#D0D5DD] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'}`}>
                <div className="grid md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-[#344054] font-medium mb-1 text-xs">Nombre de la institución</label>
                    <input type="text" value={cp.nombre} onChange={(e) => updateCounterparty(cp.id, 'nombre', e.target.value)} className="w-full px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Nombre" />
                  </div>
                  <div>
                    <label className="block text-[#344054] font-medium mb-1 text-xs">Tipo</label>
                    <select value={cp.tipo} onChange={(e) => updateCounterparty(cp.id, 'tipo', e.target.value)} className="w-full px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white">
                      <option value="">Seleccionar</option>
                      <option value="pública">Pública</option>
                      <option value="privada">Privada</option>
                      <option value="ONG">ONG</option>
                      <option value="comunitaria">Comunitaria</option>
                      <option value="internacional">Internacional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#344054] font-medium mb-1 text-xs">Contacto</label>
                    <input type="text" value={cp.contacto} onChange={(e) => updateCounterparty(cp.id, 'contacto', e.target.value)} className="w-full px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Teléfono / correo" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => addCounterparty()} className="p-2 text-[#003366] hover:bg-[#E6F0FF] rounded transition-colors" title="Agregar">
                      <Plus size={18} />
                    </button>
                    {counterparties.length > 1 && (
                      <button onClick={() => removeCounterparty(cp.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* SECCIÓN 9 - Firmas */}
          <section id="firmas" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              ✍️ FIRMAS
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-[#D0D5DD] rounded-lg p-6">
                <h3 className="font-semibold text-[#003366] mb-4">ELABORADO POR</h3>
                <p className="text-sm text-[#344054] mb-3">Docente Líder del Proyecto</p>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] mb-3" placeholder="Nombre" />
                <div>
                  <label className="block text-[#344054] text-sm mb-2">Fecha</label>
                  <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
              </div>

              <div className="border border-[#D0D5DD] rounded-lg p-6">
                <h3 className="font-semibold text-[#003366] mb-4">REVISADO POR</h3>
                <p className="text-sm text-[#344054] mb-3">Decano de Unidad</p>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] mb-3" placeholder="Nombre" />
                <div>
                  <label className="block text-[#344054] text-sm mb-2">Fecha</label>
                  <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
              </div>

              <div className="border border-[#D0D5DD] rounded-lg p-6">
                <h3 className="font-semibold text-[#003366] mb-4">APROBADO</h3>
                <p className="text-sm text-[#344054] mb-3">Dirección de Vinculación</p>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] mb-3" placeholder="Nombre" />
                <div>
                  <label className="block text-[#344054] text-sm mb-2">Fecha</label>
                  <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 10 - Anexos */}
          <section id="anexos" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              📎 ANEXOS
            </h2>

            {/* Tipo de Convenio */}
            <div className="mb-6 p-4 border border-[#D0D5DD] rounded-lg bg-[#F5F7FA]">
              <h3 className="text-[#003366] font-semibold mb-3">Tipo de Convenio</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#344054] font-medium mb-1 text-xs">Tipo</label>
                  <select value={convenio.tipo} onChange={(e) => setConvenio({ ...convenio, tipo: e.target.value })} className="w-full px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white">
                    <option value="nacional">Nacional</option>
                    <option value="internacional">Internacional</option>
                    <option value="carta_compromiso">Carta de Compromiso</option>
                  </select>
                </div>
                {convenio.tipo === 'internacional' && (
                  <>
                    <div>
                      <label className="block text-[#344054] font-medium mb-1 text-xs">País</label>
                      <input type="text" value={convenio.pais} onChange={(e) => setConvenio({ ...convenio, pais: e.target.value })} className="w-full px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="País" />
                    </div>
                    <div>
                      <label className="block text-[#344054] font-medium mb-1 text-xs">Organismo internacional</label>
                      <input type="text" value={convenio.organismo} onChange={(e) => setConvenio({ ...convenio, organismo: e.target.value })} className="w-full px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Organismo" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Documentos adjuntos */}
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054]">Acta de entrega-recepción de productos</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054]">Reporte banner de estudiantes</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054] font-medium">
                  Convenio / Carta de compromiso <span className="text-red-500">*</span>
                </span>
                <span className="text-xs text-red-500 ml-2 font-medium">Obligatorio</span>
              </label>
            </div>

            {/* Adjuntar archivos */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />
            <div
              onClick={openFilePicker}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropFiles}
              className="border-2 border-dashed border-[#D0D5DD] rounded-lg p-8 text-center hover:border-[#003366] transition-colors cursor-pointer mb-6"
            >
              <Upload size={48} className="mx-auto mb-4 text-[#344054]" />
              <p className="text-[#344054] font-medium mb-2">Adjuntar archivos</p>
              <p className="text-sm text-[#344054]/70">Haga clic para seleccionar o arrastre los archivos aquí</p>
            </div>

            {/* Resumen de archivos subidos */}
            {uploadedFiles.length > 0 && (
              <div className="border border-[#D0D5DD] rounded-lg overflow-hidden">
                <div className="bg-[#003366] text-white px-4 py-3 font-semibold text-sm">
                  Archivos adjuntos ({uploadedFiles.length})
                </div>
                <div className="divide-y divide-[#D0D5DD]">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-[#F5F7FA]">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-[#003366]" />
                        <div>
                          <p className="text-sm font-medium text-[#344054]">{file.nombre}</p>
                          <p className="text-xs text-[#667085]">{file.tipo} • {file.tamano} • {file.fecha}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeUploadedFile(file.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* SECCIÓN 11 - Notificaciones */}
          <section id="notificaciones" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              🔔 NOTIFICACIONES
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Fecha de recordatorio
                </label>
                <input
                  type="date"
                  value={notification.fechaRecordatorio}
                  onChange={(e) => setNotification({ ...notification, fechaRecordatorio: e.target.value })}
                  className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Fecha límite
                </label>
                <input
                  type="date"
                  value={notification.fechaLimite}
                  onChange={(e) => setNotification({ ...notification, fechaLimite: e.target.value })}
                  className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Correo de confirmación
                </label>
                <input
                  type="email"
                  value={notification.correoConfirmacion}
                  onChange={(e) => setNotification({ ...notification, correoConfirmacion: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={notification.activarNotificacion}
                    onChange={(e) => setNotification({ ...notification, activarNotificacion: e.target.checked })}
                    className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]"
                  />
                  <div>
                    <span className="text-[#344054] font-medium">Activar notificaciones</span>
                    <p className="text-xs text-[#667085]">Recibirá un correo de confirmación y recordatorios en las fechas seleccionadas</p>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* SECCIÓN 12 - Presupuesto Detallado */}
          <section id="presupuesto" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              💰 PRESUPUESTO DETALLADO
            </h2>

            <div className="bg-[#F5F7FA] rounded-lg p-6 mb-6 border border-[#D0D5DD]">
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">Código de proyecto</label>
                  <input type="text" placeholder="XXXX-XXX" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[#344054] font-medium mb-2 text-sm">Título del proyecto</label>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#344054] font-medium mb-2 text-sm">Director del proyecto</label>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#344054] font-medium mb-2 text-sm">Partida presupuestaria</label>
                  <input type="text" placeholder="Código de partida" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
              </div>
            </div>

            {budgetCategories.map((cat) => {
              const subtotal = cat.items.reduce((sum, item) => sum + (item.cantidad * item.costoUnitario), 0);
              return (
                <div key={cat.id} className="mb-4 border border-[#D0D5DD] rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleBudgetCategory(cat.id)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-[#003366] text-white hover:bg-[#002952] transition-colors"
                  >
                    <span className="font-semibold">{cat.nombre}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-white/80">Subtotal: <strong>${formatCurrency(subtotal)}</strong></span>
                      <span className="text-lg transition-transform" style={{ transform: cat.abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </div>
                  </button>

                  {cat.abierto && (
                    <div className="p-4 bg-white">
                      <div className="overflow-x-auto">
                        <div className="min-w-[700px]">
                          <div className="grid grid-cols-12 gap-3 mb-2 px-3 py-2 bg-[#F5F7FA] rounded-t-lg font-semibold text-[#344054] text-sm">
                            <div className="col-span-2">Código partida</div>
                            <div className="col-span-3">Descripción del rubro</div>
                            <div className="col-span-2">Unidad</div>
                            <div className="col-span-1">Cantidad</div>
                            <div className="col-span-2">Costo unitario</div>
                            <div className="col-span-1">Total</div>
                            <div className="col-span-1"></div>
                          </div>

                          {cat.items.map((item, idx) => {
                            const costoTotal = item.cantidad * item.costoUnitario;
                            return (
                              <div key={item.id} className={`grid grid-cols-12 gap-3 px-3 py-2 items-center ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'}`}>
                                <div className="col-span-2">
                                  <input
                                    type="text"
                                    value={item.codigoPartida}
                                    onChange={(e) => updateBudgetItem(cat.id, item.id, 'codigoPartida', e.target.value)}
                                    className="w-full px-2 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                    placeholder="Código"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <input
                                    type="text"
                                    value={item.descripcion}
                                    onChange={(e) => updateBudgetItem(cat.id, item.id, 'descripcion', e.target.value)}
                                    className="w-full px-2 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                    placeholder="Descripción"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <input
                                    type="text"
                                    value={item.unidad}
                                    onChange={(e) => updateBudgetItem(cat.id, item.id, 'unidad', e.target.value)}
                                    className="w-full px-2 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                    placeholder="Unidad"
                                  />
                                </div>
                                <div className="col-span-1">
                                  <input
                                    type="number"
                                    min="0"
                                    value={item.cantidad || ''}
                                    onChange={(e) => updateBudgetItem(cat.id, item.id, 'cantidad', parseFloat(e.target.value) || 0)}
                                    className="w-full px-2 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <div className="relative">
                                    <span className="absolute left-2 top-2 text-[#344054] text-sm">$</span>
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={item.costoUnitario || ''}
                                      onChange={(e) => updateBudgetItem(cat.id, item.id, 'costoUnitario', parseFloat(e.target.value) || 0)}
                                      className="w-full pl-6 pr-2 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                    />
                                  </div>
                                </div>
                                <div className="col-span-1 text-right font-medium text-[#003366] text-sm">
                                  ${formatCurrency(costoTotal)}
                                </div>
                                <div className="col-span-1 text-center">
                                  <button
                                    onClick={() => removeBudgetItem(cat.id, item.id)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        onClick={() => addBudgetItem(cat.id)}
                        className="mt-3 flex items-center gap-2 px-4 py-2 text-sm text-[#003366] font-medium hover:bg-[#E6F0FF] rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                        Agregar rubro
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* TOTAL GENERAL */}
            <div className="bg-[#003366] text-white rounded-lg p-6 mt-6">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>TOTAL GENERAL DEL PRESUPUESTO</span>
                <span>
                  ${formatCurrency(
                    budgetCategories.reduce((total, cat) =>
                      total + cat.items.reduce((sub, item) => sub + (item.cantidad * item.costoUnitario), 0)
                    , 0)
                  )}
                </span>
              </div>
            </div>

            {/* Footer del presupuesto */}
            <div className="mt-8 pt-6 border-t border-[#D0D5DD]">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">Lugar y Fecha</label>
                  <input
                    type="text"
                    defaultValue={`Quito, ${new Date().toLocaleDateString('es-ES')}`}
                    className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">Director/a del Proyecto</label>
                  <input
                    type="text"
                    placeholder="Nombre del director"
                    className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
              </div>
              <p className="text-center text-sm text-[#344054] mt-4 font-medium">
                Dirección de Investigación, Vinculación e Innovación
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Fijo */}
      <footer className="bg-white border-t border-[#E1E4E8] px-6 py-5 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          {/* Error de validación */}
          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Complete los campos obligatorios:</p>
                  <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                    {errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-white text-[#344054] border-2 border-[#D0D5DD] rounded-lg font-semibold hover:bg-[#F5F7FA] transition-colors"
            >
              Volver
            </button>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#F5F7FA] text-[#344054] border border-[#D0D5DD] rounded-lg font-semibold hover:bg-[#E1E4E8] transition-colors">
                <Save size={20} />
                Guardar borrador
              </button>
              <button
                onClick={() => {
                  if (validateForm()) {
                    alert('Informe enviado correctamente. Se ha enviado una notificación al correo: ' + (notification.correoConfirmacion || 'no especificado'));
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#12B76A] text-white rounded-lg font-semibold hover:bg-[#0F9C5A] transition-colors"
              >
                <Send size={20} />
                Enviar informe
              </button>
            </div>
          </div>
          <div className="text-center text-sm text-[#344054]/70 pt-4 border-t border-[#E1E4E8]">
            Pontificia Universidad Católica del Ecuador • Av. 12 de Octubre 1076 • Quito, Ecuador • {new Date().toLocaleDateString('es-ES')}
          </div>
        </div>
      </footer>
    </div>
  );
}
