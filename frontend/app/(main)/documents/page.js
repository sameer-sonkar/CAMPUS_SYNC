"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Trash2, X } from 'lucide-react';
import { documentService } from '@/lib/api';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docName, setDocName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // For lightbox
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const uid = localStorage.getItem('uid');
      if (!uid) return;
      const docs = await documentService.getDocuments(uid);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!docName.trim()) {
      alert("Please enter a Document Name first!");
      fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        const uid = localStorage.getItem('uid');
        await documentService.uploadDocument(uid, docName, base64String);
        setDocName('');
        fetchDocuments(); // Refresh list
      } catch (error) {
        console.error("Failed to upload document", error);
        alert("Failed to upload document.");
      } finally {
        setUploading(false);
        fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (docId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const uid = localStorage.getItem('uid');
      await documentService.deleteDocument(uid, docId);
      setDocuments(documents.filter(d => d._id !== docId));
    } catch (error) {
      console.error("Failed to delete document", error);
      alert("Failed to delete document.");
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Documents Vault...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>My Documents</h1>
        <p style={{ color: 'var(--text-muted)' }}>Securely store your ID cards, Mess QR codes, and receipts.</p>
      </header>

      {/* Upload Bar */}
      <div className="glass" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>Document Name</label>
          <input 
            type="text" 
            value={docName} 
            onChange={(e) => setDocName(e.target.value)} 
            placeholder="e.g. 'Mess QR Code' or 'Student ID'" 
            className="input-premium" 
          />
        </div>
        <input 
          type="file" 
          accept="image/*,application/pdf" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          style={{ display: 'none' }} 
        />
        <button 
          className="btn-primary" 
          onClick={() => fileInputRef.current.click()} 
          disabled={uploading}
          style={{ padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: uploading ? 0.7 : 1 }}
        >
          <Upload size={18} />
          {uploading ? 'Encrypting & Uploading...' : 'Select File'}
        </button>
      </div>

      {/* Documents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {documents.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', backgroundColor: 'var(--surface)', borderRadius: '12px' }}>
            <FileText size={48} opacity={0.5} style={{ margin: '0 auto', marginBottom: '1rem' }} />
            <p>Your vault is empty. Upload your first document above!</p>
          </div>
        ) : (
          documents.map(doc => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={doc._id} 
              className="glass"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
            >
              {/* Delete Button */}
              <button 
                onClick={() => handleDelete(doc._id)}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
              >
                <Trash2 size={16} />
              </button>

              {/* Image / PDF Preview */}
              <div 
                style={{ height: '160px', width: '100%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setSelectedImage(doc.fileData)}
              >
                {doc.fileData.startsWith('data:application/pdf') ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                    <FileText size={48} color="#FF5252" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>PDF Document</span>
                  </div>
                ) : (
                  <img src={doc.fileData} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>

              {/* Name Strip */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{doc.name}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.9)',
              zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'zoom-out',
              padding: '2rem'
            }}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              <X size={32} />
            </button>
            {selectedImage.startsWith('data:application/pdf') ? (
              <motion.iframe 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={selectedImage} 
                style={{ width: '90vw', height: '90vh', border: 'none', borderRadius: '12px', backgroundColor: 'white' }} 
                title="PDF Viewer"
              />
            ) : (
              <motion.img 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={selectedImage} 
                alt="Expanded Document" 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
