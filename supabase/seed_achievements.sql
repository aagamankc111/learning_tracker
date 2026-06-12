-- 50 Space-Themed Achievements for Learning Tracker
-- XP balance: items (466 * 5 = 2330 XP), quizzes (~90 * ~15 XP = ~1350 XP),
-- achievements (~2610 XP total), lifetime max ~6290 XP
-- Level formula: floor(sqrt(totalXp/100)) + 1 → level ~8-9 at max

-- Phase 1: Launch & Atmosphere (Early Wins)
INSERT INTO achievements (id, name, description, icon, xp_reward, criteria) VALUES
(1,  'Ground Control',     'Complete your first learning item',                         '🚀', 10,  '{"type":"items_completed","count":1}'),
(2,  'Pre-Flight Check',   'Complete 5 items',                                           '✅', 15,  '{"type":"items_completed","count":5}'),
(3,  'Ignition Sequence',  '3-day learning streak',                                      '🔥', 20,  '{"type":"streak","days":3}'),
(4,  'Clearing the Tower', 'Complete 10 items',                                          '📡', 25,  '{"type":"items_completed","count":10}'),
(5,  'Max Q',              'Take 3 quizzes',                                             '💥', 25,  '{"type":"quizzes_taken","count":3}'),
(6,  'Escaping Gravity',   'Complete 25 items',                                          '🌍', 30,  '{"type":"items_completed","count":25}'),
(7,  'Low Earth Orbit',    'Earn 100 total XP',                                          '🌏', 20,  '{"type":"total_xp","count":100}'),
(8,  'Sonic Boom',         'Score 100% on any quiz',                                     '⚡', 50,  '{"type":"quiz_perfect"}'),
(9,  'Payload Delivered',  'Complete 50 items',                                          '📦', 35,  '{"type":"items_completed","count":50}'),
(10, 'Space Cadet',        'Complete 100 items',                                         '🎖️', 40,  '{"type":"items_completed","count":100}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description,
  icon = EXCLUDED.icon, xp_reward = EXCLUDED.xp_reward, criteria = EXCLUDED.criteria;

-- Phase 2: Deep Space Navigation (Consistency & Habit Building)
INSERT INTO achievements (id, name, description, icon, xp_reward, criteria) VALUES
(11, 'Cosmic Rhythm',       '7-day learning streak',                                     '🌙', 30,  '{"type":"streak","days":7}'),
(12, 'Light-Year Leap',     '30-day learning streak',                                    '⭐', 60,  '{"type":"streak","days":30}'),
(13, 'Solar Powered',       'Complete 75 items',                                         '☀️', 35,  '{"type":"items_completed","count":75}'),
(14, 'Nebula Navigator',    '14-day learning streak',                                    '🌌', 40,  '{"type":"streak","days":14}'),
(15, 'Perpetual Motion',    '21-day learning streak',                                    '🔄', 50,  '{"type":"streak","days":21}'),
(16, 'Deep Space Beacon',   'Complete 150 items',                                        '🪐', 45,  '{"type":"items_completed","count":150}'),
(17, 'Gravity Assist',      'Take 10 quizzes',                                           '🌀', 35,  '{"type":"quizzes_taken","count":10}'),
(18, 'Orbital Resonance',   'Complete 200 items',                                        '🛸', 50,  '{"type":"items_completed","count":200}'),
(19, 'Interstellar Commute','60-day learning streak',                                    '🚆', 80,  '{"type":"streak","days":60}'),
(20, 'Mission Control Vet', '90-day learning streak',                                    '🎯', 100, '{"type":"streak","days":90}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description,
  icon = EXCLUDED.icon, xp_reward = EXCLUDED.xp_reward, criteria = EXCLUDED.criteria;

-- Phase 3: Scientific Research (Focus, Mastery & Deep Diving)
INSERT INTO achievements (id, name, description, icon, xp_reward, criteria) VALUES
(21, 'The Deep Diver',    'Complete 250 items',                                          '🤿', 50,  '{"type":"items_completed","count":250}'),
(22, 'Event Horizon',     'Earn 500 total XP',                                           '🕳️', 40,  '{"type":"total_xp","count":500}'),
(23, 'Total Eclipse',     'Score 100% on a major quiz',                                  '🌑', 75,  '{"type":"quiz_perfect"}'),
(24, 'Quantum Leap',      'Complete 300 items',                                          '⚛️', 55,  '{"type":"items_completed","count":300}'),
(25, 'Spectrum Analysis', 'Take 5 quizzes',                                              '🌈', 25,  '{"type":"quizzes_taken","count":5}'),
(26, 'Black Hole Focus',  'Take 20 quizzes',                                             '🕳️', 45,  '{"type":"quizzes_taken","count":20}'),
(27, 'Star Surveyor',     'Take 50 quizzes',                                             '🔭', 60,  '{"type":"quizzes_taken","count":50}'),
(28, 'Data Stream',       'Complete 350 items',                                          '📊', 60,  '{"type":"items_completed","count":350}'),
(29, 'Supernova',         'Earn 1000 total XP',                                          '💫', 60,  '{"type":"total_xp","count":1000}'),
(30, 'Theory of Relativity','Complete 400 items',                                        '⏳', 70,  '{"type":"items_completed","count":400}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description,
  icon = EXCLUDED.icon, xp_reward = EXCLUDED.xp_reward, criteria = EXCLUDED.criteria;

-- Phase 4: Hull Repairs & Asteroid Fields (Resilience & Grit)
INSERT INTO achievements (id, name, description, icon, xp_reward, criteria) VALUES
(31, 'Cosmic Friction',   'Complete 420 items',                                          '💢', 70,  '{"type":"items_completed","count":420}'),
(32, 'Space Debris',      'Take 35 quizzes',                                             '☄️', 50,  '{"type":"quizzes_taken","count":35}'),
(33, 'Shield Recharge',   'Earn 750 total XP',                                           '🛡️', 50,  '{"type":"total_xp","count":750}'),
(34, 'Asteroid Evader',   'Earn 1500 total XP',                                          '☄️', 70,  '{"type":"total_xp","count":1500}'),
(35, 'Apollo 13',         'Complete 450 items',                                          '🆘', 80,  '{"type":"items_completed","count":450}'),
(36, 'Dark Matter',       'Earn 2000 total XP',                                          '🔮', 80,  '{"type":"total_xp","count":2000}'),
(37, 'Re-Entry Heat',     'Take 75 quizzes',                                             '🌡️', 80,  '{"type":"quizzes_taken","count":75}'),
(38, 'Solar Flare Survive','45-day learning streak',                                     '🌋', 70,  '{"type":"streak","days":45}'),
(39, 'Inertia Breaker',   'Complete ALL 466 curriculum items',                           '🏁', 100, '{"type":"items_completed","count":466}'),
(40, 'Cosmonaut Grit',    'Take 100 quizzes',                                            '💪', 100, '{"type":"quizzes_taken","count":100}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description,
  icon = EXCLUDED.icon, xp_reward = EXCLUDED.xp_reward, criteria = EXCLUDED.criteria;

-- Phase 5: Galactic Federation (Mastery & Legacy)
INSERT INTO achievements (id, name, description, icon, xp_reward, criteria) VALUES
(41, 'Cosmic Cartographer',  'Earn 3000 total XP',                                       '🗺️', 100, '{"type":"total_xp","count":3000}'),
(42, 'Wormhole Shortcut',    'Earn 4000 total XP',                                       '🌀', 120, '{"type":"total_xp","count":4000}'),
(43, 'Deep Space Radio',     'Take 150 quizzes',                                         '📡', 120, '{"type":"quizzes_taken","count":150}'),
(44, 'Alien Diplomat',       'Earn 5000 total XP',                                       '👽', 150, '{"type":"total_xp","count":5000}'),
(45, 'Constellation Creator','Earn 7500 total XP',                                       '🌟', 180, '{"type":"total_xp","count":7500}'),
(46, 'Fleet Commander',      'Earn 10000 total XP',                                      '🛸', 200, '{"type":"total_xp","count":10000}'),
(47, 'Dyson Sphere',         'Earn 15000 total XP',                                      '⚙️', 250, '{"type":"total_xp","count":15000}'),
(48, 'Universal Translator', 'Earn 20000 total XP',                                      '🌐', 300, '{"type":"total_xp","count":20000}'),
(49, 'Grand Voyager',        'Earn 30000 total XP',                                      '🚀', 400, '{"type":"total_xp","count":30000}'),
(50, 'Singularity',          'Earn 50000 total XP',                                      '♾️', 500, '{"type":"total_xp","count":50000}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description,
  icon = EXCLUDED.icon, xp_reward = EXCLUDED.xp_reward, criteria = EXCLUDED.criteria;

-- Reset sequence in case of gaps
SELECT setval('achievements_id_seq', COALESCE((SELECT MAX(id) FROM achievements), 0));
