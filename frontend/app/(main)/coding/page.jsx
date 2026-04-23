"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Flame, ExternalLink, CheckCircle, BookOpen, Layout, FileText, Activity, Trophy, Calendar, Code2, Terminal, Cpu, Check, ArrowRight, Target, Plus, Database, Star } from 'lucide-react';
import { studentService, leetcodeService, codeforcesService, atcoderService, codechefService, contestService, dsaService } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  Container, LoadingContainer, LoadingText, HeroSection, HeroBgPattern, HeroBgGlow, HeroContent, HeroTextCol, HeroBadge, HeroBadgeIcon, HeroBadgeText, HeroTitle, HeroSubtitle, StreakCard, StreakValue, StreakLabel, TabNav, TabButton, ActiveTabPill, TrackerGrid, Col, SuggestionCard, SuggestionHeader, SuggestionTitle, SuggestionTags, DiffBadge, TopicBadge, SolveBtn, LogFormCard, LogFormHeader, LogFormTitle, Form, InputRow, Input, Select, SubmitBtn, StatCardLarge, StatLabelLarge, StatValueLarge, StatIconLarge, ChartsGrid, ChartCardPie, ChartCardBar, CardTitle, ChartEmpty, RecentList, RecentItem, RecentTitle, RecentMeta, RecentDiff, ChallengesGrid, PlatformCard, PlatformGlow, PlatformHeader, PlatformTitleBox, PlatformIconWrap, PlatformName, StreakPill, MsgAlert, UnlinkedBox, UnlinkedText, LinkRow, LinkBtn, ChallengeBox, ChallengeHeaderRow, ChallengeLabel, SolvedBadge, ChallengeName, DiffPill, ChallengeBtns, BtnSolveLink, BtnVerify, ContestsCard, ContestsHeader, ContestsIconWrap, ContestsTitle, ContestsSubtitle, ContestsMsg, ContestsList, ContestItem, ContestLeft, ContestDateBox, ContestMonth, ContestDate, ContestPlatform, ContestName, ContestMeta, BtnRegister, StudyGrid, StudyCard, StudyIconWrap, StudyMeta, StudyTitle
} from './styles';

const STUDY_MATERIALS = [
  { title: "Grokking Dynamic Programming", platform: "GeeksforGeeks", type: "Article", link: "https://www.geeksforgeeks.org/dynamic-programming/", icon: <FileText size={24} color="#00b8a3" /> },
  { title: "Graph Algorithms Handbook", platform: "CP-Algorithms", type: "Guide", link: "https://cp-algorithms.com/graph/breadth-first-search.html", icon: <BookOpen size={24} color="#ff375f" /> },
  { title: "Mastering Sliding Window", platform: "LeetCode", type: "Tutorial", link: "https://leetcode.com/discuss/study-guide/659826/Sliding-Window-for-Beginners", icon: <Layout size={24} color="#FFA116" /> },
  { title: "Time Complexity Analysis", platform: "Codeforces", type: "Blog", link: "https://codeforces.com/blog/entry/87412", icon: <Activity size={24} color="#318CE7" /> },
  { title: "Advanced Data Structures", platform: "AtCoder", type: "Wiki", link: "https://atcoder.jp/posts/230", icon: <Terminal size={24} color="#E0E0E0" /> },
  { title: "Binary Search Mastery", platform: "GeeksforGeeks", type: "Article", link: "https://www.geeksforgeeks.org/binary-search/", icon: <FileText size={24} color="#00b8a3" /> }
];

