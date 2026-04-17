import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlusIcon, SaveIcon, XIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { generateStudentId, validateEmail, validatePhone, formatDate } from '../utils/helpers';

const StudentCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Partial<Student>>({
    name: '',
    studentId: generateStudentId(),
    class: '',
    grade: '',
    contactInfo: {
      email: '',
      phone: '',
      parentContact: ''
    },
    enrollmentDate: formatDate(new Date()),
    status: 'active',
    permanentAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const validateForm = () => {
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

    if (!student.permanentAddress?.street?.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!student.permanentAddress?.city?.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setStudent(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Student] as any),
          [child]: value
        }
      }));
    } else {
      setStudent(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Store student in localStorage for demo
      const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
      const newStudent = {
        ...student,
        id: generateStudentId(),
        enrollmentDate: formatDate(new Date())
      } as Student;
      
      existingStudents.push(newStudent);
      localStorage.setItem('students', JSON.stringify(existingStudents));
      
      setIsLoading(false);
      setShowSuccess(true);
      
      // Redirect to students list after 2 seconds
      setTimeout(() => {
        navigate('/students');
      }, 2000);
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/students');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <UserPlusIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Student</h1>
                <p className="text-gray-600">Add a new student to the system</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="btn-secondary"
            >
              <XIcon className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </motion.div>

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center"
            >
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-700">Student created successfully! Redirecting...</span>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Primary Information */}
            <motion.div
              variants={itemVariants}
              className="glass-effect rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Primary Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={student.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter student name"
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
                    value={student.studentId || ''}
                    disabled
                    className="input-field bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class *
                    </label>
                    <input
                      type="text"
                      value={student.class || ''}
                      onChange={(e) => handleInputChange('class', e.target.value)}
                      className={`input-field ${errors.class ? 'border-red-500' : ''}`}
                      placeholder="e.g., 10A"
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
                      value={student.grade || ''}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className={`input-field ${errors.grade ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select Grade</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                    {errors.grade && (
                      <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={student.status || 'active'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              variants={itemVariants}
              className="glass-effect rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={student.contactInfo?.email || ''}
                    onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="student@example.com"
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
                    value={student.contactInfo?.phone || ''}
                    onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                    className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Contact
                  </label>
                  <input
                    type="tel"
                    value={student.contactInfo?.parentContact || ''}
                    onChange={(e) => handleInputChange('contactInfo.parentContact', e.target.value)}
                    className="input-field"
                    placeholder="Parent phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enrollment Date
                  </label>
                  <input
                    type="date"
                    value={student.enrollmentDate || ''}
                    onChange={(e) => handleInputChange('enrollmentDate', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </motion.div>

            {/* Permanent Address */}
            <motion.div
              variants={itemVariants}
              className="glass-effect rounded-xl p-6 shadow-lg md:col-span-2"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Permanent Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={student.permanentAddress?.street || ''}
                    onChange={(e) => handleInputChange('permanentAddress.street', e.target.value)}
                    className={`input-field ${errors.street ? 'border-red-500' : ''}`}
                    placeholder="123 Main Street"
                  />
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={student.permanentAddress?.city || ''}
                    onChange={(e) => handleInputChange('permanentAddress.city', e.target.value)}
                    className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={student.permanentAddress?.state || ''}
                    onChange={(e) => handleInputChange('permanentAddress.state', e.target.value)}
                    className="input-field"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={student.permanentAddress?.zipCode || ''}
                    onChange={(e) => handleInputChange('permanentAddress.zipCode', e.target.value)}
                    className="input-field"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={student.permanentAddress?.country || ''}
                    onChange={(e) => handleInputChange('permanentAddress.country', e.target.value)}
                    className="input-field"
                    placeholder="USA"
                  />
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 flex justify-end gap-4"
            >
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Student...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Create Student
                  </div>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentCreatePage;
