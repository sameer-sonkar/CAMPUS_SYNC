"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Calendar, GraduationCap } from "lucide-react";
import { authService } from "@/lib/api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  
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
    newPassword: "",
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
      if (showResetPassword) {
        // Step 4: Submit Reset Password
        await authService.resetPassword(formData.email, formData.code, formData.newPassword);
        setSuccess("Password reset successfully! Please log in.");
        setShowResetPassword(false);
        setShowForgotPassword(false);
        setIsLogin(true);
      } else if (showForgotPassword) {
        // Step 3: Request Forgot Password OTP
        await authService.forgotPassword(formData.email);
        setSuccess("Reset code sent to your email!");
        setShowResetPassword(true);
        setShowForgotPassword(false);
      } else if (showVerification) {
        // Step 2: Verify Signup OTP
        await authService.verify(formData.email, formData.code);
        router.push('/dashboard');
      } else if (isLogin) {
        // Step 1A: Login
        await authService.login(formData.email, formData.password);
        router.push('/dashboard');
      } else {
        // Step 1B: Signup
        await authService.signup(formData.email, formData.password, formData.fullName, formData.program, formData.branch);
        setShowVerification(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getFormTitle = () => {
    if (showResetPassword) return "Reset Password 🔒";
    if (showForgotPassword) return "Forgot Password? 🔑";
    if (showVerification) return "Check your Email 📧";
    if (isLogin) return "Welcome Back 👋";
    return "Create Account ✨";
  };

  const getFormSubtitle = () => {
    if (showResetPassword) return `Enter the 6-digit code sent to ${formData.email} and your new password.`;
    if (showForgotPassword) return "Enter your email to receive a password reset code.";
    if (showVerification) return `We sent a 6-digit code to ${formData.email}.`;
    if (isLogin) return "Enter your details to access your dashboard.";
    return "Sign up to start organizing your academic life.";
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        backgroundColor: 'var(--primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem', lineHeight: 1.1 }}
          >
            Campus<br/>Sync.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '1.25rem', color: 'rgba(26, 29, 32, 0.8)', fontWeight: 600, maxWidth: '400px' }}
          >
            Your all-in-one academic productivity platform. Track attendance, manage tasks, and calculate grades seamlessly.
          </motion.p>
          
          <div style={{ display: 'flex', gap: '2rem', marginTop: '4rem' }}>
            <FeatureItem icon={<Calendar size={24} />} text="Smart Timetable" delay={0.2} />
            <FeatureItem icon={<BookOpen size={24} />} text="Library Hub" delay={0.3} />
            <FeatureItem icon={<GraduationCap size={24} />} text="Grade Calculator" delay={0.4} />
          </div>
        </div>

        {/* Decorative Circles */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', filter: 'blur(60px)' }} />
      </div>

      {/* Right Side - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background)'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass"
          style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem', margin: '2rem' }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {getFormTitle()}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontWeight: 500 }}>
            {getFormSubtitle()}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ padding: '0.75rem', backgroundColor: 'var(--danger)', color: 'white', borderRadius: '8px', marginBottom: '1rem', fontWeight: 600 }}>
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ padding: '0.75rem', backgroundColor: 'var(--success)', color: 'white', borderRadius: '8px', marginBottom: '1rem', fontWeight: 600 }}>
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* RESET PASSWORD VIEW */}
            {showResetPassword ? (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Reset Code</label>
                  <input type="text" name="code" value={formData.code} onChange={handleChange} required className="input-premium" placeholder="123456" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>New Password</label>
                  <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required className="input-premium" placeholder="••••••••" />
                </div>
              </>
            ) : showForgotPassword ? (
              /* FORGOT PASSWORD VIEW */
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-premium" placeholder="student@university.edu" />
              </div>
            ) : showVerification ? (
              /* OTP VERIFICATION VIEW */
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Verification Code</label>
                <input type="text" name="code" value={formData.code} onChange={handleChange} required className="input-premium" placeholder="123456" />
              </div>
            ) : (
              /* LOGIN & SIGNUP VIEW */
              <>
                {!isLogin && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required={!isLogin} className="input-premium" placeholder="John Doe" />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Program</label>
                        <select name="program" value={formData.program} onChange={handleChange} required className="input-premium">
                          <option value="B.Tech">B.Tech</option>
                          <option value="M.Tech">M.Tech</option>
                          <option value="B.Sc">B.Sc</option>
                          <option value="M.Sc">M.Sc</option>
                          <option value="PhD">PhD</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Branch</label>
                        <select name="branch" value={formData.branch} onChange={handleChange} required className="input-premium">
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
                      </div>
                    </div>
                  </>
                )}
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-premium" placeholder="student@university.edu" />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Password</label>
                    {isLogin && (
                      <span onClick={() => { setShowForgotPassword(true); setError(""); setSuccess(""); }} style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', cursor: 'pointer', fontWeight: 700 }}>
                        Forgot Password?
                      </span>
                    )}
                  </div>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-premium" placeholder="••••••••" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1rem', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading 
                ? 'Processing...' 
                : showResetPassword 
                  ? 'Reset Password' 
                  : showForgotPassword
                    ? 'Send Reset Code'
                    : showVerification 
                      ? 'Verify & Enter' 
                      : isLogin 
                        ? 'Sign In' 
                        : 'Sign Up'}
            </button>
          </form>

          {/* BACK TO LOGIN NAVIGATOR */}
          {!showVerification && (
            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {(showForgotPassword || showResetPassword) ? (
                <span onClick={() => { setShowForgotPassword(false); setShowResetPassword(false); setIsLogin(true); setError(""); setSuccess(""); }} style={{ color: 'var(--primary-dark)', cursor: 'pointer', fontWeight: 700 }}>
                  ← Back to Login
                </span>
              ) : (
                <>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <span 
                    onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
                    style={{ color: 'var(--primary-dark)', cursor: 'pointer', fontWeight: 700 }}
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </span>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}
    >
      <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '12px' }}>
        {icon}
      </div>
      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{text}</span>
    </motion.div>
  );
}
