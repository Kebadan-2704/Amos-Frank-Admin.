import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Hook for reading a Firestore collection (ordered by 'order' field).
 */
export const useCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, collectionName), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      setData(snap.docs.map((d) => ({ _id: d.id, ...d.data() })));
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [collectionName]);

  return { data, loading, refetch: fetchData };
};

/**
 * Hook for reading a single Firestore document.
 */
export const useDocument = (collectionName, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, collectionName, docId));
      if (snap.exists()) {
        setData({ _id: snap.id, ...snap.data() });
      }
    } catch (err) {
      console.error(`Error fetching ${collectionName}/${docId}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [collectionName, docId]);

  return { data, loading, refetch: fetchData };
};

/**
 * CRUD operations for a Firestore collection.
 */
export const firestoreService = {
  // Add a document with auto-generated ID
  async add(collectionName, data) {
    return addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
  },

  // Update a document by ID
  async update(collectionName, docId, data) {
    return updateDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  // Delete a document by ID
  async remove(collectionName, docId) {
    return deleteDoc(doc(db, collectionName, docId));
  },

  // Set a document with a specific ID (for single-doc collections)
  async set(collectionName, docId, data) {
    const { setDoc } = await import('firebase/firestore');
    return setDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },
};
