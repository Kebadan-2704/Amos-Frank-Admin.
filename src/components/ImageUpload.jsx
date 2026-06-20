import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ImageUpload = ({ value, onChange, label }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    setProgress(0);

    const storageRef = ref(storage, `portfolio_images/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(percent));
      },
      (error) => {
        console.error('Upload error:', error);
        toast.error('Upload failed. Ensure Firebase Storage is enabled in your Firebase Console.');
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
          toast.success('Image uploaded successfully!');
        } catch (err) {
          toast.error('Failed to get download URL.');
        } finally {
          setUploading(false);
        }
      }
    );
  };

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</label>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {value && (
          <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
            <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ flexGrow: 1, position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL or Path"
            disabled={uploading}
            style={{ paddingRight: '100px' }}
          />
          <div style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)' }}>
            <input
              type="file"
              id={`file-upload-${label.replace(/\s+/g, '-')}`}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
            />
            <label
              htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.8rem',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.7 : 1,
              }}
            >
              {uploading ? <FaSpinner className="spin" /> : <FaUpload />}
              {uploading ? `${progress}%` : 'Upload'}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
