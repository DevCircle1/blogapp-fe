import { supabase } from './supabase';

const response = (data) => ({ data });
const asError = (error) => {
  const wrapped = error instanceof Error ? error : new Error(error?.message || 'Supabase request failed');
  wrapped.response = { status: error?.status || 400, data: { message: wrapped.message, error: wrapped.message } };
  return wrapped;
};
const run = async (query) => {
  const { data, error } = await query;
  if (error) throw asError(error);
  return data;
};
const currentUser = async (required = false) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (required && !user) throw asError({ status: 401, message: 'Please sign in to continue.' });
  return user;
};
const cleanPath = (url) => url.split('?')[0].replace(/^\/+|\/+$/g, '');
const queryParams = (url) => new URL(url, window.location.origin).searchParams;
const approvedPosts = () => supabase.from('posts').select('*').eq('status', 'approved').order('created_at', { ascending: false });
const dailyWords = ['crane', 'plant', 'sound', 'light', 'stone', 'grape', 'chair', 'smile', 'bread', 'ocean'];
const wordleStoreKey = 'talkandtool-wordle-games';
const getWordleGames = () => JSON.parse(localStorage.getItem(wordleStoreKey) || '{}');
const getDailyWord = (date) => {
  const day = Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 86400000);
  return dailyWords[Math.abs(day) % dailyWords.length];
};
const scoreGuess = (guess, answer) => {
  const result = Array(5).fill('absent');
  const remaining = answer.split('');
  guess.split('').forEach((letter, index) => {
    if (letter === answer[index]) {
      result[index] = 'correct';
      remaining[index] = null;
    }
  });
  guess.split('').forEach((letter, index) => {
    if (result[index] === 'correct') return;
    const match = remaining.indexOf(letter);
    if (match >= 0) {
      result[index] = 'wrong_place';
      remaining[match] = null;
    }
  });
  return result;
};

const categoriesWithPosts = async () => {
  const [categories, posts] = await Promise.all([
    run(supabase.from('categories').select('*').order('name')),
    run(approvedPosts()),
  ]);
  return categories.map((category) => {
    const articles = posts.filter((post) => String(post.category_id) === String(category.id));
    return { ...category, articles, total_articles: articles.length };
  });
};

const get = async (url, isPrivate) => {
  const path = cleanPath(url);
  const user = isPrivate ? await currentUser(true) : null;

  if (path === 'posts') return response(await run(approvedPosts()));
  if (path.startsWith('posts/')) {
    const slug = path.split('/')[1];
    return response(await run(supabase.from('posts').select('*').eq('slug', slug).single()));
  }
  if (path === 'categories') return response(await run(supabase.from('categories').select('*').order('name')));
  if (path === 'all-categories' || path === 'top-categories') {
    const categories = await categoriesWithPosts();
    return response(path === 'top-categories' ? categories.filter((item) => item.is_featured) : categories);
  }
  if (path.startsWith('all-categories/')) {
    const slug = path.split('/')[1];
    const categories = await categoriesWithPosts();
    const category = categories.find((item) => item.slug === slug);
    if (!category) throw asError({ status: 404, message: 'Category not found.' });
    return response(category);
  }
  if (path === 'questions/latest') {
    const questions = await run(supabase.from('questions').select('id, content, created_at, answers(count)').order('created_at', { ascending: false }));
    return response(questions.map((item) => ({ ...item, answer_count: item.answers?.[0]?.count || 0 })));
  }
  if (path === 'questions/my_questions') {
    const questions = await run(supabase.from('questions').select('id, content, created_at, answers(count)').eq('user_id', user.id).order('created_at', { ascending: false }));
    return response(questions.map((item) => ({ ...item, answer_count: item.answers?.[0]?.count || 0 })));
  }
  if (path.startsWith('questions/')) {
    const id = path.split('/')[1];
    return response(await run(supabase.from('questions').select('id, content, user_id, created_at, answers(id, content, created_at)').eq('id', id).single()));
  }
  if (path === 'answers/my_answers') {
    const answers = await run(supabase.from('answers').select('*, question:questions(id, content)').eq('user_id', user.id).order('created_at', { ascending: false }));
    return response(answers);
  }
  if (path.startsWith('codes/')) {
    const id = path.split('/')[1];
    return response(await run(supabase.from('code_shares').select('*').eq('id', id).single()));
  }
  if (path === 'job-alerts') return response(await run(supabase.from('job_alerts').select('*').eq('is_active', true).order('created_at', { ascending: false })));
  if (path === 'daily-word/attempts') {
    const params = queryParams(url);
    const key = `${params.get('player_id')}:${params.get('date')}`;
    const game = getWordleGames()[key] || { attempts: [], has_won: false };
    return response({ ...game, count: game.attempts.length });
  }
  if (path === 'daily-word/stats') {
    const playerId = queryParams(url).get('player_id');
    const games = Object.entries(getWordleGames()).filter(([key]) => key.startsWith(`${playerId}:`)).map(([, game]) => game);
    const wins = games.filter((game) => game.has_won).length;
    return response({ total_games: games.length, wins, current_streak: wins, max_streak: wins });
  }

  throw asError({ status: 404, message: `Unsupported Supabase route: ${path}` });
};

