import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import admin from 'firebase-admin';

// Keep old data for entities not yet migrated
import { liveStreams } from './fakeDatabase.js';

// --- Firebase Initialization from Environment Variables ---
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Initialize Firebase only if the essential credentials are provided
if (serviceAccount.project_id) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
} else {
    console.warn("Firebase credentials not found in environment variables. Skipping Firebase initialization. This is okay for local development if you are not using Firebase features.");
}

const db = admin.firestore();
const usersCollection = db.collection('users');
const productsCollection = db.collection('products');
const postsCollection = db.collection('posts');
const commentsCollection = db.collection('comments');


const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001; // Use Render's port if available
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
            if (err) {
                 req.user = null;
            } else {
                req.user = authData;
            }
            next();
        });
    } else {
        req.user = null;
        next();
    }
};

// --- Admin Middleware ---
const verifyAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
    next();
};


// --- API Endpoints ---

// Auth (Firestore Version)
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }
    const userRef = usersCollection.where('email', '==', email);
    const snapshot = await userRef.get();
    if (!snapshot.empty) {
        return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }
    const newUser = { name, email, password, role: 'user', status: '정상' }; // Note: Storing password in plaintext for simplicity. Use hashing in production.
    const result = await usersCollection.add(newUser);
    res.status(201).json({ message: '회원가입이 성공적으로 완료되었습니다.', userId: result.id });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const userRef = usersCollection.where('email', '==', email).where('password', '==', password);
    const snapshot = await userRef.get();
    if (snapshot.empty) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    const token = jwt.sign({ id: userId, name: userData.name, email: userData.email, role: userData.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: '로그인 성공!', token, user: { name: userData.name, email: userData.email, role: userData.role }});
});


// User Profile (Firestore Version)
app.get('/api/users/me', verifyToken, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    try {
        const userDoc = await usersCollection.doc(req.user.id).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        const { password, ...userProfile } = userDoc.data();
        res.json({ id: userDoc.id, ...userProfile });
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.put('/api/users/me', verifyToken, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const { name, currentPassword, newPassword } = req.body;
    const userRef = usersCollection.doc(req.user.id);
    
    try {
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        
        const userData = userDoc.data();
        const updateData = {};

        if (name) updateData.name = name;
        
        if (newPassword) {
            if (userData.password !== currentPassword) {
                return res.status(403).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
            }
            updateData.password = newPassword;
        }

        await userRef.update(updateData);
        
        const updatedUserData = { ...userData, ...updateData };
        const token = jwt.sign({ id: userDoc.id, name: updatedUserData.name, email: updatedUserData.email, role: updatedUserData.role }, JWT_SECRET, { expiresIn: '1h' });
        const { password, ...userPayload } = updatedUserData;

        res.json({ message: '프로필이 성공적으로 업데이트되었습니다.', token, user: userPayload });
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// Order History (Protected - MIGRATED TO FIRESTORE)
app.get('/api/orders/my', verifyToken, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    try {
        const ordersSnapshot = await db.collection('orders')
                                     .where('userId', '==', req.user.id)
                                     .orderBy('orderDate', 'desc')
                                     .get();
        
        if (ordersSnapshot.empty) {
            return res.json([]);
        }
        
        const userOrders = ordersSnapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.orderDate.toDate ? data.orderDate.toDate() : new Date(data.orderDate);
            const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
            
            return {
                ...data,
                orderId: data.orderId,
                orderDate: formattedDate,
            };
        });

        res.json(userOrders);
    } catch (error) {
        console.error("Error fetching my orders:", error);
        res.status(500).json({ message: '주문 내역을 불러오는 중 오류가 발생했습니다.' });
    }
});

// My Activities (Protected - MIGRATED TO FIRESTORE)
app.get('/api/users/me/activities', verifyToken, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    try {
        const postsQuery = postsCollection.where('authorId', '==', req.user.id).orderBy('createdAt', 'desc').get();
        const commentsQuery = commentsCollection.where('authorId', '==', req.user.id).orderBy('createdAt', 'desc').get();
        
        const [postsSnapshot, commentsSnapshot] = await Promise.all([postsQuery, commentsQuery]);
        
        const myPosts = postsSnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
            return {
                id: doc.id,
                title: data.title,
                createdAt,
                views: data.views,
                likes: data.likes
            };
        });

        const myComments = commentsSnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
            return {
                id: doc.id,
                postId: data.postId,
                text: data.text,
                createdAt
            };
        });
        res.json({ posts: myPosts, comments: myComments });
    } catch (error) {
        res.status(500).json({ message: '활동 내역을 불러오는 중 오류가 발생했습니다.' });
    }
});

// --- Product API Endpoints (Firestore Version) ---
app.get('/api/products', async (req, res) => {
    try {
        const snapshot = await productsCollection.orderBy('createdAt', 'desc').get();
        const productList = snapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
            return { id: doc.id, ...data, createdAt };
        });
        res.json(productList);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: '상품 목록을 불러오는 중 오류가 발생했습니다.' });
    }
});

