"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, Code, Clock } from 'lucide-react';
import { analyticsService } from '@/lib/api';
import {
  Container, Header, Title, Subtitle, PodiumContainer, PodiumSlot,
  PodiumAvatar, PodiumPillar, PillarRank, PlayerName, PlayerScore,
  PlayerStats, ListContainer, ListItem, ListRank, ListInfo,
  ListName, ListBranch, ListScoreBox, ListScore, ListStats, StatItem,
  LoadingContainer
} from './styles';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await analyticsService.getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <LoadingContainer><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Trophy size={40} /></motion.div></LoadingContainer>;
  }

  // Reorder top 3 for podium display (2nd, 1st, 3rd)
  const top3 = leaderboard.slice(0, 3);
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push({ ...top3[1], rank: 2 });
  if (top3[0]) podiumOrder.push({ ...top3[0], rank: 1 });
  if (top3[2]) podiumOrder.push({ ...top3[2], rank: 3 });

  const rest = leaderboard.slice(3);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Container>
      <Header>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Trophy size={48} color="#FFD700" style={{ marginBottom: '1rem' }} />
          <Title>Campus Leaderboard</Title>
          <Subtitle>The most productive students this week</Subtitle>
        </motion.div>
      </Header>

      {podiumOrder.length > 0 && (
        <PodiumContainer>
          {podiumOrder.map((student) => {
            const height = student.rank === 1 ? '250px' : student.rank === 2 ? '180px' : '130px';
            return (
              <PodiumSlot 
                key={student._id} 
                $rank={student.rank}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: student.rank * 0.2, duration: 0.5, type: 'spring' }}
              >
                <PlayerName>{student.fullName}</PlayerName>
                <PlayerScore>{Math.round(student.productivityScore)} pts</PlayerScore>
                <PodiumAvatar $rank={student.rank}>
                  {student.fullName.charAt(0)}
                </PodiumAvatar>
                
                <PodiumPillar 
                  $rank={student.rank}
                  initial={{ height: 0 }}
                  animate={{ height }}
                  transition={{ delay: 0.5 + (student.rank * 0.1), duration: 0.8, type: 'spring' }}
                >
                  <PillarRank $rank={student.rank}>{student.rank}</PillarRank>
                  
                  <PlayerStats style={{ marginTop: '1rem' }}>
                    <div><CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> {student.completedTasks} Tasks</div>
                    <div><Code size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> {student.dsaSolved} DSA</div>
                  </PlayerStats>
                </PodiumPillar>
              </PodiumSlot>
            );
          })}
        </PodiumContainer>
      )}

      <ListContainer as={motion.div} variants={containerVariants} initial="hidden" animate="show">
        {rest.map((student, index) => (
          <ListItem key={student._id} variants={itemVariants}>
            <ListRank>#{index + 4}</ListRank>
            <PodiumAvatar $rank={4} style={{ width: '40px', height: '40px', fontSize: '1rem', margin: '0 1.5rem 0 0', border: '1px solid #444' }}>
              {student.fullName.charAt(0)}
            </PodiumAvatar>
            <ListInfo>
              <ListName>{student.fullName}</ListName>
              <ListBranch>{student.branch || 'General'} · {student.program || 'B.Tech'}</ListBranch>
            </ListInfo>
            
            <ListStats>
              <StatItem>
                <CheckCircle2 size={16} color="#00b8a3" />
                <span>{student.completedTasks} tasks</span>
              </StatItem>
              <StatItem>
                <Code size={16} color="#FF5252" />
                <span>{student.dsaSolved} solved</span>
              </StatItem>
            </ListStats>

            <ListScoreBox>
              <ListScore>{Math.round(student.productivityScore)}</ListScore>
              <span style={{ fontSize: '0.75rem', color: '#888' }}>pts</span>
            </ListScoreBox>
          </ListItem>
        ))}
      </ListContainer>
    </Container>
  );
}
