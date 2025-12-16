
'use client';

import { useEffect, useRef, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, onSnapshot, addDoc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
};

interface VideoCallProps {
    callId: string;
    mode: 'create' | 'join';
}

export default function VideoCall({ callId, mode }: VideoCallProps) {
    const [pc, setPc] = useState<RTCPeerConnection | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [status, setStatus] = useState<string>('Initializing...');
    const [micEnabled, setMicEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);

    useEffect(() => {
        const init = async () => {
            setStatus('Accessing Media Devices...');
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                const peerConnection = new RTCPeerConnection(servers);
                setPc(peerConnection);

                // Push tracks to peer connection
                stream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, stream);
                });

                // Pull tracks from peer connection
                peerConnection.ontrack = (event) => {
                    console.log("Track received");
                    event.streams[0].getTracks().forEach((track) => {
                        if (remoteStream) {
                            remoteStream.addTrack(track);
                        } else {
                            setRemoteStream(event.streams[0]);
                        }
                    });
                    if (remoteVideoRef.current && event.streams[0]) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                const callDoc = doc(db, 'calls', callId);
                const offerCandidates = collection(callDoc, 'offerCandidates');
                const answerCandidates = collection(callDoc, 'answerCandidates');

                if (mode === 'create') {
                    setStatus('Creating Room...');
                    peerConnection.onicecandidate = (event) => {
                        event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
                    };

                    const offerDescription = await peerConnection.createOffer();
                    await peerConnection.setLocalDescription(offerDescription);

                    const offer = {
                        sdp: offerDescription.sdp,
                        type: offerDescription.type,
                    };

                    await setDoc(callDoc, { offer });
                    setStatus('Waiting for patient to join...');

                    onSnapshot(callDoc, (snapshot) => {
                        const data = snapshot.data();
                        if (!peerConnection.currentRemoteDescription && data?.answer) {
                            const answerDescription = new RTCSessionDescription(data.answer);
                            peerConnection.setRemoteDescription(answerDescription);
                            setStatus('Connected!');
                        }
                    });

                    onSnapshot(answerCandidates, (snapshot) => {
                        snapshot.docChanges().forEach((change) => {
                            if (change.type === 'added') {
                                const candidate = new RTCIceCandidate(change.doc.data());
                                peerConnection.addIceCandidate(candidate);
                            }
                        });
                    });

                } else if (mode === 'join') {
                    setStatus('Joining Room...');
                    peerConnection.onicecandidate = (event) => {
                        event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
                    };

                    const callData = (await getDoc(callDoc)).data();
                    if (!callData) {
                        setStatus("Call not found");
                        return;
                    }

                    const offerDescription = callData.offer;
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription));

                    const answerDescription = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answerDescription);

                    const answer = {
                        type: answerDescription.type,
                        sdp: answerDescription.sdp,
                    };

                    await updateDoc(callDoc, { answer });

                    onSnapshot(offerCandidates, (snapshot) => {
                        snapshot.docChanges().forEach((change) => {
                            if (change.type === 'added') {
                                const candidate = new RTCIceCandidate(change.doc.data());
                                peerConnection.addIceCandidate(candidate);
                            }
                        });
                    });
                    setStatus('Connected!');
                }

            } catch (error) {
                console.error("Error starting video call", error);
                setStatus('Error accessing camera/mic');
            }
        };

        init();

        return () => {
            // Cleanup
            localStream?.getTracks().forEach(t => t.stop());
            pc?.close();
        }
    }, [callId, mode]);

    const toggleMic = () => {
        localStream?.getAudioTracks().forEach(track => {
            track.enabled = !micEnabled;
        });
        setMicEnabled(!micEnabled);
    }

    const toggleVideo = () => {
        localStream?.getVideoTracks().forEach(track => {
            track.enabled = !videoEnabled;
        });
        setVideoEnabled(!videoEnabled);
    }

    const handleHangup = () => {
        window.location.href = '/dashboard';
    }

    return (
        <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl">
            {/* Messages / Status */}
            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-4 py-2 rounded-lg text-white text-sm">
                {status}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 h-full">
                <div className="relative h-full">
                    {/* Remote Video (Big) */}
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    {/* Local Video (Small Overlay) */}
                    <div className="absolute top-4 right-4 w-48 h-36 bg-gray-900 rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform -scale-x-100"
                        />
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
                <button
                    onClick={toggleMic}
                    className={`p-4 rounded-full transition-all ${micEnabled
                            ? 'bg-white/20 hover:bg-white/30 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                >
                    <i className={`ri-mic-${micEnabled ? 'fill' : 'off-fill'} text-xl`}></i>
                </button>

                <button
                    onClick={handleHangup}
                    className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all transform hover:scale-110 shadow-lg"
                >
                    <i className="ri-phone-fill text-2xl rotate-[135deg]"></i>
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full transition-all ${videoEnabled
                            ? 'bg-white/20 hover:bg-white/30 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                >
                    <i className={`ri-video-${videoEnabled ? 'on-fill' : 'off-fill'} text-xl`}></i>
                </button>
            </div>
        </div>
    );
}
