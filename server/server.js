import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { users, posts, comments, orders, mockProducts } from './fakeDatabase.js';

const app = express();
const httpServer = createServer(app);
const PORT = 3001;
const JWT_SECRET = 'a-super-secret-key-for-jisu-and-oppa-project';

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT"] }
});

app.use(cors());
app.use(bodyParser.json());

// --- Auth Middleware ---
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, JWT_SECRET, (err, authData) => {
            if (err) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
            req.user = authData;
            next();
        });
    } else {
        // Allow public access for some routes, so we just call next()
        // If a route needs authentication, it will check for req.user
        next();
    }
};


// --- API Endpoints ---

// Auth
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
  }
  const newUser = { id: users.length + 1, name, email, password, role: 'user', status: '정상' };
  users.push(newUser);
  res.status(201).send(); // Send 201 Created without a body
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ message: '로그인 성공!', token, user: { name: user.name, email: user.email, role: user.role }});
});


// User Profile (Protected)
app.get('/api/users/me', verifyToken, (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const currentUser = users.find(u => u.id === req.user.id);
    if (!currentUser) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    const { password, ...userProfile } = currentUser;
    res.json(userProfile);
});

app.put('/api/users/me', verifyToken, (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const { name, currentPassword, newPassword } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    
    if (newPassword && users[userIndex].password !== currentPassword) {
        return res.status(403).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    if (name) users[userIndex].name = name;
    if (newPassword) users[userIndex].password = newPassword;
    
    const updatedUser = users[userIndex];
    const token = jwt.sign({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }, JWT_SECRET, { expiresIn: '1h' });
    const { password, ...userPayload } = updatedUser;
    res.json({ message: '프로필이 성공적으로 업데이트되었습니다.', token, user: userPayload });
});

// Order History (Protected)
app.get('/api/orders/my', verifyToken, (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const userOrders = orders.filter(order => order.userId === req.user.id);
    res.json(userOrders);
});

// My Activities (Protected)
app.get('/api/users/me/activities', verifyToken, (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const myPosts = posts.filter(post => post.author === req.user.name);
    const myComments = comments.filter(comment => comment.author === req.user.name);
    res.json({ posts: myPosts, comments: myComments });
});

// --- Product API Endpoints ---
app.get('/api/products/:productId', (req, res) => {
    const { productId } = req.params;
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
});

// Community (Public and Protected parts)
app.get('/api/posts', (req, res) => { 
    const postSummaries = posts.map(({ content, ...summary }) => summary);
    res.json(postSummaries); 
});

app.get('/api/posts/:postId', (req, res) => {
    const post = posts.find(p => p.id === req.params.postId);
    if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    
    // This is a mock, so we won't increment views permanently
    const tempPost = {...post, views: post.views + 1};

    const postComments = comments.filter(c => c.postId === req.params.postId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ ...tempPost, comments: postComments });
});

app.post('/api/posts', verifyToken, (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const { title, content, category } = req.body;
    const newPost = { 
        id: `post-${Date.now()}`, 
        category, 
        title, 
        content, 
        author: req.user.name, 
        createdAt: new Date().toISOString(), 
        views: 0, 
        likes: 0, 
        thumbnailUrl: content.match(/<img src="(.*?)"/)?.[1] || '/thumbnails/default.jpg'
    };
    posts.unshift(newPost);
    res.status(201).json(newPost);
});

app.post('/api/posts/:postId/comments', verifyToken, (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const { text } = req.body;
    const { postId } = req.params;
    const newComment = { id: `comment-${Date.now()}`, postId, text, author: req.user.name, createdAt: new Date().toISOString() };
    comments.push(newComment);
    io.to(`post-${postId}`).emit('new-comment', newComment);
    res.status(201).json(newComment);
});

// --- Admin Endpoints (requires specific admin middleware) ---
const verifyAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
    next();
};

app.get('/api/admin/users', verifyToken, verifyAdmin, (req, res) => {
    res.json(users.map(({password, ...user}) => user));
});

app.put('/api/admin/users/:userId', verifyToken, verifyAdmin, (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { status } = req.body;
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    if (['정상', '정지'].includes(status)) {
        users[userIndex].status = status;
    }
    const {password, ...updatedUser} = users[userIndex];
    res.json(updatedUser);
});


// --- Socket.IO Events ---
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('joinStream', (streamId) => socket.join(streamId));
  socket.on('chatMessage', ({ streamId, message }) => io.to(streamId).emit('newChatMessage', message));
  socket.on('join-post-room', (postId) => socket.join(`post-${postId}`));
  socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`));
});

httpServer.listen(PORT, () => {
  console.log(`Jisu AI Backend Server is running on http://localhost:${PORT}`);
  console.log('Waiting for requests from 오빠...');
});