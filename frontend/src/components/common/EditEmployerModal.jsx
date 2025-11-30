import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const EditEmployerModal = ({ isOpen, onClose, employer, onSave }) => {
    const [employerData, setEmployerData] = useState({
        companyName: '',
        email: '',
    });

    useEffect(() => {
        if (employer) {
            setEmployerData({
                companyName: employer.companyName,
                email: employer.email,
            });
        }
    }, [employer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployerData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(employerData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Employer">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        value={employerData.companyName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-gray-200"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={employerData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-gray-200"
                    />
                </div>
                <div className="flex justify-end">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditEmployerModal;
