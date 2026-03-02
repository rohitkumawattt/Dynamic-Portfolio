import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import { ArrowDownToLine, SquarePen, RefreshCw } from 'lucide-react';
const Resume = () => {
    const [resumeUrl, setResumeUrl] = useState("");
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const { baseApi } = useAuth();
    const [isDownloading, setIsDownloading] = useState(false);

    // Fetch existing resume
    const fetchResume = async () => {
        try {
            const res = await axios.get(`${baseApi}/api/resume`);
            // console.log(res.data.resumeDetails.cloudinaryUrl);
            setResumeUrl(res.data.resumeDetails.cloudinaryUrl);
        } catch (err) {
            console.error("Failed to fetch resume: ", err);
        }
    };
    // function for download resume 
    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            // 1. Fetch the latest resume details from your API
            const res = await axios.get(`${baseApi}/api/resume`);
            const resumeUrl = res.data.resumeDetails.cloudinaryUrl;

            if (!resumeUrl) return alert("Resume not found!");

            // 2. Fetch the file as a blob to force download
            const response = await fetch(resumeUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // 3. Create a temporary anchor element
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Rohit-Kumawat_Resume.pdf`);
            document.body.appendChild(link);
            link.click();

            // 4. Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setIsDownloading(false);
        } catch (error) {
            console.error("Download Error:", error);
            alert("Failed to download resume. Please try again later.");
        } finally {
            setIsDownloading(false);
        }
    };

    useEffect(() => { fetchResume(); }, []);

    const handleUpdate = async () => {
        if (!file) return alert("Please select a file first");
        setLoading(true);
        const formData = new FormData();
        formData.append("resume", file);

        try {
            await axios.post(`${baseApi}/api/resume/upload`, formData);
            toast.success("Resume updated successfully!");
            setIsEditing(false);
            fetchResume(); // Refresh preview
        } catch (err) {
            toast.error("Failed to update resume");
            console.log("RESUME UPLOAD ERROR : ", err);
            setLoading(false);
        } finally { setLoading(false); }
    };

    return (
        <div className="p-2 normal-color rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Resume</h2>
                <div className='flex'>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex justify-center items-center normal-color font-semibold rounded-lg hover:scale-105 shadow-md cursor-pointer transition duration-200 ease-in-out mr-2"
                    >
                        {isEditing ? "Cancel" : <SquarePen className="w-5 h-5 mr-1 inline" />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className={`flex justify-center items-center normal-color font-semibold rounded-lg hover:scale-105 shadow-md cursor-pointer transition duration-200 ease-in-out mr-2`}
                    >

                        {isDownloading ? <RefreshCw className="w-5 h-5 mr-1 inline animate-spin" /> : <ArrowDownToLine />}
                    </button>
                </div>
            </div>

            {isEditing ? (
                <div className="w-full border-2 border-dashed border-gray-600 p-4 sm:p-10 text-center rounded-xl overflow-hidden">
                    <input
                        type="file"
                        accept="application/pdf"
                        name="resume"
                        onChange={(e) => setFile(e.target.files[0])}
                        // Added max-w-full and block to prevent text overflow
                        className="mb-4 block w-full max-w-full text-sm text-gray-400 
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-600 file:text-white
                       hover:file:bg-blue-700 cursor-pointer"
                    />
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="block mx-auto bg-green-600 px-6 py-2 rounded-md w-full sm:w-auto active:scale-95 transition-transform"
                    >
                        {loading ? "Uploading..." : "Upload & Save"}
                    </button>
                </div>
            ) : (
                // Changed fixed height to aspect-ratio for better mobile scaling
                <div className="w-full aspect-[3/4] md:h-[500px] bg-gray-800 rounded-xl overflow-hidden shadow-inner">
                    {resumeUrl ? (
                        <iframe
                            // Using the Google View wrapper is safer for mobile PDF rendering
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(resumeUrl)}&embedded=true`}
                            className="w-full h-full border-0"
                            title="Resume Preview"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 p-4 text-center">
                            No resume uploaded yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Resume;