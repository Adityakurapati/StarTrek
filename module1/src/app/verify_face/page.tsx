'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import Link from 'next/link';
import Camera from '../components/Camera';

export default function Authenticate() {
        const [stream, setStream] = useState(null);
        const [result, setResult] = useState({ message: '', isError: false });
        const [isLoading, setIsLoading] = useState(false);

        const startCamera = async (videoRef) => {
                try {
                        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                        setStream(mediaStream);
                        if (videoRef.current) {
                                videoRef.current.srcObject = mediaStream;
                        }
                } catch (err) {
                        console.error("Error accessing camera:", err);
                        showResult("Error accessing camera", true);
                }
        };

        const stopCamera = (videoRef) => {
                if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                        setStream(null);
                        if (videoRef.current) {
                                videoRef.current.srcObject = null;
                        }
                }
        };

        const showResult = (message, isError = false) => {
                setResult({ message, isError });
        };

        const authenticateFace = async (videoRef) => {
                if (!videoRef.current) return;

                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

                try {
                        setIsLoading(true);
                        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
                        const formData = new FormData();
                        formData.append('image', blob, 'face.jpg');

                        const response = await fetch("http://127.0.0.1:5000/authenticate", {
                                method: "POST",
                                body: formData
                        });
                        const data = await response.json();
                        showResult(data.message, !response.ok);
                } catch (error) {
                        console.error("Error:", error);
                        showResult("Error authenticating face", true);
                } finally {
                        setIsLoading(false);
                }
        };

        return (
                <div className="min-h-screen bg-gray-50 p-8">
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-4xl mx-auto"
                        >
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                        <div className="p-6">
                                                <div className="flex justify-between items-center mb-8">
                                                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                                                <Lock className="w-6 h-6" />
                                                                Face Authentication
                                                        </h1>
                                                        <Link
                                                                href="/register"
                                                                className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
                                                        >
                                                                Go to Registration
                                                        </Link>
                                                </div>

                                                <div className="space-y-6">
                                                        <Camera
                                                                isActive={!!stream}
                                                                onStart={startCamera}
                                                                onStop={stopCamera}
                                                                onCapture={authenticateFace}
                                                        />

                                                        <AnimatePresence>
                                                                {result.message && (
                                                                        <motion.div
                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                exit={{ opacity: 0, y: -20 }}
                                                                                className={`p-4 rounded-lg relative ${result.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                                                        }`}
                                                                        >
                                                                                <button
                                                                                        onClick={() => setResult({ message: '', isError: false })}
                                                                                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                                                                >
                                                                                        <X size={16} />
                                                                                </button>
                                                                                {result.message}
                                                                        </motion.div>
                                                                )}
                                                        </AnimatePresence>

                                                        {isLoading && (
                                                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                                                                        <div className="bg-white p-4 rounded-lg">
                                                                                Processing...
                                                                        </div>
                                                                </div>
                                                        )}
                                                </div>
                                        </div>
                                </div>
                        </motion.div>
                </div>
        );
}