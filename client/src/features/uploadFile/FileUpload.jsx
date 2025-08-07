import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile, resetUpload, fetchFiles } from "../../redux/uploadSlice";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const { status, uploadData, error } = useSelector((state) => state.upload);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    dispatch(resetUpload());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // field name must match multer config

    dispatch(uploadFile(formData));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload a File</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".pdf,image/*,.eml"
            onChange={handleFileChange}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0 file:text-white file:bg-blue-600
              hover:file:bg-blue-700 cursor-pointer"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full py-2 px-4 text-white rounded ${
              status === "loading"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {status === "loading" ? "Uploading..." : "Upload"}
          </button>
        </form>

        {status === "succeeded" && (
          <p className="mt-4 text-green-600 font-medium">
            File uploaded successfully.
          </p>
        )}
        {status === "failed" && (
          <p className="mt-4 text-red-600 font-medium">{error}</p>
        )}
      </div>

      {/* Uploaded Files Table */}
      {uploadData?.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Uploaded Files
          </h3>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left font-semibold">#</th>
                <th className="py-3 px-4 text-left font-semibold">File Name</th>
              </tr>
            </thead>
            <tbody>
              {uploadData.map((el, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{el.attachmentName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
