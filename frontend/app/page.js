"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/lib/api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    code: "",
    program: "B.Tech",
    branch: "CSE"
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (showVerification) {
        await authService.verify(formData.email, formData.code);
        router.push('/dashboard');
      } else if (isLogin) {
        await authService.login(formData.email, formData.password);
        router.push('/dashboard');
      } else {
        await authService.signup(formData.email, formData.password, formData.fullName, formData.program, formData.branch);
        setShowVerification(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google SSO would initiate here! (Visual mock)");
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#0f0f0f', fontFamily: 'Inter, sans-serif' }}>
      
      {/* LEFT SIDE - BRANDING */}
      <div style={{
        flex: 1.2,
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5rem',
        position: 'relative',
        borderRight: '1px solid #222',
        overflow: 'hidden'
      }}>
        {/* Decorative subtle glow */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(255, 215, 0, 0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '5%', left: '25%', width: '500px', height: '500px', borderRadius: '50%', border: '1px solid rgba(255, 215, 0, 0.05)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem', display: 'flex', alignItems: 'center' }}>
              Campus<span style={{ color: '#FFD700' }}>Sync</span>
            </h1>
            <p style={{ color: '#666', fontSize: '1rem', fontWeight: 500, marginBottom: '5rem' }}>
              Academic Intelligence Platform
            </p>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: '4rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '2rem' }}
          >
            Your academic <br/>
            <span style={{ color: '#FFD700' }}>command center.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: '1.25rem', color: '#888', fontWeight: 500, maxWidth: '500px', marginBottom: '3rem', lineHeight: 1.5 }}
          >
            AI scheduling · Smart attendance · Grade analytics · Coding tracker
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '1rem' }}
          >
            <span style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid rgba(255, 215, 0, 0.3)', color: '#FFD700', fontSize: '0.9rem', fontWeight: 600 }}>Smart Timetable</span>
            <span style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid rgba(255, 215, 0, 0.3)', color: '#FFD700', fontSize: '0.9rem', fontWeight: 600 }}>AI Planner</span>
            <span style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid rgba(255, 215, 0, 0.3)', color: '#FFD700', fontSize: '0.9rem', fontWeight: 600 }}>LeetCode Sync</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '6rem' }}
          >
            <div style={{ display: 'flex' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#FFD700', border: '2px solid #0a0a0a', zIndex: 3 }}></div>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#318CE7', border: '2px solid #0a0a0a', marginLeft: '-10px', zIndex: 2 }}></div>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#9C27B0', border: '2px solid #0a0a0a', marginLeft: '-10px', zIndex: 1 }}></div>
            </div>
            <span style={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>1,200+ students using CampusSync</span>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111'
      }}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isLogin ? 'Welcome back 👋' : 'Create account ✨'}
          </h2>
          <p style={{ color: '#888', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
            {isLogin ? 'Sign in to your dashboard' : 'Join CampusSync today'}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ padding: '1rem', backgroundColor: 'rgba(255, 82, 82, 0.1)', border: '1px solid #FF5252', color: '#FF5252', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ padding: '1rem', backgroundColor: 'rgba(0, 184, 163, 0.1)', border: '1px solid #00b8a3', color: '#00b8a3', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google SSO Button */}
          {!showVerification && (
            <>
              <button 
                onClick={handleGoogleLogin}
                style={{
                  width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #333', borderRadius: '8px',
                  fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }}></div>
                <span style={{ padding: '0 1rem', color: '#666', fontSize: '0.9rem' }}>or</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }}></div>
              </div>
            </>
          )}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {showVerification ? (
              /* OTP VERIFICATION VIEW */
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#aaa' }}>Verification Code</label>
                <input type="text" name="code" value={formData.code} onChange={handleChange} required style={{ width: '100%', padding: '0.85rem', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }} placeholder="123456" />
              </div>
            ) : (
              /* LOGIN & SIGNUP VIEW */
              <>
                {!isLogin && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#aaa' }}>Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required={!isLogin} style={{ width: '100%', padding: '0.85rem', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }} placeholder="John Doe" />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#aaa' }}>Program</label>
                        <select name="program" value={formData.program} onChange={handleChange} required style={{ width: '100%', padding: '0.85rem', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }}>
                          <option value="B.Tech">B.Tech</option>
                          <option value="M.Tech">M.Tech</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#aaa' }}>Branch</label>
                        <select name="branch" value={formData.branch} onChange={handleChange} required style={{ width: '100%', padding: '0.85rem', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }}>
                          <option value="CSE">CSE</option>
                          <option value="Civil">Civil</option>
                          <option value="Mechanical">Mechanical</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
                
                <div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.85rem', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }} placeholder="university@student.edu" />
                </div>

                <div>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '0.85rem', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }} placeholder="••••••••••" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} style={{ 
              marginTop: '1rem', width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 700, 
              backgroundColor: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1
            }}>
              {loading 
                ? 'Processing...' 
                : showVerification 
                  ? 'Verify Code' 
                  : isLogin 
                    ? 'Sign In' 
                    : 'Sign Up'}
            </button>
          </form>

          {/* BACK TO LOGIN NAVIGATOR */}
          {!showVerification && (
            <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '1rem', color: '#888' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span 
                onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
                style={{ color: '#FFD700', cursor: 'pointer', fontWeight: 600 }}
              >
                {isLogin ? 'Sign up free' : 'Log in'}
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
