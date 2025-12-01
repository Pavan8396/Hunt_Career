export const saveJob = (job) => {
  const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
  if (!savedJobs.some((savedJob) => savedJob._id === job._id)) {
    savedJobs.push({
      _id: job._id,
      title: job.title,
      company: job.company,
      job_type: job.job_type,
      candidate_required_location: job.candidate_required_location,
      description: job.description,
    });
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }
};

export const removeJob = (jobId) => {
  const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
  const updatedJobs = savedJobs.filter((job) => job._id !== jobId);
  localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
};

export const getSavedJobs = () => {
  return JSON.parse(localStorage.getItem('savedJobs')) || [];
};

export const isJobSaved = (jobId) => {
  const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
  return savedJobs.some((job) => job._id === jobId);
};