export default function CodingPage() {
  const [activeTab, setActiveTab] = useState('tracker');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);
  const [contestsLoading, setContestsLoading] = useState(false);
  
  const [lcState, setLcState] = useState({ username: '', challenge: null, verifying: false, message: '' });
  const [cfState, setCfState] = useState({ username: '', challenge: null, verifying: false, message: '' });
  const [acState, setAcState] = useState({ username: '', challenge: null, verifying: false, message: '' });
  const [ccState, setCcState] = useState({ username: '', challenge: null, verifying: false, message: '' });

  const [dsaStats, setDsaStats] = useState({ totalSolved: 0, recent: [], difficultyData: [], topicData: [] });
  const [dailySuggestion, setDailySuggestion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newSub, setNewSub] = useState({ title: '', link: '', difficulty: 'Medium', topic: 'Arrays & Hashing', platform: 'LeetCode', notes: '' });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'contests' && contests.length === 0) {
      fetchContests();
    }
    if (activeTab === 'tracker') {
      fetchDsaData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const uid = localStorage.getItem('uid');
      if (!uid) return;
      const studentData = await studentService.getStudent(uid);
      setProfile(studentData);
      
      setLcState(s => ({ ...s, username: studentData.leetcodeUsername || '' }));
      setCfState(s => ({ ...s, username: studentData.codeforcesUsername || '' }));
      setAcState(s => ({ ...s, username: studentData.atcoderUsername || '' }));
      setCcState(s => ({ ...s, username: studentData.codechefUsername || '' }));

      if (studentData.leetcodeUsername) {
        const data = await leetcodeService.getChallenge(uid);
        setLcState(s => ({ ...s, challenge: data }));
      }
      if (studentData.codeforcesUsername) {
        const data = await codeforcesService.getChallenge(uid);
        setCfState(s => ({ ...s, challenge: data }));
      }
      if (studentData.atcoderUsername) {
        const data = await atcoderService.getChallenge(uid);
        setAcState(s => ({ ...s, challenge: data }));
      }
      if (studentData.codechefUsername) {
        const data = await codechefService.getChallenge(uid);
        setCcState(s => ({ ...s, challenge: data }));
      }
    } catch (error) {
      console.error("Failed to fetch coding data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDsaData = async () => {
    try {
      const uid = localStorage.getItem('uid');
      if (!uid) return;
      const stats = await dsaService.getProgress(uid);
      setDsaStats(stats);
      const suggestion = await dsaService.getDailySuggestion(uid);
      setDailySuggestion(suggestion);
    } catch(error) {
      console.error("Failed to fetch DSA data:", error);
    }
  };

  const fetchContests = async () => {
    setContestsLoading(true);
    try {
      const data = await contestService.getUpcoming();
      setContests(data);
    } catch (error) {
      console.error("Failed to load contests");
    } finally {
      setContestsLoading(false);
    }
  };

  const handleLink = async (platform, username, service, setPlatformState, getRatingMsg) => {
    if (!username.trim()) return;
    try {
      const uid = localStorage.getItem('uid');
      const updated = await service.linkUsername(uid, username);
      setProfile(updated);
      setPlatformState(s => ({ ...s, message: `${platform} linked successfully! ${getRatingMsg(updated)}` }));
      const challenge = await service.getChallenge(uid);
      setPlatformState(s => ({ ...s, challenge }));
      setTimeout(() => setPlatformState(s => ({ ...s, message: '' })), 3000);
    } catch (error) {
      alert(`Failed to link ${platform}.`);
    }
  };

  const handleVerify = async (platform, service, setPlatformState, streakKey, dateKey) => {
    setPlatformState(s => ({ ...s, verifying: true, message: '' }));
    try {
      const uid = localStorage.getItem('uid');
      const result = await service.verifyChallenge(uid);
      setPlatformState(s => ({ ...s, message: result.message }));
      if (result.verified) {
        setProfile(prev => ({ ...prev, [streakKey]: result.streak, [dateKey]: new Date() }));
      }
    } catch (error) {
      setPlatformState(s => ({ ...s, message: "Verification failed." }));
    } finally {
      setPlatformState(s => ({ ...s, verifying: false }));
    }
  };

  const handleLogProblem = async (e) => {
    e.preventDefault();
    if (!newSub.title || !newSub.topic) return;
    setSubmitting(true);
    try {
      const uid = localStorage.getItem('uid');
      await dsaService.submitProblem(uid, newSub);
      setNewSub({ title: '', link: '', difficulty: 'Medium', topic: 'Arrays & Hashing', platform: 'LeetCode', notes: '' });
      fetchDsaData();
    } catch (error) {
      alert("Failed to log problem");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <LoadingContainer>
      <Code2 size={32} color="#318CE7" />
      <LoadingText>Loading Algorithms Hub...</LoadingText>
    </LoadingContainer>
  );

  const today = new Date().toISOString().split('T')[0];
  const totalStreak = (profile?.leetcodeStreak || 0) + (profile?.codeforcesStreak || 0) + (profile?.atcoderStreak || 0) + (profile?.codechefStreak || 0);
  
  const platforms = [
    {
      id: 'leetcode', name: 'LeetCode', color: '#FFA116',
      linked: !!profile?.leetcodeUsername,
      streak: profile?.leetcodeStreak || 0,
      solvedToday: profile?.lastLeetcodeSolveDate && new Date(profile.lastLeetcodeSolveDate).toISOString().split('T')[0] === today,
      state: lcState, setState: setLcState, linkService: leetcodeService, linkMsg: () => '',
      verifyCall: () => handleVerify('LeetCode', leetcodeService, setLcState, 'leetcodeStreak', 'lastLeetcodeSolveDate'),
      getProblemLink: (c) => `https://leetcode.com/problems/${c.titleSlug}/`,
      icon: <Code2 size={22} color="#FFA116" />
    },
    {
      id: 'codeforces', name: 'Codeforces', color: '#318CE7',
      linked: !!profile?.codeforcesUsername,
      streak: profile?.codeforcesStreak || 0,
      solvedToday: profile?.lastCodeforcesSolveDate && new Date(profile.lastCodeforcesSolveDate).toISOString().split('T')[0] === today,
      state: cfState, setState: setCfState, linkService: codeforcesService, linkMsg: (p) => `Rating: ${p.codeforcesRating}`,
      verifyCall: () => handleVerify('Codeforces', codeforcesService, setCfState, 'codeforcesStreak', 'lastCodeforcesSolveDate'),
      getProblemLink: (c) => `https://codeforces.com/problemset/problem/${c.contestId}/${c.index}`,
      icon: <Activity size={22} color="#318CE7" />
    },
    {
      id: 'atcoder', name: 'AtCoder', color: '#E0E0E0',
      linked: !!profile?.atcoderUsername,
      streak: profile?.atcoderStreak || 0,
      solvedToday: profile?.lastAtcoderSolveDate && new Date(profile.lastAtcoderSolveDate).toISOString().split('T')[0] === today,
      state: acState, setState: setAcState, linkService: atcoderService, linkMsg: () => '',
      verifyCall: () => handleVerify('AtCoder', atcoderService, setAcState, 'atcoderStreak', 'lastAtcoderSolveDate'),
      getProblemLink: (c) => `https://atcoder.jp/contests/${c.contestId}/tasks/${c.id}`,
      icon: <Terminal size={22} color="#E0E0E0" />
    },
    {
      id: 'codechef', name: 'CodeChef', color: '#B39169',
      linked: !!profile?.codechefUsername,
      streak: profile?.codechefStreak || 0,
      solvedToday: profile?.lastCodechefSolveDate && new Date(profile.lastCodechefSolveDate).toISOString().split('T')[0] === today,
      state: ccState, setState: setCcState, linkService: codechefService, linkMsg: () => '',
      verifyCall: () => handleVerify('CodeChef', codechefService, setCcState, 'codechefStreak', 'lastCodechefSolveDate'),
      getProblemLink: (c) => `https://www.codechef.com/problems/${c.code}`,
      icon: <Cpu size={22} color="#B39169" />
    }
  ];

  return (
    <Container>
      <HeroSection>
        <HeroBgPattern />
        <HeroBgGlow />
        
        <HeroContent>
          <HeroTextCol>
            <HeroBadge>
              <HeroBadgeIcon>
                <Code2 size={16} color="#fff" />
              </HeroBadgeIcon>
              <HeroBadgeText>Command Center</HeroBadgeText>
            </HeroBadge>
            <HeroTitle>Algorithms Hub</HeroTitle>
            <HeroSubtitle>
              Master competitive programming, manually track your DSA progress, and conquer global leaderboards from one centralized dashboard.
            </HeroSubtitle>
          </HeroTextCol>
          
          <StreakCard initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
            <StreakValue>
              <Flame size={32} /> {totalStreak}
            </StreakValue>
            <StreakLabel>Combined Streak</StreakLabel>
          </StreakCard>
        </HeroContent>
      </HeroSection>
      
      <TabNav>
        {[
          { id: 'tracker', label: 'DSA Tracker', icon: <Target size={18} /> },
          { id: 'challenges', label: 'Daily Challenges', icon: <Code size={18} /> },
          { id: 'contests', label: 'Contests', icon: <Trophy size={18} /> },
          { id: 'study', label: 'Study', icon: <BookOpen size={18} /> }
        ].map(tab => (
          <TabButton
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            $isActive={activeTab === tab.id}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && <ActiveTabPill layoutId="activeTabPill" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
          </TabButton>
        ))}
      </TabNav>

      <AnimatePresence mode="wait">

        {activeTab === 'tracker' && (
          <TrackerGrid key="tracker" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            <Col>
              {dailySuggestion && (
                <SuggestionCard>
                  <SuggestionHeader>
                    <Star size={16} /> Suggested Problem
                  </SuggestionHeader>
                  <SuggestionTitle>{dailySuggestion.title}</SuggestionTitle>
                  <SuggestionTags>
                    <DiffBadge>{dailySuggestion.difficulty}</DiffBadge>
                    <TopicBadge>{dailySuggestion.topic}</TopicBadge>
                  </SuggestionTags>
                  {dailySuggestion.link && (
                    <a href={dailySuggestion.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <SolveBtn>Solve Now</SolveBtn>
                    </a>
                  )}
                </SuggestionCard>
              )}

              <LogFormCard>
                <LogFormHeader>
                  <Plus size={20} color="#00b8a3" />
                  <LogFormTitle>Log New Problem</LogFormTitle>
                </LogFormHeader>
                
                <Form onSubmit={handleLogProblem}>
                  <Input type="text" placeholder="Problem Title (e.g. Two Sum)" required value={newSub.title} onChange={e => setNewSub({...newSub, title: e.target.value})} />
                  <Input type="url" placeholder="Problem Link (Optional)" value={newSub.link} onChange={e => setNewSub({...newSub, link: e.target.value})} />
                  
                  <InputRow>
                    <Select value={newSub.difficulty} onChange={e => setNewSub({...newSub, difficulty: e.target.value})}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </Select>
                    <Select value={newSub.platform} onChange={e => setNewSub({...newSub, platform: e.target.value})}>
                      <option value="LeetCode">LeetCode</option>
                      <option value="Codeforces">Codeforces</option>
                      <option value="AtCoder">AtCoder</option>
                      <option value="CodeChef">CodeChef</option>
                      <option value="GeeksforGeeks">GeeksforGeeks</option>
                      <option value="Other">Other</option>
                    </Select>
                    <Input type="text" placeholder="Topic (e.g. DP)" required value={newSub.topic} onChange={e => setNewSub({...newSub, topic: e.target.value})} />
                  </InputRow>
                  
                  <SubmitBtn type="submit" disabled={submitting}>
                    {submitting ? 'Logging...' : 'Log Solution'}
                  </SubmitBtn>
                </Form>
              </LogFormCard>
            </Col>

            <Col>
              <StatCardLarge>
                <div>
                  <StatLabelLarge>Total Solved</StatLabelLarge>
                  <StatValueLarge>{dsaStats.totalSolved}</StatValueLarge>
                </div>
                <StatIconLarge>
                  <Database size={32} color="#318CE7" />
                </StatIconLarge>
              </StatCardLarge>

              <ChartsGrid>
                <ChartCardPie>
                  <CardTitle>Difficulty Breakdown</CardTitle>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    {dsaStats.difficultyData.length === 0 ? <ChartEmpty>No data yet</ChartEmpty> :
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dsaStats.difficultyData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                            {dsaStats.difficultyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.name === 'Easy' ? '#00b8a3' : entry.name === 'Medium' ? '#FFD700' : '#FF5252'} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    }
                  </div>
                </ChartCardPie>

                <ChartCardBar>
                  <CardTitle>Top Topics</CardTitle>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    {dsaStats.topicData.length === 0 ? <ChartEmpty>No data yet</ChartEmpty> :
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dsaStats.topicData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{ fill: '#1A1A1A' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                          <Bar dataKey="count" fill="#318CE7" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    }
                  </div>
                </ChartCardBar>
              </ChartsGrid>

              {dsaStats.recent.length > 0 && (
                <div style={{ padding: '1.5rem', backgroundColor: '#0A0A0A', border: '1px solid #222', borderRadius: '20px' }}>
                  <CardTitle>Recent Submissions</CardTitle>
                  <RecentList>
                    {dsaStats.recent.slice(0, 4).map((sub) => (
                      <RecentItem key={sub._id}>
                        <div>
                          <RecentTitle>{sub.title}</RecentTitle>
                          <RecentMeta>{sub.platform} • {sub.topic}</RecentMeta>
                        </div>
                        <RecentDiff $diff={sub.difficulty}>
                          {sub.difficulty}
                        </RecentDiff>
                      </RecentItem>
                    ))}
                  </RecentList>
                </div>
              )}
            </Col>
          </TrackerGrid>
        )}
        
        {activeTab === 'challenges' && (
          <ChallengesGrid key="challenges" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            {platforms.map(p => (
              <PlatformCard key={p.id} $color={p.color}>
                <PlatformGlow $color={p.color} />

                <PlatformHeader>
                  <PlatformTitleBox>
                    <PlatformIconWrap $bgColor={`${p.color}25`}>
                      {p.icon}
                    </PlatformIconWrap>
                    <PlatformName>{p.name}</PlatformName>
                  </PlatformTitleBox>
                  {p.linked && (
                    <StreakPill>
                      <Flame size={16} />
                      {p.streak} Streak
                    </StreakPill>
                  )}
                </PlatformHeader>

                {p.state.message && (
                  <MsgAlert initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} $isError={p.state.message.includes('failed')}>
                    <CheckCircle size={18} /> {p.state.message}
                  </MsgAlert>
                )}

                {!p.linked ? (
                  <UnlinkedBox>
                    <UnlinkedText>Connect your account to fetch personalized daily challenges.</UnlinkedText>
                    <LinkRow>
                      <Input 
                        type="text" 
                        value={p.state.username} 
                        onChange={(e) => p.setState(s => ({...s, username: e.target.value}))} 
                        placeholder="Enter Handle" 
                        style={{ flex: 1 }} 
                      />
                      <LinkBtn $color={p.color} onClick={() => handleLink(p.name, p.state.username, p.linkService, p.setState, p.linkMsg)}>
                        Link
                      </LinkBtn>
                    </LinkRow>
                  </UnlinkedBox>
                ) : p.state.challenge && (
                  <ChallengeBox $isSolved={p.solvedToday}>
                    <ChallengeHeaderRow>
                      <ChallengeLabel>Daily Challenge</ChallengeLabel>
                      {p.solvedToday && <SolvedBadge><Check size={12} strokeWidth={3} /> SOLVED</SolvedBadge>}
                    </ChallengeHeaderRow>
                    
                    <ChallengeName>{p.state.challenge.name}</ChallengeName>
                    
                    <div>
                      <DiffPill $color={p.color}>
                        {p.state.challenge.difficulty}
                      </DiffPill>
                    </div>
                    
                    <ChallengeBtns>
                      <a href={p.getProblemLink(p.state.challenge)} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: 'none' }}>
                        <BtnSolveLink>
                          Solve <ExternalLink size={16}/>
                        </BtnSolveLink>
                      </a>
                      <BtnVerify 
                        onClick={p.verifyCall} 
                        disabled={p.state.verifying || p.solvedToday} 
                        $isSolved={p.solvedToday}
                        $isVerifying={p.state.verifying}
                      >
                        {p.state.verifying ? 'Scanning...' : p.solvedToday ? <><CheckCircle size={16}/> Verified</> : p.id === 'codechef' ? 'Self-Report' : 'Verify'}
                      </BtnVerify>
                    </ChallengeBtns>
                  </ChallengeBox>
                )}
              </PlatformCard>
            ))}
          </ChallengesGrid>
        )}

        {activeTab === 'contests' && (
          <motion.div key="contests" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            <ContestsCard>
              <ContestsHeader>
                <ContestsIconWrap>
                  <Calendar size={28} color="#fff" />
                </ContestsIconWrap>
                <div>
                  <ContestsTitle>Global Contest Radar</ContestsTitle>
                  <ContestsSubtitle>Upcoming competitive programming matches across all platforms.</ContestsSubtitle>
                </div>
              </ContestsHeader>

              {contestsLoading ? (
                <ContestsMsg>Scanning global platforms for upcoming contests...</ContestsMsg>
              ) : contests.length === 0 ? (
                <ContestsMsg>No upcoming contests found.</ContestsMsg>
              ) : (
                <ContestsList>
                  {contests.map((c, i) => {
                    const d = new Date(c.startTime);
                    const platformColor = c.platform === 'Codeforces' ? '#318CE7' : '#FFA116';
                    return (
                      <ContestItem initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: i*0.05}} key={i}>
                        <ContestLeft>
                          <ContestDateBox>
                            <ContestMonth>{d.toLocaleString('default', { month: 'short' })}</ContestMonth>
                            <ContestDate>{d.getDate()}</ContestDate>
                          </ContestDateBox>
                          <div>
                            <ContestPlatform $color={platformColor}>{c.platform}</ContestPlatform>
                            <ContestName>{c.name}</ContestName>
                            <ContestMeta>
                              <span>{d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              <span style={{ color: '#444' }}>•</span>
                              <span>Duration: {Math.floor(c.durationSeconds / 3600)}h {(c.durationSeconds % 3600)/60}m</span>
                            </ContestMeta>
                          </div>
                        </ContestLeft>
                        <a href={c.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <BtnRegister>
                            Register <ArrowRight size={16} strokeWidth={3} />
                          </BtnRegister>
                        </a>
                      </ContestItem>
                    )
                  })}
                </ContestsList>
              )}
            </ContestsCard>
          </motion.div>
        )}

        {activeTab === 'study' && (
          <StudyGrid key="study" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            {STUDY_MATERIALS.map((mat, idx) => (
              <a key={idx} href={mat.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <StudyCard>
                  <StudyIconWrap>
                    {mat.icon}
                  </StudyIconWrap>
                  <div>
                    <StudyMeta>{mat.platform} • {mat.type}</StudyMeta>
                    <StudyTitle>{mat.title}</StudyTitle>
                  </div>
                </StudyCard>
              </a>
            ))}
          </StudyGrid>
        )}
      </AnimatePresence>
    </Container>
  );
}
