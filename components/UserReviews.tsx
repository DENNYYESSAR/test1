'use client';

import { useState, useEffect, useRef } from 'react';

// Mock initial reviews to populate the "live" feed
const INITIAL_REVIEWS: any[] = [];

export default function UserReviews() {
    const [reviews, setReviews] = useState<any[]>(INITIAL_REVIEWS);
    const [visibleReviews, setVisibleReviews] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [newName, setNewName] = useState("");
    const [newDesignation, setNewDesignation] = useState("");
    const [newRole, setNewRole] = useState("Early Adopter");
    const [newRating, setNewRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [animatingOut, setAnimatingOut] = useState<number | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const VISIBLE_COUNT = 3; // Number of reviews to show at once

    const roles = [
        "Early Adopter",
        "Patient",
        "Medical Professional",
        "Beta Tester",
        "Visitor"
    ];

    useEffect(() => {
        fetchReviews();
    }, []);

    // Rotate reviews with animation when there are more than VISIBLE_COUNT
    useEffect(() => {
        if (reviews.length <= VISIBLE_COUNT) {
            setVisibleReviews(reviews);
            return;
        }

        // Initialize visible reviews
        setVisibleReviews(reviews.slice(0, VISIBLE_COUNT));

        const interval = setInterval(() => {
            // Animate out the first card
            setAnimatingOut(0);
            
            setTimeout(() => {
                setCurrentIndex((prev) => {
                    const nextIndex = (prev + 1) % reviews.length;
                    const newVisible = [];
                    for (let i = 0; i < VISIBLE_COUNT; i++) {
                        newVisible.push(reviews[(nextIndex + i) % reviews.length]);
                    }
                    setVisibleReviews(newVisible);
                    return nextIndex;
                });
                setAnimatingOut(null);
            }, 500); // Match animation duration
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, [reviews]);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews');
            if (res.ok) {
                const data = await res.json();
                const formatted = data.map((r: any) => ({
                    ...r,
                    // Assign random color based on name length for consistency without DB storage
                    avatarColor: ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-emerald-100 text-emerald-600', 'bg-orange-100 text-orange-600'][r.name.length % 4],
                    time: new Date(r.created_at).toLocaleDateString()
                }));
                setReviews(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !newName.trim()) return;

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName,
                    designation: newDesignation,
                    comment: newComment,
                    role: newRole,
                    rating: newRating
                })
            });

            if (res.ok) {
                await fetchReviews();
                setNewComment("");
                setNewName("");
                setNewDesignation("");
                setNewRole("Early Adopter");
                setNewRating(5);
                setIsTyping(false);
            }
        } catch (err) {
            console.error("Error posting review", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Decorative Elements */}

            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Left Side: Header & CTA */}
                    <div className="lg:w-2/5 lg:sticky lg:top-24">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 font-medium text-[10px] mb-4 animate-pulse">
                            <span className="relative flex h-1.5 w-1.5 mr-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                            </span>
                            Live Community Feed
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                            See what others are <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">saying right now.</span>
                        </h2>

                        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                            Join our community. Share your experience and help us shape the future of healthcare.
                        </p>

                        {/* Input Area */}
                        <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-5 rounded-2xl shadow-lg shadow-blue-900/5">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <i className="ri-chat-smile-3-line text-blue-500"></i>
                                Leave a comment
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Title (Dr./Mr.)"
                                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                            value={newDesignation}
                                            onChange={(e) => setNewDesignation(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Name *"
                                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none"
                                    >
                                        {roles.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <i className={`ri-star-fill text-lg ${star <= newRating ? 'text-yellow-400' : 'text-gray-200'}`}></i>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <textarea
                                    placeholder="Share your thoughts... *"
                                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm resize-none h-20"
                                    value={newComment}
                                    onChange={(e) => {
                                        setNewComment(e.target.value);
                                        setIsTyping(e.target.value.length > 0);
                                    }}
                                ></textarea>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim() || !newName.trim()}
                                    className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all transform flex items-center justify-center gap-2 text-sm
                                    ${isSubmitting || !newComment.trim()
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-md hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <i className="ri-loader-4-line animate-spin"></i>
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            Post Comment <i className="ri-send-plane-fill"></i>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: The Feed */}
                    <div className="lg:w-3/5 w-full">
                        <div className="relative">
                            {/* Review count indicator */}
                            {reviews.length > VISIBLE_COUNT && (
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-500">
                                        Showing {Math.min(VISIBLE_COUNT, reviews.length)} of {reviews.length} reviews
                                    </span>
                                    <div className="flex gap-1">
                                        {Array.from({ length: Math.min(reviews.length, 6) }).map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    i === currentIndex % Math.min(reviews.length, 6) 
                                                        ? 'bg-blue-500 w-4' 
                                                        : 'bg-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3" ref={containerRef}>
                                {visibleReviews.map((review, index) => (
                                    <div
                                        key={`${review.id}-${index}`}
                                        className={`review-card group relative overflow-hidden transition-all duration-300
                                            ${animatingOut === index ? 'review-exit' : 'review-enter'}`}
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        {/* Modern Glass Card */}
                                        <div className="relative bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:border-blue-200/50">
                                            
                                            {/* Top accent line */}
                                            <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            
                                            {/* Header row */}
                                            <div className="flex items-start gap-3">
                                                {/* Avatar with status ring */}
                                                <div className="relative flex-shrink-0">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg ring-2 ring-white bg-gradient-to-br ${
                                                        review.avatarColor?.includes('blue') ? 'from-blue-500 to-indigo-600' :
                                                        review.avatarColor?.includes('purple') ? 'from-purple-500 to-pink-600' :
                                                        review.avatarColor?.includes('emerald') ? 'from-emerald-500 to-teal-600' :
                                                        'from-orange-500 to-red-500'
                                                    }`}>
                                                        {review.name?.charAt(0) || 'U'}
                                                    </div>
                                                    {/* Rating badge */}
                                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-1 py-0.5 shadow-sm border border-gray-100 flex items-center">
                                                        <i className="ri-star-fill text-[8px] text-yellow-400"></i>
                                                        <span className="text-[8px] font-bold text-gray-700 ml-0.5">{review.rating}</span>
                                                    </div>
                                                </div>

                                                {/* Info section */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                                                                {review.designation && <span className="font-semibold text-gray-900">{review.designation}</span>}
                                                                <span>{review.name}</span>
                                                                {review.role === 'Medical Professional' && (
                                                                    <i className="ri-verified-badge-fill text-blue-500 text-sm" title="Verified"></i>
                                                                )}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                                                    review.role === 'Medical Professional' ? 'bg-blue-100 text-blue-700' :
                                                                    review.role === 'Early Adopter' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                    {review.role}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400">{review.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Comment */}
                                            <div className="mt-3 pl-[52px]">
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Empty state */}
                                {visibleReviews.length === 0 && (
                                    <div className="text-center py-12 px-6 bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-gray-200">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                            <i className="ri-chat-smile-3-line text-2xl text-blue-500"></i>
                                        </div>
                                        <h3 className="text-gray-900 font-semibold mb-1">No reviews yet</h3>
                                        <p className="text-gray-500 text-sm">Be the first to share your experience!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
