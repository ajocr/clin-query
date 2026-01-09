import { useState } from 'react';
import { Search, Download, UserCircle2, Plus, X, Lightbulb } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface LabValue {
  [key: string]: number | string | undefined;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  diagnoses: string[];
  labValues: LabValue;
  medications: string[];
  lastVisit: string;
  eligibilityScore: number;
}

interface Criterion {
  id: string;
  field: string;
  operator: 'greater' | 'less' | 'equal' | 'between';
  value: string;
  valueMax?: string;
}

const LAB_TEST_OPTIONS = [
  { value: 'hbA1c', label: 'HbA1c (%)', category: 'Metabolic' },
  { value: 'glucoseFasting', label: 'Fasting Glucose (mg/dL)', category: 'Metabolic' },
  { value: 'ldlCholesterol', label: 'LDL Cholesterol (mg/dL)', category: 'Lipid Panel' },
  { value: 'hdlCholesterol', label: 'HDL Cholesterol (mg/dL)', category: 'Lipid Panel' },
  { value: 'triglycerides', label: 'Triglycerides (mg/dL)', category: 'Lipid Panel' },
  { value: 'totalCholesterol', label: 'Total Cholesterol (mg/dL)', category: 'Lipid Panel' },
  { value: 'bmi', label: 'BMI', category: 'Vitals' },
  { value: 'systolicBP', label: 'Systolic BP (mmHg)', category: 'Vitals' },
  { value: 'diastolicBP', label: 'Diastolic BP (mmHg)', category: 'Vitals' },
  { value: 'creatinine', label: 'Creatinine (mg/dL)', category: 'Renal Function' },
  { value: 'egfr', label: 'eGFR (mL/min)', category: 'Renal Function' },
  { value: 'alt', label: 'ALT (U/L)', category: 'Liver Function' },
  { value: 'ast', label: 'AST (U/L)', category: 'Liver Function' },
  { value: 'hemoglobin', label: 'Hemoglobin (g/dL)', category: 'Hematology' },
  { value: 'wbc', label: 'WBC Count (K/μL)', category: 'Hematology' },
  { value: 'platelets', label: 'Platelet Count (K/μL)', category: 'Hematology' },
  { value: 'tsh', label: 'TSH (mIU/L)', category: 'Thyroid' },
  { value: 'vitaminD', label: 'Vitamin D (ng/mL)', category: 'Other' },
];

