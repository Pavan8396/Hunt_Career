import React, { useState, useEffect } from 'react';
import api from '../services/api';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/user/profile');
        // Initialize with empty arrays if fields are missing
        setProfile({
          ...data,
          workExperience: data.workExperience || [],
          education: data.education || [],
          skills: data.skills || [],
          portfolioLinks: data.portfolioLinks || [],
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty strings from skills and portfolioLinks
      const profileToUpdate = {
        ...profile,
        skills: profile.skills.filter(skill => skill.trim() !== ''),
        portfolioLinks: profile.portfolioLinks.filter(link => link.trim() !== ''),
      };
      const { data } = await api.put('/api/user/profile', profileToUpdate);
      setProfile(data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const handleChange = (e, index, section) => {
    const { name, value } = e.target;
    if (section) {
      const updatedSection = [...profile[section]];
      updatedSection[index] = { ...updatedSection[index], [name]: value };
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
    const newItem =
      section === 'workExperience'
        ? { title: '', company: '', location: '', startDate: '', endDate: '', description: '' }
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
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>User Profile</h1>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* -- Basic Info -- */}
        <fieldset style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <legend>Basic Information</legend>
          <input name="firstName" value={profile.firstName} onChange={(e) => handleChange(e)} placeholder="First Name" />
          <input name="lastName" value={profile.lastName} onChange={(e) => handleChange(e)} placeholder="Last Name" />
          <input name="email" value={profile.email} onChange={(e) => handleChange(e)} placeholder="Email" />
          <input name="phoneNumber" value={profile.phoneNumber} onChange={(e) => handleChange(e)} placeholder="Phone Number" />
        </fieldset>

        {/* -- Work Experience -- */}
        <fieldset style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <legend>Work Experience</legend>
          {profile.workExperience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee' }}>
              <input name="title" value={exp.title} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Job Title" />
              <input name="company" value={exp.company} onChange={(e) => handleChange(e, index, 'workExperience')} placeholder="Company" />
              <button type="button" onClick={() => removeSectionItem(index, 'workExperience')}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addSectionItem('workExperience')}>Add Experience</button>
        </fieldset>

        {/* -- Education -- */}
        <fieldset style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <legend>Education</legend>
          {profile.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee' }}>
              <input name="school" value={edu.school} onChange={(e) => handleChange(e, index, 'education')} placeholder="School" />
              <input name="degree" value={edu.degree} onChange={(e) => handleChange(e, index, 'education')} placeholder="Degree" />
              <button type="button" onClick={() => removeSectionItem(index, 'education')}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addSectionItem('education')}>Add Education</button>
        </fieldset>

        {/* -- Skills -- */}
        <fieldset style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <legend>Skills</legend>
          {profile.skills.map((skill, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input value={skill} onChange={(e) => handleListChange(e, index, 'skills')} placeholder="Skill" />
              <button type="button" onClick={() => removeListItem(index, 'skills')}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem('skills')}>Add Skill</button>
        </fieldset>

        {/* -- Portfolio Links -- */}
        <fieldset style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <legend>Portfolio Links</legend>
          {profile.portfolioLinks.map((link, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input value={link} onChange={(e) => handleListChange(e, index, 'portfolioLinks')} placeholder="https://example.com" />
              <button type="button" onClick={() => removeListItem(index, 'portfolioLinks')}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem('portfolioLinks')}>Add Link</button>
        </fieldset>

        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfilePage;
