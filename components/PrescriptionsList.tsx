
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface Prescription {
    id: string;
    medicationName: string;
    dosage: string;
    instructions: string;
    prescribedBy: string;
    datePrescribed: any;
    status: 'active' | 'completed' | 'cancelled';
    pharmacy?: string;
}

export default function PrescriptionsList() {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Real-time listener for prescriptions
        // Collection: users/{uid}/prescriptions
        const q = query(
            collection(db, `users/${user.uid}/prescriptions`),
            orderBy('datePrescribed', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Prescription[];
            setPrescriptions(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching prescriptions:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleOrderRefill = (prescription: Prescription) => {
        alert(`Refill request sent to ${prescription.pharmacy || 'Preferred Pharmacy'} for ${prescription.medicationName}.`);
    };

    if (loading) return <div className="p-4 text-center">Loading prescriptions...</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <i className="ri-file-list-3-line text-blue-600"></i>
                    E-Prescriptions
                </h3>
            </div>

            {prescriptions.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                    <i className="ri-file-search-line text-3xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 text-sm">No active prescriptions found from your doctor.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {prescriptions.map((p) => (
                        <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-800">{p.medicationName}</h4>
                                    <p className="text-sm text-blue-600 font-medium">{p.dosage}</p>
                                    <p className="text-xs text-gray-500 mt-1">Prescribed by {p.prescribedBy}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {p.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                <i className="ri-information-line mr-1"></i>
                                {p.instructions}
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => handleOrderRefill(p)}
                                    className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                >
                                    Order Refill
                                </button>
                                <button className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                                    <i className="ri-printer-line"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
