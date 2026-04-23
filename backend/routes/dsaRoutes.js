const express = require('express');
const router = express.Router();
const { DSASubmission } = require('../models');

// POST /:uid/submit
router.post('/:uid/submit', async (req, res) => {
  try {
    const { title, link, platform, difficulty, topic, notes } = req.body;
    const newSub = await DSASubmission.create({
      userId: req.params.uid,
      title, link, platform, difficulty, topic, notes
    });
    res.status(201).json(newSub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:uid/progress
router.get('/:uid/progress', async (req, res) => {
  try {
    const uid = req.params.uid;
    
    // Total Solved
    const totalSolved = await DSASubmission.countDocuments({ userId: uid });

    // Recent Submissions
    const recent = await DSASubmission.find({ userId: uid }).sort({ solvedAt: -1 }).limit(10);

    // Difficulty Breakdown
    const diffStats = await DSASubmission.aggregate([
      { $match: { userId: uid } },
      { $group: { _id: "$difficulty", count: { $sum: 1 } } }
    ]);
    const difficultyData = ['Easy', 'Medium', 'Hard'].map(d => {
      const match = diffStats.find(s => s._id === d);
      return { name: d, value: match ? match.count : 0 };
    }).filter(d => d.value > 0);

    // Topic Breakdown
    const topicStats = await DSASubmission.aggregate([
      { $match: { userId: uid } },
      { $group: { _id: "$topic", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const topicData = topicStats.map(s => ({
      name: s._id,
      count: s.count
    }));

    res.json({
      totalSolved,
      recent,
      difficultyData,
      topicData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:uid/daily-suggestion
router.get('/:uid/daily-suggestion', async (req, res) => {
  try {
    const uid = req.params.uid;
    
    const BLIND_75 = [
      { title: "Two Sum", difficulty: "Easy", topic: "Arrays & Hashing", link: "https://leetcode.com/problems/two-sum/" },
      { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Arrays & Hashing", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { title: "Contains Duplicate", difficulty: "Easy", topic: "Arrays & Hashing", link: "https://leetcode.com/problems/contains-duplicate/" },
      { title: "Product of Array Except Self", difficulty: "Medium", topic: "Arrays & Hashing", link: "https://leetcode.com/problems/product-of-array-except-self/" },
      { title: "Maximum Subarray", difficulty: "Medium", topic: "Arrays & Hashing", link: "https://leetcode.com/problems/maximum-subarray/" },
      { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List", link: "https://leetcode.com/problems/reverse-linked-list/" },
      { title: "Invert Binary Tree", difficulty: "Easy", topic: "Trees", link: "https://leetcode.com/problems/invert-binary-tree/" },
      { title: "Climbing Stairs", difficulty: "Easy", topic: "1D DP", link: "https://leetcode.com/problems/climbing-stairs/" },
      { title: "3Sum", difficulty: "Medium", topic: "Two Pointers", link: "https://leetcode.com/problems/3sum/" },
      { title: "Number of Islands", difficulty: "Medium", topic: "Graphs", link: "https://leetcode.com/problems/number-of-islands/" },
    ];

    // Find all titles the user has solved
    const solved = await DSASubmission.find({ userId: uid }).select('title -_id');
    const solvedTitles = new Set(solved.map(s => s.title.toLowerCase().trim()));

    // Find the first Blind 75 problem not solved yet
    let suggestion = BLIND_75.find(p => !solvedTitles.has(p.title.toLowerCase().trim()));
    
    if (!suggestion) {
      suggestion = { title: "You finished the list!", difficulty: "Hard", topic: "Everything", link: "" };
    }

    res.json(suggestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
