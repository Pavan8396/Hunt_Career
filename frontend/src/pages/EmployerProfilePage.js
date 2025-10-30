import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { getEmployerProfile, updateEmployerProfile } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { UploadIcon } from '@heroicons/react/outline';

const EmployerProfilePage = () => {
  const [profile, setProfile] = useState({
    companyName: '',
    email: '',
    companyDescription: '',
    website: '',
    companyLogo: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { updateUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const data = await getEmployerProfile(token);
        setProfile(data);
        if (data.companyLogo) {
          setPreview(`http://localhost:5000/${data.companyLogo}`);
        }
      } catch (error) {
        console.error('Failed to fetch employer profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!profile.companyName) {
      newErrors.companyName = 'Company name is required.';
    }
    if (!profile.companyDescription) {
      newErrors.companyDescription = 'Company description is required.';
    }
    if (profile.website && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(profile.website)) {
      newErrors.website = 'Please enter a valid URL.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }
    const formData = new FormData();
    formData.append('companyName', profile.companyName);
    formData.append('email', profile.email);
    formData.append('companyDescription', profile.companyDescription);
    formData.append('website', profile.website || '');
    if (selectedFile) {
      formData.append('companyLogo', selectedFile);
    }

    try {
      const token = sessionStorage.getItem('token');
      const data = await updateEmployerProfile(formData, token);
      setProfile(data);
      if (data.companyLogo) {
        setPreview(`http://localhost:5000/${data.companyLogo}`);
      }
      updateUser(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update employer profile', error);
      toast.error('Failed to update profile.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  if (loading) {
    return <div className="p-4 max-w-4xl mx-auto text-center dark:text-gray-200">Loading company profile...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">Company Profile</h1>
      <form onSubmit={handleUpdate} className="space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">Company Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
              <input type="text" name="companyName" id="companyName" value={profile.companyName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-gray-200" />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" name="email" id="email" value={profile.email} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm dark:text-gray-400" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
              <input type="url" name="website" id="website" value={profile.website} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-gray-200" />
              {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Description</label>
              <textarea name="companyDescription" id="companyDescription" value={profile.companyDescription} onChange={handleChange} rows="4" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-gray-200"></textarea>
              {errors.companyDescription && <p className="text-red-500 text-xs mt-1">{errors.companyDescription}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Logo</label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {preview ? <img src={preview} alt="Company Logo Preview" className="h-full w-full object-cover" /> : <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                </span>
                <label htmlFor="file-upload" className="ml-5 cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <UploadIcon className="h-5 w-5 mr-2 inline-block" />
                  <span>Change</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployerProfilePage;
