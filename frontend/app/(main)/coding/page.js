"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Flame, ExternalLink, CheckCircle, BookOpen, Layout, FileText, Activity } from 'lucide-react';
import { studentService, leetcodeService, codeforcesService } from '@/lib/api';

const STUDY_MATERIALS = [
  { title: "Grokking Dynamic Programming", platform: "GeeksforGeeks", type: "Article", link: "https://www.geeksforgeeks.org/dynamic-programming/", icon: <FileText size={28} color="#00b8a3" /> },
  { title: "Graph Algorithms Handbook", platform: "CP-Algorithms", type: "Guide", link: "https://cp-algorithms.com/graph/breadth-first-search.html", icon: <BookOpen size={28} color="#ff375f" /> },
  { title: "Mastering Sliding Window", platform: "LeetCode", type: "Tutorial", link: "https://leetcode.com/discuss/study-guide/659826/Sliding-Window-for-Beginners", icon: <Layout size={28} color="#ffc01e" /> },
  { title: "Time Complexity Analysis", platform: "Codeforces", type: "Blog", link: "https://codeforces.com/blog/entry/87412", icon: <Activity size={28} color="#2196F3" /> },
  { title: "Advanced Data Structures", platform: "AtCoder", type: "Wiki", link: "https://atcoder.jp/posts/230", icon: <BookOpen size={28} color="#9C27B0" /> },
  { title: "Binary Search Mastery", platform: "GeeksforGeeks", type: "Article", link: "https://www.geeksforgeeks.org/binary-search/", icon: <FileText size={28} color="#00b8a3" /> }
];