const mockPatients: Patient[] = [
  {
    id: '001234',
    name: 'Sarah Johnson',
    age: 42,
    gender: 'Female',
    diagnoses: ['Type 2 Diabetes', 'Hypertension'],
    labValues: {
      hbA1c: 7.8,
      glucoseFasting: 145,
      ldlCholesterol: 145,
      hdlCholesterol: 48,
      triglycerides: 185,
      totalCholesterol: 225,
      bmi: 28.5,
      systolicBP: 138,
      diastolicBP: 88,
      creatinine: 1.0,
      egfr: 85,
      alt: 28,
      ast: 32,
      hemoglobin: 13.5,
      wbc: 7.2,
      platelets: 245,
      tsh: 2.1,
    },
    medications: ['Metformin', 'Lisinopril'],
    lastVisit: '2024-11-15',
    eligibilityScore: 95
  },
  {
    id: '001235',
    name: 'Michael Chen',
    age: 58,
    gender: 'Male',
    diagnoses: ['Type 2 Diabetes', 'Hyperlipidemia'],
    labValues: {
      hbA1c: 8.2,
      glucoseFasting: 165,
      ldlCholesterol: 165,
      hdlCholesterol: 42,
      triglycerides: 210,
      totalCholesterol: 245,
      bmi: 31.2,
      systolicBP: 142,
      diastolicBP: 90,
      creatinine: 1.1,
      egfr: 78,
      alt: 35,
      ast: 38,
      hemoglobin: 14.8,
      wbc: 6.8,
      platelets: 228,
    },
    medications: ['Metformin', 'Atorvastatin'],
    lastVisit: '2024-11-20',
    eligibilityScore: 92
  },
  {
    id: '001236',
    name: 'Emily Rodriguez',
    age: 35,
    gender: 'Female',
    diagnoses: ['Prediabetes'],
    labValues: {
      hbA1c: 6.2,
      glucoseFasting: 110,
      ldlCholesterol: 125,
      hdlCholesterol: 58,
      triglycerides: 120,
      totalCholesterol: 195,
      bmi: 26.8,
      systolicBP: 128,
      diastolicBP: 82,
      creatinine: 0.9,
      egfr: 95,
      alt: 22,
      ast: 25,
      hemoglobin: 13.2,
      wbc: 6.5,
      platelets: 265,
      tsh: 1.8,
      vitaminD: 32,
    },
    medications: ['None'],
    lastVisit: '2024-11-28',
    eligibilityScore: 78
  },
  {
    id: '001237',
    name: 'James Wilson',
    age: 67,
    gender: 'Male',
    diagnoses: ['Type 2 Diabetes', 'CAD', 'Hypertension'],
    labValues: {
      hbA1c: 9.1,
      glucoseFasting: 195,
      ldlCholesterol: 185,
      hdlCholesterol: 38,
      triglycerides: 245,
      totalCholesterol: 275,
      bmi: 33.5,
      systolicBP: 152,
      diastolicBP: 95,
      creatinine: 1.4,
      egfr: 58,
      alt: 42,
      ast: 45,
      hemoglobin: 12.8,
      wbc: 8.1,
      platelets: 198,
    },
    medications: ['Insulin', 'Metformin', 'Aspirin', 'Lisinopril'],
    lastVisit: '2024-11-10',
    eligibilityScore: 65
  },
  {
    id: '001238',
    name: 'Maria Garcia',
    age: 51,
    gender: 'Female',
    diagnoses: ['Type 2 Diabetes'],
    labValues: {
      hbA1c: 7.5,
      glucoseFasting: 152,
      ldlCholesterol: 138,
      hdlCholesterol: 52,
      triglycerides: 168,
      totalCholesterol: 215,
      bmi: 29.3,
      systolicBP: 135,
      diastolicBP: 85,
      creatinine: 0.95,
      egfr: 88,
      alt: 30,
      hemoglobin: 13.8,
      wbc: 7.0,
      platelets: 252,
      tsh: 2.5,
    },
    medications: ['Metformin', 'Glipizide'],
    lastVisit: '2024-11-22',
    eligibilityScore: 88
  },
  {
    id: '001239',
    name: 'David Thompson',
    age: 44,
    gender: 'Male',
    diagnoses: ['Prediabetes', 'Obesity'],
    labValues: {
      hbA1c: 6.0,
      glucoseFasting: 105,
      ldlCholesterol: 155,
      hdlCholesterol: 45,
      triglycerides: 195,
      totalCholesterol: 235,
      bmi: 34.1,
      systolicBP: 130,
      diastolicBP: 84,
      creatinine: 1.0,
      egfr: 90,
      alt: 38,
      ast: 40,
      hemoglobin: 15.2,
      wbc: 7.5,
      platelets: 235,
    },
    medications: ['None'],
    lastVisit: '2024-11-18',
    eligibilityScore: 82
  },
];

