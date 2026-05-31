const RANK_TIERS = [
  { id: 1, title: 'Novice', subtitle: 'Just Started', icon: '🌱', xpRequired: 0, color: 'slate', minLevel: 1, description: 'Every master was once a beginner. Your journey begins now.' },
  { id: 2, title: 'Apprentice', subtitle: 'Building Foundations', icon: '🔧', xpRequired: 500, color: 'stone', minLevel: 3, description: 'You are learning the tools of the trade. Foundations matter.' },
  { id: 3, title: 'Engineer', subtitle: 'Shipping Code', icon: '⚙️', xpRequired: 1500, color: 'blue', minLevel: 5, description: 'You can build and deploy. Systems are starting to make sense.' },
  { id: 4, title: 'Senior Engineer', subtitle: 'Owning Systems', icon: '🏗️', xpRequired: 3500, color: 'indigo', minLevel: 8, description: 'You own production systems. You debug, optimize, and mentor.' },
  { id: 5, title: 'Expert', subtitle: 'Deep Specialization', icon: '🎯', xpRequired: 7000, color: 'violet', minLevel: 12, description: 'You have deep expertise in cloud, K8s, and MLOps architecture.' },
  { id: 6, title: 'Master', subtitle: 'Architect Level', icon: '👑', xpRequired: 12000, color: 'amber', minLevel: 16, description: 'You design systems that scale. You see the full stack clearly.' },
  { id: 7, title: 'Legend', subtitle: 'Thought Leader', icon: '⭐', xpRequired: 20000, color: 'orange', minLevel: 20, description: 'Others look to you for technical direction. You shape the team.' },
  { id: 8, title: 'Mythic', subtitle: 'Industry Force', icon: '🔥', xpRequired: 35000, color: 'red', minLevel: 25, description: 'Your work influences industry practices. You are a known force.' },
  { id: 9, title: 'God Tier', subtitle: 'MLOps Architect', icon: '🏆', xpRequired: 50000, color: 'purple', minLevel: 30, description: 'You have achieved the highest level of MLOps mastery. You architect the future of AI infrastructure.' },
];

const RANK_MILESTONE_MESSAGES = {
  1: { title: 'The First Step', message: 'Every expert was once a beginner. You\'ve taken the most important step — starting.', badge: '🌱' },
  2: { title: 'Hands Dirty', message: 'You\'re getting your hands dirty with real tools. This is where the real learning begins.', badge: '🔧' },
  3: { title: 'Shipping Reality', message: 'You\'ve shipped code. You understand deployments. You are no longer a beginner.', badge: '⚙️' },
  4: { title: 'System Ownership', message: 'You own systems end-to-end. Production incidents don\'t scare you anymore.', badge: '🏗️' },
  5: { title: 'Deep Waters', message: 'You\'ve gone deep into Kubernetes, cloud networking, and MLOps. Few engineers have your range.', badge: '🎯' },
  6: { title: 'Architect Mindset', message: 'You think in terms of systems, not just code. Architecture patterns are your language.', badge: '👑' },
  7: { title: 'Leadership', message: 'You influence technical direction. Others seek your guidance. You are a leader.', badge: '⭐' },
  8: { title: 'Industry Impact', message: 'Your contributions extend beyond your team. You are shaping the industry.', badge: '🔥' },
  9: { title: 'God Tier Achieved', message: 'You have reached the pinnacle of MLOps engineering. You are a God Tier MLOps Architect.', badge: '🏆' },
};

const AAGAMAN_MESSAGES = [
  "Aagaman — you're not just learning, you're building an empire. Every checkbox is a brick.",
  "Remember why you started. The 3:1 demand gap means the market needs you.",
  "Burnout is the real enemy. Take your rest day seriously. Recovery = Growth.",
  "You're not competing with others. You're competing with who you were yesterday.",
  "Every master was once a beginner. Every expert was once confused. Keep going.",
  "The only way to fail is to stop. Everything else is just feedback.",
  "You've already graduated. Now you're specializing. This is the edge.",
  "Most people talk. You build. That's the difference between average and elite.",
  "Your GitHub will speak for itself. 3 projects. 90 days. Let the code do the talking.",
  "MLOps engineers don't grow on trees. You're becoming rare and valuable.",
  "The market has 3 jobs for every 1 qualified engineer. Be that 1.",
  "You're not just learning for a job. You're learning to architect the future of AI.",
];

const DAILY_MOTIVATIONAL_QUOTES = [
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Your limitation—it's only your imagination.", author: "Unknown" },
  { quote: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { quote: "Great things never come from comfort zones.", author: "Unknown" },
  { quote: "Dream it. Wish it. Do it.", author: "Unknown" },
  { quote: "Talent without working hard is nothing.", author: "Cristiano Ronaldo" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis" },
  { quote: "It's hard to beat a person who never gives up.", author: "Babe Ruth" },
  { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { quote: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { quote: "Success doesn't come from what you do occasionally. It comes from what you do consistently.", author: "Marie Forleo" },
  { quote: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { quote: "The mind is everything. What you think you become.", author: "Buddha" },
];

export function getRankForXp(totalXp) {
  let rank = RANK_TIERS[0];
  for (const tier of RANK_TIERS) {
    if (totalXp >= tier.xpRequired) {
      rank = tier;
    }
  }
  return rank;
}

export function getNextRank(currentRank) {
  const idx = RANK_TIERS.findIndex(r => r.id === currentRank.id);
  if (idx < RANK_TIERS.length - 1) return RANK_TIERS[idx + 1];
  return null;
}

export function getRankProgress(totalXp, currentRank) {
  const nextRank = getNextRank(currentRank);
  if (!nextRank) return 100;
  const currentXp = currentRank.xpRequired;
  const nextXp = nextRank.xpRequired;
  const progress = ((totalXp - currentXp) / (nextXp - currentXp)) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

export function getDailyQuote(dayOffset = 0) {
  const dayIndex = (new Date().getDate() + dayOffset) % DAILY_MOTIVATIONAL_QUOTES.length;
  return DAILY_MOTIVATIONAL_QUOTES[dayIndex];
}

export function getAagamanMessage(dayOffset = 0) {
  const dayIndex = (new Date().getDate() + dayOffset * 7) % AAGAMAN_MESSAGES.length;
  return AAGAMAN_MESSAGES[dayIndex];
}

export function getRankMilestoneMessage(rankId) {
  return RANK_MILESTONE_MESSAGES[rankId] || RANK_MILESTONE_MESSAGES[1];
}

export { RANK_TIERS, RANK_MILESTONE_MESSAGES, AAGAMAN_MESSAGES, DAILY_MOTIVATIONAL_QUOTES };