export default function CodingPage() {
  const [activeTab, setActiveTab] = useState('practice');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // LeetCode State
  const [lcUsernameInput, setLcUsernameInput] = useState('');
  const [lcChallenge, setLcChallenge] = useState(null);
  const [lcVerifying, setLcVerifying] = useState(false);
  const [lcMessage, setLcMessage] = useState('');

  // Codeforces State
  const [cfUsernameInput, setCfUsernameInput] = useState('');
  const [cfChallenge, setCfChallenge] = useState(null);
  const [cfVerifying, setCfVerifying] = useState(false);
  const [cfMessage, setCfMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const uid = localStorage.getItem('uid');
      if (!uid) return;
      const studentData = await studentService.getStudent(uid);
      setProfile(studentData);
      setLcUsernameInput(studentData.leetcodeUsername || '');
      setCfUsernameInput(studentData.codeforcesUsername || '');

      if (studentData.leetcodeUsername) {
        const lcData = await leetcodeService.getChallenge(uid);
        setLcChallenge(lcData);
      }
      
      if (studentData.codeforcesUsername) {
        const cfData = await codeforcesService.getChallenge(uid);
        setCfChallenge(cfData);
      }
    } catch (error) {
      console.error("Failed to fetch coding data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkLc = async () => {
    if (!lcUsernameInput.trim()) return;
    try {
      const uid = localStorage.getItem('uid');
      const updated = await leetcodeService.linkUsername(uid, lcUsernameInput);
      setProfile(updated);
      setLcMessage("LeetCode linked successfully!");
      const lcData = await leetcodeService.getChallenge(uid);
      setLcChallenge(lcData);
      setTimeout(() => setLcMessage(''), 3000);
    } catch (error) {
      alert("Failed to link LeetCode.");
    }
  };

  const handleLinkCf = async () => {
    if (!cfUsernameInput.trim()) return;
    try {
      const uid = localStorage.getItem('uid');
      const updated = await codeforcesService.linkUsername(uid, cfUsernameInput);
      setProfile(updated);
      setCfMessage(`Codeforces linked! Rating: ${updated.codeforcesRating}`);
      const cfData = await codeforcesService.getChallenge(uid);
      setCfChallenge(cfData);
      setTimeout(() => setCfMessage(''), 3000);
    } catch (error) {
      alert("Failed to link Codeforces. Please ensure your handle is correct.");
    }
  };

  const handleVerifyLc = async () => {
    setLcVerifying(true);
    setLcMessage('');
    try {
      const uid = localStorage.getItem('uid');
      const result = await leetcodeService.verifyChallenge(uid);
      setLcMessage(result.message);
      if (result.verified) {
        setProfile(prev => ({ ...prev, leetcodeStreak: result.streak, lastLeetcodeSolveDate: new Date() }));
      }
    } catch (error) {
      setLcMessage("Verification failed.");
    } finally {
      setLcVerifying(false);
    }
  };

  const handleVerifyCf = async () => {
    setCfVerifying(true);
    setCfMessage('');
    try {
      const uid = localStorage.getItem('uid');
      const result = await codeforcesService.verifyChallenge(uid);
      setCfMessage(result.message);
      if (result.verified) {
        setProfile(prev => ({ ...prev, codeforcesStreak: result.streak, lastCodeforcesSolveDate: new Date() }));
      }
    } catch (error) {
      setCfMessage("Verification failed.");
    } finally {
      setCfVerifying(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading Algorithms Hub...</div>;

  const lcLinked = !!profile?.leetcodeUsername;
  const cfLinked = !!profile?.codeforcesUsername;
  const today = new Date().toISOString().split('T')[0];
  const lcSolvedToday = profile?.lastLeetcodeSolveDate && new Date(profile.lastLeetcodeSolveDate).toISOString().split('T')[0] === today;
  const cfSolvedToday = profile?.lastCodeforcesSolveDate && new Date(profile.lastCodeforcesSolveDate).toISOString().split('T')[0] === today;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--text-main) 0%, var(--primary-dark) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Algorithms Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.25rem' }}>Master competitive programming and conquer your interviews.</p>
        </div>
        
        {/* Premium Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '0.4rem', backdropFilter: 'blur(10px)' }}>
          <button 
            onClick={() => setActiveTab('practice')}
            style={{ padding: '0.75rem 2rem', backgroundColor: activeTab === 'practice' ? 'var(--primary)' : 'transparent', color: activeTab === 'practice' ? '#1A1D20' : 'var(--text-muted)', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: activeTab === 'practice' ? '0 4px 15px rgba(var(--primary-rgb), 0.3)' : 'none' }}
          >
            <Code size={20} /> Practice
          </button>
          <button 
            onClick={() => setActiveTab('study')}
            style={{ padding: '0.75rem 2rem', backgroundColor: activeTab === 'study' ? 'var(--primary)' : 'transparent', color: activeTab === 'study' ? '#1A1D20' : 'var(--text-muted)', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: activeTab === 'study' ? '0 4px 15px rgba(var(--primary-rgb), 0.3)' : 'none' }}
          >
            <BookOpen size={20} /> Study
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'practice' ? (
          <motion.div key="practice" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
            
            {/* LeetCode Premium Card */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ffc01e' }}>
                  LeetCode
                  {lcLinked && <motion.div initial={{scale:0}} animate={{scale:1}}><CheckCircle size={24} color="#00b8a3" /></motion.div>}
                </h2>
                {lcLinked && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 82, 82, 0.1)', border: '1px solid rgba(255, 82, 82, 0.2)', padding: '0.5rem 1.25rem', borderRadius: '30px' }}>
                    <Flame size={20} color="#FF5252" />
                    <span style={{ fontWeight: 900, color: '#FF5252', fontSize: '1.1rem' }}>{profile.leetcodeStreak || 0} Streak</span>
                  </div>
                )}
              </div>

              {lcMessage && (
                <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} style={{ padding: '1rem', backgroundColor: lcMessage.includes('failed') ? 'rgba(255, 55, 95, 0.1)' : 'rgba(0, 184, 163, 0.1)', color: lcMessage.includes('failed') ? '#ff375f' : '#00b8a3', border: `1px solid ${lcMessage.includes('failed') ? 'rgba(255, 55, 95, 0.2)' : 'rgba(0, 184, 163, 0.2)'}`, borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 700, textAlign: 'center' }}>{lcMessage}</motion.div>
              )}

              {!lcLinked ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, justifyContent: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', textAlign: 'center' }}>Connect your profile to track your daily progress.</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="text" value={lcUsernameInput} onChange={(e) => setLcUsernameInput(e.target.value)} placeholder="Enter Username" className="input-premium" style={{ flex: 1, padding: '1rem 1.5rem', fontSize: '1.1rem', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button className="btn-secondary" onClick={handleLinkLc} style={{ padding: '0 2rem', fontSize: '1.1rem' }}>Link</button>
                  </div>
                </div>
              ) : lcChallenge && (
                <div style={{ backgroundColor: '#1A1A1A', padding: '2rem', borderRadius: '16px', border: lcSolvedToday ? '2px solid #00b8a3' : '1px solid #333', position: 'relative', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {lcSolvedToday && <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#00b8a3', color: '#1A1A1A', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '1px' }}>SOLVED</div>}
                  
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Challenge of the Day</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem', lineHeight: '1.3' }}>{lcChallenge.name}</h3>
                  <div style={{ marginBottom: 'auto' }}>
                    <span style={{ display: 'inline-block', padding: '0.3rem 1rem', backgroundColor: lcChallenge.difficulty === 'Easy' ? 'rgba(0, 184, 163, 0.15)' : lcChallenge.difficulty === 'Medium' ? 'rgba(255, 192, 30, 0.15)' : 'rgba(255, 55, 95, 0.15)', color: lcChallenge.difficulty === 'Easy' ? '#00b8a3' : lcChallenge.difficulty === 'Medium' ? '#ffc01e' : '#ff375f', borderRadius: '30px', fontWeight: 800, fontSize: '0.9rem' }}>{lcChallenge.difficulty}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <a href={`https://leetcode.com/problems/${lcChallenge.titleSlug}/`} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                      <button style={{ width: '100%', padding: '1rem', backgroundColor: 'transparent', color: 'white', border: '2px solid #333', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#555'} onMouseOut={e=>e.currentTarget.style.borderColor='#333'}>
                        Solve <ExternalLink size={18}/>
                      </button>
                    </a>
                    <button onClick={handleVerifyLc} disabled={lcVerifying || lcSolvedToday} style={{ flex: 1, padding: '1rem', backgroundColor: lcSolvedToday ? '#00b8a3' : 'var(--primary)', color: '#1A1D20', border: 'none', borderRadius: '12px', cursor: lcSolvedToday ? 'default' : 'pointer', fontWeight: 900, fontSize: '1.1rem', transition: 'all 0.2s', opacity: lcVerifying ? 0.7 : 1 }}>
                      {lcVerifying ? 'Scanning...' : lcSolvedToday ? 'Verified!' : 'Verify'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Codeforces Premium Card */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.5px' }}>
                  {/* Official Codeforces Logo Recreation */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '28px', marginRight: '6px' }}>
                    <div style={{ width: '7px', height: '18px', backgroundColor: '#FFC107', borderRadius: '2px' }}></div>
                    <div style={{ width: '7px', height: '28px', backgroundColor: '#2196F3', borderRadius: '2px' }}></div>
                    <div style={{ width: '7px', height: '14px', backgroundColor: '#D32F2F', borderRadius: '2px' }}></div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span style={{ color: 'var(--text-main)' }}>CODE</span>
                    <span style={{ color: '#318CE7' }}>FORCES</span>
                  </div>
                  {cfLinked && <motion.div initial={{scale:0}} animate={{scale:1}} style={{marginLeft: '0.5rem'}}><CheckCircle size={24} color="#00b8a3" /></motion.div>}
                </h2>
                {cfLinked && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 82, 82, 0.1)', border: '1px solid rgba(255, 82, 82, 0.2)', padding: '0.5rem 1.25rem', borderRadius: '30px' }}>
                    <Flame size={20} color="#FF5252" />
                    <span style={{ fontWeight: 900, color: '#FF5252', fontSize: '1.1rem' }}>{profile.codeforcesStreak || 0} Streak</span>
                  </div>
                )}
              </div>

              {cfMessage && (
                <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} style={{ padding: '1rem', backgroundColor: cfMessage.includes('failed') ? 'rgba(255, 55, 95, 0.1)' : 'rgba(0, 184, 163, 0.1)', color: cfMessage.includes('failed') ? '#ff375f' : '#00b8a3', border: `1px solid ${cfMessage.includes('failed') ? 'rgba(255, 55, 95, 0.2)' : 'rgba(0, 184, 163, 0.2)'}`, borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 700, textAlign: 'center' }}>{cfMessage}</motion.div>
              )}

              {!cfLinked ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, justifyContent: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', textAlign: 'center' }}>Connect to unlock challenges tailored to your rating.</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="text" value={cfUsernameInput} onChange={(e) => setCfUsernameInput(e.target.value)} placeholder="Enter Handle" className="input-premium" style={{ flex: 1, padding: '1rem 1.5rem', fontSize: '1.1rem', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button className="btn-secondary" onClick={handleLinkCf} style={{ padding: '0 2rem', fontSize: '1.1rem' }}>Link</button>
                  </div>
                </div>
              ) : cfChallenge && (
                <div style={{ backgroundColor: '#1A1A1A', padding: '2rem', borderRadius: '16px', border: cfSolvedToday ? '2px solid #00b8a3' : '1px solid #333', position: 'relative', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {cfSolvedToday && <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#00b8a3', color: '#1A1A1A', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '1px' }}>SOLVED</div>}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Dynamic Challenge</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#318CE7', backgroundColor: 'rgba(49, 140, 231, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '8px' }}>Your Rating: {profile.codeforcesRating}</div>
                  </div>
                  
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem', lineHeight: '1.3' }}>{cfChallenge.name}</h3>
                  <div style={{ marginBottom: 'auto' }}>
                    <span style={{ display: 'inline-block', padding: '0.3rem 1rem', backgroundColor: 'rgba(49, 140, 231, 0.15)', color: '#318CE7', borderRadius: '30px', fontWeight: 800, fontSize: '0.9rem' }}>{cfChallenge.difficulty}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <a href={`https://codeforces.com/problemset/problem/${cfChallenge.contestId}/${cfChallenge.index}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                      <button style={{ width: '100%', padding: '1rem', backgroundColor: 'transparent', color: 'white', border: '2px solid #333', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#555'} onMouseOut={e=>e.currentTarget.style.borderColor='#333'}>
                        Solve <ExternalLink size={18}/>
                      </button>
                    </a>
                    <button onClick={handleVerifyCf} disabled={cfVerifying || cfSolvedToday} style={{ flex: 1, padding: '1rem', backgroundColor: cfSolvedToday ? '#00b8a3' : 'var(--primary)', color: '#1A1D20', border: 'none', borderRadius: '12px', cursor: cfSolvedToday ? 'default' : 'pointer', fontWeight: 900, fontSize: '1.1rem', transition: 'all 0.2s', opacity: cfVerifying ? 0.7 : 1 }}>
                      {cfVerifying ? 'Scanning API...' : cfSolvedToday ? 'Verified!' : 'Verify'}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        ) : (
          <motion.div key="study" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {STUDY_MATERIALS.map((mat, idx) => (
                <a key={idx} href={mat.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', height: '100%' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}>
                    <div style={{ padding: '1.25rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '16px', display: 'inline-flex', alignSelf: 'flex-start' }}>
                      {mat.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>{mat.platform} • {mat.type}</div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.3' }}>{mat.title}</h3>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