export function PatientSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [diagnosisFilter, setDiagnosisFilter] = useState('all');
  const [criteria, setCriteria] = useState<Criterion[]>([
    {
      id: 'example-1',
      field: 'hbA1c',
      operator: 'greater',
      value: '7.0',
    },
    {
      id: 'example-2',
      field: 'egfr',
      operator: 'between',
      value: '60',
      valueMax: '90',
    },
  ]);
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);
  const [openPopover, setOpenPopover] = useState(false);
  const [showExample, setShowExample] = useState(true);

  const addCriterion = (field: string) => {
    const newCriterion: Criterion = {
      id: Math.random().toString(36).substr(2, 9),
      field,
      operator: 'greater',
      value: '',
    };
    setCriteria([...criteria, newCriterion]);
    setOpenPopover(false);
  };

  const updateCriterion = (id: string, updates: Partial<Criterion>) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const getFieldLabel = (field: string) => {
    return LAB_TEST_OPTIONS.find(opt => opt.value === field)?.label || field;
  };

  const handleSearch = () => {
    let results = mockPatients;

    // Text search
    if (searchQuery) {
      results = results.filter(
        patient =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Age filters
    if (ageMin) {
      results = results.filter(patient => patient.age >= parseInt(ageMin));
    }
    if (ageMax) {
      results = results.filter(patient => patient.age <= parseInt(ageMax));
    }

    // Gender filter
    if (genderFilter !== 'all') {
      results = results.filter(patient => patient.gender === genderFilter);
    }

    // Diagnosis filter
    if (diagnosisFilter !== 'all') {
      results = results.filter(patient => 
        patient.diagnoses.some(d => d.toLowerCase().includes(diagnosisFilter.toLowerCase()))
      );
    }

    // Lab criteria filters
    results = results.filter(patient => {
      return criteria.every(criterion => {
        const labValue = patient.labValues[criterion.field];
        if (labValue === undefined || labValue === null) return false;
        
        const numericValue = typeof labValue === 'number' ? labValue : parseFloat(labValue as string);
        const criterionValue = parseFloat(criterion.value);
        
        if (isNaN(numericValue) || isNaN(criterionValue)) return false;

        switch (criterion.operator) {
          case 'greater':
            return numericValue >= criterionValue;
          case 'less':
            return numericValue <= criterionValue;
          case 'equal':
            return Math.abs(numericValue - criterionValue) < 0.01;
          case 'between':
            const maxValue = parseFloat(criterion.valueMax || '0');
            return numericValue >= criterionValue && numericValue <= maxValue;
          default:
            return true;
        }
      });
    });

    // Sort by eligibility score
    results.sort((a, b) => b.eligibilityScore - a.eligibilityScore);

    setFilteredPatients(results);
  };

  const getEligibilityColor = (score: number) => {
    if (score >= 85) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (score >= 70) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  // Group lab test options by category
  const groupedOptions = LAB_TEST_OPTIONS.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof LAB_TEST_OPTIONS>);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Patient Search</h1>
          <p className="text-gray-600 mt-1">
            Find patients based on medical criteria
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Results
        </Button>
      </div>

      {/* Example Panel */}
      {showExample && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-blue-900">How to Use ClinQuery</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExample(false)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-blue-800 text-sm mb-4">
                Below you can see example criteria already added. When you click <span className="font-medium">"Add Criterion"</span>, a searchable dropdown appears showing dozens of lab tests organized by category (Metabolic, Lipid Panel, Vitals, Renal Function, Liver Function, Hematology, Thyroid, etc.). Simply search or browse to select the lab test you want to filter by.
              </p>
              
              {/* Example Criteria */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex-1 grid grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Field</label>
                      <div className="text-sm text-gray-900">HbA1c (%)</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Operator</label>
                      <div className="text-sm text-gray-900">≥ Greater than or equal</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Value</label>
                      <div className="text-sm text-gray-900">7.0</div>
                    </div>
                    <div></div>
                  </div>
                  <div className="w-8 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-300" />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex-1 grid grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Field</label>
                      <div className="text-sm text-gray-900">eGFR (mL/min)</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Operator</label>
                      <div className="text-sm text-gray-900">Between</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Value</label>
                      <div className="text-sm text-gray-900">60</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Max Value</label>
                      <div className="text-sm text-gray-900">90</div>
                    </div>
                  </div>
                  <div className="w-8 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-300" />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex-1 grid grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Field</label>
                      <div className="text-sm text-gray-900">LDL Cholesterol (mg/dL)</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Operator</label>
                      <div className="text-sm text-gray-900">≤ Less than or equal</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Value</label>
                      <div className="text-sm text-gray-900">160</div>
                    </div>
                    <div></div>
                  </div>
                  <div className="w-8 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm text-blue-900">
                    💡 <span className="font-medium">How it works:</span> Click "Add Criterion" → A searchable dropdown appears → Search or browse by category → Select your lab test → Configure the operator and values → Click the X button to remove
                  </p>
                </div>      
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-5">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by patient name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>

          {/* Demographics Filters */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-700">Demographics</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Age Min</label>
                <Input
                  type="number"
                  placeholder="18"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Age Max</label>
                <Input
                  type="number"
                  placeholder="65"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Gender</label>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Diagnosis</label>
                <Select value={diagnosisFilter} onValueChange={setDiagnosisFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Diagnoses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Diagnoses</SelectItem>
                    <SelectItem value="Type 2 Diabetes">Type 2 Diabetes</SelectItem>
                    <SelectItem value="Prediabetes">Prediabetes</SelectItem>
                    <SelectItem value="Hypertension">Hypertension</SelectItem>
                    <SelectItem value="Hyperlipidemia">Hyperlipidemia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Lab Criteria Builder */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700">Lab Values & Clinical Criteria</span>
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger>
                  <Button variant="outline" size="sm" className="gap-2" type="button">
                    <Plus className="w-4 h-4" />
                    Add Criterion
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Search lab tests..." />
                    <CommandList>
                      <CommandEmpty>No lab test found.</CommandEmpty>
                      {Object.entries(groupedOptions).map(([category, options]) => (
                        <CommandGroup key={category} heading={category}>
                          {options.map((option) => (
                            <CommandItem
                              key={option.value}
                              onSelect={() => addCriterion(option.value)}
                            >
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Active Criteria */}
            <div className="space-y-3">
              {criteria.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No criteria added yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Click "Add Criterion" above to open a searchable list of lab tests
                  </p>
                </div>
              ) : (
                criteria.map((criterion) => (
                  <div key={criterion.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Test</label>
                        <div className="text-sm">{getFieldLabel(criterion.field)}</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Operator</label>
                        <Select
                          value={criterion.operator}
                          onValueChange={(value) => 
                            updateCriterion(criterion.id, { operator: value as any })
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="greater">≥ Greater than or equal</SelectItem>
                            <SelectItem value="less">≤ Less than or equal</SelectItem>
                            <SelectItem value="equal">= Equal to</SelectItem>
                            <SelectItem value="between">Between</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Value</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Enter value"
                          value={criterion.value}
                          onChange={(e) => 
                            updateCriterion(criterion.id, { value: e.target.value })
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      {criterion.operator === 'between' && (
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Max Value</label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="Max value"
                            value={criterion.valueMax || ''}
                            onChange={(e) => 
                              updateCriterion(criterion.id, { valueMax: e.target.value })
                            }
                            className="h-8 text-sm"
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCriterion(criterion.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Results */}
      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">Search Results</h2>
              <p className="text-gray-600 mt-1">
                {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Match Score</TableHead>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>Diagnoses</TableHead>
                <TableHead>Key Lab Values</TableHead>
                <TableHead>Last Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <UserCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No patients found matching your criteria</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search filters</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.eligibilityScore} className="hover:bg-gray-50 cursor-pointer">
                    <TableCell>
                      <Badge variant="outline" className={getEligibilityColor(patient.eligibilityScore)}>
                        {patient.eligibilityScore}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-blue-600">{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell className="text-gray-600">
                      {patient.age} / {patient.gender.charAt(0)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.diagnoses.slice(0, 2).map((diagnosis, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            {diagnosis}
                          </Badge>
                        ))}
                        {patient.diagnoses.length > 2 && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                            +{patient.diagnoses.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {patient.labValues.hbA1c && (
                          <div className="text-gray-600">HbA1c: <span className="text-gray-900">{patient.labValues.hbA1c}%</span></div>
                        )}
                        {patient.labValues.ldlCholesterol && (
                          <div className="text-gray-600">LDL: <span className="text-gray-900">{patient.labValues.ldlCholesterol}</span></div>
                        )}
                        {patient.labValues.bmi && (
                          <div className="text-gray-600">BMI: <span className="text-gray-900">{patient.labValues.bmi}</span></div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{patient.lastVisit}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