const uploadFeaturedImage = async (file, userId) => {
  if (!(file instanceof File)) return null;
  const extension = file.name.split('.').pop();
  const filePath = `${userId}/${crypto.randomUUID()}.${extension}`;
  const bucket = import.meta.env.VITE_SUPABASE_BLOG_IMAGES_BUCKET || 'blog-images';
  await run(supabase.storage.from(bucket).upload(filePath, file, { upsert: false }));
  return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
};

const post = async (url, payload, isPrivate) => {
  const path = cleanPath(url);
  const user = await currentUser(isPrivate);

  if (path === 'posts') {
    const title = payload.get('title');
    const featuredImage = await uploadFeaturedImage(payload.get('featured_image'), user.id);
    const profile = await run(supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle());
    const record = {
      title,
      slug: `${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString(36)}`,
      content: payload.get('content'),
      category_id: payload.get('category'),
      author_id: user.id,
      status: profile?.is_admin ? 'approved' : 'pending',
      ...(featuredImage ? { featured_image: featuredImage } : {}),
    };
    return response(await run(supabase.from('posts').insert(record).select().single()));
  }
  if (path === 'questions') {
    const record = { content: payload.content, user_id: user.id, user_email: user.email };
    return response(await run(supabase.from('questions').insert(record).select().single()));
  }
  if (path === 'answers') {
    const answerUser = user || await currentUser(false);
    const record = { question_id: payload.question, content: payload.content, ...(answerUser ? { user_id: answerUser.id } : {}) };
    return response(await run(supabase.from('answers').insert(record).select().single()));
  }
  if (path === 'codes') return response(await run(supabase.from('code_shares').insert(payload).select().single()));
  if (path === 'subscribe') return response(await run(supabase.from('subscribers').insert({ email: payload.email }).select().single()));
  if (path === 'contact') return response(await run(supabase.from('contact_messages').insert(payload).select().single()));
  if (path === 'daily-word/guess') {
    const date = new Date().toISOString().split('T')[0];
    const key = `${payload.player_id}:${date}`;
    const games = getWordleGames();
    const game = games[key] || { attempts: [], has_won: false };
    if (game.attempts.length >= 6 || game.has_won) throw asError({ message: 'Today\'s game is already complete.' });
    const guess = payload.guess.toLowerCase();
    const answer = getDailyWord(date);
    const result = scoreGuess(guess, answer);
    const win = guess === answer;
    game.attempts.push({ guess: guess.toUpperCase(), result, attempt_number: game.attempts.length + 1 });
    game.has_won = win;
    games[key] = game;
    localStorage.setItem(wordleStoreKey, JSON.stringify(games));
    return response({ result, attempt: game.attempts.length, win });
  }

  throw asError({ status: 404, message: `Unsupported Supabase route: ${path}` });
};

const put = async (url, payload) => {
  const path = cleanPath(url);
  if (path.startsWith('codes/')) {
    const id = path.split('/')[1];
    return response(await run(supabase.from('code_shares').update(payload).eq('id', id).select().single()));
  }
  throw asError({ status: 404, message: `Unsupported Supabase route: ${path}` });
};

const makeClient = (isPrivate) => ({
  get: (url) => get(url, isPrivate),
  post: (url, payload) => post(url, payload, isPrivate),
  put: (url, payload) => put(url, payload, isPrivate),
});

export const publicRequest = makeClient(false);
export const privateRequest = makeClient(true);
export const handleApiError = (error) => ({ message: error?.message || 'Something went wrong', details: error?.response?.data || null });

export default { publicRequest, privateRequest, handleApiError };
