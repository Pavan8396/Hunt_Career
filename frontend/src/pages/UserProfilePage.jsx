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

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">Your Profile</h1>
        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input type="text" name="firstName" id="firstName" value={profile.firstName} onChange={(e) => handleChange(e)} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800 dark:text-gray-200" />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                  <input type="text" name="lastName" id="lastName" value={profile.lastName} onChange={(e) => handleChange(e)} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800 dark:text-gray-200" />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" name="email" id="email" value={profile.email} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                  <input type="tel" name="phoneNumber" id="phoneNumber" value={profile.phoneNumber} onChange={(e) => handleChange(e)} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800 dark:text-gray-200" />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Work Experience
              </h2>
              <div className="space-y-4">
                {profile.workExperience.length > 0 ? (
                  profile.workExperience.map((exp, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 bg-gray-50 dark:bg-gray-700/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input name="title" value={exp.title} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Job Title" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200" />
                          {errors.workExperience?.[index]?.title && <p className="text-red-500 text-xs mt-1">{errors.workExperience[index].title}</p>}
                        </div>
                        <div>
                          <input name="company" value={exp.company} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Company" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200" />
                          {errors.workExperience?.[index]?.company && <p className="text-red-500 text-xs mt-1">{errors.workExperience[index].company}</p>}
                        </div>
                        <input name="location" value={exp.location} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Location" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200" />
                        <input name="startDate" type="date" value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Start Date" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200" />
                        <input name="endDate" type="date" disabled={exp.present} value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="End Date" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200 disabled:bg-gray-200 dark:disabled:bg-gray-600" />
                        <div className="flex items-center">
                          <input type="checkbox" name="present" id={`present-${index}`} checked={exp.present} onChange={(e) => handleChange(e, index, 'workExperience')} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                          <label htmlFor={`present-${index}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">I currently work here</label>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <textarea name="description" value={exp.description} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Description" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200"></textarea>
                        <button type="button" onClick={() => removeSectionItem(index, 'workExperience')} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400" title="Remove work experience">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="font-semibold">You haven't added any work experience yet.</p>
                    <p className="text-sm mt-1">Adding your roles helps employers understand your background.</p>
                  </div>
                )}
              </div>
              <button type="button" onClick={() => addSectionItem('workExperience')} className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
                <PlusIcon className="h-5 w-5 mr-1" /> Add Experience
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
               <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" />
                </svg>
                Education
              </h2>
              <div className="space-y-4">
                 {profile.education.length > 0 ? (
                  profile.education.map((edu, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 bg-gray-50 dark:bg-gray-700/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input name="school" value={edu.school} onChange={(e) => handleChange(e, index, 'education')} placeholder="School" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200" />
                          {errors.education?.[index]?.school && <p className="text-red-500 text-xs mt-1">{errors.education[index].school}</p>}
                        </div>
                        <div>
                          <input name="degree" value={edu.degree} onChange={(e) => handleChange(e, index, 'education')} placeholder="Degree" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200" />
                          {errors.education?.[index]?.degree && <p className="text-red-500 text-xs mt-1">{errors.education[index].degree}</p>}
                        </div>
                        <input name="fieldOfStudy" value={edu.fieldOfStudy} onChange={(e) => handleChange(e, index, 'education')} placeholder="Field of Study" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200" />
                        <input name="startDate" type="date" value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(e, index, 'education')} placeholder="Start Date" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200" />
                        <input name="endDate" type="date" value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(e, index, 'education')} placeholder="End Date" className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200" />
                      </div>
                      <div className="flex justify-end">
                        <button type="button" onClick={() => removeSectionItem(index, 'education')} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400" title="Remove education">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                 ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="font-semibold">No education details have been added.</p>
                    <p className="text-sm mt-1">Add your academic qualifications to complete your profile.</p>
                  </div>
                )}
              </div>
              <button type="button" onClick={() => addSectionItem('education')} className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
                <PlusIcon className="h-5 w-5 mr-1" /> Add Education
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Skills
              </h2>
              <div className="space-y-2">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input value={skill} onChange={(e) => handleListChange(e, index, 'skills')} placeholder="e.g., React" className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200" />
                      <button type="button" onClick={() => removeListItem(index, 'skills')} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400" title="Remove skill"><TrashIcon className="h-5 w-5" /></button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="font-semibold">No skills added yet.</p>
                    <p className="text-sm mt-1">Click the button below to add your skills.</p>
                  </div>
                )}
              </div>
              <button type="button" onClick={() => addListItem('skills')} className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
                <PlusIcon className="h-5 w-5 mr-1" /> Add Skill
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Portfolio Links
              </h2>
              <div className="space-y-2">
                {profile.portfolioLinks.length > 0 ? (
                  profile.portfolioLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input value={link} onChange={(e) => handleListChange(e, index, 'portfolioLinks')} placeholder="https://github.com/johndoe" className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-800 dark:text-gray-200" />
                      <button type="button" onClick={() => removeListItem(index, 'portfolioLinks')} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400" title="Remove link"><TrashIcon className="h-5 w-5" /></button>
                      {errors.portfolioLinks?.[index] && <p className="text-red-500 text-xs mt-1">{errors.portfolioLinks[index]}</p>}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="font-semibold">No portfolio links added yet.</p>
                    <p className="text-sm mt-1">Showcase your work by adding links.</p>
                  </div>
                )}
              </div>
              <button type="button" onClick={() => addListItem('portfolioLinks')} className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
                <PlusIcon className="h-5 w-5 mr-1" /> Add Link
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button type="submit" className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center shadow-lg">
              <SaveIcon className="h-5 w-5 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;
