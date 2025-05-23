import React from 'react';

const ProfilePicture = ({
  imagePreview,
  onFileSelect,
  onUpload,
  selectedFile,
  isUploading
}) => {
  return (
    <div className="profile-picture-section">
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Profile Preview"
          className="profile-picture-preview"
          style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: '50%', border: '1px solid #ccc' }}
        />
      ) : (
        <div
          className="profile-picture-placeholder"
          style={{
            width: 150,
            height: 150,
            backgroundColor: '#eee',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#aaa',
            fontSize: 14,
            border: '1px solid #ccc'
          }}
        >
          No Image
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
          }
        }}
        style={{ marginTop: 10 }}
      />

      <button
        onClick={onUpload}
        disabled={isUploading || !selectedFile}
        style={{
          marginTop: 10,
          padding: '8px 16px',
          cursor: isUploading || !selectedFile ? 'not-allowed' : 'pointer'
        }}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default ProfilePicture;
