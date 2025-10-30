import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { getUserProfile, updateUserProfile } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const data = await getUserProfile(token);
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
  }, []);

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
      toast.error('Please fix the errors before submitting.');
      return;
    }
    try {
      const profileToUpdate = {
        ...profile,
        skills: profile.skills.filter(skill => skill.trim() !== ''),
        portfolioLinks: profile.portfolioLinks.filter(link => link.trim() !== ''),
      };
      const token = sessionStorage.getItem('token');
      const data = await updateUserProfile(profileToUpdate, token);
      setProfile(data);
      updateUser(data);
      toast.success('Profile updated successfully!');
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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">Your Profile</h1>
      <form onSubmit={handleUpdate} className="space-y-8">

        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
              <input type="text" name="firstName" id="firstName" value={profile.firstName} onChange={(e) => handleChange(e)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-gray-200" />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
              <input type="text" name="lastName" id="lastName" value={profile.lastName} onChange={(e) => handleChange(e)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-gray-200" />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" name="email" id="email" value={profile.email} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm dark:text-gray-400" />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <input type="tel" name="phoneNumber" id="phoneNumber" value={profile.phoneNumber} onChange={(e) => handleChange(e)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-gray-200" />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">Work Experience</h2>
          <div className="space-y-4">
            {profile.workExperience.map((exp, index) => (
              <div key={index} className="p-4 border dark:border-gray-700 rounded-md space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input name="title" value={exp.title} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Job Title" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200" />
                    {errors.workExperience && errors.workExperience[index] && errors.workExperience[index].title && <p className="text-red-500 text-xs mt-1">{errors.workExperience[index].title}</p>}
                  </div>
                  <div>
                    <input name="company" value={exp.company} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Company" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200" />
                    {errors.workExperience && errors.workExperience[index] && errors.workExperience[index].company && <p className="text-red-500 text-xs mt-1">{errors.workExperience[index].company}</p>}
                  </div>
                  <input name="location" value={exp.location} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Location" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200" />
                  <input name="startDate" type="date" value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Start Date" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200" />
                  <input name="endDate" type="date" disabled={exp.present} value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="End Date" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-600" />
                  <div className="flex items-center">
                    <input type="checkbox" name="present" id={`present-${index}`} checked={exp.present} onChange={(e) => handleChange(e, index, 'workExperience')} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label htmlFor={`present-${index}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">I currently work here</label>
                  </div>
                </div>
                <textarea name="description" value={exp.description} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Description" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200"></textarea>
                <button type="button" onClick={() => removeSectionItem(index, 'workExperience')} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 flex items-center">
                  <TrashIcon className="h-5 w-5 mr-1" /> Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addSectionItem('workExperience')} className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
            <PlusIcon className="h-5 w-5 mr-1" /> Add Experience
          </button>
        </div>

        {/* Education */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">Education</h2>
          <div className="space-y-4">
            {profile.education.map((edu, index) => (
              <div key={index} className="p-4 border dark:border-gray-700 rounded-md space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input name="school" value={edu.school} onChange={(e) => handleChange(e, index, 'education')} placeholder="School" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200" />
                    {errors.education && errors.education[index] && errors.education[index].school && <p className="text-red-500 text-xs mt-1">{errors.education[index].school}</p>}
                  </div>
                  <div>
                    <input name="degree" value={edu.degree} onChange={(e) => handleChange(e, index, 'education')} placeholder="Degree" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200" />
                    {errors.education && errors.education[index] && errors.education[index].degree && <p className="text-red-500 text-xs mt-1">{errors.education[index].degree}</p>}
                  </div>
                  <input name="fieldOfStudy" value={edu.fieldOfStudy} onChange={(e) => handleChange(e, index, 'education')} placeholder="Field of Study" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200" />
                  <input name="startDate" type="date" value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(e, index, 'education')} placeholder="Start Date" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200" />
                  <input name="endDate" type="date" value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(e, index, 'education')} placeholder="End Date" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200" />
                </div>
                <button type="button" onClick={() => removeSectionItem(index, 'education')} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 flex items-center">
                  <TrashIcon className="h-5 w-5 mr-1" /> Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addSectionItem('education')} className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
            <PlusIcon className="h-5 w-5 mr-1" /> Add Education
          </button>
        </div>

        {/* Skills & Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">Skills</h2>
            <div className="space-y-2">
              {profile.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input value={skill} onChange={(e) => handleListChange(e, index, 'skills')} placeholder="e.g., React" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200" />
                  <button type="button" onClick={() => removeListItem(index, 'skills')} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"><TrashIcon className="h-5 w-5" /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addListItem('skills')} className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
              <PlusIcon className="h-5 w-5 mr-1" /> Add Skill
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">Portfolio Links</h2>
            <div className="space-y-2">
              {profile.portfolioLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input value={link} onChange={(e) => handleListChange(e, index, 'portfolioLinks')} placeholder="https://github.com/johndoe" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm dark:text-gray-200" />
                  <button type="button" onClick={() => removeListItem(index, 'portfolioLinks')} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"><TrashIcon className="h-5 w-5" /></button>
                  {errors.portfolioLinks && errors.portfolioLinks[index] && <p className="text-red-500 text-xs mt-1">{errors.portfolioLinks[index]}</p>}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addListItem('portfolioLinks')} className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
              <PlusIcon className="h-5 w-5 mr-1" /> Add Link
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfilePage;
