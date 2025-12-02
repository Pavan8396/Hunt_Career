import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserProfile, updateUserProfile, getUserById } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { PlusIcon, TrashIcon, SaveIcon } from '@heroicons/react/outline';

const UserProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    workExperience: [],
    education: [],
    skills: [],
    portfolioLinks: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const { updateUser } = useContext(AuthContext);
  const { userId } = useParams();
  const navigate = useNavigate();

  const calculateProfileCompleteness = () => {
    const fields = [
      'firstName', 'lastName', 'email', 'phoneNumber',
      'workExperience', 'education', 'skills', 'portfolioLinks'
    ];
    const filledFields = fields.filter(field => {
      const value = profile[field];
      if (Array.isArray(value)) {
        return value.length > 0 && value.some(item => (typeof item === 'string' && item.trim() !== '') || (typeof item === 'object' && Object.values(item).some(v => v)));
      }
      return value && value.toString().trim() !== '';
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const data = userId ? await getUserById(userId, token) : await getUserProfile(token);
        setProfile({
          ...data,
          workExperience: data.workExperience || [],
          education: data.education || [],
          skills: data.skills || [],
          portfolioLinks: data.portfolioLinks || [],
        });
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const validate = () => {
    const newErrors = {};
    if (!profile.firstName) newErrors.firstName = 'First name is required.';
    if (!profile.lastName) newErrors.lastName = 'Last name is required.';
    if (!profile.phoneNumber) newErrors.phoneNumber = 'Phone number is required.';

    const workExperienceErrors = profile.workExperience.map(exp => {
      const expErrors = {};
      if (!exp.title) expErrors.title = 'Job title is required.';
      if (!exp.company) expErrors.company = 'Company is required.';
      return expErrors;
    });

    if (workExperienceErrors.some(e => Object.keys(e).length > 0)) {
      newErrors.workExperience = workExperienceErrors;
    }

    const educationErrors = profile.education.map(edu => {
      const eduErrors = {};
      if (!edu.school) eduErrors.school = 'School is required.';
      if (!edu.degree) eduErrors.degree = 'Degree is required.';
      return eduErrors;
    });

    if (educationErrors.some(e => Object.keys(e).length > 0)) {
      newErrors.education = educationErrors;
    }

    profile.portfolioLinks.forEach((link, index) => {
      if (link && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(link)) {
        if (!newErrors.portfolioLinks) newErrors.portfolioLinks = [];
        newErrors.portfolioLinks[index] = 'Please enter a valid URL.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Your profile has validation errors. Please check the fields below.');
      return;
    }
    try {
      const profileToUpdate = {
        ...profile,
        skills: profile.skills.filter(skill => skill.trim() !== ''),
        portfolioLinks: profile.portfolioLinks.filter(link => link.trim() !== ''),
      };
      const token = sessionStorage.getItem('token');
      // If userId is present (admin editing), pass it to the API call
      const data = await updateUserProfile(profileToUpdate, token, userId);
      setProfile(data);

      // Only update the context if the user is editing their own profile
      if (!userId) {
        // Manually construct the name for the Navbar update
        const updatedUserForContext = {
          ...data,
          name: `${data.firstName} ${data.lastName}`,
        };
        updateUser(updatedUserForContext);
        toast.success('Profile updated successfully!');
      } else {
        toast.success('User profile updated successfully by admin!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error('Failed to update profile.');
    }
  };

  const handleChange = (e, index, section) => {
    const { name, value, type, checked } = e.target;
    if (section) {
      const updatedSection = [...profile[section]];
      if (type === 'checkbox') {
        updatedSection[index] = { ...updatedSection[index], [name]: checked };
        if (name === 'present' && checked) {
          updatedSection[index].endDate = null;
        }
      } else {
        updatedSection[index] = { ...updatedSection[index], [name]: value };
      }
      setProfile({ ...profile, [section]: updatedSection });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleListChange = (e, index, field) => {
    const newList = [...profile[field]];
    newList[index] = e.target.value;
    setProfile({ ...profile, [field]: newList });
  };

  const addSectionItem = (section) => {
    const newItem = section === 'workExperience'
      ? { title: '', company: '', location: '', startDate: '', endDate: '', description: '', present: false }
      : { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' };
    setProfile({ ...profile, [section]: [...profile[section], newItem] });
  };

  const addListItem = (field) => {
    setProfile({ ...profile, [field]: [...profile[field], ''] });
  };

  const removeSectionItem = (index, section) => {
    const updatedSection = profile[section].filter((_, i) => i !== index);
    setProfile({ ...profile, [section]: updatedSection });
  };

  const removeListItem = (index, field) => {
    const newList = profile[field].filter((_, i) => i !== index);
    setProfile({ ...profile, [field]: newList });
  };

  if (loading) {
    return <div className="p-4 max-w-4xl mx-auto text-center dark:text-gray-200">Loading profile...</div>;
  }

  const completeness = calculateProfileCompleteness();

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-screen-lg mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Your Professional Profile</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Keep your profile updated to attract the best opportunities.</p>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Profile Completeness</h2>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                        className="bg-green-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${completeness}%` }}
                    ></div>
                </div>
                <p className="text-right text-sm text-gray-600 dark:text-gray-400 mt-2">{completeness}% Complete</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
                {/* Basic Information Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                            <input type="text" name="firstName" id="firstName" value={profile.firstName} onChange={(e) => handleChange(e)} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                            <input type="text" name="lastName" id="lastName" value={profile.lastName} onChange={(e) => handleChange(e)} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" name="email" id="email" value={profile.email} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                            <input type="tel" name="phoneNumber" id="phoneNumber" value={profile.phoneNumber} onChange={(e) => handleChange(e)} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                        </div>
                    </div>
                </div>

                {/* Work Experience Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Work Experience</h2>
                    <div className="space-y-6">
                        {profile.workExperience.map((exp, index) => (
                            <div key={index} className="p-4 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-700/50 rounded-r-lg">
                                {/* ... form fields for work experience ... */}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={() => addSectionItem('workExperience')} className="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
                        <PlusIcon className="h-5 w-5 mr-2" /> Add Experience
                    </button>
                </div>

                {/* Education Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Education</h2>
                    <div className="space-y-6">
                        {profile.education.map((edu, index) => (
                           <div key={index} className="p-4 border-l-4 border-green-500 bg-gray-50 dark:bg-gray-700/50 rounded-r-lg">
                                {/* ... form fields for education ... */}
                           </div>
                        ))}
                    </div>
                    <button type="button" onClick={() => addSectionItem('education')} className="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
                        <PlusIcon className="h-5 w-5 mr-2" /> Add Education
                    </button>
                </div>

                {/* Skills and Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Skills</h2>
                        {/* ... skills mapping and add button ... */}
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Portfolio Links</h2>
                        {/* ... portfolio links mapping and add button ... */}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="px-8 py-3 border border-transparent text-base font-bold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center shadow-lg transition-transform transform hover:scale-105">
                        <SaveIcon className="h-6 w-6 mr-2" />
                        Save All Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default UserProfilePage;
