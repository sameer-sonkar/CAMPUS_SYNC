"use client";
import { useState, useEffect, useRef } from 'react';
import { User, Book, GraduationCap, Calendar, Edit2 } from 'lucide-react';
import { studentService } from '@/lib/api';
import { Container, Header, Title, Subtitle, ProfileCard, AvatarWrapper, ProfileImage, InitialsAvatar, EditAvatarBtn, InfoSection, NameText, EmailText, InputLarge, DetailsList, DetailItem, DetailContent, DetailLabel, DetailValue, InputSmall, SelectSmall, ActionGroup, PrimaryBtn, SecondaryBtn } from './styles';

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
    return <div style={{ textAlign: 'center', marginTop: '4rem', color: '#888' }}>Loading Profile...</div>;
  }

  if (!profile) {
    return <div style={{ textAlign: 'center', marginTop: '4rem', color: '#FF5252' }}>Failed to load profile data. Please try logging in again.</div>;
  }

  const initials = profile.fullName 
    ? profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'CS';

  return (
    <Container>
      <Header>
        <Title>Your Profile</Title>
        <Subtitle>Manage your personal information.</Subtitle>
      </Header>

      <ProfileCard 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AvatarWrapper>
          {profile.profilePic ? (
            <ProfileImage src={profile.profilePic} alt="Profile" />
          ) : (
            <InitialsAvatar>{initials}</InitialsAvatar>
          )}
          <EditAvatarBtn onClick={() => fileInputRef.current.click()}>
            <Edit2 size={16} color="#FFD700" />
          </EditAvatarBtn>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
        </AvatarWrapper>

        <InfoSection>
          {isEditing ? (
            <InputLarge type="text" name="fullName" value={editForm.fullName} onChange={handleEditChange} placeholder="Full Name" />
          ) : (
            <NameText>{profile.fullName || "Student Name"}</NameText>
          )}
          <EmailText>{profile.email}</EmailText>
        </InfoSection>

        <DetailsList>
          
          <DetailItem>
            <GraduationCap color="#FFD700" size={24} />
            <DetailContent>
              <DetailLabel>Program</DetailLabel>
              {isEditing ? (
                <SelectSmall name="program" value={editForm.program} onChange={handleEditChange}>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="PhD">PhD</option>
                </SelectSmall>
              ) : (
                <DetailValue>{profile.program || "Not Set"}</DetailValue>
              )}
            </DetailContent>
          </DetailItem>

          <DetailItem>
            <Book color="#FFD700" size={24} />
            <DetailContent>
              <DetailLabel>Branch</DetailLabel>
              {isEditing ? (
                <SelectSmall name="branch" value={editForm.branch} onChange={handleEditChange}>
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
                </SelectSmall>
              ) : (
                <DetailValue>{profile.branch || "Not Set"}</DetailValue>
              )}
            </DetailContent>
          </DetailItem>

          <DetailItem>
            <Calendar color="#FFD700" size={24} />
            <DetailContent>
              <DetailLabel>Current Semester</DetailLabel>
              {isEditing ? (
                <InputSmall type="number" name="currentSemester" min="1" max="10" value={editForm.currentSemester} onChange={handleEditChange} />
              ) : (
                <DetailValue>{profile.currentSemester || 1}</DetailValue>
              )}
            </DetailContent>
          </DetailItem>

          <DetailItem>
            <User color="#FFD700" size={24} />
            <DetailContent>
              <DetailLabel>Roll Number / UID</DetailLabel>
              {isEditing ? (
                <InputSmall type="text" name="rollNo" value={editForm.rollNo} onChange={handleEditChange} placeholder="e.g. 2401CS01" />
              ) : (
                <DetailValue>{profile.rollNo || profile.uid}</DetailValue>
              )}
            </DetailContent>
          </DetailItem>

        </DetailsList>

        {isEditing ? (
          <ActionGroup>
            <PrimaryBtn onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </PrimaryBtn>
            <SecondaryBtn onClick={() => setIsEditing(false)}>
              Cancel
            </SecondaryBtn>
          </ActionGroup>
        ) : (
          <PrimaryBtn onClick={() => setIsEditing(true)} style={{ marginTop: '1rem', width: '100%' }}>
            Edit Profile
          </PrimaryBtn>
        )}
      </ProfileCard>
    </Container>
  );
}
