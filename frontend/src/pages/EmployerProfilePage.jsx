import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { getEmployerProfile, updateEmployerProfile } from '../services/api';
import { AuthContext } from '../context/AuthContext';

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
      toast.error('Your company profile has validation errors. Please check the fields below.');
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
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">Company Profile</h1>
        <form onSubmit={handleUpdate}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                <input type="text" name="companyName" id="companyName" value={profile.companyName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}

                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" name="email" id="email" value={profile.email} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-500 dark:text-gray-400" />
                </div>

                <div className="mt-4">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                  <input type="text" name="website" id="website" value={profile.website} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                </div>
              </div>

              <div className="w-40 flex-shrink-0 text-center">
                <div className="flex items-center justify-end">
                  <span className="inline-block h-20 w-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {preview ? <img src={preview} alt="Company Logo Preview" className="h-full w-full object-cover" /> : <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                  </span>
                </div>
                <label htmlFor="file-upload" className="mt-3 inline-flex items-center justify-center cursor-pointer bg-white dark:bg-gray-700 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline-block text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 14a1 1 0 011-1h3v2H5v1h10v-1h-2v-2h3a1 1 0 011 1v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zM9 7a1 1 0 012 0v4h3l-4-5-4 5h3V7z" clipRule="evenodd" />
                  </svg>
                  <span>Change Logo</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Description</label>
              <textarea name="companyDescription" id="companyDescription" value={profile.companyDescription} onChange={handleChange} rows="4" className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
              {errors.companyDescription && <p className="text-red-500 text-xs mt-1">{errors.companyDescription}</p>}
            </div>

            <div className="flex justify-end pt-6">
              <button type="submit" className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Save Changes</button>
            </div>
          </div>
        </form>
    </div>    
  </div>
  );
};

export default EmployerProfilePage;
