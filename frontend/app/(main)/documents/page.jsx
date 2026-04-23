"use client";
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FileText, Upload, Trash2, X } from 'lucide-react';
import { documentService } from '@/lib/api';
import { Container, Header, Title, Subtitle, UploadBar, InputGroup, Label, Input, UploadBtn, Grid, EmptyState, EmptyStateText, DocCard, DeleteBtn, PreviewArea, PdfPreview, PdfLabel, ImagePreview, NameStrip, DocNameText, LightboxOverlay, CloseLightboxBtn, IframePreview, ExpandedImage } from './styles';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docName, setDocName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  
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
        fetchDocuments();
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

  if (loading) return <div style={{ padding: '2rem', color: '#888' }}>Loading Documents Vault...</div>;

  return (
    <Container>
      <Header>
        <Title>My Documents</Title>
        <Subtitle>Securely store your ID cards, Mess QR codes, and receipts.</Subtitle>
      </Header>

      <UploadBar>
        <InputGroup>
          <Label>Document Name</Label>
          <Input 
            type="text" 
            value={docName} 
            onChange={(e) => setDocName(e.target.value)} 
            placeholder="e.g. 'Mess QR Code' or 'Student ID'" 
          />
        </InputGroup>
        <input 
          type="file" 
          accept="image/*,application/pdf" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          style={{ display: 'none' }} 
        />
        <UploadBtn 
          onClick={() => fileInputRef.current.click()} 
          disabled={uploading}
        >
          <Upload size={18} />
          {uploading ? 'Encrypting...' : 'Select File'}
        </UploadBtn>
      </UploadBar>

      <Grid>
        {documents.length === 0 ? (
          <EmptyState>
            <FileText size={48} opacity={0.5} color="#888" />
            <EmptyStateText>Your vault is empty. Upload your first document above!</EmptyStateText>
          </EmptyState>
        ) : (
          documents.map(doc => (
            <DocCard 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              key={doc._id} 
            >
              <DeleteBtn onClick={() => handleDelete(doc._id)}>
                <Trash2 size={16} />
              </DeleteBtn>

              <PreviewArea onClick={() => setSelectedImage(doc.fileData)}>
                {doc.fileData.startsWith('data:application/pdf') ? (
                  <PdfPreview>
                    <FileText size={48} color="#FF5252" />
                    <PdfLabel>PDF Document</PdfLabel>
                  </PdfPreview>
                ) : (
                  <ImagePreview src={doc.fileData} alt={doc.name} />
                )}
              </PreviewArea>

              <NameStrip>
                <DocNameText>{doc.name}</DocNameText>
              </NameStrip>
            </DocCard>
          ))
        )}
      </Grid>

      <AnimatePresence>
        {selectedImage && (
          <LightboxOverlay 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <CloseLightboxBtn onClick={() => setSelectedImage(null)}>
              <X size={32} />
            </CloseLightboxBtn>
            {selectedImage.startsWith('data:application/pdf') ? (
              <IframePreview 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={selectedImage} 
                title="PDF Viewer"
              />
            ) : (
              <ExpandedImage 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={selectedImage} 
                alt="Expanded Document" 
              />
            )}
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
}
