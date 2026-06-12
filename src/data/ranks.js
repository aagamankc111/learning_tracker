const RANK_TIERS = [
  { id: 1, title: 'Novice', subtitle: 'Just Started', icon: '🌱', xpRequired: 0, color: 'indigo', minLevel: 1, description: 'Every master was once a beginner. Your journey begins now.' },
  { id: 2, title: 'Apprentice', subtitle: 'Building Foundations', icon: '🔧', xpRequired: 500, color: 'indigo', minLevel: 3, description: 'You are learning the tools of the trade. Foundations matter.' },
  { id: 3, title: 'Engineer', subtitle: 'Shipping Code', icon: '⚙️', xpRequired: 1500, color: 'indigo', minLevel: 5, description: 'You can build and deploy. Systems are starting to make sense.' },
  { id: 4, title: 'Senior Engineer', subtitle: 'Owning Systems', icon: '🏗️', xpRequired: 3500, color: 'indigo', minLevel: 8, description: 'You own production systems. You debug, optimize, and mentor.' },
  { id: 5, title: 'Expert', subtitle: 'Deep Specialization', icon: '🎯', xpRequired: 7000, color: 'indigo', minLevel: 12, description: 'You have deep expertise in cloud, K8s, and MLOps architecture.' },
  { id: 6, title: 'Master', subtitle: 'Architect Level', icon: '👑', xpRequired: 12000, color: 'indigo', minLevel: 16, description: 'You design systems that scale. You see the full stack clearly.' },
  { id: 7, title: 'Legend', subtitle: 'Thought Leader', icon: '⭐', xpRequired: 20000, color: 'indigo', minLevel: 20, description: 'Others look to you for technical direction. You shape the team.' },
  { id: 8, title: 'Mythic', subtitle: 'Industry Force', icon: '🔥', xpRequired: 35000, color: 'indigo', minLevel: 25, description: 'Your work influences industry practices. You are a known force.' },
  { id: 9, title: 'God Tier', subtitle: 'MLOps Architect', icon: '🏆', xpRequired: 50000, color: 'indigo', minLevel: 30, description: 'You have achieved the highest level of MLOps mastery. You architect the future of AI infrastructure.' },
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
  // Day 0–10: Starting Phase
  { quote: "Your life does not get better by chance, it gets better by change.", author: "Jim Rohn", phase: "Starting Phase", phaseIcon: "🌱" },
  { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", phase: "Starting Phase", phaseIcon: "🌱" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", phase: "Starting Phase", phaseIcon: "🌱" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", phase: "Starting Phase", phaseIcon: "🌱" },
  { quote: "Small disciplines repeated with consistency lead to great achievements.", author: "John C. Maxwell", phase: "Starting Phase", phaseIcon: "🌱" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso", phase: "Starting Phase", phaseIcon: "🌱" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", phase: "Starting Phase", phaseIcon: "🌱" },
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln", phase: "Starting Phase", phaseIcon: "🌱" },
  { quote: "Don't wait. The time will never be just right.", author: "Napoleon Hill", phase: "Starting Phase", phaseIcon: "🌱" },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", phase: "Starting Phase", phaseIcon: "🌱" },
  { quote: "What you do today can improve all your tomorrows.", author: "Ralph Marston", phase: "Starting Phase", phaseIcon: "🌱" },
  // Day 11–30: Discipline Phase
  { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Motivation gets you going, but discipline keeps you growing.", author: "John C. Maxwell", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Success is nothing more than a few simple disciplines, practiced every day.", author: "Jim Rohn", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "The pain you feel today will be the strength you feel tomorrow.", author: "unknown", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Do not be embarrassed by your failures, learn from them.", author: "Bill Gates", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Fall seven times, stand up eight.", author: "Japanese Proverb", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Without labor, nothing prospers.", author: "Sophocles", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Push yourself, because no one else is going to do it for you.", author: "unknown", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "The future depends on what you do today.", author: "Mahatma Gandhi", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Don't wish it were easier, wish you were better.", author: "Jim Rohn", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Energy and persistence conquer all things.", author: "Benjamin Franklin", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", phase: "Discipline Phase", phaseIcon: "🔥" },
  { quote: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn", phase: "Discipline Phase", phaseIcon: "🔥" },
  // Day 31–60: Struggle Phase
  { quote: "Tough times never last, but tough people do.", author: "Robert H. Schuller", phase: "Struggle Phase", phaseIcon: "🧠" },
  { quote: "If you are going through hell, keep going.", author: "Winston Churchill", phase: "Struggle Phase", phaseIcon: "🧠" },
  { quote: "Out of difficulties grow miracles.", author: "Jean de La Bruyère", phase: "Struggle Phase", phaseIcon: "🧠" },
  { quote: "The struggle you're in today is developing the strength you need tomorrow.", author: "unknown", phase: "Struggle Phase", phaseIcon: "🧠" },
  { quote: "Pain is temporary. Quitting lasts forever.", author: "Lance Armstrong", phase: "Struggle Phase", phaseIcon: "🧠" },
  { quote: "Rock bottom became the solid foundation on which I rebuilt my life.", author: "J.K. Rowling", phase: "Struggle Phase", phaseIcon: "🧠" },
  { quote: "What defines us is how well we rise after falling.", author: "Lionel Messi", phase: "Struggle Phase", phaseIcon: "🧠" },
  { quote: "Difficulties strengthen the mind, as labor strengthens the body.", author: "Seneca", phase: "Struggle Phase", phaseIcon: "🧠" },
  { quote: "Turn your wounds into wisdom.", author: "Oprah Winfrey", phase: "Struggle Phase", phaseIcon: "🧠" },
  { quote: "Stars can't shine without darkness.", author: "D.H. Sidebottom", phase: "Struggle Phase", phaseIcon: "🧠" },
  // Day 61–80: Growth Phase
  { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", phase: "Growth Phase", phaseIcon: "🏔️" },
  { quote: "The best way out is always through.", author: "Robert Frost", phase: "Growth Phase", phaseIcon: "🏔️" },
  { quote: "Don't count the days, make the days count.", author: "Muhammad Ali", phase: "Growth Phase", phaseIcon: "🏔️" },
  { quote: "Great things take time.", author: "Unknown", phase: "Growth Phase", phaseIcon: "🏔️" },
  { quote: "Patience is bitter, but its fruit is sweet.", author: "Aristotle", phase: "Growth Phase", phaseIcon: "🏔️" },
  { quote: "Be so good they can't ignore you.", author: "Steve Martin", phase: "Growth Phase", phaseIcon: "🏔️" },
  { quote: "Consistency is what transforms average into excellence.", author: "unknown", phase: "Growth Phase", phaseIcon: "🏔️" },
  { quote: "Success is the sum of small efforts repeated daily.", author: "Robert Collier", phase: "Growth Phase", phaseIcon: "🏔️" },
  { quote: "The hard days are what make you stronger.", author: "Aly Raisman", phase: "Growth Phase", phaseIcon: "🏔️" },
  { quote: "Dreams don't work unless you do.", author: "John C. Maxwell", phase: "Growth Phase", phaseIcon: "🏔️" },
  // Day 81–100: Mastery Phase
  { quote: "We become what we think about.", author: "Earl Nightingale", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "Satisfaction lies in the effort, not in the attainment.", author: "Mahatma Gandhi", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "What you stay consistent with becomes your identity.", author: "unknown", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "Keep going. Everything you need will come to you.", author: "unknown", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "Your habits determine your future.", author: "unknown", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "The best revenge is massive success.", author: "Frank Sinatra", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "Do not stop until you're proud.", author: "unknown", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "It's not over until I win.", author: "Les Brown", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "You didn't come this far to only come this far.", author: "unknown", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "Endure now and live the rest of your life as a champion.", author: "unknown", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "Success is built on showing up when you don't feel like it.", author: "unknown", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "Discipline is freedom.", author: "Jocko Willink", phase: "Mastery Phase", phaseIcon: "🧭" },
  { quote: "What you become is worth more than what you get.", author: "unknown", phase: "Mastery Phase", phaseIcon: "🧭" },
  // Bonus originals
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker", phase: "Bonus", phaseIcon: "💎" },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins", phase: "Bonus", phaseIcon: "💎" },
  { quote: "Your limitation—it's only your imagination.", author: "Unknown", phase: "Bonus", phaseIcon: "💎" },
  { quote: "Great things never come from comfort zones.", author: "Unknown", phase: "Bonus", phaseIcon: "💎" },
  { quote: "Dream it. Wish it. Do it.", author: "Unknown", phase: "Bonus", phaseIcon: "💎" },
  { quote: "Talent without working hard is nothing.", author: "Cristiano Ronaldo", phase: "Bonus", phaseIcon: "💎" },
  { quote: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis", phase: "Bonus", phaseIcon: "💎" },
  { quote: "It's hard to beat a person who never gives up.", author: "Babe Ruth", phase: "Bonus", phaseIcon: "💎" },
  { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown", phase: "Bonus", phaseIcon: "💎" },
  { quote: "Don't stop when you're tired. Stop when you're done.", author: "Unknown", phase: "Bonus", phaseIcon: "💎" },
  { quote: "Success doesn't come from what you do occasionally. It comes from what you do consistently.", author: "Marie Forleo", phase: "Bonus", phaseIcon: "💎" },
  { quote: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", phase: "Bonus", phaseIcon: "💎" },
  { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", phase: "Bonus", phaseIcon: "💎" },
  { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki", phase: "Bonus", phaseIcon: "💎" },
  { quote: "The mind is everything. What you think you become.", author: "Buddha", phase: "Bonus", phaseIcon: "💎" },
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