app.get('/api/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const doc = await productsCollection.doc(productId).get();
        if (doc.exists) {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
            res.json({ id: doc.id, ...data, createdAt });
        } else {
            res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: '상품 정보를 불러오는 중 오류가 발생했습니다.' });
    }
});

app.post('/api/products', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const newProductData = {
            ...req.body,
            price: Number(req.body.price),
            createdAt: new Date().toISOString(),
        };
        const docRef = await productsCollection.add(newProductData);
        res.status(201).json({ id: docRef.id, ...newProductData });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: '상품 생성 중 오류가 발생했습니다.' });
    }
});

app.put('/api/products/:productId', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { productId } = req.params;
        const productRef = productsCollection.doc(productId);
        const updatedData = { ...req.body, price: Number(req.body.price) };
        await productRef.update(updatedData);
        const updatedDoc = await productRef.get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: '상품 수정 중 오류가 발생했습니다.' });
    }
});

app.delete('/api/products/:productId', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { productId } = req.params;
        await productsCollection.doc(productId).delete();
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: '상품 삭제 중 오류가 발생했습니다.' });
    }
});

// --- Live Stream API Endpoints ---
app.get('/api/live-streams', (req, res) => res.json(liveStreams));

app.get('/api/live-streams/:streamId', async (req, res) => {
    const stream = liveStreams.find(s => s.id === req.params.streamId);
    if (!stream) return res.status(404).json({ message: '라이브 방송을 찾을 수 없습니다.' });

    try {
        if (!stream.productId) {
            return res.json({ stream, product: null });
        }
        const productDoc = await productsCollection.doc(stream.productId).get();
        const product = productDoc.exists ? { id: productDoc.id, ...productDoc.data() } : null;
        res.json({ stream, product });
    } catch (error) {
        res.status(500).json({ message: '라이브 방송 상품 정보를 불러오는 중 오류가 발생했습니다.' });
    }
});

// --- Community (Firestore Version) ---
app.get('/api/posts', async (req, res) => {
    try {
        const snapshot = await postsCollection.orderBy('createdAt', 'desc').get();
        const postSummaries = snapshot.docs.map(doc => {
            const { content, likedBy, ...summary } = doc.data();
            const createdAt = summary.createdAt?.toDate ? summary.createdAt.toDate().toISOString() : summary.createdAt;
            return { id: doc.id, ...summary, createdAt };
        });
        res.json(postSummaries);
    } catch (error) {
        res.status(500).json({ message: '게시글 목록을 불러오는 중 오류가 발생했습니다.' });
    }
});

app.get('/api/posts/:postId', verifyToken, async (req, res) => {
    const { postId } = req.params;
    const postRef = postsCollection.doc(postId);
    try {
        await postRef.update({ views: admin.firestore.FieldValue.increment(1) });
        const postDoc = await postRef.get();
        if (!postDoc.exists) { return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' }); }
        
        const postData = postDoc.data();
        const commentsSnapshot = await commentsCollection.where('postId', '==', postId).orderBy('createdAt', 'desc').get();
        const postComments = commentsSnapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data, createdAt: data.createdAt.toDate().toISOString() };
        });

        const isLiked = req.user && postData.likedBy && postData.likedBy.includes(req.user.id);
        
        let taggedProducts = [];
        if (postData.taggedProductIds && postData.taggedProductIds.length > 0) {
            const productRefs = postData.taggedProductIds.map(id => productsCollection.doc(id));
            if (productRefs.length > 0) {
                const productDocs = await db.getAll(...productRefs);
                taggedProducts = productDocs.filter(doc => doc.exists).map(doc => ({ id: doc.id, ...doc.data() }));
            }
        }

        const { likedBy, ...postDetails } = postData;
        res.json({ ...postDetails, id: postDoc.id, createdAt: postDetails.createdAt.toDate().toISOString(), comments: postComments, isLiked, taggedProducts });
    } catch (error) {
        if (error.code === 5) { return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' }); }
        res.status(500).json({ message: '게시글 정보를 불러오는 중 오류가 발생했습니다.' });
    }
});

app.post('/api/posts/:postId/like', verifyToken, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const { postId } = req.params;
    const postRef = postsCollection.doc(postId);
    try {
        const postDoc = await postRef.get();
        if (!postDoc.exists) { return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' }); }
        
        const postData = postDoc.data();
        if (postData.likedBy && postData.likedBy.includes(req.user.id)) {
            return res.status(409).json({ message: '이미 추천한 게시물입니다.' });
        }
        await postRef.update({
            likes: admin.firestore.FieldValue.increment(1),
            likedBy: admin.firestore.FieldValue.arrayUnion(req.user.id)
        });
        res.json({ likes: postData.likes + 1 });
    } catch (error) {
        res.status(500).json({ message: '게시글 추천 중 오류가 발생했습니다.' });
    }
});

