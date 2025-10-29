import React, { useState, useEffect } from 'react';
import { getEmployerProfile, updateEmployerProfile } from '../services/api';

const EmployerProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const data = await getEmployerProfile(token);
        setProfile(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch employer profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('companyName', profile.companyName);
    formData.append('email', profile.email);
    formData.append('companyDescription', profile.companyDescription);
    formData.append('website', profile.website);
    if (selectedFile) {
      formData.append('companyLogo', selectedFile);
    }

    try {
      const token = sessionStorage.getItem('token');
      const data = await updateEmployerProfile(formData, token);
      setProfile(data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update employer profile', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Company Profile</h1>
      <form onSubmit={handleUpdate}>
        <input name="companyName" value={profile.companyName} onChange={handleChange} />
        <input name="email" value={profile.email} onChange={handleChange} />
        <textarea
          name="companyDescription"
          value={profile.companyDescription}
          onChange={handleChange}
        />
        <input name="website" value={profile.website} onChange={handleChange} />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EmployerProfilePage;
