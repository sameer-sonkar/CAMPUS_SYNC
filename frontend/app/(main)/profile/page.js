"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Book, GraduationCap, Calendar } from 'lucide-react';
import { studentService } from '@/lib/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        try {
          const uid = localStorage.getItem('uid');
          const updatedProfile = await studentService.updateStudent(uid, { profilePic: base64String });
          setProfile(updatedProfile);
        } catch (error) {
          console.error("Failed to upload image", error);
          alert("Failed to upload image.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const uid = localStorage.getItem('uid');
        if (!uid) return;
        const data = await studentService.getStudent(uid);
        setProfile(data);
        setEditForm({
          fullName: data.fullName || "",
          program: data.program || "B.Tech",
          branch: data.branch || "CSE",
          rollNo: data.rollNo || "",
          currentSemester: data.currentSemester || 1
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const uid = localStorage.getItem('uid');
      if (!uid) return;
      const updatedProfile = await studentService.updateStudent(uid, editForm);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile", error);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Loading Profile...</div>;
  }

  if (!profile) {
    return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--danger)' }}>Failed to load profile data. Please try logging in again.</div>;
  }

  // Get initials for avatar
  const initials = profile.fullName 
    ? profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'CS';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Your Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal information.</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}
      >
        <div style={{ position: 'relative' }}>
          {profile.profilePic ? (
            <img src={profile.profilePic} alt="Profile" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
          ) : (
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: '#1A1D20' }}>
              {initials}
            </div>
          )}
          <div 
            onClick={() => fileInputRef.current.click()}
            style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--surface)', padding: '0.4rem', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10 }}
          >
            ✏️
          </div>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
        </div>

        <div style={{ textAlign: 'center', width: '100%' }}>
          {isEditing ? (
            <input type="text" name="fullName" value={editForm.fullName} onChange={handleEditChange} className="input-premium" style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem', width: '100%' }} placeholder="Full Name" />
          ) : (
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{profile.fullName || "Student Name"}</h2>
          )}
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{profile.email}</p>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'var(--background)', borderRadius: '12px', gap: '0.75rem' }}>
            <GraduationCap color="var(--primary-dark)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Program</div>
              {isEditing ? (
                <select name="program" value={editForm.program} onChange={handleEditChange} className="input-premium" style={{ padding: '0.5rem', marginTop: '0.25rem' }}>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="PhD">PhD</option>
                </select>
              ) : (
                <div style={{ fontWeight: 800 }}>{profile.program || "Not Set"}</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'var(--background)', borderRadius: '12px', gap: '0.75rem' }}>
            <Book color="var(--primary-dark)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Branch</div>
              {isEditing ? (
                <select name="branch" value={editForm.branch} onChange={handleEditChange} className="input-premium" style={{ padding: '0.5rem', marginTop: '0.25rem' }}>
                  <option value="CSE">CSE</option>
                  <option value="Civil">Civil</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="ECE">ECE</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Metallurgy">Metallurgy</option>
                  <option value="Economics">Economics</option>
                  <option value="AI & DS">AI & DS</option>
                  <option value="Mathematics and Computing">Mathematics and Computing</option>
                </select>
              ) : (
                <div style={{ fontWeight: 800 }}>{profile.branch || "Not Set"}</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'var(--background)', borderRadius: '12px', gap: '0.75rem' }}>
            <Calendar color="var(--primary-dark)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Current Semester</div>
              {isEditing ? (
                <input type="number" name="currentSemester" min="1" max="10" value={editForm.currentSemester} onChange={handleEditChange} className="input-premium" style={{ padding: '0.5rem', marginTop: '0.25rem' }} />
              ) : (
                <div style={{ fontWeight: 800 }}>{profile.currentSemester || 1}</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'var(--background)', borderRadius: '12px', gap: '0.75rem' }}>
            <User color="var(--primary-dark)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Roll Number / UID</div>
              {isEditing ? (
                <input type="text" name="rollNo" value={editForm.rollNo} onChange={handleEditChange} className="input-premium" style={{ padding: '0.5rem', marginTop: '0.25rem' }} placeholder="e.g. 2401CS01" />
              ) : (
                <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{profile.rollNo || profile.uid}</div>
              )}
            </div>
          </div>

        </div>

        {isEditing ? (
          <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
            <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1, opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 700 }}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn-primary" onClick={() => setIsEditing(true)} style={{ marginTop: '1rem', width: '100%' }}>
            Edit Profile
          </button>
        )}
      </motion.div>
    </div>
  );
}
