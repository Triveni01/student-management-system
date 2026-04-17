import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  CameraIcon, 
  SaveIcon, 
  XIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon,
  CalendarIcon,
  Edit3Icon
} from 'lucide-react';
import { Student } from '../types';
import { validateEmail, validatePhone, formatDate } from '../utils/helpers';

const EditStudentPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    loadStudent();
  }, [studentId]);

  const loadStudent = () => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const foundStudent = students.find((s: Student) => s.id === studentId);
    
    if (foundStudent) {
      setStudent(foundStudent);
    } else {
      navigate('/students');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleInputChange = (field: string, value: string) => {
    if (!student) return;

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setStudent(prev => ({
        ...prev!,
        [parent]: {
          ...(prev![parent as keyof Student] as any),
          [child]: value
        }
      }));
    } else {
      setStudent(prev => ({
        ...prev!,
        [field]: value
      }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    if (!student) return false;

    const newErrors: { [key: string]: string } = {};

    if (!student.name?.trim()) {
      newErrors.name = 'Student name is required';
    }

    if (!student.class?.trim()) {
      newErrors.class = 'Class is required';
    }

    if (!student.grade?.trim()) {
      newErrors.grade = 'Grade is required';
    }

    if (!student.contactInfo?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(student.contactInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!student.contactInfo?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(student.contactInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!student || !validateForm()) return;
    
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      const updatedStudents = students.map((s: Student) => 
        s.id === student.id ? student : s
      );
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      
      setIsLoading(false);
      navigate('/students');
    }, 1500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadPhoto = () => {
    if (selectedFile && student) {
      // In a real app, you'd upload to a server
      // For demo, we'll just update the local state
      const updatedStudent = {
        ...student,
        profilePhoto: previewUrl
      };
      setStudent(updatedStudent);
      
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      const updatedStudents = students.map((s: Student) => 
        s.id === student.id ? updatedStudent : s
      );
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center">
              <button
                onClick={() => navigate('/students')}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <Edit3Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Student Profile</h1>
                <p className="text-gray-600">Update student information and profile</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/students')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleSave}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Save Changes
                  </div>
                )}
              </motion.button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Photo Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-1"
            >
              <div className="glass-effect rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Profile Photo
                </h2>
                
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                      {student.profilePhoto ? (
                        <img src={student.profilePhoto} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        student.name.split(' ').map(n => n[0]).join('').toUpperCase()
                      )}
                    </div>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <CameraIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Click the camera icon to upload a new profile photo
                  </p>
                </div>

                {/* Quick Info */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Student ID:</span>
                    <span className="ml-2 font-medium">{student.studentId}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Enrolled:</span>
                    <span className="ml-2 font-medium">{formatDate(student.enrollmentDate)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 mr-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium capitalize">{student.status}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              {/* Primary Information */}
              <div className="glass-effect rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Primary Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={student.studentId}
                      disabled
                      className="input-field bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class *
                    </label>
                    <input
                      type="text"
                      value={student.class}
                      onChange={(e) => handleInputChange('class', e.target.value)}
                      className={`input-field ${errors.class ? 'border-red-500' : ''}`}
                    />
                    {errors.class && (
                      <p className="mt-1 text-sm text-red-600">{errors.class}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade *
                    </label>
                    <select
                      value={student.grade}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className={`input-field ${errors.grade ? 'border-red-500' : ''}`}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                    {errors.grade && (
                      <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={student.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="graduated">Graduated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="glass-effect rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MailIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={student.contactInfo.email}
                      onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={student.contactInfo.phone}
                      onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                      className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Contact
                    </label>
                    <input
                      type="tel"
                      value={student.contactInfo.parentContact}
                      onChange={(e) => handleInputChange('contactInfo.parentContact', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Permanent Address */}
              <div className="glass-effect rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Permanent Address
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={student.permanentAddress.street}
                      onChange={(e) => handleInputChange('permanentAddress.street', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={student.permanentAddress.city}
                      onChange={(e) => handleInputChange('permanentAddress.city', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={student.permanentAddress.state}
                      onChange={(e) => handleInputChange('permanentAddress.state', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={student.permanentAddress.zipCode}
                      onChange={(e) => handleInputChange('permanentAddress.zipCode', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={student.permanentAddress.country}
                      onChange={(e) => handleInputChange('permanentAddress.country', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Profile Photo</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Choose a photo to upload</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="btn-secondary cursor-pointer inline-block"
              >
                Choose File
              </label>
            </div>

            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full mx-auto object-cover" />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setPreviewUrl('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadPhoto}
                disabled={!selectedFile}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EditStudentPage;