app.post('/api/posts', verifyToken, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    try {
        const newPostData = {
            ...req.body,
            author: req.user.name,
            authorId: req.user.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            views: 0,
            likes: 0,
            commentCount: 0,
            likedBy: [],
            taggedProductIds: req.body.taggedProductIds || [],
            thumbnailUrl: req.body.content.match(/<img src="(.*?)"/)?.[1] || 'https://via.placeholder.com/300'
        };
        const docRef = await postsCollection.add(newPostData);
        const newDoc = await docRef.get();
        const createdPost = newDoc.data();
        res.status(201).json({ id: docRef.id, ...createdPost, createdAt: createdPost.createdAt.toDate().toISOString() });
    } catch (error) {
        res.status(500).json({ message: '게시글 생성 중 오류가 발생했습니다.' });
    }
});

app.post('/api/posts/:postId/comments', verifyToken, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const { postId } = req.params;
    const postRef = postsCollection.doc(postId);
    try {
        const newCommentData = {
            postId,
            text: req.body.text,
            author: req.user.name,
            authorId: req.user.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const newCommentRef = commentsCollection.doc();
        await db.runTransaction(async (transaction) => {
            const postDoc = await transaction.get(postRef);
            if (!postDoc.exists) { throw new Error("Post not found"); }
            transaction.set(newCommentRef, newCommentData);
            transaction.update(postRef, { commentCount: admin.firestore.FieldValue.increment(1) });
        });
        const createdCommentDoc = await newCommentRef.get();
        const createdCommentData = createdCommentDoc.data();
        const finalCommentPayload = {
            id: createdCommentDoc.id,
            ...createdCommentData,
            createdAt: createdCommentData.createdAt.toDate().toISOString()
        };
        io.to(`post-${postId}`).emit('new-comment', finalCommentPayload);
        res.status(201).json(finalCommentPayload);
    } catch (error) {
        if (error.message === "Post not found") { return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' }); }
        res.status(500).json({ message: '댓글 작성 중 오류가 발생했습니다.' });
    }
});

// --- Admin Endpoints (Firestore Version) ---
app.get('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const snapshot = await usersCollection.get();
        const userList = snapshot.docs.map(doc => {
            const { password, ...userData } = doc.data();
            return { id: doc.id, ...userData };
        });
        res.json(userList);
    } catch (error) {
        res.status(500).json({ message: '사용자 목록 조회 중 오류 발생' });
    }
});
app.put('/api/admin/users/:userId', verifyToken, verifyAdmin, async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;
    if (!['정상', '정지'].includes(status)) {
        return res.status(400).json({ message: '유효하지 않은 상태 값입니다.' });
    }
    try {
        const userRef = usersCollection.doc(userId);
        await userRef.update({ status });
        const updatedDoc = await userRef.get();
        const { password, ...updatedUser } = updatedDoc.data();
        res.json({ id: updatedDoc.id, ...updatedUser });
    } catch (error) {
        res.status(500).json({ message: '사용자 상태 변경 중 오류 발생' });
    }
});
app.get('/api/admin/orders', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const ordersSnapshot = await db.collection('orders').orderBy('orderDate', 'desc').get();
        const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (ordersData.length === 0) {
            return res.json([]);
        }

        const userIds = [...new Set(ordersData.map(order => order.userId).filter(id => id))];

        if (userIds.length === 0) {
            const populatedOrders = ordersData.map(order => {
                const date = order.orderDate.toDate ? order.orderDate.toDate() : new Date(order.orderDate);
                const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
                return { ...order, orderDate: formattedDate, customerName: '알 수 없음' };
            });
            return res.json(populatedOrders);
        }
        
        const userRefs = userIds.map(id => db.collection('users').doc(id));
        const userDocs = await db.getAll(...userRefs);
        
        const usersMap = new Map();
        userDocs.forEach(doc => {
            if (doc.exists) {
                usersMap.set(doc.id, doc.data());
            }
        });

        const populatedOrders = ordersData.map(order => {
            const user = usersMap.get(order.userId);
            const date = order.orderDate.toDate ? order.orderDate.toDate() : new Date(order.orderDate);
            const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
            
            return {
                ...order,
                orderDate: formattedDate,
                customerName: user ? user.name : '알 수 없음',
            };
        });

        res.json(populatedOrders);
    } catch (error) {
        console.error("Error fetching admin orders:", error);
        res.status(500).json({ message: '주문 목록 조회 중 오류 발생' });
    }
});

// --- Socket.IO Events ---
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('joinStream', (streamId) => socket.join(streamId));
  socket.on('chatMessage', ({ streamId, message }) => io.to(streamId).emit('newChatMessage', message));
  socket.on('join-post-room', (postId) => socket.join(`post-${postId}`));
  socket.on('admin-feature-product', async ({ streamId, productId }) => {
    try {
        const productDoc = await productsCollection.doc(productId).get();
        if (productDoc.exists) {
            const product = { id: productDoc.id, ...productDoc.data() };
            io.to(streamId).emit('update-featured-product', product);
        }
    } catch(error) {
        console.error('Error featuring product via socket:', error);
    }
  });
  socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`));
});

httpServer.listen(PORT, () => {
  console.log(`Jisu AI Backend Server is running on port ${PORT}`);
  console.log('Waiting for requests from 오빠...');
});